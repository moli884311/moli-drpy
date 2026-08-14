import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const danmuApiRoot = path.join(__dirname, 'danmu_api');
const danmuApiRequire = createRequire(path.join(danmuApiRoot, 'package.json'));
const ENV_PATH = path.join(danmuApiRoot, 'config', '.env');

let handleRequest = null;
let loaded = false;

async function ensureLoaded() {
    if (loaded) return;
    try {
        const dotenv = danmuApiRequire('dotenv');
        dotenv.config({ path: ENV_PATH, override: true });
    } catch (e) {
        console.warn(`[danmu-bridge] dotenv 加载失败: ${e.message}`);
    }
    const worker = await import(pathToFileURL(path.join(danmuApiRoot, 'danmu_api', 'worker.js')).href);
    handleRequest = worker.handleRequest;
    loaded = true;
}

export async function danmuRequest(pathname, params = {}, timeoutMs = 15000) {
    await ensureLoaded();
    const qs = new URLSearchParams(params).toString();
    const url = `http://127.0.0.1${pathname}${qs ? '?' + qs : ''}`;
    const req = new Request(url, { method: 'GET', headers: {} });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const resp = await handleRequest(req, process.env, 'netlify', '127.0.0.1');
        return { status: resp.status, body: await resp.text() };
    } finally {
        clearTimeout(timer);
    }
}

export async function danmuHttpGet(url, timeoutMs = 15000) {
    try {
        const u = new URL(url);
        const params = {};
        u.searchParams.forEach((value, key) => { params[key] = value; });
        const result = await danmuRequest(u.pathname, params, timeoutMs);
        if (result.status < 200 || result.status >= 300) {
            console.warn(`[danmu-bridge] 进程内请求非 2xx: ${result.status} ${u.pathname}`);
            return "";
        }
        return result.body;
    } catch (e) {
        console.warn(`[danmu-bridge] 进程内请求失败: ${e.message}`);
        return "";
    }
}

/**
 * 通用进程内代理：把任意 method + pathname + query + body 转发给 danmu-api 的 handleRequest，
 * 返回完整响应（status + headers + body）。用于挂载原版弹幕面板及其全部系统 API。
 * 注意 deployPlatform 传 'node'，使系统配置（setEnv 等）走 NodeHandler 写入本地 .env。
 */
export async function danmuProxy(method, pathname, params = {}, body = null, timeoutMs = 60000) {
    await ensureLoaded();
    const qs = new URLSearchParams(params).toString();
    const url = `http://127.0.0.1${pathname}${qs ? '?' + qs : ''}`;
    const headers = {};
    const init = { method: (method || 'GET').toUpperCase(), headers };
    if (init.method !== 'GET' && init.method !== 'HEAD' && body != null) {
        init.headers['Content-Type'] = 'application/json';
        init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    const req = new Request(url, init);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const resp = await handleRequest(req, process.env, 'node', '127.0.0.1');
        const respHeaders = {};
        resp.headers.forEach((value, key) => { respHeaders[key] = value; });
        return { status: resp.status, headers: respHeaders, body: await resp.text() };
    } finally {
        clearTimeout(timer);
    }
}

// 面板可编辑的配置项白名单（key → 中文标签 + 说明）
export const DANMU_EDITABLE_CONFIG = {
    OTHER_SERVER: { label: '弹幕源服务器', desc: '弹弹play 弹幕主源地址' },
    VOD_SERVERS: { label: 'VOD 弹幕源', desc: '格式：名称@URL,名称@URL（逗号分隔）' },
    VOD_RETURN_MODE: { label: 'VOD 返回模式', desc: 'fastest（最快）或 concurrent（并发）' },
    SOURCE_ORDER: { label: '搜索源顺序', desc: 'douban,360,renren,hanjutv,tencent,youku,iqiyi,imgo,bilibili 等' },
    DANMU_OUTPUT_FORMAT: { label: '输出格式', desc: 'json 或 xml' },
    SEARCH_CACHE_MINUTES: { label: '搜索缓存(分钟)', desc: '搜索结果的缓存时长' },
    COMMENT_CACHE_MINUTES: { label: '弹幕缓存(分钟)', desc: '弹幕内容的缓存时长' },
    GROUP_MINUTE: { label: '分组合并(分钟)', desc: '相近弹幕分组阈值' },
    DANMU_LIMIT: { label: '弹幕条数上限', desc: '0 表示不限制' },
};

function parseEnvFile(content) {
    const lines = content.split('\n');
    const values = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !line.trim().startsWith('#')) {
            values[m[1]] = { value: m[2], lineIndex: i };
        }
    }
    return { lines, values };
}

export function readDanmuConfig() {
    try {
        const content = fs.readFileSync(ENV_PATH, 'utf-8');
        const { values } = parseEnvFile(content);
        const result = {};
        for (const key of Object.keys(DANMU_EDITABLE_CONFIG)) {
            result[key] = values[key] ? values[key].value : '';
        }
        return { ok: true, config: result };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

export function writeDanmuConfig(updates) {
    try {
        const content = fs.readFileSync(ENV_PATH, 'utf-8');
        const { lines, values } = parseEnvFile(content);
        for (const [key, newValue] of Object.entries(updates)) {
            if (!(key in DANMU_EDITABLE_CONFIG)) continue;
            const strValue = String(newValue ?? '');
            if (values[key]) {
                lines[values[key].lineIndex] = `${key}=${strValue}`;
            } else {
                lines.push(`${key}=${strValue}`);
            }
        }
        fs.writeFileSync(ENV_PATH, lines.join('\n'), 'utf-8');
        // 热重载：重新加载 .env 到 process.env（下次请求生效）
        try {
            const dotenv = danmuApiRequire('dotenv');
            dotenv.config({ path: ENV_PATH, override: true });
        } catch (e) {}
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}
