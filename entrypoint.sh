#!/bin/sh
set -e

# 启动 danmu-api（后台运行）
echo "Starting danmu-api..."
node /app/libs/danmu_api/danmu_api/server.js &

# 启动 drpy（前台运行，保持容器存活）
echo "Starting drpy..."
exec node /app/index.js
