"""Tests for LLM-backed /api/agent-chat endpoint (Gemini 2.5 Flash via Emergent LLM key)."""
import os
import re
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read frontend/.env directly
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
            break

CHAT_URL = f"{BASE_URL}/api/agent-chat"
AGENTS_URL = f"{BASE_URL}/api/agents"
TIMEOUT = 30  # LLM calls can take a few seconds


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- /api/agents ----------
def test_list_agents_returns_nine(session):
    r = session.get(AGENTS_URL, timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert "agents" in data
    names = data["agents"]
    assert isinstance(names, list)
    assert len(names) == 9, f"Expected 9 agents, got {len(names)}: {names}"
    expected = {"Ava", "Sophia", "Iris", "Neo", "Atlas", "Mira", "Kai", "Luna", "Ronan"}
    assert set(names) == expected, f"Missing: {expected - set(names)}, extra: {set(names) - expected}"


# ---------- Basic LLM reply ----------
def test_ava_lead_qualification_bpo(session):
    sid = f"qa-ava-{uuid.uuid4().hex[:8]}"
    r = session.post(CHAT_URL, json={
        "agent": "Ava",
        "session_id": sid,
        "message": "Tell me about lead qualification for a 200-seat BPO",
    }, timeout=TIMEOUT)
    assert r.status_code == 200, f"Body: {r.text}"
    data = r.json()
    assert data["agent"] == "Ava"
    assert data["session_id"] == sid
    reply = data["reply"]
    assert isinstance(reply, str) and len(reply) > 30, f"Reply too short: {reply!r}"
    low = reply.lower()
    # Should mention something topical (lead/qualif/bpo/agent/seat)
    assert any(kw in low for kw in ["lead", "qualif", "bpo", "seat", "sales", "demo"]), \
        f"Reply doesn't seem topical: {reply!r}"


# ---------- Multi-turn memory ----------
def test_ava_multi_turn_memory(session):
    sid = f"qa-mem-{uuid.uuid4().hex[:8]}"
    r1 = session.post(CHAT_URL, json={
        "agent": "Ava",
        "session_id": sid,
        "message": "We're a 200-seat BPO based in Manila looking to automate outbound lead qualification.",
    }, timeout=TIMEOUT)
    assert r1.status_code == 200, r1.text
    assert len(r1.json()["reply"]) > 20

    # Follow-up — must reference earlier context (BPO / 200 seats / outbound)
    r2 = session.post(CHAT_URL, json={
        "agent": "Ava",
        "session_id": sid,
        "message": "What ROI do clients typically see?",
    }, timeout=TIMEOUT)
    assert r2.status_code == 200, r2.text
    reply2 = r2.json()["reply"]
    assert len(reply2) > 20
    # The reply should be a real LLM reply (not just FALLBACK_REPLY of scripted /api/chat)
    assert "Great question. PlugDrop deploys Voice Agents" not in reply2


# ---------- Hindi/Hinglish support ----------
def test_sophia_hindi_reply(session):
    sid = f"qa-hi-{uuid.uuid4().hex[:8]}"
    r = session.post(CHAT_URL, json={
        "agent": "Sophia",
        "session_id": sid,
        "message": "Mera order kahan hai bhai",
    }, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    reply = r.json()["reply"]
    assert len(reply) > 10
    # Check that reply contains Hindi/Hinglish indicators (Devanagari OR common Hinglish words)
    has_devanagari = bool(re.search(r"[\u0900-\u097F]", reply))
    has_hinglish = any(w in reply.lower() for w in [
        "aap", "aapka", "order", "bhai", "kar", "hum", "mein", "kya",
        "main", "namaste", "dhanyavaad", "shukriya", "track", "kahan",
    ])
    assert has_devanagari or has_hinglish, f"Reply not in Hindi/Hinglish: {reply!r}"


# ---------- Ronan finance ----------
def test_ronan_invoice_query(session):
    sid = f"qa-ron-{uuid.uuid4().hex[:8]}"
    r = session.post(CHAT_URL, json={
        "agent": "Ronan",
        "session_id": sid,
        "message": "My team processes 5000 invoices per month",
    }, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    reply = r.json()["reply"].lower()
    assert any(kw in reply for kw in [
        "invoice", "ocr", "ap ", "accounts payable", "finance", "po ", "purchase",
        "match", "ledger", "approval", "process", "automat",
    ]), f"Reply not finance-relevant: {reply!r}"


# ---------- Validation: invalid agent ----------
def test_invalid_agent_returns_400(session):
    r = session.post(CHAT_URL, json={
        "agent": "Bogus",
        "session_id": "qa-bad",
        "message": "Hello",
    }, timeout=TIMEOUT)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text}"


# ---------- Validation: empty message ----------
def test_empty_message_returns_422(session):
    r = session.post(CHAT_URL, json={
        "agent": "Ava",
        "session_id": "qa-empty",
        "message": "",
    }, timeout=10)
    assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"


# ---------- Reply is NOT a canned KB-verbatim ----------
def test_reply_is_not_canned_verbatim(session):
    """Ensure LLM is actually generating, not returning raw KB answer."""
    sid = f"qa-canned-{uuid.uuid4().hex[:8]}"
    r = session.post(CHAT_URL, json={
        "agent": "Iris",
        "session_id": sid,
        "message": "How do you handle a sudden spike in negative brand mentions?",
    }, timeout=TIMEOUT)
    assert r.status_code == 200, r.text
    reply = r.json()["reply"]
    # No markdown bold (rule #8)
    assert "**" not in reply, f"Reply contains markdown bold: {reply!r}"
    assert len(reply) > 20
