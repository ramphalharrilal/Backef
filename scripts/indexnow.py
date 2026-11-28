"""Notify IndexNow of changed canonical and retired public URLs."""
import os, json, time, subprocess, pathlib, urllib.request, urllib.error, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
HOST="withszara.com"
BASE="https://"+HOST
KEY="ab9eaed911fddcb7e36d234e7aaa9e444"
KEY_URL=f"{BASE}/{KEY}.txt"
urls={e.text for e in ET.parse(ROOT/"sitemap.xml").getroot().findall(".//{*}loc")}
retired={BASE+"/advice/",BASE+"/small-business-websites/"}
before=os.getenv("BEFORE","")
if os.getenv("FULL")=="true" or not before or set(before)=={"0"}:
    selected=urls|retired
else:
    try:
        files=subprocess.check_output(["git","diff","--name-only",before,"HEAD"],text=True,cwd=ROOT).splitlines()
    except subprocess.CalledProcessError:
        raise SystemExit("Cannot determine changed files; run manual full submission.")
    selected=set()
    if KEY+".txt" in files: selected=urls|retired
    else:
        for f in files:
            if f=="index.html": selected.add(BASE+"/")
            elif f.endswith("/index.html"):
                u=BASE+"/"+f.removesuffix("index.html")
                if u in urls or u in retired: selected.add(u)
if not selected:
    print("No changed public page URLs to submit."); raise SystemExit(0)
# Pages deploy separately. Confirm the key and changed canonical pages are reachable first.
for attempt in range(18):
    try:
        with urllib.request.urlopen(KEY_URL,timeout=20) as r:
            assert r.read().decode().strip()==KEY
        with urllib.request.urlopen(BASE+"/sitemap.xml",timeout=20) as r:
            live={e.text for e in ET.fromstring(r.read()).findall(".//{*}loc")}
        assert (selected & urls)<=live
        break
    except Exception as e:
        print(f"Awaiting published key and sitemap ({attempt+1}/18): {e}")
        if attempt==17: raise
        time.sleep(20)
payload=json.dumps({"host":HOST,"key":KEY,"keyLocation":KEY_URL,"urlList":sorted(selected)}).encode()
req=urllib.request.Request("https://api.indexnow.org/indexnow",data=payload,headers={"Content-Type":"application/json; charset=utf-8","User-Agent":"SZARA-IndexNow/1.0"})
with urllib.request.urlopen(req,timeout=30) as r:
    print(f"IndexNow HTTP {r.status}: {len(selected)} URLs submitted")
    assert r.status in (200,202)
