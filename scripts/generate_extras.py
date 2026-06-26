"""Generate 3 additional agents + a cleaner hero image."""
import os, asyncio, base64
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent.parent / "backend" / ".env")
OUT = Path(__file__).parent.parent / "frontend" / "public" / "agents"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.environ["EMERGENT_LLM_KEY"]

BASE = (
    "A high-quality close-up portrait of a {gender} sleek humanoid AI robot, "
    "{detail}. Half human face half polished chrome robotic helmet with glowing violet "
    "neon accents around the ear, neck cables visible, polished white-and-purple "
    "ceramic shell, three-quarter angle, studio softbox lighting, isolated on a "
    "clean light lavender (#F5F3FF) background, professional, photorealistic, "
    "cinematic, TryEva.ai style, ultra-detailed, 4K, brand color #8B5CF6."
)

HERO = (
    "A premium close-up portrait of a young South Asian / Indian woman as a "
    "futuristic AI digital workforce avatar — MORE half-human half-machine: "
    "the human half shows soft brown eyes, gentle confident smile and warm "
    "Indian features; the other half is a clearly mechanical chrome-and-violet "
    "robotic helmet with visible micro-circuitry, glowing neon ear ring, exposed "
    "neck cables, fibre-optic strands going into the shoulder, and a transparent "
    "polycarbonate cheek-piece revealing internal violet machinery. Hair flows "
    "back into the helmet. Three-quarter studio portrait, soft purple rim "
    "lighting, completely isolated on a pure clean light lavender studio "
    "background (#F5F3FF) — no environment, no extra props. Photorealistic, "
    "cinematic, premium enterprise look."
)

NEW_AGENTS = [
    ("kai",    "young male",   "calm strategic expression, short side-swept hair, focused gaze"),
    ("luna",   "young female", "creative artistic look, asymmetric hairstyle, brighter purple highlights"),
    ("ronan",  "young male",   "analytical thoughtful expression, glasses-rim built into chrome, tidy hair"),
]

async def gen(session, prompt, out_file):
    chat = LlmChat(api_key=API_KEY, session_id=session,
                   system_message="Expert AI image generator. Produce a single hero portrait.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        print("ERR", out_file, text[:120]); return
    (OUT / out_file).write_bytes(base64.b64decode(images[0]["data"]))
    print("OK ", out_file)

async def main():
    # New hero
    await gen("plugdrop-hero-v2", HERO, "hero.png")
    # Three new agents
    for slug, gender, detail in NEW_AGENTS:
        prompt = BASE.format(gender=gender, detail=detail)
        await gen(f"plugdrop-agent-{slug}", prompt, f"{slug}.png")

asyncio.run(main())
