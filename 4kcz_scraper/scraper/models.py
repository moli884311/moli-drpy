from dataclasses import dataclass, field
from typing import Optional


@dataclass
class MovieItem:
    title: str
    url: str
    movie_id: int = 0
    cover: str = ""
    category: str = ""
    status: str = ""
    rating: str = ""
    actors: str = ""

    def __post_init__(self):
        if self.movie_id == 0 and self.url:
            try:
                self.movie_id = int(self.url.rstrip("/").split("/")[-1].replace(".html", ""))
            except (ValueError, IndexError):
                pass


@dataclass
class MovieDetail:
    movie_id: int
    title: str
    year: str = ""
    cover: str = ""
    categories: list[str] = field(default_factory=list)
    region: str = ""
    alias: str = ""
    release_date: str = ""
    directors: list[str] = field(default_factory=list)
    writers: list[str] = field(default_factory=list)
    actors: list[str] = field(default_factory=list)
    language: str = ""
    description: str = ""
    episodes: list[dict] = field(default_factory=list)


@dataclass
class VideoSource:
    episode: int
    url: str
    play_url: str = ""
    player_server: str = ""
    raw_video_url: str = ""
    expires_at: str = ""


@dataclass
class SearchResult:
    keyword: str
    total: int = 0
    query_time: float = 0.0
    items: list[MovieItem] = field(default_factory=list)
