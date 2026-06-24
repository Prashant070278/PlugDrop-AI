"""Backend API tests for PlugDrop.ai marketing site."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://voice-agent-hub-62.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "PlugDrop" in r.json().get("message", "")


# ---------- /api/chat ----------
class TestChat:
    @pytest.mark.parametrize("keyword,must_contain", [
        ("Tell me about voice agents", "Voice"),
        ("How does multi-agent work?", "Multi-Agent"),
        ("Do you integrate with our CRM?", "integrate"),
        ("I want a demo", "Book"),
        ("What is your pricing?", "Pricing"),
        ("Tell me about BYOP bring", "BYOP"),
    ])
    def test_chat_keyword_returns_relevant_reply(self, session, keyword, must_contain):
        r = session.post(f"{API}/chat", json={"message": keyword})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "reply" in data
        assert isinstance(data["reply"], str)
        assert len(data["reply"]) > 0
        assert must_contain.lower() in data["reply"].lower(), f"expected '{must_contain}' in reply, got: {data['reply']}"

    def test_chat_empty_returns_400(self, session):
        r = session.post(f"{API}/chat", json={"message": ""})
        assert r.status_code == 400

    def test_chat_whitespace_returns_400(self, session):
        r = session.post(f"{API}/chat", json={"message": "   "})
        assert r.status_code == 400

    def test_chat_fallback_for_unknown(self, session):
        r = session.post(f"{API}/chat", json={"message": "zzzzqqq random gibberish 12345"})
        assert r.status_code == 200
        assert len(r.json()["reply"]) > 0


# ---------- /api/demo-request ----------
class TestDemoRequest:
    def test_create_valid_demo_request(self, session):
        payload = {
            "name": "TEST_John Doe",
            "email": "test_john@example.com",
            "company": "TEST_Acme Corp",
            "phone": "+1-555-1234",
            "interest": "voice-ai",
            "message": "Looking to automate lead qualification.",
        }
        r = session.post(f"{API}/demo-request", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        # Data assertions
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["company"] == payload["company"]
        assert data["phone"] == payload["phone"]
        assert data["interest"] == payload["interest"]
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "_id" not in data, "MongoDB _id should NOT be exposed"
        # Persisted -> verify via list
        list_r = session.get(f"{API}/demo-requests")
        assert list_r.status_code == 200
        ids = [it["id"] for it in list_r.json()]
        assert data["id"] in ids

    def test_create_minimal_payload(self, session):
        payload = {
            "name": "TEST_Min",
            "email": "test_min@example.com",
            "company": "TEST_MinCo",
        }
        r = session.post(f"{API}/demo-request", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["phone"] == ""
        assert data["interest"] == "general"
        assert data["message"] == ""

    def test_invalid_email_returns_422(self, session):
        payload = {"name": "TEST_Bad", "email": "not-an-email", "company": "TEST_Co"}
        r = session.post(f"{API}/demo-request", json=payload)
        assert r.status_code == 422

    def test_missing_required_returns_422(self, session):
        r = session.post(f"{API}/demo-request", json={"name": "TEST_NoEmail"})
        assert r.status_code == 422


# ---------- /api/demo-requests ----------
class TestDemoRequestList:
    def test_list_returns_array(self, session):
        r = session.get(f"{API}/demo-requests")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)

    def test_list_does_not_expose_object_id(self, session):
        # Ensure at least one exists
        session.post(f"{API}/demo-request", json={
            "name": "TEST_ListCheck", "email": "test_list@example.com", "company": "TEST_LC"
        })
        r = session.get(f"{API}/demo-requests")
        assert r.status_code == 200
        for item in r.json():
            assert "_id" not in item, f"Found _id in list item: {item}"
            assert "id" in item
