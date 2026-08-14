/**
 * 弹幕控制器 - 进程内整合版
 * 
 * 整合 danmu-api 到 drpy 内部，本地请求通过进程内直调（无需 9321 外部进程），
 * 仅远程备用接口走 HTTP。
 */

import axios from 'axios';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { LRUCache } from 'lru-cache';
import { danmuHttpGet, danmuProxy, readDanmuConfig, writeDanmuConfig, DANMU_EDITABLE_CONFIG } from '../libs_drpy/danmu-bridge.js';

console.log('[drplayer] 模块加载，弹幕功能已启用（进程内 danmu-api）');

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
const BACKUP_API_1314 = "https://pizazz.us.ci/1314/";
const BACKUP_API_LOGVAR = "https://danmu.iyo.us.ci/theft-dastardly-prognosis-hula-agenda2-dropkick/";
const BUILTIN_TIMEOUT = 15000;
const BACKUP_TIMEOUT = 10000;
const BUILTIN_SEARCH_TIMEOUT = 11000;
const BUILTIN_MAX_RETRY = 0;
const FONGMI_SEARCH_TIMEOUT = 15000;
const FONGMI_COMMENT_TIMEOUT = 10000;
const TOTAL_SEARCH_BUDGET = 15000;
const BACKUP_SEARCH_BUDGET = 10000;
const PIZAZZ_SEARCH_BUDGET = 6000;
const SIMILARITY_THRESHOLD = 0.75;
const DANMU_CACHE_TTL = 10 * 60 * 1000;
const danmuResultCache = new LRUCache({ max: 1000, ttl: DANMU_CACHE_TTL });

// ── 内存日志缓冲（面板日志查看用，最多 500 条） ──
const MAX_DANMU_LOGS = 500;
const danmuLogs = [];

function appendDanmuLog(entry) {
    danmuLogs.push({
        time: new Date().toISOString(),
        ...entry,
    });
    if (danmuLogs.length > MAX_DANMU_LOGS) {
        danmuLogs.splice(0, danmuLogs.length - MAX_DANMU_LOGS);
    }
}

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
            if (url.startsWith(BUILTIN_API)) {
                const body = await danmuHttpGet(url, timeout);
                if (body) return body;
                lastError = "进程内调用返回空";
                if (attempt === retries) break;
                continue;
            }
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
    return danmuResultCache.get(key) || null;
}

function setCachedResult(key, result) {
    if (!result || !result.xml) return;
    danmuResultCache.set(key, result);
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

function artplayerItem(text, time, mode, colorNum) {
    let color = "#ffffff";
    if (!Number.isNaN(colorNum) && colorNum >= 0) {
        color = "#" + colorNum.toString(16).padStart(6, "0");
    }
    const type = mode === 4 ? "top" : mode === 5 ? "bottom" : "right";
    return { text, time, color, type };
}

function xmlToArtplayerJson(xml) {
    if (!xml || typeof xml !== "string") return [];
    const result = [];
    const regex = /<d p="([^"]*)">([\s\S]*?)<\/d>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        const values = (match[1] || "").split(",");
        const time = parseFloat(values[0]);
        if (Number.isNaN(time)) continue;
        const text = match[2] || "";
        if (!text.trim()) continue;
        const mode = parseInt(values[1]);
        const colorText = isColorValue(values[3]) ? values[3] : (isColorValue(values[2]) ? values[2] : "");
        result.push(artplayerItem(text, time, mode, parseInt(colorText)));
    }
    return result;
}

function commentJsonToArtplayer(body) {
    try {
        const obj = JSON.parse(body);
        let comments = obj.comments || obj.data;
        if (!comments || !Array.isArray(comments)) return [];
        const result = [];
        for (const item of comments) {
            if (!item) continue;
            const param = item.p || "";
            const text = item.m || item.text || "";
            if (!param || !text) continue;
            const values = param.split(",");
            const time = parseFloat(values[0]);
            if (Number.isNaN(time)) continue;
            const mode = parseInt(values[1]);
            result.push(artplayerItem(text, time, mode, parseInt(values[2])));
        }
        return result;
    } catch { return []; }
}

