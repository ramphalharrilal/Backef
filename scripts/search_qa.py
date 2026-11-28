"""Validate the published SZARA search inventory without third-party packages."""
import json, re, pathlib, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE="https://withszara.com"
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.h1=0; self.canonical=[]; self.schemas=[]; self.active=False; self.data=""; self.title=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=="meta" and a.get("name"): self.meta[a["name"]]=a.get("content","")
        if tag=="link" and a.get("rel")=="canonical": self.canonical.append(a.get("href"))
        if tag=="a" and a.get("href"): self.links.append(a["href"])
        if tag=="h1": self.h1+=1
        if tag=="title": self.title=True
        if tag=="script" and a.get("type")=="application/ld+json": self.active=True; self.data=""
    def handle_data(self,data):
        if self.active: self.data+=data
    def handle_endtag(self,tag):
        if tag=="script" and self.active:
            self.schemas.append(json.loads(self.data)); self.active=False
def page(path):
    p=Page(); p.feed(path.read_text(encoding="utf-8")); return p
urls=[e.text for e in ET.parse(ROOT/"sitemap.xml").getroot().findall(".//{*}loc")]
assert len(urls)==len(set(urls)), "Duplicate sitemap URL"
assert BASE+"/" in urls
assert BASE+"/pay/" not in urls and BASE+"/thank-you/" not in urls
articles=[]
for url in urls:
    path=urlsplit(url).path
    f=ROOT/path.lstrip("/")/"index.html"
    assert f.is_file(),f"Missing {url}"
    p=page(f)
    assert p.title and p.meta.get("description"), f"Missing title or description: {url}"
    assert p.canonical==[url],f"Canonical mismatch: {url} {p.canonical}"
    assert "noindex" not in p.meta.get("robots",""),f"Noindex in sitemap: {url}"
    assert p.h1==1,f"H1 count: {url} {p.h1}"
    if re.match(r"/(?:advice|insights)/[^/]+/$",path):
        articles.append(url)
        nodes=[n for j in p.schemas for n in j.get("@graph",[j])]
        assert any(n.get("@type")=="Article" for n in nodes),f"Article data missing: {url}"
        assert "sz-editorial-byline" in f.read_text(),f"Byline missing: {url}"
        assert "sz-quick-answer" in f.read_text(),f"Answer missing: {url}"
hub=page(ROOT/"insights/index.html")
linked={urljoin(BASE+"/insights/",x).split("#")[0] for x in hub.links}
assert set(articles)<=linked, "Article not in resource library"
assert len(articles)>=16
for path in ["advice","small-business-websites"]:
    assert BASE+"/"+path+"/" not in urls
for path in ["pay","thank-you"]:
    assert "noindex" in page(ROOT/path/"index.html").meta.get("robots","")
print(f"Validated {len(urls)} canonical search pages and {len(articles)} articles.")
