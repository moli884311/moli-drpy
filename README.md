# 沫离 drpyS (drpy-node) UI 美化版

[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=plastic&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/hjdhnx/drpy-node)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/hjdhnx/drpy-node)

![沫离drpyS(drpy-node)ui美化版](./public/images/moli.png)

---

## 改动总览 (mlcp-drpy)

### 站点与品牌定制

| 功能 | 说明 | 关键文件 |
|------|------|----------|
| 首页 UI 美化 | 渐变色头部 + 卡片式网格布局 + 分类标签，现代化视觉风格 | `public/index.html`, `controllers/root.js` |
| moli 自定义站源 | 52 个精选站点 + 7 个电视直播源，通过 `sub=moli` 订阅码加载 | `public/sub/sub.json`, `public/sub/custom/moli.json` |
| 品牌名称全局变量 `brand_name` | 默认"沫离影视"，后台面板可自定义；moli.json 中采用 `{brand_name}` 占位符，运行时动态替换，改一处全站生效 | `controllers/config.js`, `controllers/admin.js` |
| 站点名称格式化 | `🎬{brand_name}┃平台名┃[标签]` 格式，`enable_formatted_names` 可开关 | `controllers/config.js` |
| `custom_json` 字段支持 | 订阅码若含 `custom_json` 字段，自动从外部 JSON 加载站点和直播源 | `controllers/config.js` |

### 解析器系统

| 功能 | 说明 | 关键文件 |
|------|------|----------|
| 解析接口整合 | 整合 **155 条** VIP 视频解析接口，覆盖 JSON / WEB / 聚合三大类 | `config/parses.conf` |
| 自建 JS 解析器 | 3 个自维护解析器（168 / 无名 / 江湖），独立实现，不依赖第三方 | `jx/168.js`, `jx/无名.js`, `jx/江湖.js` |
| JSON 并发解析器 | 重写为沙箱原生 API 实现，并发请求所有 type=1 解析器，竞速取最快返回，自动选择最优线路 | `jx/JSON并发.js` |
| 解析器合并策略 | `custom_json` 中的解析器**追加**到系统解析器之前，不再覆盖 | `controllers/config.js` |

### Admin 管理面板

| 功能 | 说明 | 关键文件 |
|------|------|----------|
| 品牌名称配置 | 控制台可修改 `brand_name`，站点名称实时同步 | `src/views/Config.vue` |
| 自定义源管理页面 | 自动检测 moli.json 数据，站源 / 直播源分区域展示，内联 Monaco 编辑器分别编辑 sites 和 lives 数组 | `src/views/CustomSource.vue` |
| 自定义源 API | 后端增删查 moli.json 站点接口，前端 API 层对接 | `controllers/admin/customSourcesController.js`, `src/api/admin.js` |
| `{brand_name}` 占位符渲染 | 自定义源页面对接后台配置，实时替换占位符显示品牌名 | `src/views/CustomSource.vue` |
| 侧边栏 + 路由 | 新增"自定义源"菜单项及 `/custom-source` 路由 | `src/components/Sidebar.vue`, `src/router/index.js` |
| 构建产物 | Admin 面板多次重新构建至 `apps/admin/` | `apps/admin/` |

### 品牌名称使用指南

在后台面板「配置管理」中修改 `brand_name` 变量（默认值：`沫离影视`），保存后重启容器即可全局生效。修改后以下位置将同步更新：

- 配置接口输出中的站点名称（`GET /config/1?sub=moli`）
- Admin 面板自定义源页面的站点展示
- 所有通过 `formatSiteName()` 生成的前端标签

---

## 常用超链接

