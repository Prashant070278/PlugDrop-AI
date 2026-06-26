"""Generate Indian-looking AI digital-workforce hero image (and an extra side-portrait variant).
Saves to /app/frontend/public/agents/hero.png
"""
import os, asyncio, base64
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path(__file__).parent.parent / "backend" / ".env")
OUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "agents"
OUT_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ["EMERGENT_LLM_KEY"]

PROMPT = (
    "A premium close-up portrait of a young South Asian / Indian woman as a "
    "futuristic AI digital workforce avatar. Half her face is warm human skin "
    "with soft brown eyes, defined eyebrows, subtle Indian features and full lips, "
    "and the other half seamlessly transitions into a polished white-and-purple "
    "ceramic robotic helmet with glowing violet neon circuitry around the ear and "
    "neck cables visible. Long dark hair styled and integrated into the helmet "
    "design. Three-quarter studio portrait, gentle confident smile, soft purple rim "
    "lighting, isolated on a very light lavender (#F5F3FF) clean studio background, "
    "TryEva.ai style, photorealistic, cinematic 4K, brand color #8B5CF6, premium "
    "enterprise look."
)


async def main():
    chat = LlmChat(
        api_key=API_KEY,
        session_id="plugdrop-hero-indian",
        system_message="You are an expert AI image generator. Produce a single hero portrait image.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    if not images:
        print("[ERR] no image:", text[:120])
        return
    (OUT_DIR / "hero.png").write_bytes(base64.b64decode(images[0]["data"]))
    print("[OK] hero.png saved")


if __name__ == "__main__":
    asyncio.run(main())
