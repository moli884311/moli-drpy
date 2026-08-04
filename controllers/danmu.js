/**
 * 弹幕控制器 - 本地整合版（修复 XML 重复声明）
 * 
 * 整合 danmu-api 到 drpy 内部，所有请求通过本地 127.0.0.1:9321 调用。
 */

import axios from 'axios';
import http from 'http';
import https from 'https';
import { URL } from 'url';

console.log('[drplayer] 模块加载，弹幕功能已启用（本地 danmu-api）');

// ── 纯净 Axios 实例 ──
const agentOptions = {
    keepAlive: true,
    maxSockets: 64,
    timeout: 30000,
    rejectUnauthorized: false
};
const httpAgent = new http.Agent(agentOptions);
const httpsAgent = new https.Agent(agentOptions);
const cleanAxios = axios.create({ httpAgent, httpsAgent });

// ── 弹幕 API 配置 ──
const BUILTIN_API = "http://127.0.0.1:9321/";
const BACKUP_API = "https://danmuapi-1-nu.vercel.app/";
const BUILTIN_TIMEOUT = 15000;
const BACKUP_TIMEOUT = 10000;
const BUILTIN_SEARCH_TIMEOUT = 8000;
const BUILTIN_MAX_RETRY = 1;
const SIMILARITY_THRESHOLD = 0.75;
const DANMU_CACHE_TTL = 10 * 60 * 1000;
const danmuResultCache = new Map();

// ── 工具函数 ──
function getRealName(str) {
    if (!str) return "";
    return str.replace(/[（(【<][臻真]彩[）)】>]/g, "").trim();
}

function extractNumber(text) {
    if (!text) return -1;
    const digits = text.replace(/\D/g, "");
    if (!digits) return -1;
    return parseInt(digits);
}

function parseEpisodeNumber(value) {
    if (!value) return -1;
    try {
        return parseInt(parseFloat(value));
    } catch (e) {
        return extractNumber(value);
    }
}

function escapeXml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;");
}

function safeLog(text) { return text || ""; }

async function httpGet(url, headers = {}, timeout = 10000, retries = 1) {
    let lastError = "";
    for (let attempt = 0; attempt <= retries; attempt++) {
        if (attempt > 0) await delay(1000 * attempt);
        try {
            const resp = await cleanAxios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                    ...headers,
                },
                timeout,
                responseType: "text",
            });
            return resp.data;
        } catch (e) {
            lastError = e.message;
            if (attempt === retries) break;
        }
    }
    console.log(`[danmu] httpGet failed: ${safeLog(url)} (${lastError})`);
    return "";
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function extractYear(str) {
    if (!str) return "";
    const m = str.match(/(?:19|20)\d{2}/);
    return m ? m[0] : "";
}

function cleanTitle(str) {
    if (!str) return "";
    let title = String(str);
    title = title.split(/from/i)[0];
    title = title.replace(/【.*?】/g, "").replace(/\[.*?\]/g, "");
    title = title.trim();
    title = title.replace(/^[-_]+/, "").trim();
    return title;
}

function editDistance(a, b) {
    if (!a || !b) return Math.max((a || "").length, (b || "").length);
    if (a === b) return 0;
    const m = a.length, n = b.length;
    let prev = new Array(n + 1), curr = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
        }
        [prev, curr] = [curr, prev];
    }
    return prev[n];
}

function calculateSimilarity(a, b) {
    const x = cleanTitle(a || ""), y = cleanTitle(b || "");
    if (!x || !y) return 0;
    return 1 - editDistance(x.toLowerCase(), y.toLowerCase()) / Math.max(x.length, y.length);
}

