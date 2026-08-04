# 构建器阶段
FROM node:22-alpine AS builder

RUN apk add --no-cache git make python3 py3-pip build-base
RUN git config --global http.version HTTP/1.1

WORKDIR /app

# 克隆 drpy 源码
RUN git clone https://github.com/moli884311/moli-drpy.git .
RUN sed -i 's|const shell = os.platform() === '"'"'win32'"'"' ? '"'"'powershell.exe'"'"' : '"'"'bash'"'"'|const shell = os.platform() === '"'"'win32'"'"' ? '"'"'powershell.exe'"'"' : '"'"'sh'"'"'|' controllers/admin/terminalController.js
RUN rm -rf drpy-node-admin drpy-node-bundle drpy-node-mcp drpy2-quickjs

# 安装 drpy 依赖
RUN yarn && yarn add puppeteer

# --- 新增：复制 danmu-api 源码 ---
# 假设 danmu-api 源码位于当前构建上下文中的 libs/danmu_api 目录
# 您需要将 danmu_api 文件夹放在与 Dockerfile 同级的 libs/ 下
COPY libs/danmu_api /app/libs/danmu_api

# 进入 danmu-api 目录安装其依赖
RUN cd /app/libs/danmu_api/danmu_api && npm install --production

# --- 新增：复制修改后的 drpy 弹幕控制器 ---
# 将您修改后的 index.js（即 danmu.js）复制到正确位置覆盖原文件
# 注意原路径是 controllers/danmu.js，但您的修改文件我们命名为 danmu.js
COPY apps/drplayer/index.js /app/controllers/danmu.js

# 准备临时目录用于运行阶段
RUN mkdir -p /tmp/drpys && cp -r /app/. /tmp/drpys/

# ===== 运行器阶段 =====
FROM alpine:latest AS runner

WORKDIR /app

# 复制构建结果
COPY --from=builder /tmp/drpys/. /app

# 配置 drpy 环境
RUN cp /app/.env.development /app/.env && \
    rm -f /app/.env.development && \
    sed -i 's|^VIRTUAL_ENV[[:space:]]*=[[:space:]]*$|VIRTUAL_ENV=/app/.venv|' /app/.env && \
    sed -i 's|^ENABLE_TERMINAL=0|ENABLE_TERMINAL=1|' /app/.env && \
    echo '{"ali_token":"","ali_refresh_token":"","quark_cookie":"","uc_cookie":"","bili_cookie":"","thread":"10","enable_dr2":"1","enable_py":"2"}' > /app/config/env.json

# 安装必要运行时
RUN apk add --no-cache nodejs php83 php83-cli php83-curl php83-mbstring php83-xml php83-pdo php83-pdo_mysql php83-pdo_sqlite php83-openssl php83-sqlite3 php83-json python3 py3-pip py3-setuptools py3-wheel build-base libffi-dev openssl-dev
RUN ln -sf /usr/bin/php83 /usr/bin/php

# 激活 python 虚拟环境并安装依赖
RUN python3 -m venv /app/.venv && \
    . /app/.venv/bin/activate && \
    pip3 install -r /app/spider/py/base/requirements.txt

# --- 新增：复制 danmu-api 的环境变量配置（可选） ---
# 如果您有预设的 .env 配置，可以复制到对应位置
# 例如：COPY .env.danmu /app/libs/danmu_api/danmu_api/.env

# --- 新增：复制启动脚本 ---
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5757 9321

# 修改 CMD 为执行启动脚本
CMD ["/entrypoint.sh"]
