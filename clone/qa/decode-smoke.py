"""Independently decode downloaded GIFs and compare to actual PNG sheet cells."""
from pathlib import Path
import sys,json,hashlib
from PIL import Image, ImageChops
root = Path(sys.argv[1] if len(sys.argv)>1 else 'clone/evidence/smoke')
results=[]
for name in ['Original Burst','Original Ring','Original Fountain']:
    gif=root / f'{name}-64.gif'
    image=Image.open(gif)
    sheet=Image.open(root / f'{name}-sheet.png').convert('RGBA')
    assert image.size==(64,64) and image.n_frames==18, name
    assert sheet.size==(320,256), name
    duration=0
    visible=[]
    for i in range(image.n_frames):
        image.seek(i)
        frame=image.convert('RGBA')
        cell=sheet.crop(((i%5)*64,(i//5)*64,(i%5+1)*64,(i//5+1)*64))
        # Transparent RGB is irrelevant; visible RGB and alpha must match.
        for got,want in zip(frame.get_flattened_data(),cell.get_flattened_data()):
            assert got[3]==want[3] and (not want[3] or got[:3]==want[:3]), (name,i,got,want)
        visible.append(sum(bool(p[3]) and max(p[:3])>0 for p in frame.get_flattened_data()))
        duration+=image.info.get('duration',0)
    assert duration==1200 and max(visible)>0, name
    results.append(dict(effect=name,frames=image.n_frames,duration_ms=duration,
        gif_sha256=hashlib.sha256(gif.read_bytes()).hexdigest(),visible_pixels=visible))
(root/'decode-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