function generateEpisodeCandidates(num) {
    if (num <= 0) return [];
    const set = new Set();
    set.add(`第${num}集`); set.add(`第${num}期`); set.add(`第${num}话`);
    set.add(`第${num}章`); set.add(`第${num}回`);
    set.add(`_${num}`); set.add(`_${String(num).padStart(2, "0")}`);
    set.add(`第${String(num).padStart(2, "0")}集`);
    set.add(`第${String(num).padStart(2, "0")}期`);
    set.add(`[${num}]`); set.add(`(${num})`);
    set.add(`E${num}`); set.add(`e${num}`); set.add(`EP${num}`); set.add(`ep${num}`);
    return [...set];
}

function countXmlDanmaku(xml) {
    if (!xml || typeof xml !== "string") return 0;
    const trimmed = xml.trim();
    if (!trimmed.startsWith("<")) return 0;
    const matches = trimmed.match(/<d\s/g);
    return matches ? matches.length : 0;
}

function matchByEpisodeCandidates(title, candidates) {
    if (!title || !candidates || candidates.length === 0) return false;
    const lower = title.toLowerCase();
    return candidates.some(c => lower.includes(c.toLowerCase()));
}

function getCacheKey(apiBase, name, episode) {
    return `${apiBase}|${name}|${episode}`;
}

function getCachedResult(key) {
    const entry = danmuResultCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > DANMU_CACHE_TTL) {
        danmuResultCache.delete(key);
        return null;
    }
    return entry.xml;
}

function setCachedResult(key, xml) {
    if (!xml) return;
    danmuResultCache.set(key, { xml, timestamp: Date.now() });
}

// ── 颜色规范化 ──
function isColorValue(value) {
    try {
        if (!value) return false;
        const text = value.trim();
        if (text.startsWith("#") || text.startsWith("0x") || text.startsWith("0X")) return true;
        const color = parseInt(text);
        return color >= 0 && color <= 0x00ffffff;
    } catch { return false; }
}

function normalizeColor(color) {
    if (!color) return "16777215";
    const text = color.trim();
    try {
        if (text.startsWith("#")) return String(parseInt(text.substring(1), 16));
        if (text.startsWith("0x") || text.startsWith("0X")) return String(parseInt(text.substring(2), 16));
    } catch {}
    return text;
}

function normalizeDanmakuParam(param) {
    const values = param.split(",");
    if (values.length < 4) return param;
    let time = values[0], type = values[1], size = values[2], color = values[3];
    if (isColorValue(size)) { color = size; size = "25"; }
    else if (!isColorValue(color)) { color = "16777215"; }
    return time + "," + type + "," + size + "," + normalizeColor(color);
}

// ── API 交互函数 ──
function normalizeBaseUrl(apiUrl) {
    let url = (apiUrl || "").trim();
    if (url.endsWith("/")) url = url.substring(0, url.length - 1);
    if (url.endsWith("/87654321")) url = url.substring(0, url.length - "/87654321".length);
    return url;
}

function getEpisodeQuery(episode, queryMode) {
    if (queryMode === 1) return "";
    const number = extractNumber(episode);
    return number > 0 ? String(number) : "";
}

function getNextEpisodeQueryMode(episode, queryMode) {
    if (queryMode === 0 && getEpisodeQuery(episode, 0)) return 1;
    return -1;
}

function isMovieTypeText(type) { return type === "电影"; }
function isMandarinTitle(title) { return title && (title.includes("国语") || title.includes("普通话")); }
function isCantoneseTitle(title) { return title && title.includes("粤语"); }
function prefersCantonese(episode) { return isCantoneseTitle(episode); }
function isPreferredLanguageTitle(title, preferCantonese) {
    return preferCantonese ? isCantoneseTitle(title) : isMandarinTitle(title);
}

function firstString(obj, ...keys) {
    for (const key of keys) {
        const value = obj[key];
        if (value && String(value).trim()) return String(value).trim();
    }
    return "";
}

function findAnimeId(body) {
    try {
        const obj = JSON.parse(body);
        let array = obj.animes || obj.anime || obj.data;
        if (!array || !Array.isArray(array) || array.length === 0) return "";
        const item = array[0];
        if (!item) return "";
        return item.animeId || item.id || "";
    } catch { return ""; }
}

