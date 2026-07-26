import re
from bs4 import BeautifulSoup
from .models import MovieDetail, MovieItem
from .client import HttpClient


class DetailParser:

    def __init__(self, client: HttpClient):
        self.client = client

    def parse(self, movie_id: int) -> MovieDetail | None:
        html = self.client.get_text(f"/movie/{movie_id}.html")
        if not html:
            return None
        return self.parse_html(html, movie_id)

    def parse_html(self, html: str, movie_id: int = 0) -> MovieDetail | None:
        soup = BeautifulSoup(html, "lxml")

        if not movie_id:
            pid_el = soup.select_one("#comment_post_ID")
            if pid_el:
                movie_id = int(pid_el.get("value", 0))

        if not movie_id:
            return None

        detail = MovieDetail(movie_id=movie_id, title="")

        title_el = soup.select_one("h3.dy_tit_big")
        if title_el:
            parts = title_el.get_text(separator="|").split("|")
            detail.title = parts[0].strip() if parts else ""
            detail.year = parts[1].strip() if len(parts) > 1 else ""

        og_title = soup.select_one('meta[property="og:title"]')
        if og_title and not detail.title:
            detail.title = og_title.get("content", "")

        cover_el = soup.select_one(".dyimg img")
        if cover_el:
            detail.cover = cover_el.get("src", "")

        og_image = soup.select_one('meta[property="og:image"]')
        if og_image and not detail.cover:
            detail.cover = og_image.get("content", "")

        desc_el = soup.select_one('meta[property="og:description"]')
        if desc_el:
            d = desc_el.get("content", "")
            if d and len(d) > len(detail.description or ""):
                detail.description = d

        for li in soup.select("ul.moviedteail_list li"):
            text = li.get_text(separator=" ", strip=True)
            if text.startswith("类型"):
                detail.categories = [a.text.strip() for a in li.select("a")]
            elif text.startswith("地区"):
                detail.region = " ".join(a.text.strip() for a in li.select("a"))
            elif text.startswith("年份"):
                detail.year = detail.year or " ".join(a.text.strip() for a in li.select("a"))
            elif text.startswith("又名"):
                detail.alias = self._get_span_text(li)
            elif text.startswith("上映"):
                detail.release_date = self._get_span_text(li)
            elif text.startswith("导演"):
                detail.directors = [s.strip() for s in self._get_span_text(li).split("  ") if s.strip()]
            elif text.startswith("编剧"):
                detail.writers = [s.strip() for s in self._get_span_text(li).split("  ") if s.strip() and s.strip() != "false"]
            elif text.startswith("主演"):
                detail.actors = [s.strip() for s in self._get_span_text(li).split("  ") if s.strip() and s.strip() != "false"]
            elif text.startswith("语言"):
                detail.language = self._get_span_text(li)

        desc_div = soup.select_one(".yp_context")
        if desc_div:
            paras = [p.text.strip() for p in desc_div.select("p") if p.text.strip()]
            if paras:
                detail.description = "\n".join(paras)

        for a in soup.select(".paly_list_btn a"):
            href = a.get("href", "")
            text = a.text.strip()
            ep_num = self._extract_ep_num(text)
            detail.episodes.append({
                "episode": ep_num,
                "title": text,
                "url": href,
            })

        soup2 = BeautifulSoup(html, "lxml")
        related = []
        for li in soup2.select(".cai_list .bt_img ul li"):
            link = li.select_one("h3.dytit a") or li.select_one("a[href]")
            if not link:
                continue
            img = li.select_one("img")
            cover = (img.get("data-original") or img.get("src") or "") if img else ""
            related.append(MovieItem(
                title=link.get("title") or link.text.strip(),
                url=link.get("href", ""),
                cover=cover,
            ))
        detail.episodes = detail.episodes or []

        return detail

    def _get_span_text(self, li) -> str:
        spans = li.select("span:not(.furk):not(.rating)")
        if spans:
            return " ".join(s.text.strip() for s in spans)
        text = li.get_text(separator=" ", strip=True)
        colon_idx = text.find("：") if "：" in text else text.find(":")
        if colon_idx > 0:
            return text[colon_idx + 1:].strip()
        return ""

    @staticmethod
    def _extract_ep_num(text: str) -> int:
        m = re.search(r"(\d+)", text)
        return int(m.group(1)) if m else 0
