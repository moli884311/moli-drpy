import re
from bs4 import BeautifulSoup
from .models import MovieItem
from .client import HttpClient


class HomeParser:
    SECTION_PATTERNS = {
        "gcj": ("国产剧", "movie_bt_series/gcj"),
        "meijutt": ("美剧", "movie_bt_series/mj"),
        "hanjutv": ("韩剧", "movie_bt_series/hj"),
        "riju": ("日剧", "movie_bt_series/rj"),
        "fanju": ("番剧", "movie_bt_view_cat/fjj"),
    }

    def __init__(self, client: HttpClient):
        self.client = client

    def parse(self) -> list[MovieItem]:
        html = self.client.get_text("/")
        soup = BeautifulSoup(html, "lxml")
        items = []

        for section in soup.select(".mi_btcon"):
            for li in section.select(".bt_img ul li"):
                item = self._parse_item(li)
                if item and item.title:
                    items.append(item)
        return items

    def parse_section(self, section_key: str) -> list[MovieItem]:
        if section_key not in self.SECTION_PATTERNS:
            return []
        _, path = self.SECTION_PATTERNS[section_key]
        html = self.client.get_text(f"/{path}")
        soup = BeautifulSoup(html, "lxml")
        items = []
        for li in soup.select(".bt_img ul li"):
            item = self._parse_item(li)
            if item and item.title:
                items.append(item)
        return items

    def _parse_item(self, li) -> MovieItem | None:
        link = li.select_one("h3.dytit a") or li.select_one("a[href]")
        if not link:
            return None

        img = li.select_one("img")
        cover = (img.get("data-original") or img.get("src") or "").strip() if img else ""

        item = MovieItem(
            title=link.get("title") or link.text.strip(),
            url=link.get("href", ""),
            cover=cover,
        )

        furk = li.select_one(".furk")
        if furk:
            item.category = furk.text.strip()

        jidi = li.select_one(".jidi span")
        if jidi:
            item.status = jidi.text.strip()

        rating = li.select_one(".rating")
        if rating:
            item.rating = rating.text.strip()

        zhuy = li.select_one("p.inzhuy")
        if zhuy:
            item.actors = zhuy.text.strip().removeprefix("主演：")

        return item
