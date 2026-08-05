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

# --- 新增：复制 danmu-api 源码（仓库路径 libs_drpy/danmu_api） ---
COPY libs_drpy/danmu_api /app/libs_drpy/danmu_api

# --- 新增：进入正确目录安装 danmu-api 依赖（package.json 在 libs_drpy/danmu_api/ 下） ---
RUN cd /app/libs_drpy/danmu_api && npm install --production

# --- 新增：复制修改后的弹幕控制器（仓库已有 controllers/danmu.js，无需再取 apps/drplayer） ---
COPY controllers/danmu.js /app/controllers/danmu.js

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

# --- 新增：复制启动脚本 ---
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5757 9321

# 修改 CMD 为执行启动脚本
CMD ["/entrypoint.sh"]