function findEpisodeList(obj) {
    if (Array.isArray(obj)) {
        return { episodes: obj, isMovie: false };
    }
    let array = obj.episodes;
    if (array) return { episodes: array, isMovie: isMovieTypeText(obj.type || obj.typeDescription || "") };
    const bangumi = obj.bangumi;
    if (bangumi) {
        array = bangumi.episodes;
        if (array) return { episodes: array, isMovie: isMovieTypeText(bangumi.type || bangumi.typeDescription || "") };
    }
    let animes = obj.animes || obj.anime || obj.data;
    if (animes && Array.isArray(animes)) {
        for (const item of animes) {
            if (!item) continue;
            array = item.episodes;
            if (array && Array.isArray(array) && array.length > 0) {
                return { episodes: array, isMovie: isMovieTypeText(item.type || item.typeDescription || "") };
            }
        }
    }
    return null;
}

function isMovieType(obj) {
    if (!obj) return false;
    if (isMovieTypeText(obj.type || "")) return true;
    if (isMovieTypeText(obj.typeDescription || "")) return true;
    const bangumi = obj.bangumi;
    if (bangumi && isMovieTypeText(bangumi.type || bangumi.typeDescription || "")) return true;
    let animes = obj.animes || obj.anime || obj.data;
    if (!animes || !Array.isArray(animes)) return false;
    for (const item of animes) {
        if (item && isMovieTypeText(item.type || item.typeDescription || "")) return true;
    }
    return false;
}

function isSearchEpisodesMovieResult(body) {
    try {
        const obj = JSON.parse(body);
        if (Array.isArray(obj)) return false;
        let animes = obj.animes || obj.anime || obj.data;
        if (!animes || !Array.isArray(animes)) return false;
        for (const anime of animes) {
            if (anime && isMovieType(anime) && anime.episodes) return true;
        }
    } catch {}
    return false;
}

function findMovieFallback(obj, episode) {
    if (Array.isArray(obj)) return null;
    let animes = obj.animes || obj.anime || obj.data;
    if (!animes || !Array.isArray(animes)) return null;
    const preferCantonese = prefersCantonese(episode);
    let firstMovie = null;
    for (const anime of animes) {
        if (!anime || !isMovieType(anime)) continue;
        const episodes = anime.episodes;
        if (!episodes || !Array.isArray(episodes)) continue;
        for (const item of episodes) {
            if (!item) continue;
            const id = firstString(item, "episodeId", "id");
            if (!id) continue;
            const title = firstString(item, "episodeTitle", "title", "name");
            const number = parseEpisodeNumber(firstString(item, "episodeNumber", "number", "sort"));
            const match = { id, title, number };
            if (!firstMovie) firstMovie = match;
            if (isPreferredLanguageTitle(title, preferCantonese)) return match;
        }
    }
    return firstMovie;
}

