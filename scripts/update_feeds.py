#!/usr/bin/env python3
"""Daily refresh of news + video feeds for SmallBusinessSolution.com (stdlib only).
Run by .github/workflows/update-feeds.yml. Writes assets/data/news.json and assets/data/videos.json.
A failing feed is skipped; existing data is kept if every feed fails."""
import json, re, sys, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "assets" / "data"
UA = {"User-Agent": "Mozilla/5.0 (compatible; SBS-FeedBot/1.0; +https://smallbusinesssolution.com)"}

NEWS_FEEDS = [
    ("https://news.google.com/rss/search?q=%22small+business%22+when:7d&hl=en-US&gl=US&ceid=US:en", None),
    ("https://news.google.com/rss/search?q=small+business+loans+OR+grants+when:7d&hl=en-US&gl=US&ceid=US:en", None),
    ("https://news.google.com/rss/search?q=%22small+business%22+when:7d&hl=en-CA&gl=CA&ceid=CA:en", None),
    ("https://smallbiztrends.com/feed", "Small Business Trends"),
]
YT_CHANNELS = [
    ("UCxXd9AWfNNaNipcXNmFuCAw", "U.S. Small Business Administration"),
    ("UCcefcZRL2oaA_uBNeo5UOWg", "Y Combinator"),
]
BLOCK = re.compile(r"\b(casino|betting|porn|crypto giveaway)\b", re.I)


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def iso(s):
    if not s:
        return None
    try:
        return parsedate_to_datetime(s).astimezone(timezone.utc).isoformat()
    except Exception:
        try:
            return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat()
        except Exception:
            return None


def news():
    items, seen = [], set()
    for url, fixed_source in NEWS_FEEDS:
        try:
            root = ET.fromstring(fetch(url))
        except Exception as e:  # skip broken feed
            print("news feed failed:", url, e, file=sys.stderr)
            continue
        for it in root.iter("item"):
            title = (it.findtext("title") or "").strip()
            link = (it.findtext("link") or "").strip()
            src_el = it.find("source")
            source = fixed_source or (src_el.text.strip() if src_el is not None and src_el.text else "News")
            if fixed_source is None and title.endswith(" - " + source):
                title = title[: -len(" - " + source)]
            key = re.sub(r"\W+", "", title.lower())[:80]
            if not title or not link.startswith("http") or key in seen or BLOCK.search(title):
                continue
            seen.add(key)
            items.append({"title": title, "link": link, "source": source, "date": iso(it.findtext("pubDate"))})
    items.sort(key=lambda x: x["date"] or "", reverse=True)
    return items[:40]


def videos():
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    items = []
    for cid, name in YT_CHANNELS:
        try:
            root = ET.fromstring(fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + cid))
        except Exception as e:
            print("video feed failed:", cid, e, file=sys.stderr)
            continue
        for en in root.findall("a:entry", ns)[:6]:
            vid = en.findtext("yt:videoId", namespaces=ns)
            title = en.findtext("a:title", namespaces=ns)
            if vid and title and "#shorts" not in title.lower():
                items.append({"id": vid, "title": title.strip(), "channel": name, "date": en.findtext("a:published", namespaces=ns)})
    items.sort(key=lambda x: x["date"] or "", reverse=True)
    return items[:12]


def write(name, items):
    path = DATA / name
    if not items:
        print(f"{name}: no items fetched; keeping existing file")
        return
    payload = {"updated": datetime.now(timezone.utc).isoformat(), "items": items}
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{name}: {len(items)} items")


if __name__ == "__main__":
    DATA.mkdir(parents=True, exist_ok=True)
    write("news.json", news())
    write("videos.json", videos())