async function loadBuiltinComment(baseUrl, title, episode, episodeMatch) {
    const commentUrl = `${baseUrl}/api/v2/comment/${episodeMatch.id}?format=xml`;
    console.log(`[danmu] builtin load title: ${safeLog(title)}, episode: ${safeLog(episode)}, matched: ${safeLog(episodeMatch.title)}, id: ${episodeMatch.id}`);
    const body = await httpGet(commentUrl, {}, BUILTIN_TIMEOUT, BUILTIN_MAX_RETRY);
    if (body && body.trim().startsWith("<")) {
        const count = countXmlDanmaku(body);
        console.log(`[danmu] builtin xml direct count: ${count}`);
        return { xml: body, json: xmlToArtplayerJson(body), count };
    }
    const jsonUrl = `${baseUrl}/api/v2/comment/${episodeMatch.id}?format=json`;
    console.log(`[danmu] fallback json: ${jsonUrl}`);
    const jsonBody = await httpGet(jsonUrl, {}, BUILTIN_TIMEOUT, BUILTIN_MAX_RETRY);
    if (!jsonBody) return { xml: "", json: [], count: 0 };
    const result = commentJsonToXml(jsonBody);
    return { xml: result.xml, json: commentJsonToArtplayer(jsonBody), count: result.count };
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
    // 不带 episode 参数请求，避免服务端按 episodeNumber 过滤导致失配返回空，改由本地 findEpisode 匹配
    const searchUrl = `${baseUrl}/api/v2/search/episodes?anime=${encodeURIComponent(name)}`;

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

function matchFongmiItem(items, episode) {
    if (!items || !items.length) return null;
    const num = extractNumber(String(episode));
    const candidates = num > 0 ? generateEpisodeCandidates(num) : [];
    const epText = String(episode || "").trim();
    if (epText && epText !== "1") {
        const exact = items.find(it => it && it.name && it.name.includes(epText));
        if (exact) return exact;
    }
    if (candidates.length) {
        for (const it of items) {
            if (!it || !it.name) continue;
            const lower = it.name.toLowerCase();
            if (candidates.some(c => lower.includes(c.toLowerCase()))) return it;
        }
    }
    return items[0] || null;
}

function normalizeCommentUrl(url, base) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) {
        try {
            const u = new URL(url);
            const b = new URL(base);
            u.protocol = b.protocol;
            u.host = b.host;
            return u.toString();
        } catch (e) { return url; }
    }
    if (url.startsWith("/")) return base + url;
    return base + "/" + url;
}

async function searchDanmuFromFongmi(baseUrl, name, episode) {
    const base = normalizeBaseUrl(baseUrl);
    const epNum = (() => {
        const n = extractNumber(String(episode));
        return n > 0 ? String(n) : String(episode || 1);
    })();
    const cacheKey = getCacheKey(base + "#fongmi", name, epNum);
    const cached = getCachedResult(cacheKey);
    if (cached) {
        console.log(`[danmu] fongmi cache hit: ${safeLog(name)}, ep: ${epNum}`);
        return cached;
    }
    const searchUrl = `${base}/api/v2/fongmi/danmaku?name=${encodeURIComponent(name)}&episode=${encodeURIComponent(epNum)}`;
    const body = await httpGet(searchUrl, {}, FONGMI_SEARCH_TIMEOUT, 0);
    if (!body) return { xml: "", json: [], count: 0 };
    let items;
    try { items = JSON.parse(body); } catch (e) { return { xml: "", json: [], count: 0 }; }
    if (!Array.isArray(items) || items.length === 0) return { xml: "", json: [], count: 0 };

    const target = matchFongmiItem(items, epNum);
    const commentUrl = normalizeCommentUrl(target && target.url, base);
    console.log(`[danmu] fongmi matched: ${safeLog(target && target.name)}, commentUrl: ${safeLog(commentUrl)}`);
    if (!commentUrl) return { xml: "", json: [], count: 0 };

    const xml = await httpGet(commentUrl, {}, FONGMI_COMMENT_TIMEOUT, 0);
    if (!xml || !xml.trim().startsWith("<")) return { xml: "", json: [], count: 0 };
    const count = countXmlDanmaku(xml);
    const result = { xml, json: xmlToArtplayerJson(xml), count };
    if (count > 0) setCachedResult(cacheKey, result);
    console.log(`[danmu] fongmi result: 条数 ${count}`);
    return result;
}

