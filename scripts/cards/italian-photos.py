# The "Real" Italian deck: Luca's own Sicilian cards (Dal Negro), photographed ten to a
# photo on a tablecloth, one photo per suit, laid out 2..7 on top and fante, cavallo, re,
# asso below. Each card is found, straightened and cut on its own edge, the lighting is
# flattened so the paper comes out one even white, and the corners are rounded.
#
#   heic -> jpg first:  for f in IMG_*.HEIC; do sips -s format jpeg "$f" --out "${f%.HEIC}.jpg"; done
#   python3 scripts/cards/italian-photos.py <dir with IMG_2997.jpg ...>   (needs opencv-python-headless)
#
# Cards are found by colour: the paper is a warm off-white (red a little above blue and
# green); the tablecloth is teal or a greenish grey. The cloth's pale patches sometimes
# pass anyway, so several thresholds are tried and each card keeps the cut whose
# proportions are closest to a real card's.
import sys
from pathlib import Path
import cv2, numpy as np

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parents[2] / "public/cards/real/italian"
PAPER = np.array([251, 252, 253], np.float32)  # BGR: near white, like the drawn cards
RADIUS = 28

def grade(img, sat=1.3, black=18, lift=0.82, sharp=0.5):
    # Phone photos flatten printed ink: set the ink's floor, open up the mid-tones, push
    # the colour, sharpen the linework, and settle the (grainy) paper on one clean white.
    # lift < 1 opens up the mid-tones: printed colours read light, as on the real card
    f = np.clip((img.astype(np.float32) - black) / (255 - black), 0, 1) ** lift * 255
    hsv = cv2.cvtColor(f.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    s = hsv[..., 1]
    w = np.clip((s - 15) / 25, 0, 1)  # near-neutral paper stays neutral
    hsv[..., 1] = np.clip(s * (1 + (sat - 1) * w), 0, 255)
    g = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    g = g + sharp * (g - cv2.GaussianBlur(g, (0, 0), 1.2))
    paper = np.clip((hsv[..., 2] - 200) / 30, 0, 1) * (1 - w)
    paper = cv2.GaussianBlur(paper, (0, 0), 1)[..., None]
    return np.clip(g * (1 - paper) + PAPER * paper, 0, 255).astype(np.uint8)

def save(card, path):
    # flat-field: the paper's own brightness, blurred across the card, divides out
    hsv = cv2.cvtColor(card, cv2.COLOR_BGR2HSV)
    paper = ((hsv[..., 1] < 40) & (hsv[..., 2] > 120)).astype(np.float32)
    paper = cv2.erode(paper, np.ones((5, 5), np.uint8))
    f = card.astype(np.float32)
    num = cv2.GaussianBlur(f * paper[..., None], (0, 0), 40)
    den = cv2.GaussianBlur(paper, (0, 0), 40)[..., None] + 1e-3
    bg = num / den
    out = grade(np.clip(f / np.maximum(bg, 1) * PAPER, 0, 255).astype(np.uint8))
    # trim the photographed edge (a little shadow and cloth), then round the corners
    t = 4
    out = cv2.resize(out[t:-t, t:-t], (W, H), interpolation=cv2.INTER_AREA)
    a = np.zeros((H, W), np.uint8)
    cv2.rectangle(a, (RADIUS, 0), (W - RADIUS - 1, H - 1), 255, -1)
    cv2.rectangle(a, (0, RADIUS), (W - 1, H - RADIUS - 1), 255, -1)
    for cx, cy in [(RADIUS, RADIUS), (W - RADIUS - 1, RADIUS), (RADIUS, H - RADIUS - 1), (W - RADIUS - 1, H - RADIUS - 1)]:
        cv2.circle(a, (cx, cy), RADIUS, 255, -1, cv2.LINE_AA)
    cv2.imwrite(str(path), np.dstack([out, a]), [cv2.IMWRITE_WEBP_QUALITY, 88])

def mask(im, RG, RB):
    b,g,r=[im[...,i].astype(int) for i in range(3)]
    blur=lambda a: cv2.GaussianBlur(a.astype(np.float32),(0,0),2)
    rg=blur(r-g); rb=blur(r-b); v=blur(np.maximum(np.maximum(r,g),b))
    m=((rg>RG)&(rb>RB)&(v>140)).astype(np.uint8)*255
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((9,9),np.uint8))
    return m