function findEpisode(body, episode, allowMovieFallback = true) {
    try {
        const obj = JSON.parse(body);
        const episodeList = findEpisodeList(obj);
        if (!episodeList || !episodeList.episodes || episodeList.episodes.length === 0) return null;

        const episodes = episodeList.episodes;
        const targetNumber = extractNumber(episode);
        const episodeCandidates = generateEpisodeCandidates(targetNumber);
        const year = extractYear(episode || "");
        let first = null, firstMandarin = null;
        let bestMatch = null, bestScore = 0;
        let bestWithYear = null, bestScoreWithYear = 0;

        for (const item of episodes) {
            if (!item) continue;
            const id = firstString(item, "episodeId", "id");
            if (!id) continue;
            const title = firstString(item, "episodeTitle", "title", "name");
            const animeTitle = firstString(item, "animeTitle", "title", "name");
            const number = parseEpisodeNumber(firstString(item, "episodeNumber", "number", "sort"));
            const match = { id, title, number };
            if (!first) first = match;
            if (!firstMandarin && isMandarinTitle(title)) firstMandarin = match;

            let hasYear = true;
            if (year) {
                const titleHasYear = (title && title.includes(year)) || (animeTitle && animeTitle.includes(year));
                if (!titleHasYear) hasYear = false;
            }

            if (episode && title && title.includes(episode)) return match;
            if (matchByEpisodeCandidates(title, episodeCandidates)) return match;
            if (targetNumber > 0 && number === targetNumber) return match;
            if (targetNumber > 0 && extractNumber(title) === targetNumber) return match;

            const score = Math.max(calculateSimilarity(animeTitle || "", episode || ""), calculateSimilarity(title || "", episode || ""));
            if (hasYear) {
                if (score > bestScoreWithYear) { bestScoreWithYear = score; bestWithYear = match; }
            } else {
                if (score > bestScore) { bestScore = score; bestMatch = match; }
            }
        }

        if (bestWithYear && bestScoreWithYear >= SIMILARITY_THRESHOLD) return bestWithYear;
        if (bestMatch && bestScore >= SIMILARITY_THRESHOLD) return bestMatch;
        if (!episode) return first;
        if (allowMovieFallback && episodeList.isMovie) return firstMandarin || first;
        return null;
    } catch { return null; }
}

function findEpisodeFromSearchEpisodes(body, episode) {
    try {
        const match = findEpisode(body, episode, false);
        if (match) return match;
        const obj = JSON.parse(body);
        const movieFallback = findMovieFallback(obj, episode);
        if (movieFallback) {
            console.log(`[danmu] episodes movie fallback episode: ${safeLog(movieFallback.title)}, episodeId: ${movieFallback.id}`);
        }
        return movieFallback;
    } catch { return null; }
}

function commentJsonToXml(body) {
    try {
        const obj = JSON.parse(body);
        let comments = obj.comments || obj.data;
        if (!comments || !Array.isArray(comments) || comments.length === 0) return { xml: "", count: 0 };

        let xml = "<i>";
        let count = 0;
        for (const item of comments) {
            if (!item) continue;
            let param = item.p || "";
            let text = item.m || item.text || "";
            if (!param || !text) continue;
            xml += `<d p="${escapeXml(normalizeDanmakuParam(param))}">${escapeXml(text)}</d>`;
            count++;
        }
        xml += "</i>";
        console.log(`[danmu] builtin xml length: ${xml.length}, 弹幕条数: ${count}`);
        return { xml, count };
    } catch { return { xml: "", count: 0 }; }
}

async function loadBuiltinComment(baseUrl, title, episode, episodeMatch) {
    const commentUrl = `${baseUrl}/api/v2/comment/${episodeMatch.id}?format=xml`;
    console.log(`[danmu] builtin load title: ${safeLog(title)}, episode: ${safeLog(episode)}, matched: ${safeLog(episodeMatch.title)}, id: ${episodeMatch.id}`);
    const body = await httpGet(commentUrl, {}, BUILTIN_TIMEOUT, BUILTIN_MAX_RETRY);
    if (body && body.trim().startsWith("<")) {
        const count = countXmlDanmaku(body);
        console.log(`[danmu] builtin xml direct count: ${count}`);
        return { xml: body, count };
    }
    const jsonUrl = `${baseUrl}/api/v2/comment/${episodeMatch.id}?format=json`;
    console.log(`[danmu] fallback json: ${jsonUrl}`);
    const jsonBody = await httpGet(jsonUrl, {}, BUILTIN_TIMEOUT, BUILTIN_MAX_RETRY);
    if (!jsonBody) return { xml: "", count: 0 };
    return commentJsonToXml(jsonBody);
}

async function loadBuiltinBangumi(baseUrl, animeId, episode) {
    const bangumiUrl = `${baseUrl}/api/v2/bangumi/${animeId}`;
    const body = await httpGet(bangumiUrl, {}, BUILTIN_SEARCH_TIMEOUT, 1);
    if (!body) return null;
    return findEpisode(body, episode);
}

