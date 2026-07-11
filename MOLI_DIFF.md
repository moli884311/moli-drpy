# moli-drpy 与原版 drpy-node 差异总览

原版仓库：`https://github.com/Hululu007/drpy-node`
定制版本：moli-drpy（沫离影视增强版）

---

## 新增文件（23 个）

### 控制器

| 文件 | 说明 |
|------|------|
| `controllers/danmu.js` | 弹幕服务 — 从 TVBox JAR 反编译迁移，通过 360kan + 公共弹幕 API 获取弹幕 XML |
| `controllers/admin/customSourcesController.js` | 自定义源管理 API — 增删 moli.json 中的站点/直播源 |

### 前端页面

| 文件 | 说明 |
|------|------|
| `drpy-node-admin/src/views/CustomSource.vue` | 自定义源管理界面 — Monaco 编辑器在线编辑 moli.json 站点和直播源数组 |

### 解析器

| 文件 | 说明 |
|------|------|
| `jx/无意云.js` | 无意云 JSON 解析器 |
| `Douban.java` | 豆瓣爬虫反编译源（JAR 提取） |
| `Gz360.java` | 360kan 爬虫反编译源（JAR 提取） |

### 站点配置与 UI

| 文件 | 说明 |
|------|------|
| `public/sub/custom/moli.json` | 52 个精选站点 + 7 个直播源配置 |
| `public/images/moli.png` | 品牌 Logo |
| `sites_4k.json` | 4K/网盘站点配置 |
| `sites_src/` (9 个 Java 文件) | 反编译的爬虫源码（从 custom_spider.jar 提取） |
| `public/jar/custom_spider_old.jar` | 原始 JAR 备份 |

---

## 修改文件（20 个）

### 品牌与 UI

| 文件 | 改动内容 |
|------|----------|
| `public/index.html` | **完全重写** — 原版为 README.md 渲染，现为精美品牌首页，主题色渐变色 + 卡片式布局 |
| `README.md` | 标题改为"沫离 drpyS UI 美化版"，新增品牌名称自定义章节 |

### 核心控制器

| 文件 | 改动内容 |
|------|----------|
| `controllers/config.js` | 新增 `formatSiteName()` — 站点名格式化为 `🎬沫离影视┃平台名┃[标签]`；支持 `enable_formatted_names` 开关；新增 `brand_name` 全局变量；新增 `{brand_name}` / `{api_pwd}` 占位符替换 |
| `controllers/root.js` | 移除 README.md 渲染逻辑，直接提供 brand 首页；密码改用 `ENV.get('api_pwd')` 读取，空密码时自动移除 URL 中的 `pwd` 参数 |
| `controllers/docs.js` | 密码处理同上，空密码时移除文档链接中的 `pwd=$pwd` |
| `controllers/source-checker.js` | 密码处理同上，空密码时忽略 pwd 参数 |
| `controllers/api.js` | 新增弹幕缓存功能 — 从播放 URL 提取片名+集数，自动附弹幕链接 |
| `controllers/admin.js` | 新增 7 个默认配置字段：`kfzys_cookie`、`panweb_cookie`、`panpt_cookie`、`pan123_cookie`、`wogg_cookie`、`brand_name`(沫离影视)、`enable_formatted_names`(1)；注册自定义源路由 |
| `controllers/index.js` | 注册弹幕控制器 |

### Admin 管理面板

| 文件 | 改动内容 |
|------|----------|
| `drpy-node-admin/src/api/admin.js` | 新增 3 个自定义源 API：获取/添加/删除 |
| `drpy-node-admin/src/components/Sidebar.vue` | 侧边栏新增"自定义源"菜单项 |
| `drpy-node-admin/src/router/index.js` | 新增 `/custom-source` 路由 |
| `drpy-node-admin/src/views/Config.vue` | 配置页新增 `brand_name` 和 `enable_formatted_names` 字段 |

### 解析与配置

| 文件 | 改动内容 |
|------|----------|
| `config/parses.conf` | 新增无意云解析器（JSON 类型，绑定 X-Forwarded-For） |
| `config/player.json` | custom_spider.jar MD5 更新 |
| `public/sub/sub.json` | 新增"沫离精选"订阅条目（code=moli） |
| `utils/file.js` | 解析器支持第 6 参数 `extra_headers` |

### 解析器优化

| 文件 | 改动内容 |
|------|----------|
| `jx/JSON合集.js` | 移除外部 `$.require()` 依赖，内联 `shuffle()` 函数，代码更独立 |
| `jx/JSON并发.js` | 同上，简化代码结构 |
| `public/jar/custom_spider.jar` | 更新版本（4MB -> 2MB） |

### 构建产物

| 文件 | 改动内容 |
|------|----------|
| `apps/admin/index.html`、`apps/admin/assets/*`（30+ 文件） | Admin 面板多次重建，JS/CSS 哈希更新 |

---

## 无变更

- `package.json` — 与原版完全相同
- `libs_drpy/` — 全部 30 个文件无改动
- `spider/` — 169 个 JS + 48 个 Python 爬虫源无改动
- `utils/`（除 file.js）— 40 个文件无改动

---

## 功能一览

### 品牌定制
- 品牌名"沫离影视"全局可配，所有站点名称自动加前缀
- 首页精美品牌页面，渐变色设计

### 站源管理
- 52 个精选站点 + 7 个直播源（moli.json）
- 后台管理面板可直接编辑站点配置（Monaco 编辑器）

### 密码安全
- `$pwd` / `{api_pwd}` 占位符系统，首页不再暴露明文密码
- 空密码时自动清理 URL 中 pwd 参数

### 弹幕增强
- 播放时自动附加弹幕链接（360kan + 公共弹幕 API）

### 解析器
- 新增无意云解析器
- JSON 并发/合集解析器代码精简，移除外部依赖

### 配置扩展
- 新增多种网盘 Cookie 配置字段
- 解析器支持自定义请求头
