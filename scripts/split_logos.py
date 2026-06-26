"""Slice the customer-logos screenshot into 5 horizontal STRIPS (one per row of the grid)
so each strip can be displayed as a horizontally scrolling band on the website.
"""
import urllib.request
from pathlib import Path
from PIL import Image

URL = "https://customer-assets.emergentagent.com/job_voice-agent-hub-62/artifacts/ktxf6vj3_Screenshot%202026-06-24%20at%2011.09.37%E2%80%AFPM.png"
OUT = Path(__file__).parent.parent / "frontend" / "public" / "customers"
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(urllib.request.urlopen(URL)).convert("RGB")
W, H = img.size
print("source size", W, H)

# Visual inspection of the grid: roughly 5 logo rows (with Bisleri straddling rows 1-2).
# We split into 5 horizontal strips for the marquee.
ROWS = 5
strip_h = H // ROWS
PAD = 6
for r in range(ROWS):
    y1 = max(0, r * strip_h + PAD)
    y2 = min(H, (r + 1) * strip_h - PAD)
    strip = img.crop((0, y1, W, y2))
    strip.save(OUT / f"strip_{r+1}.png", optimize=True)
    print(f"strip_{r+1}.png  {strip.size}")
print("DONE")