async function searchBuiltinAnime(baseUrl, name, episode) {
    const searchUrl = `${baseUrl}/api/v2/search/anime?keyword=${encodeURIComponent(name)}`;
    console.log(`[danmu] search anime: ${searchUrl}`);
    const body = await httpGet(searchUrl, {}, BUILTIN_SEARCH_TIMEOUT, 1);
    if (!body) return null;
    const animeId = findAnimeId(body);
    if (!animeId) return null;
    return loadBuiltinBangumi(baseUrl, animeId, episode);
}

async function searchBuiltinEpisodes(baseUrl, name, episode, queryMode = 0) {
    const episodeQuery = getEpisodeQuery(episode, queryMode);
    let searchUrl = `${baseUrl}/api/v2/search/episodes?anime=${encodeURIComponent(name)}`;
    if (episodeQuery) searchUrl += `&episode=${encodeURIComponent(episodeQuery)}`;

    let body = await httpGet(searchUrl, {}, BUILTIN_SEARCH_TIMEOUT, 1);
    if (!body) {
        const fallbackUrl = `${baseUrl}/search/episodes?anime=${encodeURIComponent(name)}`;
        console.log(`[danmu] fallback search: ${fallbackUrl}`);
        body = await httpGet(fallbackUrl, {}, BUILTIN_SEARCH_TIMEOUT, 1);
    }
    if (!body) return null;

    const episodeMatch = findEpisodeFromSearchEpisodes(body, episode);
    if (episodeMatch) return episodeMatch;
    if (isSearchEpisodesMovieResult(body)) {
        console.log(`[danmu] movie result not matched, skip anime`);
        return null;
    }
    const nextMode = getNextEpisodeQueryMode(episode, queryMode);
    if (nextMode >= 0) {
        console.log(`[danmu] retry query mode: ${queryMode} -> ${nextMode}`);
        return searchBuiltinEpisodes(baseUrl, name, episode, nextMode);
    }
    console.log(`[danmu] episode not matched: ${safeLog(name)}, ep: ${safeLog(episode)}`);
    return null;
}

async function searchDanmuFromApi(baseUrl, name, episode) {
    const base = normalizeBaseUrl(baseUrl);
    const epNum = episode || 1;
    const cacheKey = getCacheKey(base, name, epNum);
    const cached = getCachedResult(cacheKey);
    if (cached) {
        console.log(`[danmu] cache hit: ${safeLog(name)}, ep: ${epNum}`);
        return { xml: cached, count: countXmlDanmaku(cached) };
    }

    let episodeMatch = await searchBuiltinEpisodes(base, name, String(epNum));
    if (episodeMatch) {
        const result = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
        if (result.xml) { setCachedResult(cacheKey, result.xml); return result; }
    }
    episodeMatch = await searchBuiltinAnime(base, name, String(epNum));
    if (episodeMatch) {
        const result = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
        if (result.xml) { setCachedResult(cacheKey, result.xml); return result; }
    }
    console.log(`[danmu] no result: ${safeLog(name)}, ep: ${epNum}`);
    return { xml: "", count: 0 };
}

// ── 修复后的 buildDanmuXml 函数 ──
function buildDanmuXml(innerXml, count) {
    let content = "";
    if (innerXml) {
        // 提取 <i>...</i> 内部的内容，去除所有 XML 声明和外部标签
        const match = innerXml.match(/<i[^>]*>([\s\S]*?)<\/i>/);
        if (match) {
            content = match[1].trim();
        } else {
            // 如果没有 <i>，直接去除 XML 声明
            content = innerXml.replace(/<\?xml.*?\?>/, "").trim();
        }
    }
    const hint = count > 0 ? `匹配到 ${count} 条弹幕` : "暂无弹幕";
    return `<?xml version="1.0" encoding="UTF-8"?>\n<i>\n  <chatserver></chatserver>\n  <chatid>${count}</chatid>\n  <source>${hint}</source>\n${content ? content + "\n" : ""}</i>`;
}

