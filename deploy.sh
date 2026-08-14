#!/bin/bash
# moli-drpy 生产部署脚本
# 在 8.130.134.173 生产机上执行，需要 docker 可用。
# 原理：Dockerfile 内 git clone 会拉取最新 main，因此重建镜像即包含全部已推送改动
# （controllers/danmu.js 弹幕调优、danmu_api/worker.js、jar 恢复原始版本等）。

set -e

REPO_URL="https://github.com/moli884311/moli-drpy.git"
BUILD_DIR="${BUILD_DIR:-/tmp/moli-drpy-build}"
CONTAINER_NAME="${CONTAINER_NAME:-moli-drpy}"
IMAGE_TAG="moli-drpy:latest"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
NEW_NAME="${CONTAINER_NAME}-${TIMESTAMP}"

# 获取最新源码（构建上下文）
if [ -d "$BUILD_DIR/.git" ]; then
    git -C "$BUILD_DIR" pull --ff-only
else
    git clone --depth 1 "$REPO_URL" "$BUILD_DIR"
fi

# 构建镜像
docker build -t "$IMAGE_TAG" "$BUILD_DIR"

# 停止旧容器（保留容器供回滚，不删除）
if docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    docker stop "$CONTAINER_NAME"
fi

# 启动新容器（新名字带时间戳，避免与停止中的旧容器重名冲突）
docker run -d \
    --name "$NEW_NAME" \
    -p 5757:5757 \
    --restart unless-stopped \
    "$IMAGE_TAG"

# 等待就绪并健康检查
for i in $(seq 1 20); do
    if curl -sf "http://127.0.0.1:5757/danmu/ping" >/dev/null 2>&1; then
        echo "部署完成，服务已就绪。新容器: $NEW_NAME"
        echo "旧容器 $CONTAINER_NAME 已停止保留，确认新容器正常后手动清理："
        echo "  docker rm $CONTAINER_NAME"
        exit 0
    fi
    sleep 2
done

echo "部署完成，但服务未就绪，请检查容器日志：docker logs -f $NEW_NAME"
exit 1
