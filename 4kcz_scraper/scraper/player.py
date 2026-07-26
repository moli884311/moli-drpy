import re
import base64
from .models import VideoSource
from .client import HttpClient


class PlayerParser:

    PLAYER_SERVER = "https://159.75.162.215:3001"

    def __init__(self, client: HttpClient):
        self.client = client

    def get_video(self, movie_id: int, episode: int = 1) -> VideoSource | None:
        encoded = self._encode_path(movie_id, episode)
        play_url = f"/v_play/{encoded}.html"
        play_page_url = f"{HttpClient.BASE_URL}{play_url}"

        html = self.client.get_text(play_url)
        if not html:
            return None

        source = VideoSource(
            episode=episode,
            url=play_page_url,
            play_url=play_url,
        )

        encoded_url = self._extract_iframe_url(html)
        if not encoded_url:
            return source

        source.player_server = self.PLAYER_SERVER

        raw_video = self._fetch_raw_video(encoded_url, play_page_url)
        if raw_video:
            source.raw_video_url = raw_video["url"]
            source.expires_at = raw_video["expires"]

        return source

    def _extract_iframe_url(self, html: str) -> str | None:
        m = re.search(r'class="viframe"[^>]*src="([^"]*)"', html)
        if not m:
            m = re.search(r'<iframe[^>]*src="([^"]*)"', html)
        if not m:
            return None

        full_url = m.group(1).replace("&amp;", "&")
        m2 = re.search(r'[?&]url=([^&"]+)', full_url)
        return m2.group(1) if m2 else None

    def _fetch_raw_video(self, encoded_url: str, referer: str) -> dict | None:
        player_html = self.client.get_player_page(encoded_url, referer)
        if not player_html:
            return None

        url_match = re.search(r"(?:const|var)\s+mysvg\s*=\s*'([^']+)'", player_html)
        if url_match:
            url = url_match.group(1)
            expires = ""
            exp_match = re.search(r'X-Amz-Expires=(\d+)', url)
            if exp_match:
                expires = exp_match.group(1)
            return {"url": url, "expires": expires}

        url_match = re.search(r'art\.url\s*=\s*["\']([^"\']+)["\']', player_html)
        if url_match:
            return {"url": url_match.group(1), "expires": ""}

        url_match = re.search(r'(?:https?://[^\s"\']+\.(?:mp4|m3u8)[^\s"\']*)', player_html)
        if url_match:
            return {"url": url_match.group(1), "expires": ""}

        return None

    def get_episodes(self, movie_id: int) -> list[dict]:
        encoded = self._encode_path(movie_id, 1)
        html = self.client.get_text(f"/v_play/{encoded}.html")
        if not html:
            return []

        episodes = []
        seen = set()
        link_pattern = re.findall(r'<a[^>]*href="[^"]*?(/v_play/[^"]+)"[^>]*>(\d+)</a>', html)
        for href, num in link_pattern:
            ep = int(num)
            if ep not in seen:
                seen.add(ep)
                episodes.append({"episode": ep, "url": href})

        episodes.sort(key=lambda x: x["episode"])
        return episodes

    @staticmethod
    def _encode_path(movie_id: int, episode: int) -> str:
        raw = f"mv_{movie_id}-nm_{episode}"
        return base64.b64encode(raw.encode()).decode().rstrip("=")
