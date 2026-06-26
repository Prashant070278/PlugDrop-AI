from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from mailer import send_email, format_lead_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Demo Booking ----------
class DemoRequestCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    phone: str = Field(min_length=4)
    company: Optional[str] = ""
    interest: Optional[str] = "general"
    message: Optional[str] = ""


class DemoRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: str
    phone: str = ""
    interest: str = "general"
    message: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "PlugDrop.ai API"}


@api_router.post("/demo-request", response_model=DemoRequest)
async def create_demo_request(payload: DemoRequestCreate):
    obj = DemoRequest(
        name=payload.name,
        email=payload.email,
        company=payload.company or "",
        phone=payload.phone,
        interest=payload.interest or "general",
        message=payload.message or "",
    )
    doc = obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.demo_requests.insert_one(doc)
    logger.info(f"New demo request from {payload.email} ({payload.company})")

    # Fire-and-forget email — never block the user if SMTP fails.
    try:
        subject, html = format_lead_email(doc)
        send_email(subject, html)
    except Exception as e:
        logger.error("Lead email failed: %s", e)

    return obj


@api_router.get("/demo-requests", response_model=List[DemoRequest])
async def list_demo_requests():
    items = await db.demo_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except Exception:
                pass
    return items


# ---------- Chat (Scripted Knowledge) ----------
KNOWLEDGE_BASE = [
    {
        "keywords": ["voice", "call", "telephony", "phone", "speak"],
        "reply": "Our Voice AI Agents handle lead qualification, customer service, appointment scheduling, collections and order tracking — with natural conversation quality on your existing telephony (BYOP). Want to see a live use case?"
    },
    {
        "keywords": ["multi", "agent", "orchestra", "framework", "langchain", "crew"],
        "reply": "PlugDrop's Multi-Agentic Orchestration Framework (built on LangChain, LangGraph & CrewAI) lets specialist agents — Sales, Support, Research, Compliance, Operations — collaborate on complex tasks autonomously."
    },
    {
        "keywords": ["crm", "erp", "integrate", "integration", "salesforce", "dynamics", "sap"],
        "reply": "We integrate with Microsoft Dynamics, Salesforce, HubSpot, SAP, Oracle, Azure AI, OpenAI, Twilio, WhatsApp, Power Platform and custom APIs. BYOP means we plug into your existing stack — no rip-and-replace."
    },
    {
        "keywords": ["industry", "manufacturing", "education", "real estate", "fmcg", "insurance", "retail", "logistics", "construction"],
        "reply": "We've deployed AI across Manufacturing, Education, Real Estate, Construction, FMCG, Logistics, Insurance and Retail. Each comes with vertical-tuned agents and proven ROI playbooks."
    },
    {
        "keywords": ["case", "study", "client", "customer", "result", "roi"],
        "reply": "20+ projects delivered, 12+ enterprise customers, 8 countries, 4.8 CSAT. A real estate client (~$500M turnover) automated lead qualification & site visit scheduling end-to-end."
    },
    {
        "keywords": ["price", "cost", "pricing", "plan"],
        "reply": "Pricing depends on agent count, integrations, and call/message volume. Book a 20-minute consultation and we'll send a tailored estimate within 24 hours."
    },
    {
        "keywords": ["demo", "book", "meeting", "consultation", "talk"],
        "reply": "Happy to set that up. Click 'Book a Demo' at the top — we'll match you with a solutions architect this week."
    },
    {
        "keywords": ["plugdrop", "what", "who", "about", "do"],
        "reply": "PlugDrop deploys enterprise-grade AI Agents, Voice AI and Multi-Agent systems that automate conversations, operations and workflows. We make AI production-ready, not pilot-ready."
    },
    {
        "keywords": ["byop", "bring", "own"],
        "reply": "BYOP = Bring Your Own Platform. Bring your CRM, ERP, workflow, API, interface, or telephony — PlugDrop AI Core wraps around them without disruption."
    },
]

FALLBACK_REPLY = "Great question. PlugDrop deploys Voice Agents, Multi-Agent systems and AI automations on your existing stack. Tell me your industry or the workflow you want to automate — I'll suggest the right agent."


class ChatMessage(BaseModel):
    message: str


class ChatReply(BaseModel):
    reply: str


@api_router.post("/chat", response_model=ChatReply)
async def chat(payload: ChatMessage):
    text = (payload.message or "").lower().strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty message")
    best = None
    best_score = 0
    for entry in KNOWLEDGE_BASE:
        score = sum(1 for kw in entry["keywords"] if kw in text)
        if score > best_score:
            best_score = score
            best = entry
    reply = best["reply"] if best and best_score > 0 else FALLBACK_REPLY
    return ChatReply(reply=reply)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
