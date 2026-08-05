#!/bin/sh
set -e

# 启动 danmu-api（后台运行）
echo "Starting danmu-api..."
node /app/libs_drpy/danmu_api/danmu_api/server.js &

# 等待 danmu-api 端口就绪（最多 15 秒）
for i in $(seq 1 15); do
    if node -e "const n=require('net'),s=n.connect(9321,'127.0.0.1');s.on('connect',()=>process.exit(0));s.on('error',()=>process.exit(1));setTimeout(()=>process.exit(1),800)" >/dev/null 2>&1; then
        echo "danmu-api is ready"
        break
    fi
    sleep 1
done

# 启动 drpy（前台运行，保持容器存活）
echo "Starting drpy..."
exec node /app/index.js
