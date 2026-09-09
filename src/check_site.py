from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import json,collections
ROOT=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[];self.h1=0;self.lang=None
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='html':self.lang=d.get('lang')
  if tag=='h1':self.h1+=1
  if 'id' in d:self.ids.append(d['id'])
  for a in ['src','href','poster']:
   if a in d:self.links.append(d[a])
errors=[];parsed={}
for entry in json.loads((ROOT/'site-map.json').read_text()):
 path=ROOT/entry['slug']/'index.html';p=Page();p.feed(path.read_text());parsed[path]=p
 if p.h1!=1:errors.append(f'{path.relative_to(ROOT)}: {p.h1} h1s')
 if p.lang!='ru':errors.append(f'{path}: wrong lang')
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{path}: duplicate IDs')
for path,p in parsed.items():
 for url in p.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  target=(path.parent/unquote(u.path)).resolve() if u.path else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path.relative_to(ROOT)}: broken {url}')
  if u.fragment and target in parsed and u.fragment not in parsed[target].ids:errors.append(f'{path.relative_to(ROOT)}: missing anchor {url}')
print(json.dumps({'pages':len(parsed),'errors':errors},ensure_ascii=False,indent=2));assert not errors