| 类别 | 链接 |
|------|------|
| 项目主页（免翻） | [https://git-proxy.playdreamer.cn/hjdhnx/drpy-node](https://git-proxy.playdreamer.cn/hjdhnx/drpy-node) |
| DS源仓库（去中心化） | [http://183.87.133.60:5678/](http://183.87.133.60:5678/) |
| DS本地包下载中心 | [/admin/download](/admin/download) |
| 接口文档 | [docs/apidoc.md](docs/apidoc.md) · [接口列表（含定时任务）](docs/apiList.md) |
| 代码质量评估 | [工具说明](docs/codeCheck.md) · [评估报告](docs/codeCheckReport.md) |
| 本地配置接口（动态本地） | [`/config?healthy=1&pwd=$pwd`](/config?healthy=1&pwd=$pwd) |
| 本地配置接口（动态外网/局域网） | [`/config/1?healthy=1&pwd=$pwd`](/config/1?healthy=1&pwd=$pwd) |
| 沫离精简接口 | [`/config/1?sub=moli&healthy=1&pwd=$pwd`](/config/1?sub=moli&healthy=1&pwd=$pwd) |
| 其他配置接口（订阅过滤） | [docs/sub.md](docs/sub.md) |
| Python环境 | [docs/pyenv.md](docs/pyenv.md) |
| DS项目环境变量说明 | [docs/envdoc.md](docs/envdoc.md) |
| PHP环境 | [spider/php/readme.md](spider/php/readme.md) |
| 猫源调试教程 | [docs/catDebug.md](docs/catDebug.md) |
| 接口压测教程 | [docs/httpTest.md](docs/httpTest.md) |
| AI编程工具 Trae | [https://www.trae.ai/account-setting#subscription](https://www.trae.ai/account-setting#subscription)（邮编 ZIP 输入：`518000`） |
| 推荐 AI 模型 GLM-4.7 | [https://www.bigmodel.cn/glm-coding?ic=DRV3C8M5NX](https://www.bigmodel.cn/glm-coding?ic=DRV3C8M5NX) · [配置文档](https://docs.bigmodel.cn/cn/coding-plan/tool/trae) |
| 免费 AI | [360纳米](https://bot.n.cn/) · [当贝AI](https://ai.dangbei.com/chat) · [国外聚合全模型](https://lmarena.ai/) |
| 防爬虫协议 | [/robots.txt](/robots.txt) |
| 油猴脚本 | [反切屏检测](/public/monkey/check_screen_leave.user.js) · [通用网页脚本框架](/public/monkey/clipboard-sender.user.js) · [自定义指令集](/public/monkey/自定义指令集-道长.json) |

---

## 插件应用列表

| 插件 | 路径 |
|------|------|
| Admin 管理面板 | `/apps/admin` |
| DrPlayer | `/apps/drplayer` |
| Websocket 实时日志 | `/apps/websocket` |
| Cookie 管理插件 | `/apps/cookie-butler/index.html` |
| Cron 表达式生成器 | `/apps/cron-generator/index.html` |
| 剪切板智能推送 | `/apps/clipboard-pusher/index.html` |
| DS源可用性检测 | `/apps/source-checker/index.html` |
| DS解析检测 | `/apps/vip-parser/index.html` |
| DS源配置编辑 | `/apps/source-editor/index.html` |
| DS内存图片管理器 | `/apps/image-manager/index.html` |
| 时钟插件 | [白色时钟](/apps/clock/white_clock.html) · [日历时钟](/apps/clock/index.html) |
| 庆祝页面（完结撒花） | `/apps/happy/index.html` |
| bookReader | `/apps/book-reader` |
| 系统备份与恢复 | `/apps/backup-restore/index.html` |
| 代码加解密工具 | `/admin/encoder` |
| 央视点播解析工具 | `/proxy/央视大全[官]/index.html` |
| 在线猫DS源主页 | `/cat/index.html` |
| V我50支付凭证生成器 | `/authcoder?len=10&number=1` |

---

## 同作者项目

- [DS源适配猫影视](https://github.com/hjdhnx/CatPawOpen/tree/ds-cat)
- [DS插件项目（Golang）](https://github.com/hjdhnx/drpy-plugin)
- [DS 二进制插件项目 - pup-sniffer](https://github.com/hjdhnx/pup-sniffer)
- [DS 二进制插件项目 - file-index](https://github.com/hjdhnx/file-index)
- [DS Web 插件项目 - DrPlayer](https://github.com/hjdhnx/DrPlayer)
- [drpy2 打包项目](https://github.com/hjdhnx/drpy-webpack)

---

## 免费壳子推荐

| 名称 | 下载链接 |
|------|----------|
| 酷9 | [https://wwbty.lanzouv.com/iGoUV3d3hxuf](https://wwbty.lanzouv.com/iGoUV3d3hxuf) |
| 千寻 | [https://wwbty.lanzouv.com/iSSN93d3hyzg](https://wwbty.lanzouv.com/iSSN93d3hyzg) |
| 皮卡丘 | [https://github.com/ingriddaleusag-dotcom/PeekPiliRelease](https://github.com/ingriddaleusag-dotcom/PeekPiliRelease) |

## 点播壳子推荐

| 网盘 | 链接 |
|------|------|
| 百度网盘 | [https://pan.baidu.com/s/1pbGbHIeqvlbXMtsw_rIJQA?pwd=jef2](https://pan.baidu.com/s/1pbGbHIeqvlbXMtsw_rIJQA?pwd=jef2) |
| 夸克网盘 | [https://pan.quark.cn/s/fbee14d16842](https://pan.quark.cn/s/fbee14d16842) |
| UC网盘 | [https://drive.uc.cn/s/680211bd149d4](https://drive.uc.cn/s/680211bd149d4) |

---

## 更新记录

### 2026-08-04 更新至 **V1.5.0**
- 🎉 **整合自建弹幕 API（danmu-api）**，实现完全本地化的弹幕服务，无需依赖任何外部接口
- 🌈 **彩色弹幕支持**：每条弹幕自动分配不同颜色，告别单调，提升观看体验
- 🔧 **修复 XML 重复声明问题**：完美兼容 TVBox、WebBox 等播放器，不再出现解析错误
- 📡 **新增 `/action` 管理接口**：支持 TVBox 推送刷新机制，可配合本地代理实现弹幕实时更新
- 🚀 **提供 Docker 一键部署方案**：简化安装流程，任何人都能快速部署
- ⚙️ **完整的环境变量配置**：支持自定义数据源、缓存策略、限流等高级调优
- 📚 **超详细部署教程**：从零开始，一步步指导完成部署

### 2026-07-07 更新至 **V1.4.4**
### 2026-03-22 更新至 **V1.4.3**
### 2026-03-21 更新至 **V1.4.2**
### 2026-03-20 更新至 **V1.4.1**
### 2026-03-19 更新至 **V1.3.31**
### 2026-03-17 更新至 **V1.3.30**
### 2026-03-15 更新至 **V1.3.29**
### 2026-03-14 更新至 **V1.3.28**

> [点此查看完整更新记录](docs/updateRecord.md)

---

## 注意事项

> 总是有人遇到各种奇葩问题（如没弹幕、访问 `/config/1` 服务马上崩溃等）。能自行解决最好，解决不了建议使用下方 **安装教程** 中的 **方案三（道长腾讯轻量云服务器安装方案）**。跟我一样部署，有问题那就不可能了——我能用你即能用。

---

## 基础框架

**待办事项：**

1. js 里的源能否去除 `export` 开头，保持跟 qjs 一致？
2. js 里的源，像一级这种异步 js，里面调用未定义的函数，能否不通过函数参数传入直接注入调用？
3. 在源的各个函数调用时动态注入 `input`、`MY_URL` 等局部变量，不影响全局。搞了半天没成功，待解决。

> 写源的函数**不可以使用箭头函数**，箭头函数无法拿到 `this` 作用域，就没法获取 `input` 和 `MY_URL` 变量。

**精简去除的库：**
- `axios`（刚需，后端请求才能拿到 `set-cookie`）
- `jsonpath`
- `underscore`
- `pino-pretty`
- `deasync`

---

## 参考资料

- [crypto-js-wasm 使用教程](docs/crypto-js-wasm/readme-CN.md)
- [WebDAV 使用教程](docs/webdav.md)
- [Puppeteer 使用教程](docs/pupInstall.md)
- [drpyS 源属性说明](docs/ruleAttr.md)
- [drpy2 写源简述](docs/ruleDesc.md)
- [关姐算法搭建说明](docs/suanfa.md)
- [重要问题记录](docs/issue.md)

---

## 问题说明

1. Windows 上直接运行 `index.js` 可能会发现运行过程中的日志打印出中文乱码。建议通过 `yarn dev` 运行或在 `package.json` 里点击 `dev` 脚本运行。
2. `pinyin` 库依赖的 `nodejieba` 已"跑路"，目前无法完成安装。
3. `new Promise` 里发生的错误无法被外部 `try...catch` 捕获，会导致程序崩溃（如 `番薯动漫.js` 中的写法）。

---

## 安装说明

### 方案一：ZY 安装方案（多平台）
[多平台安装教程](https://zy.catni.cn/otherShare/drpyS-build.html)

---

### 方案二：自动化安装（直接薅道长羊毛）

**终端执行：**
```bash
bash -c "$(curl -fsSLk https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/refs/heads/main/install/autorun.sh)"

添加定时方案：

bash
echo "30 7 * * * cd /patch && bash -c \"\$(curl -fsSLk https://git-proxy.playdreamer.cn/hjdhnx/drpy-node/raw/refs/heads/main/install/autorun.sh)\" >> /patch/drpyslog.log 2>&1" | crontab -
命令说明：/patch 为脚本存放路径（脚本放在与源码同级的自定义目录中）

方案三：道长腾讯轻量云服务器安装方案
shell
mkdir /home/node_work
cd /home/node_work
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm install 22
npm config set registry https://registry.npmmirror.com
npm i -g cnpm --registry=https://registry.npmmirror.com
npm i -g pm2 yarn@1.22.19
git clone https://git-proxy.playdreamer.cn/hjdhnx/drpy-node.git
cd drpy-node
yarn
yarn pm2
pm2 logs drpys
pm2 ls
pm2 stop drpys
pm2 start drpys
pm2 restart drpys
弹幕服务整合（本地弹幕 API）
本项目现已集成自建弹幕 API（danmu-api），实现完全本地化的弹幕服务，无需依赖任何外部弹幕接口，支持 TVBox、WebBox 等播放器，并提供以下增强功能：

✅ 本地弹幕引擎：内置完整弹幕搜索、匹配、拉取逻辑，数据源可自由配置（支持 B站、腾讯、优酷、爱奇艺、芒果、豆瓣、人人等主流平台）

✅ 彩色弹幕：每条弹幕自动分配不同颜色，告别单调，提升观看体验

✅ XML 格式修复：完美兼容 TVBox 和 WebBox 解析，无重复声明错误

✅ TVBox 推送联动：支持 /action 管理接口，可配合 TVBox 本地代理实现弹幕刷新

✅ 高性能缓存：搜索和弹幕数据均有缓存，降低上游请求压力

✅ 一键部署：通过 Docker 镜像可快速部署，无需手动配置

部署方式
您可以使用以下三种方式之一部署本服务：

方式一：Docker 一键部署（推荐）
克隆仓库

bash
git clone https://github.com/moli884311/moli-drpy.git
cd moli-drpy
构建镜像

bash
docker build -t moli-drpy:latest .
运行容器

bash
docker run -d --name moli-drpy -p 5757:5757 -p 9321:9321 --restart=always moli-drpy:latest
端口说明：

5757：drpy 主服务端口，用于 TVBox/WebBox 获取弹幕数据

9321：danmu-api 管理界面端口（可选），可通过 http://你的IP:9321 访问

验证

bash
curl "http://localhost:5757/danmu?name=test&episode=1"
如果返回 XML 弹幕，说明服务正常。

方式二：Docker Compose 编排（便于管理）
创建 docker-compose.yml：

yaml
version: '3.8'
services:
  drpy:
    build: .
    container_name: moli-drpy
    restart: always
    ports:
      - "5757:5757"
      - "9321:9321"
    environment:
      - DANMU_API_PORT=9321
      - SOURCE_ORDER=360,vod,tencent,youku,iqiyi,imgo,bilibili,migu,renren,hanjutv,dandan
      - DANMU_OUTPUT_FORMAT=xml
      - CONVERT_COLOR=default
      - DANMU_PUSH_URL=http://127.0.0.1:9978/action?do=refresh&type=danmaku&path=
      - LOG_LEVEL=info
      - SEARCH_CACHE_MINUTES=5
      - COMMENT_CACHE_MINUTES=10
      - RATE_LIMIT_MAX_REQUESTS=10
      - GROUP_MINUTE=1
      - ENABLE_ANIME_EPISODE_FILTER=true
      # 如需自定义 VOD 采集站，可添加 VOD_SERVERS 变量
    volumes:
      # 可选：挂载自定义环境变量文件
      - ./danmu.env:/app/libs/danmu_api/danmu_api/.env:ro
然后执行：

bash
docker-compose up -d
方式三：裸机部署（传统方式）
安装 Node.js 22 和 yarn

克隆仓库并安装依赖

进入 libs/danmu_api/danmu_api 目录，执行 npm install

修改 controllers/danmu.js 中的 BUILTIN_API 为 http://127.0.0.1:9321/（如需）

启动 danmu-api：node /app/libs/danmu_api/danmu_api/server.js &

启动 drpy：node index.js

环境变量配置（可选）
您可以通过以下环境变量调整弹幕服务行为（在 docker run 或 docker-compose 中设置）：

变量名	说明	默认值
DANMU_API_PORT	danmu-api 监听端口	9321
SOURCE_ORDER	数据源优先级（逗号分隔）	360,vod,tencent,youku,iqiyi,imgo,bilibili,migu,renren,hanjutv,dandan
DANMU_OUTPUT_FORMAT	输出格式（xml 或 json）	xml
CONVERT_COLOR	颜色转换策略（default 保留原始颜色，white 全白，color 强制彩色）	default（由 drpy 控制）
DANMU_PUSH_URL	TVBox 推送回调地址	http://127.0.0.1:9978/action?do=refresh&type=danmaku&path=
SEARCH_CACHE_MINUTES	搜索缓存时间（分钟）	5
COMMENT_CACHE_MINUTES	弹幕缓存时间（分钟）	10
RATE_LIMIT_MAX_REQUESTS	每分钟每 IP 最大请求数	10
GROUP_MINUTE	弹幕去重时间窗口（分钟）	1
ENABLE_ANIME_EPISODE_FILTER	是否过滤花絮/预告等非正片	true
如需更高级配置（如 VOD 采集站、代理、TMDB 等），请参考 libs/danmu_api/danmu_api/.env.example 文件，并挂载到容器中。

使用示例
TVBox 弹幕配置：在 TVBox 的弹幕设置中，填入 http://你的服务器IP:5757/danmu

WebBox 使用：直接引用相同的地址即可，支持跨域

手动测试：curl "http://你的服务器IP:5757/danmu?name=间谍过家家&episode=1" 会返回 XML 弹幕

管理界面
如果 danmu-api 带有管理界面，可通过 http://你的服务器IP:9321 访问（需在容器中暴露该端口）。

超详细部署教程（Docker 一键部署）
以下教程适合没有任何 Docker 经验的用户，一步一步带你完成部署。

前提条件
一台 Linux 服务器（CentOS/Ubuntu/Debian 均可）

服务器已安装 Docker（如果没有，请先执行下方安装 Docker 的命令）

第一步：安装 Docker
CentOS 7/8：

bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
Ubuntu/Debian：

bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
第二步：克隆项目并构建镜像
bash
# 克隆仓库
git clone https://github.com/moli884311/moli-drpy.git
cd moli-drpy

# 构建镜像（首次构建约需 5-10 分钟，视网络而定）
docker build -t moli-drpy:latest .
第三步：运行容器
bash
docker run -d --name moli-drpy -p 5757:5757 -p 9321:9321 --restart=always moli-drpy:latest
参数说明：

-d：后台运行

--name moli-drpy：指定容器名

-p 5757:5757：映射 drpy 端口

-p 9321:9321：映射 danmu-api 管理端口

--restart=always：容器意外退出时自动重启

第四步：验证服务
bash
# 查看容器运行状态
docker ps | grep moli-drpy

# 测试弹幕接口
curl "http://localhost:5757/danmu?name=test&episode=1"
如果返回 XML 格式的弹幕数据，说明部署成功。

第五步：配置 TVBox/WebBox
在 TVBox 的弹幕设置中，将弹幕地址填写为：

text
http://你的服务器公网IP:5757/danmu
例如：http://123.456.789.0:5757/danmu

播放视频时，TVBox 会自动拼接 ?name=视频名&episode=集数，无需手动添加。

第六步（可选）：配置自定义环境变量
如果您想调整弹幕源、缓存时间等，可以创建 danmu.env 文件（参考上面的环境变量表），然后重新运行容器并挂载该文件：

bash
docker stop moli-drpy
docker rm moli-drpy
docker run -d --name moli-drpy -p 5757:5757 -p 9321:9321 --restart=always -v $(pwd)/danmu.env:/app/libs/danmu_api/danmu_api/.env moli-drpy:latest
常见问题
Q：访问 /danmu 返回空 XML？
A：检查 danmu-api 是否正常运行：docker exec moli-drpy ps aux | grep server.js。如果进程不存在，查看日志：docker logs moli-drpy。

Q：TVBox 无法加载弹幕？
A：确认防火墙已放行 5757 端口，且在 TVBox 中填写的地址正确（注意是公网 IP，不是 127.0.0.1）。

Q：如何更新服务？
A：重新拉取最新代码并重新构建镜像，然后替换容器即可。

bash
git pull
docker build -t moli-drpy:latest .
docker stop moli-drpy
docker rm moli-drpy
docker run -d --name moli-drpy -p 5757:5757 -p 9321:9321 --restart=always moli-drpy:latest
代理转发功能测试
代理转发ds

代理转发百度

代理转发范冰冰直播源

友链（白嫖接口服务）
猫影视git文件加速

猫影视多功能主页

ZY写源教学

源动力-新

源动力-老

电竞专业反应测试

桌面启动器

不知名获取网盘CK工具

AI接入
讯飞星火

deepseek | 对话

讯飞智能体 | 对话 | 数据集

KIMI | 对话

品牌名称自定义
在管理面板的环境配置中修改 brand_name 变量，即可更换站点名称中的品牌前缀（默认：沫离影视）。修改后所有站点名称和接口输出中的品牌文字将同步更新，可用于品牌展示或广告用途。

版权
本项目主体框架由道长开发，项目内相关源收集于互联网，可供学习交流测试使用，禁止商用或者直接转卖代码，转载代码请带上出处。

免责声明
此程序仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。

由于此程序仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。

请勿将此程序用于任何商业或非法目的，若违反规定请自行对此负责。

此程序涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。

本人对任何程序引发的问题概不负责，包括但不限于由程序错误引起的任何损失和损害。

如果任何单位或个人认为此程序可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此程序。

所有直接或间接使用、查看此程序的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此程序，即视为您已接受此免责声明。

text

---

## ✅ 如何复制

1. 点击代码块右上角的 **"复制"** 按钮（如果支持），或手动全选代码块内容。
2. 粘贴到您的 `README.md` 文件中。

---

## 📌 如果仍然显示截断

因为文件长度超过平台显示限制，您可能需要在复制后检查结尾是否完整。完整内容的末尾应为：

```markdown
此程序涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何程序引发的问题概不负责，包括但不限于由程序错误引起的任何损失和损害。
6. 如果任何单位或个人认为此程序可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此程序。
7. 所有直接或间接使用、查看此程序的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此程序，即视为您已接受此免责声明。


