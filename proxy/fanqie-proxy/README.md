# 番茄短剧反代

替代已停用的 `fqgo.52dns.cc`，对接 fanqienovel.com 公开 API。

## 部署

```bash
cd proxy/fanqie-proxy
node proxy.js
```

默认端口 3001，可通过 `PORT` 环境变量修改。

## 接口

| 路径 | 参数 | 说明 |
|------|------|------|
| `/search` | `query`, `page` | 短剧搜索 |
| `/catalog` | `book_id` | 剧集目录 |
| `/video` | `item_ids` | 播放地址(实验性) |
| `/health` | - | 健康检查 |

## 配置爬虫

修改 `番茄短剧[短].js` 和 `短剧聚合[短].js` 中的 `PROXY` / `FQ_PROXY` 变量为实际部署地址。
