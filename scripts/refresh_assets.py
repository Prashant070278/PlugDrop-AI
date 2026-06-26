"""Generate a new hero image (35-40 yr old face, white background)
and strip the white background off the Plug mascot image.
"""
import os, asyncio, base64, urllib.request
from pathlib import Path
from PIL import Image
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / "backend" / ".env")
OUT = ROOT / "frontend" / "public" / "agents"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.environ["EMERGENT_LLM_KEY"]

HERO_PROMPT = (
    "A premium close-up cinematic portrait of a 35-40 year old South Asian / "
    "Indian woman as a futuristic AI digital workforce avatar. She has mature, "
    "wise warm brown eyes, subtle laugh lines, defined cheekbones and a calm "
    "professional half-smile — a senior executive AI advisor. The right side of "
    "her face is warm human skin with delicate Indian features; the left side "
    "seamlessly transitions into a polished chrome-and-violet robotic helmet "
    "with visible micro-circuitry, glowing neon ear ring, exposed neck cables "
    "and a transparent polycarbonate cheek-piece revealing internal violet "
    "machinery. Sleek dark hair flows back and integrates into the helmet "
    "design. Three-quarter studio portrait, soft purple rim lighting, "
    "isolated on a completely pure WHITE studio background (#FFFFFF) — no "
    "environment, no extra props. Photorealistic, cinematic, premium "
    "enterprise look. Brand color #8B5CF6."
)

MASCOT_URL = "https://customer-assets.emergentagent.com/job_0cd876a0-a865-4d97-862d-50a9b26ad778/artifacts/89py54a2_Plug%20Avatar.png"


async def gen_hero():
    chat = LlmChat(api_key=API_KEY, session_id="plugdrop-hero-v3-white",
                   system_message="Expert AI image generator. Produce one premium hero portrait.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=HERO_PROMPT))
    if not images:
        print("ERR hero:", text[:200]); return
    (OUT / "hero.png").write_bytes(base64.b64decode(images[0]["data"]))
    print("OK hero.png")


def strip_white_bg():
    """Make the white background of the Plug mascot transparent."""
    img = Image.open(urllib.request.urlopen(MASCOT_URL)).convert("RGBA")
    px = img.load()
    W, H = img.size
    THRESH = 232  # near-white
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if r > THRESH and g > THRESH and b > THRESH:
                # Fade alpha based on how white it is (anti-alias edges)
                m = min(r, g, b)
                px[x, y] = (r, g, b, max(0, int((m - THRESH) * 255 / (255 - THRESH))) if m < 255 else 0)
    img.save(OUT.parent / "mascot.png", optimize=True)
    print(f"OK mascot.png saved {W}x{H}")


async def main():
    strip_white_bg()
    await gen_hero()

asyncio.run(main())
