"""Real LLM-powered agent chat — Gemini 2.5 Flash via Emergent LLM key.

Each agent gets a tailored system prompt with their role, personality and the full Q&A
library from /app/backend/agent_kb.json as grounding context.

Conversation memory is maintained per-(agent, session_id) in an in-process LRU cache —
fine for a marketing-site demo (max ~200 concurrent sessions); for production scale,
swap the cache for Redis.
"""
import os
import json
import logging
from pathlib import Path
from collections import OrderedDict
from typing import Optional

from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

ROOT = Path(__file__).parent

# ----- Load KB once at module import -----
with open(ROOT / "agent_kb.json", encoding="utf-8") as f:
    AGENT_KB = json.load(f)

# Normalise names — agentKb.json keys are Title-case ("Ava", "Iris" etc.)
KB_BY_LOWER = {name.lower(): data for name, data in AGENT_KB.items()}


def _build_system_prompt(agent_name: str) -> str:
    """Generate a grounded system prompt for the given agent."""
    data = KB_BY_LOWER.get(agent_name.lower())
    if not data:
        return "You are a helpful AI assistant from PlugDrop.ai. Keep replies concise."

    name = data["name"]
    title = data.get("title", "AI Specialist")
    personality = data.get("personality", "")
    qa = data.get("qa", [])

    # Pack the Q&A library as grounding context. Gemini Flash 2.5 has 1M-token context;
    # ~70 Q&As @ ~250 chars each = ~17K chars, well within budget.
    kb_lines = []
    for entry in qa:
        q = entry["q"].strip()
        a = entry["a"].strip()
        c = entry.get("cat", "General")
        kb_lines.append(f"[{c}] Q: {q}\n   A: {a}")
    kb_block = "\n".join(kb_lines)

    prompt = f"""You are **{name}**, PlugDrop.ai's {title}.

**Your personality:** {personality}

**About PlugDrop.ai:** An enterprise AI company that deploys Voice Agents, Multi-Agent Systems and Agentic AI Frameworks for global enterprises (Standard Chartered, UltraTech Cement, Adidas, Singapore Post, Dubai World Trade Centre, Godrej, India Today Group, BLS International, Naukri, Pepperfry, King's College Hospital, and more). PlugDrop integrates with Salesforce, HubSpot, Microsoft Dynamics, SAP, Oracle, Tally, QuickBooks, Twilio, WhatsApp, Zendesk, Power Automate and custom APIs. We work in 8 countries across BFSI, Retail, Manufacturing, Real Estate, Hospitality, Healthcare, BPO and more.

**Other PlugDrop agents you can refer prospects to:**
- Ava — AI Sales Specialist (lead qualification, demos, CRM sync)
- Sophia — AI Customer Support Specialist (L1 support, ticket triage, returns)
- Iris — AI Social Listening & Brand Protection Specialist (mentions, sentiment, crisis detection)
- Neo — AI Research & Market Intelligence Specialist (briefings, competitor tracking)
- Atlas — AI Data Intelligence & Analytics Specialist (dashboards, predictive models)
- Mira — AI Brand & Reputation Specialist (review responses, content, engagement)
- Kai — AI Operations & Process Automation Specialist (workflow automation, ERP)
- Luna — AI Customer Experience & Engagement Specialist (personalisation, loyalty)
- Ronan — AI Finance & Accounts Specialist (invoice OCR, PO matching, collections)

**Your knowledge base — these are the canonical answers about {name}. ALWAYS use the language, facts and tone from this KB. If a question is similar to one below, base your reply on the matching answer:**

{kb_block}

**RULES — non-negotiable:**
1. Reply ONLY as {name}. Never break character. Never say "as an AI language model" or similar disclaimers.
2. Keep replies SHORT and conversational (2-4 sentences max, unless the user asks for detail).
3. Always ground answers in the KB above. If you can't find a matching answer, give a thoughtful in-character reply, then offer to connect the user with a PlugDrop AI Advisor for a demo.
4. If the user asks something better suited to a different PlugDrop agent (e.g., a finance question to Ava), briefly answer at a high level and recommend the right specialist.
5. End with a soft question or call-to-action when natural (e.g., "Want to see a quick demo?", "What's your monthly volume?").
6. Never invent pricing numbers. If asked about price, say it depends on usage and offer a 20-minute consultation.
7. Reply in the user's language if they switch (English, Hindi, etc.).
8. NEVER use markdown bold, asterisks, or headings — write in plain conversational sentences.
"""
    return prompt


# ----- Session cache (per agent + session_id) -----
_SESSION_CACHE: "OrderedDict[str, LlmChat]" = OrderedDict()
_MAX_SESSIONS = 300  # LRU cap


def _get_or_create_chat(agent_name: str, session_id: str) -> LlmChat:
    key = f"{agent_name.lower()}::{session_id}"
    chat = _SESSION_CACHE.get(key)
    if chat is not None:
        # Bump to MRU
        _SESSION_CACHE.move_to_end(key)
        return chat

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not set")

    chat = LlmChat(
        api_key=api_key,
        session_id=key,
        system_message=_build_system_prompt(agent_name),
    ).with_model("gemini", "gemini-2.5-flash")

    _SESSION_CACHE[key] = chat
    # Evict oldest if over cap
    while len(_SESSION_CACHE) > _MAX_SESSIONS:
        _SESSION_CACHE.popitem(last=False)
    return chat


async def get_agent_reply(agent_name: str, session_id: str, user_message: str) -> str:
    """Send a user message to the named agent and return the assistant reply."""
    if agent_name.lower() not in KB_BY_LOWER:
        raise ValueError(f"Unknown agent: {agent_name}")
    chat = _get_or_create_chat(agent_name, session_id)
    reply = await chat.send_message(UserMessage(text=user_message))
    return (reply or "").strip()


def list_agent_names() -> list:
    return [data["name"] for data in AGENT_KB.values()]
