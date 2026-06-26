"""Regenerate the older 'younger Indian woman' hero on a clean WHITE background,
and recolor the Plug mascot to a purple-themed palette.
"""
import os, asyncio, base64, urllib.request
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image
import colorsys
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / "backend" / ".env")
OUT = ROOT / "frontend" / "public" / "agents"
OUT.mkdir(parents=True, exist_ok=True)
API_KEY = os.environ["EMERGENT_LLM_KEY"]

HERO_PROMPT = (
    "A premium close-up cinematic portrait of a YOUNG South Asian / Indian woman "
    "(early 20s) as a futuristic AI digital workforce avatar. Soft warm brown "
    "eyes, gentle confident smile, smooth youthful Indian features, full lips. "
    "The right side of her face is warm human skin; the left side seamlessly "
    "transitions into a polished chrome-and-violet robotic helmet with visible "
    "micro-circuitry, glowing neon ear ring, exposed neck cables and a "
    "transparent polycarbonate cheek-piece revealing internal violet machinery. "
    "Long dark sleek hair flows back and integrates into the helmet design. "
    "Three-quarter studio portrait, soft purple rim lighting, isolated on a "
    "completely PURE WHITE studio background (#FFFFFF) — no environment, no "
    "extra props. Photorealistic, cinematic, premium enterprise look. "
    "Brand color #8B5CF6."
)


async def gen_hero():
    chat = LlmChat(api_key=API_KEY, session_id="plugdrop-hero-young-white",
                   system_message="Expert AI image generator. Produce one premium hero portrait.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=HERO_PROMPT))
    if not images:
        print("ERR hero:", text[:200]); return
    (OUT / "hero.png").write_bytes(base64.b64decode(images[0]["data"]))
    print("OK hero.png")


def recolor_mascot():
    """Shift the blue hues of the mascot to purple."""
    src = ROOT / "frontend" / "public" / "mascot.png"
    img = Image.open(src).convert("RGBA")
    W, H = img.size
    px = img.load()
    # PlugDrop purple ~ H=265 deg (HSV). Mascot blue ~ H=210 deg. Need to shift by +55deg.
    # Map: any pixel whose H is between 180-240 (blueish), shift to 250-300 (purple).
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            rr, gg, bb = r / 255, g / 255, b / 255
            h, s, v = colorsys.rgb_to_hsv(rr, gg, bb)
            hue_deg = h * 360
            if s < 0.18:  # near-grey / white — leave alone
                continue
            if 175 <= hue_deg <= 245:  # blue spectrum -> purple
                new_hue = (hue_deg + 55) % 360
                nr, ng, nb = colorsys.hsv_to_rgb(new_hue / 360, min(1.0, s * 1.05), v)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif 240 < hue_deg <= 260:  # already purple-ish — boost saturation slightly
                nr, ng, nb = colorsys.hsv_to_rgb(h, min(1.0, s * 1.1), v)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    img.save(src, optimize=True)
    print(f"OK mascot recolored to purple ({W}x{H})")


async def main():
    recolor_mascot()
    await gen_hero()

asyncio.run(main())
