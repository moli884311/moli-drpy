#!/bin/bash
# 更新内置 danmu-api（libs_drpy/danmu_api）到上游最新版本，并重新应用本地定制补丁
# 用法：在项目根目录执行 bash scripts/update-danmu-api.sh
set -euo pipefail

REPO_URL="https://github.com/huangxd-/danmu_api.git"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DANMU_DIR="$ROOT_DIR/libs_drpy/danmu_api"
WORK_DIR="$(mktemp -d)"

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

echo "==> 克隆上游 danmu-api 最新代码..."
git clone --depth 1 "$REPO_URL" "$WORK_DIR/upstream"

echo "==> 记录更新前版本..."
OLD_VER="$(grep -oE "VERSION: '[^']+'" "$DANMU_DIR/danmu_api/configs/globals.js" | head -1 || true)"

echo "==> 同步上游源码（保留本地 .env / config/.env）..."
rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='config/.env' \
  "$WORK_DIR/upstream/" "$DANMU_DIR/"

echo "==> 应用本地定制补丁（fongmi format=xml）..."
node "$ROOT_DIR/scripts/patch-danmu-api-fongmi.mjs"

echo "==> 更新后版本..."
NEW_VER="$(grep -oE "VERSION: '[^']+'" "$DANMU_DIR/danmu_api/configs/globals.js" | head -1 || true)"
echo "    $OLD_VER -> $NEW_VER"

echo "==> 完成。如需生效请重建镜像，或 docker cp 热更新后重启容器。"
