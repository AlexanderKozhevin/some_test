"""Portable home page. Other pages open on the published multi-page website."""
from pathlib import Path
from urllib.parse import urljoin
import base64
import mimetypes
import re
import zipfile

ROOT = Path(__file__).resolve().parent
PUBLIC = 'https://alexanderkozhevin.github.io/some_test/'

def data_uri(filename):
    path = ROOT / filename
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()

html = (ROOT / 'index.html').read_text()
html = re.sub(r'<link rel="preload"[^>]+>', '', html)
for filename in ['styles.css', 'site.css']:
    css = (ROOT / filename).read_text()
    css = re.sub(r"url\('([^']+)'\)", lambda m: "url('" + data_uri(m[1]) + "')", css)
    html = html.replace(f'<link rel="stylesheet" href="{filename}">', '<style>\n' + css + '\n</style>')
html = re.sub(r'<script src="[^"]+" defer></script>', '', html)
html = re.sub(r'(src|poster)="((?:\./)?assets/[^"]+)"', lambda m: m[1] + '="' + data_uri(m[2]) + '"', html)
html = re.sub(r'href="([^"#][^"]*)"', lambda m: 'href="' + urljoin(PUBLIC, m[1]) + '"', html)
html = html.replace('data-base="./"', f'data-base="{PUBLIC}"')
scripts = []
for filename in ['assets/lucide.min.js', 'app.js', 'site.js']:
    js = (ROOT / filename).read_text()
    if filename == 'app.js':
        js = js.replace("url:'./", "url:'" + PUBLIC)
    scripts.append('<script>\n' + js.replace('</script', '<\\/script') + '\n</script>')
html = html.replace('</body>', '\n'.join(scripts) + '\n</body>')
result = ROOT / 'edge-center-concept.html'
result.write_text(html)
with zipfile.ZipFile(ROOT / 'edge-center-concept.zip', 'w', zipfile.ZIP_DEFLATED) as package:
    package.write(result, result.name)
    package.write(ROOT / 'README.md', 'README.md')
    for filename in ['assets/LICENSE-Golos.txt', 'assets/LICENSE-Lucide.txt']:
        package.write(ROOT / filename, filename)
print(f'Built {result.name}: {result.stat().st_size:,} bytes')
