#!/usr/bin/env python3
import sys
import json
import os
import argparse
from scraper import HttpClient, HomeParser, SearchParser, DetailParser, PlayerParser


def setup_parser():
    p = argparse.ArgumentParser(description="4kcz.com 厂长资源 视频爬虫工具")
    p.add_argument("--cookie", "-c", help="登录 Cookie 字符串 (或设置为环境变量 4KCZ_COOKIE)")

    sub = p.add_subparsers(dest="command")

    home = sub.add_parser("home", help="首页推荐列表")
    home.add_argument("--section", "-s", choices=["gcj", "meijutt", "hanjutv", "riju", "fanju"],
                      help="按分类获取 (不指定则获取全部)")

    search = sub.add_parser("search", help="搜索影片")
    search.add_argument("keyword", help="搜索关键词")

    detail = sub.add_parser("detail", help="影片详情 + 剧集列表")
    g = detail.add_mutually_exclusive_group(required=True)
    g.add_argument("--id", type=int, help="影片 ID")
    g.add_argument("--url", help="影片详情页 URL")

    play = sub.add_parser("play", help="获取播放地址")
    play.add_argument("--id", type=int, required=True, help="影片 ID")
    play.add_argument("--ep", type=int, default=1, help="集数 (默认: 1)")
    play.add_argument("--raw", action="store_true", help="仅输出视频直链")

    return p


def to_json(obj):
    if hasattr(obj, "__dataclass_fields__"):
        return {k: to_json(v) for k, v in obj.__dict__.items()}
    if isinstance(obj, list):
        return [to_json(i) for i in obj]
    if isinstance(obj, dict):
        return {k: to_json(v) for k, v in obj.items()}
    return obj


def main():
    parser = setup_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    cookie = getattr(args, "cookie", "") or os.environ.get("4KCZ_COOKIE", "")
    client = HttpClient(cookies=cookie)

    try:
        if args.command == "home":
            hp = HomeParser(client)
            if args.section:
                items = hp.parse_section(args.section)
            else:
                items = hp.parse()
            print(json.dumps(to_json(items), ensure_ascii=False, indent=2))

        elif args.command == "search":
            sp = SearchParser(client)
            result = sp.search(args.keyword)
            print(json.dumps(to_json(result), ensure_ascii=False, indent=2))

        elif args.command == "detail":
            dp = DetailParser(client)
            if args.id:
                detail = dp.parse(args.id)
            else:
                import re
                m = re.search(r"movie/(\d+)", args.url)
                if not m:
                    print("无法从 URL 提取影片 ID", file=sys.stderr)
                    sys.exit(1)
                detail = dp.parse(int(m.group(1)))
            if detail:
                print(json.dumps(to_json(detail), ensure_ascii=False, indent=2))
            else:
                print("获取详情失败", file=sys.stderr)
                sys.exit(1)

        elif args.command == "play":
            pp = PlayerParser(client)
            source = pp.get_video(args.id, args.ep)
            if source:
                if args.raw and source.raw_video_url:
                    print(source.raw_video_url)
                else:
                    print(json.dumps(to_json(source), ensure_ascii=False, indent=2))
            else:
                print("获取视频地址失败", file=sys.stderr)
                sys.exit(1)

    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
