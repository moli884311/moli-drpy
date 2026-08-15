import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.join(__dirname, '..', 'libs_drpy', 'danmu_api', 'danmu_api', 'worker.js');

const worker = fs.readFileSync(workerPath, 'utf8');

if (/async function handleFongmiDanmaku/.test(worker)) {
  console.log('[patch] handleFongmiDanmaku 已存在，跳过注入');
  process.exit(0);
}

const snippet = `/**
 * FongMi 弹幕接口统一入口。
 * 支持 format=xml 时直接返回最优候选的弹幕 XML，兼容 jar 内按 XML 解析的弹幕搜索逻辑。
 * @param {URL} url 请求 URL
 * @param {Request} req 请求对象
 * @returns {Promise<Response>} 弹幕响应
 */
async function handleFongmiDanmaku(url, req) {
  const queryFormat = (url.searchParams.get("format") || "").toLowerCase();
  const resp = await getFongmiDanmaku(url, req);
  if (queryFormat !== "xml") return resp;

  let commentUrl = "";
  try {
    const items = await resp.clone().json();
    if (Array.isArray(items) && items.length > 0 && items[0] && items[0].url) {
      commentUrl = items[0].url;
    }
  } catch (e) {
    log("warn", \`[system] [fongmi] format=xml 解析候选失败: \${e.message}\`);
  }

  if (commentUrl) {
    log("info", \`[system] [fongmi] format=xml matched: \${commentUrl}\`);
    return getCommentByUrl(commentUrl, "xml", false, false);
  }
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\\n<i></i>', {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8", "Access-Control-Allow-Origin": "*" }
  });
}

`;

const marker = 'async function handleRequest(';
if (!worker.includes(marker)) {
  console.error('[patch] 未找到 handleRequest 函数，无法注入');
  process.exit(1);
}

let out = worker.replace(marker, snippet + marker);

const routeCall = 'return getFongmiDanmaku(url, req);';
const routeCalls = out.split(routeCall).length - 1;
out = out.split(routeCall).join('return handleFongmiDanmaku(url, req);');

if (routeCalls !== 2) {
  console.warn(`[patch] 预期 2 处路由调用，实际匹配 ${routeCalls} 处，请检查 worker.js 的 fongmi/danmaku 路由`);
}

fs.writeFileSync(workerPath, out, 'utf8');
console.log(`[patch] handleFongmiDanmaku 注入完成，路由调用替换 ${routeCalls} 处`);
