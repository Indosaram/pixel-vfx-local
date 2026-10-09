from PIL import Image
from pathlib import Path
import sys,json
root=Path(sys.argv[1] if len(sys.argv)>1 else 'clone/evidence/author')
gif=Image.open(root/'author-full.gif');sheet=Image.open(root/'author-full-sheet.png').convert('RGBA')
assert gif.size==(32,32) and gif.n_frames==12
assert sheet.size==(128,96)
duration=0;colored=0
for i in range(gif.n_frames):
    gif.seek(i);frame=gif.convert('RGBA');cell=sheet.crop(((i%4)*32,(i//4)*32,(i%4+1)*32,(i//4+1)*32))
    for a,b in zip(frame.get_flattened_data(),cell.get_flattened_data()):
        assert a[3]==b[3] and (not b[3] or a[:3]==b[:3]),(i,a,b)
        colored+=bool(a[3] and max(a[:3]))
    duration+=gif.info.get('duration',0)
assert colored>0 and duration==1000
result=dict(frames=gif.n_frames,size=gif.size,duration_ms=duration,gif_sheet_pixels_equal=True,colored_pixels=colored)
(root/'decode-author.json').write_text(json.dumps(result,indent=2));print(result)