PHOTOS={"2997":"s","2998":"c","2999":"h","3001":"d"}
RANKS=[2,3,4,5,6,7,11,12,13,14]
FLIP={("c",7)}  # printed upside down in the photo
W,H=360,580

def quad(cnt):
    box=cv2.boxPoints(cv2.minAreaRect(cnt))
    pts=cnt.reshape(-1,2).astype(np.float32)
    lines=[]
    for i in range(4):
        a,b=box[i],box[(i+1)%4]; d=b-a; L=np.linalg.norm(d); u=d/L; nrm=np.array([-u[1],u[0]])
        t=(pts-a)@u; dist=np.abs((pts-a)@nrm)
        sel=pts[(t>0.2*L)&(t<0.8*L)&(dist<0.08*L)]
        vx,vy,x0,y0=cv2.fitLine(sel,cv2.DIST_HUBER,0,0.01,0.01).ravel()
        lines.append((np.array([x0,y0]),np.array([vx,vy])))
    q=[]
    for i in range(4):
        (p1,d1),(p2,d2)=lines[i-1],lines[i]
        A=np.array([d1,-d2]).T; t=np.linalg.solve(A,p2-p1); q.append(p1+t[0]*d1)
    q=np.array(q,np.float32)
    # order: tl,tr,br,bl
    s=q.sum(1); df=q[:,0]-q[:,1]
    tl=q[np.argmin(s)]; br=q[np.argmax(s)]; tr=q[np.argmax(df)]; bl=q[np.argmin(df)]
    return np.array([tl,tr,br,bl],np.float32)


def run(RG,RB):
    got={}
    for n,suit in PHOTOS.items():
        im=cv2.imread(str(SRC / f"IMG_{n}.jpg")); m=mask(im,RG,RB)
        ff=m.copy(); hh,ww=m.shape; fm=np.zeros((hh+2,ww+2),np.uint8)
        for x,y in [(0,0),(ww-1,0),(0,hh-1),(ww-1,hh-1),(ww//2,0),(ww//2,hh-1),(0,hh//2),(ww-1,hh//2)]:
            if ff[y,x]==0: cv2.floodFill(ff,fm,(x,y),128)
        m=np.where(ff==128,0,255).astype(np.uint8)
        k=lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(r,r))
        seeds=cv2.erode(m,k(81))
        cnt_n,lab,stats,_=cv2.connectedComponentsWithStats(seeds)
        cards=[]
        for i in range(1,cnt_n):
            if stats[i,4]<60000: continue
            reg=cv2.dilate((lab==i).astype(np.uint8)*255,k(81))&m
            cs,_=cv2.findContours(reg,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
            c=max(cs,key=cv2.contourArea)
            if cv2.contourArea(c)>300000: cards.append(c)
        if len(cards)!=10: continue
        qs=[quad(c) for c in cards]
        cy=np.median([q[:,1].mean() for q in qs])
        top=sorted([q for q in qs if q[:,1].mean()<cy],key=lambda q:q[:,0].mean())
        bot=sorted([q for q in qs if q[:,1].mean()>=cy],key=lambda q:q[:,0].mean())
        if len(top)!=5: continue
        for r,q in zip(RANKS,top+bot):
            w=(np.linalg.norm(q[1]-q[0])+np.linalg.norm(q[2]-q[3]))/2
            h=(np.linalg.norm(q[3]-q[0])+np.linalg.norm(q[2]-q[1]))/2
            got[(suit,r)]=(q,w/h,n,w*h)
    return got

runs=[run(a,b) for a,b in [(-3,3),(-1,5),(0,7),(-2,4),(-1,6)]]
TARGET=0.622
best={}
for key in [(s,r) for s in "cshd" for r in RANKS]:
    c=[g[key] for g in runs if key in g]
    best[key]=min(c,key=lambda v:abs(v[1]-TARGET))
    
ims={n:cv2.imread(str(SRC / f"IMG_{n}.jpg")) for n in PHOTOS}
for (suit,r),(q,a,n,_) in best.items():
    M=cv2.getPerspectiveTransform(q,np.float32([[0,0],[W,0],[W,H],[0,H]]))
    card=cv2.warpPerspective(ims[n],M,(W,H),flags=cv2.INTER_AREA)
    if (suit,r) in FLIP: card=cv2.rotate(card,cv2.ROTATE_180)
    save(card, OUT / f"{r}{suit}.webp")
