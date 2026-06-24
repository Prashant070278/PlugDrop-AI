"""Generate 6 consistent AI/robot avatar images for the agent gallery using Gemini Nano Banana.
Saves PNGs to /app/frontend/public/agents/<slug>.png so they can be served as static assets.
Run: python scripts/generate_agents.py
"""
import os
import asyncio
import base64
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

OUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "agents"
OUT_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ["EMERGENT_LLM_KEY"]

AGENTS = [
    ("ava",    "young female",  "warm violet eyes, soft confident smile, neat shoulder-length hair sculpted into the helmet"),
    ("sophia", "young female",  "gentle empathetic expression, sleek bob hairstyle integrated into the chrome helmet"),
    ("iris",   "young female",  "sharp focused gaze, longer hair flowing back, slight serious expression"),
    ("neo",    "young male",    "calm intelligent expression, short cropped hair, angular jawline integrated into helmet"),
    ("atlas",  "young male",    "strong professional expression, side profile, light beard contour integrated into chrome"),
    ("mira",   "young female",  "alert observant expression, three-quarter view, curls integrated into helmet design"),
]

PROMPT_TEMPLATE = (
    "A high-quality close-up portrait of a {gender} sleek humanoid AI robot, "
    "{detail}. Half human face half chrome robotic helmet with glowing violet "
    "neon accents around the ear, neck cables visible, polished white-and-purple "
    "ceramic shell, three-quarter angle, studio softbox lighting, isolated on a "
    "clean light lavender background, professional, photorealistic, cinematic, "
    "TryEva.ai style, ultra-detailed, 4K, brand color #8B5CF6."
)


async def gen_one(slug: str, gender: str, detail: str):
    prompt = PROMPT_TEMPLATE.format(gender=gender, detail=detail)
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"plugdrop-agent-{slug}",
        system_message="You are an expert AI image generator. Produce a single hero portrait image.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"[ERR] {slug}: no image returned. text={text[:120]!r}")
        return False
    img = images[0]
    out_path = OUT_DIR / f"{slug}.png"
    out_path.write_bytes(base64.b64decode(img["data"]))
    print(f"[OK]  {slug} -> {out_path}")
    return True


async def main():
    for slug, gender, detail in AGENTS:
        try:
            await gen_one(slug, gender, detail)
        except Exception as e:
            print(f"[FAIL] {slug}: {e}")


if __name__ == "__main__":
    asyncio.run(main())