async function searchDanmuFromApi(baseUrl, name, episode, budgetMs = TOTAL_SEARCH_BUDGET) {
    const base = normalizeBaseUrl(baseUrl);
    const epNum = episode || 1;
    const cacheKey = getCacheKey(base, name, epNum);
    const cached = getCachedResult(cacheKey);
    if (cached) {
        console.log(`[danmu] cache hit: ${safeLog(name)}, ep: ${epNum}`);
        return cached;
    }

    const empty = { xml: "", json: [], count: 0 };
    try {
        return await Promise.race([
            (async () => {
                const fongmiResult = await searchDanmuFromFongmi(base, name, String(epNum));
                if (fongmiResult.xml) { setCachedResult(cacheKey, fongmiResult); return fongmiResult; }

                let episodeMatch = await searchBuiltinEpisodes(base, name, String(epNum));
                if (episodeMatch) {
                    const result = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
                    if (result.xml) { setCachedResult(cacheKey, result); return result; }
                }
                episodeMatch = await searchBuiltinAnime(base, name, String(epNum));
                if (episodeMatch) {
                    const result = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
                    if (result.xml) { setCachedResult(cacheKey, result); return result; }
                }
                console.log(`[danmu] no result: ${safeLog(name)}, ep: ${epNum}`);
                return empty;
            })(),
            delay(budgetMs).then(() => {
                console.log(`[danmu] 搜索超时(${budgetMs}ms), 返回空: ${safeLog(name)}, ep: ${epNum}`);
                return empty;
            })
        ]);
    } catch (e) {
        console.warn(`[danmu] 搜索异常: ${e.message}`);
        return empty;
    }
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

    // 日志查看接口（面板用）
    fastify.get('/danmu/logs', async (req, reply) => {
        const limit = parseInt(req.query.limit || '100', 10);
        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), MAX_DANMU_LOGS) : 100;
        reply.header('Access-Control-Allow-Origin', '*');
        reply.send({
            total: danmuLogs.length,
            logs: danmuLogs.slice(-safeLimit).reverse(),
        });
    });

    // 清空日志接口（面板用）
    fastify.get('/danmu/logs/clear', async (req, reply) => {
        danmuLogs.length = 0;
        reply.header('Access-Control-Allow-Origin', '*');
        reply.send({ code: 200, msg: '日志已清空' });
    });

    // 配置读取接口（面板用）
    fastify.get('/danmu/config', async (req, reply) => {
        const result = readDanmuConfig();
        reply.header('Access-Control-Allow-Origin', '*');
        reply.send({ ...result, meta: DANMU_EDITABLE_CONFIG });
    });

    // 配置写入接口（面板用）
    fastify.post('/danmu/config', async (req, reply) => {
        reply.header('Access-Control-Allow-Origin', '*');
        const body = req.body || {};
        if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
            reply.send({ ok: false, error: '没有要更新的配置项' });
            return;
        }
        const result = writeDanmuConfig(body);
        appendDanmuLog({ name: '[配置更新]', episode: JSON.stringify(body), status: result.ok ? 'success' : 'error', source: 'config', count: 0, duration: 0, error: result.error });
        reply.send(result);
    });

    // 弹幕源连通性检测（面板用）
    fastify.get('/danmu/sources/check', async (req, reply) => {
        reply.header('Access-Control-Allow-Origin', '*');
        const cfg = readDanmuConfig();
        const otherServer = cfg.ok ? (cfg.config.OTHER_SERVER || '') : '';
        const vodServers = cfg.ok ? (cfg.config.VOD_SERVERS || '') : '';
        const targets = [];
        if (otherServer) targets.push({ name: '弹幕主源', url: otherServer });
        if (vodServers) {
            for (const entry of vodServers.split(',')) {
                const idx = entry.lastIndexOf('@');
                const name = idx > 0 ? entry.substring(0, idx) : entry;
                const url = idx > 0 ? entry.substring(idx + 1) : entry;
                targets.push({ name: `VOD:${name}`, url });
            }
        }
        const results = await Promise.all(targets.map(async t => {
            const start = Date.now();
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 8000);
                const resp = await fetch(t.url, { method: 'GET', signal: controller.signal, redirect: 'follow' });
                clearTimeout(timer);
                return { name: t.name, url: t.url, ok: resp.ok, status: resp.status, duration: Date.now() - start };
            } catch (e) {
                return { name: t.name, url: t.url, ok: false, status: 0, duration: Date.now() - start, error: e.cause?.code || e.message };
            }
        }));
        reply.send({ total: results.length, results });
    });

    // 主弹幕接口
    fastify.get('/danmu', async (req, reply) => {
        const format = (req.query.format || 'xml').toLowerCase();
        const sendEmpty = (msg = '') => {
            reply.header('Access-Control-Allow-Origin', '*');
            if (format === 'json') {
                reply.header('Content-Type', 'application/json; charset=utf-8');
                return reply.send([]);
            }
            reply.header('Content-Type', 'application/xml; charset=utf-8');
            if (!msg) return reply.send('<?xml version="1.0" encoding="UTF-8"?>\n<i></i>');
            return reply.send(`<?xml version="1.0" encoding="UTF-8"?>
<i>
  <chatserver></chatserver>
  <chatid>0</chatid>
  <source>${msg}</source>
</i>`);
        };
        try {
            const name = req.query.name || req.query.vodName || '';
            const episode = (req.query.episode || req.query.vodIndex || '1').trim();
            const startTime = Date.now();

            console.log(`[danmu] 请求: name=${name}, episode=${episode}`);

            if (!name) {
                appendDanmuLog({ name, episode, status: 'error', source: 'N/A', count: 0, duration: Date.now() - startTime, error: '缺少 name 参数' });
                return sendEmpty();
            }

            const realName = getRealName(name);
            console.log(`[danmu] realName=${realName}`);

            let danmakuResult = { xml: '', json: [], count: 0 };
            let usedSource = '';

            // 主接口
            try {
                console.log(`[danmu] 尝试主接口...`);
                danmakuResult = await searchDanmuFromApi(BUILTIN_API, realName, episode);
                if (danmakuResult.xml) usedSource = '内置 danmu-api';
            } catch (e) {
                console.warn(`[danmu] 主接口异常: ${e.message}`);
            }

            // 备用
            if (!danmakuResult.xml) {
                try {
                    console.log(`[danmu] 尝试备用接口...`);
                    danmakuResult = await searchDanmuFromApi(BACKUP_API, realName, episode, BACKUP_SEARCH_BUDGET);
                    if (danmakuResult.xml) usedSource = '备用 danmuapi';
                } catch (e) {
                    console.warn(`[danmu] 备用接口异常: ${e.message}`);
                }
            }

            // 副接口1: danmu.iyo LogVar 弹幕源（实测 ~9.5s 能返回结果，优先）
            if (!danmakuResult.xml) {
                try {
                    console.log(`[danmu] 尝试副接口1 (danmu.iyo LogVar)...`);
                    danmakuResult = await searchDanmuFromApi(BACKUP_API_LOGVAR, realName, episode, BACKUP_SEARCH_BUDGET);
                    if (danmakuResult.xml) usedSource = 'LogVar';
                } catch (e) {
                    console.warn(`[danmu] 副接口1异常: ${e.message}`);
                }
            }

            // 副接口2: pizazz 1314 弹幕源（实测首次 20s+ 且二次请求易挂起，短预算仅作最后兜底）
            if (!danmakuResult.xml) {
                try {
                    console.log(`[danmu] 尝试副接口2 (pizazz/1314)...`);
                    danmakuResult = await searchDanmuFromApi(BACKUP_API_1314, realName, episode, PIZAZZ_SEARCH_BUDGET);
                    if (danmakuResult.xml) usedSource = 'pizazz/1314';
                } catch (e) {
                    console.warn(`[danmu] 副接口2异常: ${e.message}`);
                }
            }

            if (danmakuResult.xml) {
                console.log(`[danmu] 成功返回弹幕, 条数: ${danmakuResult.count}`);
            } else {
                console.log(`[danmu] 未获取到弹幕，返回空`);
            }

            appendDanmuLog({
                name: realName,
                episode,
                status: danmakuResult.xml ? 'success' : 'empty',
                source: usedSource || 'N/A',
                count: danmakuResult.count || 0,
                duration: Date.now() - startTime,
            });

            if (format === 'json') {
                reply.header('Content-Type', 'application/json; charset=utf-8');
                reply.header('Access-Control-Allow-Origin', '*');
                return reply.send(danmakuResult.json || []);
            }

            const danmakuXml = danmakuResult.xml ? buildDanmuXml(danmakuResult.xml, danmakuResult.count) : buildDanmuXml('', 0);
            reply.header('Content-Type', 'application/xml; charset=utf-8');
            reply.header('Access-Control-Allow-Origin', '*');
            return reply.send(danmakuXml);
        } catch (error) {
            console.error(`[danmu] 路由处理异常:`, error.stack || error.message);
            appendDanmuLog({ name: req.query.name || '', episode: req.query.episode || '1', status: 'error', source: 'N/A', count: 0, duration: 0, error: error.message });
            return sendEmpty('服务内部错误');
        }
    });

    // ── 原版完整弹幕面板（配置预览/日志/接口调试/推送弹幕/请求记录/系统配置） ──
    // 面板 HTML 挂在 /danmu/panel，其内部 API 请求经 customBaseUrl 前缀统一走 /danmu/panel/*，
    // 这里剥掉前缀后转发给进程内 danmu-api 的 handleRequest。
    const PANEL_BASE = '/danmu/panel';

    async function renderPanel() {
        const result = await danmuProxy('GET', '/', {});
        if (result.status !== 200) return { status: result.status, body: result.body };
        let html = result.body;
        // 注入默认 customBaseUrl，让面板所有 fetch 请求带上 /danmu/panel 前缀。
        // 强制覆盖 localStorage 旧值：面板固定挂在 /danmu/panel，旧的反代地址（如 9321）
        // 会污染 customBaseUrl 导致「获取配置失败」，这里直接固化默认值。
        html = html.replace(
            "let customBaseUrl = localStorage.getItem('logvar_api_base_url') || ''",
            "let customBaseUrl = '/danmu/panel'"
        );
        return { status: 200, body: html };
    }

    fastify.get(PANEL_BASE, async (req, reply) => {
        const { status, body } = await renderPanel();
        reply.header('Content-Type', 'text/html; charset=utf-8');
        reply.status(status).send(body);
    });

    fastify.get(`${PANEL_BASE}/`, async (req, reply) => {
        const { status, body } = await renderPanel();
        reply.header('Content-Type', 'text/html; charset=utf-8');
        reply.status(status).send(body);
    });

    // 面板 API 通配转发（剥 /danmu/panel 前缀）
    fastify.route({
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        url: `${PANEL_BASE}/*`,
        handler: async (req, reply) => {
            const subPath = '/' + (req.params['*'] || '');
            const result = await danmuProxy(req.method, subPath, req.query || {}, req.body || null);
            reply.header('Access-Control-Allow-Origin', '*');
            for (const [key, value] of Object.entries(result.headers || {})) {
                if (['content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) continue;
                try { reply.header(key, value); } catch (e) {}
            }
            reply.status(result.status).send(result.body);
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
