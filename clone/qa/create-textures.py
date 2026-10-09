from PIL import Image
from math import hypot,atan2,cos,sin
from pathlib import Path
root=Path(__file__).resolve().parent.parent / 'gallery' / 'textures'
for kind in ['glow','spark','smoke','ring','star','flame']:
 im=Image.new('RGBA',(64,64));px=im.load()
 for y in range(64):
  for x in range(64):
   u=(x-31.5)/31.5;v=(y-31.5)/31.5;r=hypot(u,v);a=0
   if kind=='glow': a=max(0,1-r)**1.8
   if kind=='spark': a=max(0,1-abs(u)*2)*max(0,1-abs(v))**.5
   if kind=='smoke': a=max(0,1-r)**.7*(.7+.15*cos(13*u+4*sin(8*v))+.15*sin(11*v+3*cos(9*u)))
   if kind=='ring': a=max(0,1-abs(r-.72)/.12)
   if kind=='star': a=max(0,1-r/(.35+.3*abs(cos(5*atan2(v,u)))))
   if kind=='flame': a=max(0,1-abs(u)/max(.05,(1+v)*.4))*max(0,1-abs(v))**.5
   px[x,y]=(255,255,255,round(max(0,min(1,a))*255))
 im.save(root/(kind+'.png'))
