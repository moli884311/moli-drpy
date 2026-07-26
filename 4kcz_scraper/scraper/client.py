import re
import time
import base64
import os
import requests
from typing import Optional
from urllib.parse import urljoin


def parse_cookie_string(raw: str) -> dict[str, str]:
    cookies = {}
    for part in raw.split(";"):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies


class HttpClient:
    BASE_URL = "https://www.4kcz.com"
    PLAYER_SERVER = "https://159.75.162.215:3001"

    def __init__(self, timeout: int = 15, retries: int = 3, cookies: str = ""):
        self.timeout = timeout
        self.retries = retries
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
        })
        self._set_cookies(cookies)

    def _set_cookies(self, raw: str):
        if not raw:
            return
        for name, value in parse_cookie_string(raw).items():
            self.session.cookies.set(name, value)

    def get(self, path: str, **kwargs) -> Optional[requests.Response]:
        url = urljoin(self.BASE_URL, path) if not path.startswith("http") else path
        for attempt in range(self.retries):
            try:
                resp = self.session.get(url, timeout=self.timeout, **kwargs)
                resp.raise_for_status()
                return resp
            except requests.RequestException as e:
                if attempt == self.retries - 1:
                    raise
                time.sleep(1 * (attempt + 1))
        return None

    def get_text(self, path: str) -> str:
        resp = self.get(path)
        return resp.text if resp else ""

    def get_player_page(self, encoded_url: str, referer: str = "") -> str:
        referer = referer or self.BASE_URL
        headers = {"Referer": referer}
        url = f"{self.PLAYER_SERVER}/player/py.php?code=cs&if=1&url={encoded_url}"
        for attempt in range(self.retries):
            try:
                resp = self.session.get(url, headers=headers, timeout=self.timeout)
                return resp.text
            except requests.RequestException as e:
                if attempt == self.retries - 1:
                    raise
                time.sleep(1 * (attempt + 1))
        return ""

    @staticmethod
    def decode_v_play_path(path: str) -> tuple[int, int]:
        b64 = path.replace(".html", "").split("/")[-1]
        try:
            padding = 4 - len(b64) % 4
            if padding != 4:
                b64 += "=" * padding
            decoded = base64.b64decode(b64).decode()
            m = re.match(r"mv_(\d+)-nm_(\d+)", decoded)
            if m:
                return int(m.group(1)), int(m.group(2))
        except Exception:
            pass
        return 0, 0

    @staticmethod
    def encode_v_play_path(movie_id: int, episode: int) -> str:
        raw = f"mv_{movie_id}-nm_{episode}"
        return base64.b64encode(raw.encode()).decode().rstrip("=")
