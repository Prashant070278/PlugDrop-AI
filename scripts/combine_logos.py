"""Combine the 5 customer-logo strips into ONE single wide horizontal banner
so the website can scroll a single continuous row of real logos.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent.parent
SRC = ROOT / "frontend" / "public" / "customers"
strips = sorted(SRC.glob("strip_*.png"))

imgs = [Image.open(p).convert("RGBA") for p in strips]
h = max(i.size[1] for i in imgs)
# Pad/resize each to same height
norm = []
for i in imgs:
    if i.size[1] != h:
        i = i.resize((int(i.size[0] * h / i.size[1]), h), Image.LANCZOS)
    norm.append(i)
total_w = sum(i.size[0] for i in norm)

combined = Image.new("RGBA", (total_w, h), (255, 255, 255, 0))
x = 0
for i in norm:
    combined.paste(i, (x, 0))
    x += i.size[0]

out = SRC / "row.png"
combined.convert("RGB").save(out, optimize=True)
print(f"saved {out}  size={combined.size}")
