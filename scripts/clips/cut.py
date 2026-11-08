# cut.py SRC START END OUT [cap] [marks...] : clip with idle gaps capped, prints mapped mark times
import subprocess, sys, os, shutil, json, re
src, a, b, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
cap = float(sys.argv[5]) if len(sys.argv) > 5 else 0.8
marks = [float(m) for m in sys.argv[6:]]
d = out + ".frames"; shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
# decode everything, keep frames in [a-1, b]; showinfo reports the true time of each kept frame
r = subprocess.run(["ffmpeg","-hide_banner","-y","-i",src,"-vf",f"select='between(t\\,{a-1}\\,{b})',showinfo,scale=540:-2","-fps_mode","passthrough",f"{d}/%05d.png"],capture_output=True,text=True,check=True)
pts = [float(x) for x in re.findall(r"pts_time:([\d.]+)", r.stderr)]
files = sorted(os.listdir(d)); assert len(files) == len(pts), (len(files), len(pts))
# start from the last frame at or before a
start = max([i for i,t in enumerate(pts) if t <= a] or [0])
idx = list(range(start, len(pts)))
lines, newt, mapping = [], 0.0, {}
for k,i in enumerate(idx):
    t0 = max(pts[i], a)
    t1 = pts[idx[k+1]] if k+1 < len(idx) else b
    dur = min(max(t1 - t0, 1/60), cap)
    if k == 0: dur = float(os.environ.get("FIRST", "0.6"))
    if k+1 == len(idx): dur = 1.4
    for m in marks:
        if t0 <= m < t0 + max(t1-t0,1e-6) and m not in mapping: mapping[m] = round(newt + min(m-t0, dur), 2)
    lines.append(f"file '{d}/{files[i]}'\nduration {dur:.4f}")
    newt += dur
lines.append(f"file '{d}/{files[idx[-1]]}'")
open(d+".txt","w").write("\n".join(lines))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",d+".txt","-vf","fps=30,format=yuv420p","-c:v","libx264","-crf","27","-preset","slow","-movflags","+faststart","-an",out],check=True)
shutil.rmtree(d); os.remove(d+".txt")
print(out, "len", round(newt,2), "marks", json.dumps(mapping), os.path.getsize(out)//1024, "KB")
