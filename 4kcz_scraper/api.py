#!/usr/bin/env python3
import os
from flask import Flask, request, jsonify
from scraper import HttpClient, HomeParser, SearchParser, DetailParser, PlayerParser

app = Flask(__name__)

_COOKIE_FILE = os.path.join(os.path.dirname(__file__), ".cookie")
_DEFAULT_COOKIE = ""
try:
    with open(_COOKIE_FILE) as f:
        _DEFAULT_COOKIE = f.read().strip()
except IOError:
    _DEFAULT_COOKIE = os.environ.get("4KCZ_COOKIE", "")


def _get_client() -> HttpClient:
    cookie = request.headers.get("X-Cookie", "") or request.args.get("cookie", "") or _DEFAULT_COOKIE
    return HttpClient(cookies=cookie)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "cookie_configured": bool(_DEFAULT_COOKIE)})


@app.route("/api/home")
def home():
    section = request.args.get("section", "")
    hp = HomeParser(_get_client())
    try:
        if section:
            items = hp.parse_section(section)
        else:
            items = hp.parse()
        return jsonify({"items": _serialize(items)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/search")
def search():
    keyword = request.args.get("q", "").strip()
    if not keyword:
        return jsonify({"error": "请提供搜索关键词 ?q="}), 400
    sp = SearchParser(_get_client())
    try:
        result = sp.search(keyword)
        return jsonify(_serialize(result))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/detail/<int:movie_id>")
def detail(movie_id: int):
    dp = DetailParser(_get_client())
    try:
        detail = dp.parse(movie_id)
        if not detail:
            return jsonify({"error": "未找到影片"}), 404
        return jsonify(_serialize(detail))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/play/<int:movie_id>")
def play(movie_id: int):
    episode = request.args.get("ep", 1, type=int)
    raw_only = request.args.get("raw", "0") == "1"
    pp = PlayerParser(_get_client())
    try:
        source = pp.get_video(movie_id, episode)
        if not source:
            return jsonify({"error": "获取播放地址失败"}), 500
        if raw_only and source.raw_video_url:
            return jsonify({"video_url": source.raw_video_url, "episode": episode})
        return jsonify(_serialize(source))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/episodes/<int:movie_id>")
def episodes(movie_id: int):
    pp = PlayerParser(_get_client())
    try:
        eps = pp.get_episodes(movie_id)
        return jsonify({"movie_id": movie_id, "episodes": eps, "total": len(eps)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/pipeline")
def pipeline():
    keyword = request.args.get("q", "").strip()
    if not keyword:
        return jsonify({"error": "请提供关键词 ?q="}), 400

    client = _get_client()
    try:
        sp = SearchParser(client)
        results = sp.search(keyword)

        if not results.items:
            return jsonify({"error": "未找到结果"}), 404

        first = results.items[0]

        dp = DetailParser(client)
        detail = dp.parse(first.movie_id)

        pp = PlayerParser(client)
        episodes = pp.get_episodes(first.movie_id)

        resp = _serialize(detail)
        resp["episodes_list"] = episodes
        resp["episodes_total"] = len(episodes)

        if episodes:
            source = pp.get_video(first.movie_id, episodes[0]["episode"])
            if source and source.raw_video_url:
                resp["video_preview"] = {
                    "episode": source.episode,
                    "video_url": source.raw_video_url,
                }
            elif source:
                resp["video_preview"] = _serialize(source)

        return jsonify(resp)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def _serialize(obj):
    if hasattr(obj, "__dataclass_fields__"):
        return {k: _serialize(v) for k, v in obj.__dict__.items()}
    if isinstance(obj, list):
        return [_serialize(i) for i in obj]
    if isinstance(obj, dict):
        return {k: _serialize(v) for k, v in obj.items()}
    return obj


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