// ── 路由注册 ──
export default async function(fastify, opts) {
    // 测试路由
    fastify.get('/danmu/ping', async (req, reply) => {
        reply.send({ status: 'ok', module: 'drplayer/danmu' });
    });

    // 主弹幕接口
    fastify.get('/danmu', async (req, reply) => {
        try {
            const name = req.query.name || req.query.vodName || '';
            const episode = (req.query.episode || req.query.vodIndex || '1').trim();

            console.log(`[danmu] 请求: name=${name}, episode=${episode}`);

            if (!name) {
                reply.header('Content-Type', 'application/xml; charset=utf-8');
                reply.header('Access-Control-Allow-Origin', '*');
                return reply.send('<?xml version="1.0" encoding="UTF-8"?>\n<i></i>');
            }

            const realName = getRealName(name);
            console.log(`[danmu] realName=${realName}`);

            let danmakuResult = { xml: '', count: 0 };

            // 主接口
            try {
                console.log(`[danmu] 尝试主接口...`);
                danmakuResult = await searchDanmuFromApi(BUILTIN_API, realName, episode);
            } catch (e) {
                console.warn(`[danmu] 主接口异常: ${e.message}`);
            }

            // 备用
            if (!danmakuResult.xml) {
                try {
                    console.log(`[danmu] 尝试备用接口...`);
                    danmakuResult = await searchDanmuFromApi(BACKUP_API, realName, episode);
                } catch (e) {
                    console.warn(`[danmu] 备用接口异常: ${e.message}`);
                }
            }

            const danmakuXml = danmakuResult.xml ? buildDanmuXml(danmakuResult.xml, danmakuResult.count) : buildDanmuXml('', 0);
            if (danmakuResult.xml) {
                console.log(`[danmu] 成功返回弹幕, 条数: ${danmakuResult.count}`);
            } else {
                console.log(`[danmu] 未获取到弹幕，返回空`);
            }

            reply.header('Content-Type', 'application/xml; charset=utf-8');
            reply.header('Access-Control-Allow-Origin', '*');
            return reply.send(danmakuXml);
        } catch (error) {
            console.error(`[danmu] 路由处理异常:`, error.stack || error.message);
            reply.header('Content-Type', 'application/xml; charset=utf-8');
            reply.header('Access-Control-Allow-Origin', '*');
            return reply.send(`<?xml version="1.0" encoding="UTF-8"?>
<i>
  <chatserver></chatserver>
  <chatid>0</chatid>
  <source>服务内部错误</source>
</i>`);
        }
    });

    // 管理接口：清除缓存（支持 path 参数）
    fastify.get('/action', async (req, reply) => {
        const { do: action, type, path, name, episode } = req.query;
        if (action === 'refresh' && type === 'danmaku') {
            let targetName = name;
            let targetEpisode = episode;
            if (!targetName && path) {
                try {
                    const urlObj = new URL(path, 'http://dummy');
                    targetName = urlObj.searchParams.get('name') || '';
                    targetEpisode = urlObj.searchParams.get('episode') || '1';
                } catch {}
            }
            if (!targetName) {
                reply.send({ code: 400, msg: '缺少 name 参数' });
                return;
            }
            const base = normalizeBaseUrl(BUILTIN_API);
            const cacheKey = getCacheKey(base, targetName, targetEpisode || '1');
            const cached = danmuResultCache.get(cacheKey);
            if (cached) {
                danmuResultCache.delete(cacheKey);
                console.log(`[action] 已清除缓存: ${cacheKey}`);
                reply.send({ code: 200, msg: '缓存已清除', key: cacheKey });
            } else {
                reply.send({ code: 404, msg: '未找到对应缓存', key: cacheKey });
            }
            return;
        }
        reply.send({ code: 400, msg: '不支持的 action 或 type' });
    });
}
