# Re-crop the Piacentine card scans so every card sits the same way in its border.
# The scans place the printed frame at different offsets (and some are cut off), which
# made the cards look crooked side by side. Finds each card's frame (all frames are
# about 274 x 540 px in the 351 x 604 scans), crops it, and centres it on clean paper
# at the site's 360 x 620 card size.
#   python3 scripts/cards/italian.py
import sys
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parents[3] / "elevator-scoreboard/assets/images/cards_piacentine"
OUT = Path(__file__).resolve().parents[2] / "public/cards"
FW, FH = 274, 540          # printed frame in the scans
OW, OH = 360, 620          # site card size
DW = 292                   # frame width on the output card
DH = round(DW * FH / FW)
PAPER = (250, 248, 242)
# Only scans whose frame is found at full confidence: the swords knight and swords ace
# scans don't have a clean frame and came out crooked.
CARDS = ["01_coins_ace", "20_cups_king", "30_clubs_king", "40_swords_king",
         "21_clubs_ace", "19_cups_knight", "10_coins_king",
         # the deck tile's hand, card for card the same as the poker hand
         "37_swords_7", "23_clubs_3", "17_cups_7"]

def lines(px, w, h, thr):
    cd = lambda x: sum(px[x, y] < 100 for y in range(h // 4, 3 * h // 4, 2)) / (h / 4)
    rd = lambda y: sum(px[x, y] < 100 for x in range(w // 4, 3 * w // 4, 2)) / (w / 4)
    L = [x for x in range(w // 4) if cd(x) > thr]
    R = [x for x in range(3 * w // 4, w) if cd(x) > thr]
    T = [y for y in range(h // 6) if rd(y) > thr]
    B = [y for y in range(5 * h // 6, h) if rd(y) > thr]
    return (L[0] if L else None, R[-1] if R else None, T[0] if T else None, B[-1] if B else None)

def frame(im):
    g = im.convert("L"); w, h = g.size; px = g.load()
    for thr in (0.55, 0.35, 0.2):
        l, r, t, b = lines(px, w, h, thr)
        # a detected pair must be about one frame apart, or it isn't the frame
        if l is not None and r is not None and abs(r - l - FW) > 8: r = None
        if t is not None and b is not None and abs(b - t - FH) > 8: b = None
        x = l if l is not None else (r - FW if r is not None else None)
        y = t if t is not None else (b - FH if b is not None else None)
        if x is not None and y is not None:
            return x, y, thr
    return None

for name in CARDS:
    im = Image.open(SRC / f"piacentine_{name}.jpg").convert("RGB")
    f = frame(im)
    if not f:
        print("NO FRAME", name, file=sys.stderr); continue
    x, y, thr = f
    # just inside the printed line, which survives on only some sides of some scans
    face = im.crop((x + 4, y + 4, x + FW - 4, y + FH - 4)).resize((DW, DH), Image.LANCZOS)
    card = Image.new("RGB", (OW, OH), PAPER)
    card.paste(face, ((OW - DW) // 2, (OH - DH) // 2))
    card.save(OUT / f"{name}.webp", quality=88)
    print(f"{name}: frame at {x},{y} (thr {thr})")
