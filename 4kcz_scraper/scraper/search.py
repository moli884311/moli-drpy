import re
from bs4 import BeautifulSoup
from .models import MovieItem, SearchResult
from .client import HttpClient


class SearchParser:

    def __init__(self, client: HttpClient):
        self.client = client

    def search(self, keyword: str) -> SearchResult:
        html = self.client.get_text(f"/boss1O1?q={keyword}")
        soup = BeautifulSoup(html, "lxml")

        result = SearchResult(keyword=keyword)

        title_el = soup.select_one("h3.dy_tit_big")
        if title_el:
            m = re.search(r"(\d+)\s*条", title_el.text)
            if m:
                result.total = int(m.group(1))
            m = re.search(r"([\d.]+)\s*秒", title_el.text)
            if m:
                result.query_time = float(m.group(1))

        for li in soup.select(".search_list ul li"):
            link = li.select_one("h3.dytit a") or li.select_one("a[href]")
            if not link:
                continue

            item = MovieItem(
                title=link.get("title") or link.text.strip(),
                url=link.get("href", ""),
            )

            img = li.select_one("img")
            if img:
                item.cover = img.get("src", "")

            zhuy = li.select_one("p.inzhuy")
            if zhuy:
                item.actors = zhuy.text.strip().removeprefix("主演：")

            result.items.append(item)

        return result
