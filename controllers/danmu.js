/**
 * 弹幕控制器
 *
 * 从 TVBox JAR (DanmakuApi.java) 反编译迁移并优化
 * 主源使用 konfan.cn 内置弹幕 API，失败后回退到自建 danmu_api（兼容 konfan.cn 接口格式）
 */

import createAxiosInstance from "../utils/createAxiosAgent.js";

const _axios = createAxiosInstance({ maxSockets: 64 });

// ── 弹幕 API 配置 ──
const BUILTIN_API = "https://logvardanmu.konfan.cn/87654321";
const BACKUP_API = "https://danmuapi-1-nu.vercel.app/";
const BUILTIN_TIMEOUT = 20000;
const BUILTIN_MAX_RETRY = 2;

// ── 通用工具函数 ──

function getRealName(str) {
    if (!str) return "";
    return str.replace(/[（(【<][臻真]彩[）)】>]/g, "").trim();
}

function parseEpisode(str) {
    if (!str) return null;
    let clean = str.replace(/\[.*?\]/g, "");
    let m = clean.match(/第(\d+)[集话]/);
    if (m) return parseInt(m[1]);
    m = clean.match(/S\d+E(\d{2,3})/i);
    if (m) return parseInt(m[1]);
    m = clean.match(/·E(\d+)·/i);
    if (m) return parseInt(m[1]);
    m = clean.match(/(\d{4})[-._]?(\d{2})[-._]?(\d{2})/);
    if (m) return parseInt(m[1] + m[2] + m[3]);
    m = clean.split(".")[0].match(/(\d+)/);
    if (m) return parseInt(m[1]);
    return 1;
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

function safeLog(text) {
    return text || "";
}

async function httpGet(url, headers = {}, timeout = 10000) {
    try {
        const resp = await _axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                ...headers,
            },
            timeout,
            responseType: "text",
        });
        return resp.data;
    } catch (e) {
        return "";
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── 颜色规范化（来自 TVBox normalizeDanmakuParam / normalizeColor）──

function isColorValue(value) {
    try {
        if (!value) return false;
        const text = value.trim();
        if (text.startsWith("#")) return true;
        if (text.startsWith("0x") || text.startsWith("0X")) return true;
        const color = parseInt(text);
        return color >= 0 && color <= 0x00ffffff;
    } catch (e) {
        return false;
    }
}

function normalizeColor(color) {
    if (!color) return "16777215";
    const text = color.trim();
    try {
        if (text.startsWith("#")) return String(parseInt(text.substring(1), 16));
        if (text.startsWith("0x") || text.startsWith("0X")) return String(parseInt(text.substring(2), 16));
    } catch (e) {
        // ignore
    }
    return text;
}

function normalizeDanmakuParam(param) {
    const values = param.split(",");
    if (values.length < 4) return param;
    let time = values[0];
    let type = values[1];
    let size = values[2];
    let color = values[3];

    if (isColorValue(size)) {
        color = size;
        size = "25";
    } else if (!isColorValue(color)) {
        color = "16777215";
    }
    return time + "," + type + "," + size + "," + normalizeColor(color);
}

// ── 自建 danmu_api 弹幕搜索 ──

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

function isMovieTypeText(type) {
    return type === "\u7535\u5f71";
}

function isMandarinTitle(title) {
    return title && (title.includes("\u56fd\u8bed") || title.includes("\u666e\u901a\u8bdd"));
}

function isCantoneseTitle(title) {
    return title && title.includes("\u7ca4\u8bed");
}

function prefersCantonese(episode) {
    return isCantoneseTitle(episode);
}

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
    } catch (e) {
        return "";
    }
}

function findEpisodeList(obj) {
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
        let animes = obj.animes || obj.anime || obj.data;
        if (!animes || !Array.isArray(animes)) return false;
        for (const anime of animes) {
            if (anime && isMovieType(anime) && anime.episodes) return true;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

function findMovieFallback(obj, episode) {
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
        let first = null;
        let firstMandarin = null;

        for (const item of episodes) {
            if (!item) continue;
            const id = firstString(item, "episodeId", "id");
            if (!id) continue;
            const title = firstString(item, "episodeTitle", "title", "name");
            const number = parseEpisodeNumber(firstString(item, "episodeNumber", "number", "sort"));
            const match = { id, title, number };
            if (!first) first = match;
            if (!firstMandarin && isMandarinTitle(title)) firstMandarin = match;
            if (episode && title && title.includes(episode)) return match;
            if (targetNumber > 0 && number === targetNumber) return match;
            if (targetNumber > 0 && extractNumber(title) === targetNumber) return match;
        }
        if (!episode) return first;
        if (allowMovieFallback && episodeList.isMovie) return firstMandarin || first;
        return null;
    } catch (e) {
        return null;
    }
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
    } catch (e) {
        return null;
    }
}

function commentJsonToXml(body) {
    try {
        const obj = JSON.parse(body);
        let comments = obj.comments || obj.data;
        if (!comments || !Array.isArray(comments) || comments.length === 0) return "";

        let xml = "<i>";
        for (const item of comments) {
            if (!item) continue;
            let param = item.p || "";
            let text = item.m || item.text || "";
            if (!param || !text) continue;
            xml += `<d p="${escapeXml(normalizeDanmakuParam(param))}">${escapeXml(text)}</d>`;
        }
        xml += "</i>";
        console.log(`[danmu] builtin xml length: ${xml.length}`);
        return xml;
    } catch (e) {
        return "";
    }
}

// ── 自建 danmu_api 完整搜索流程 ──

async function loadBuiltinComment(baseUrl, title, episode, episodeMatch) {
    const commentUrl = `${baseUrl}/api/v2/comment/${episodeMatch.id}?format=json`;
    console.log(`[danmu] builtin load title: ${safeLog(title)}, request episode: ${safeLog(episode)}, matched episode: ${safeLog(episodeMatch.title)}, matched number: ${episodeMatch.number}, episodeId: ${episodeMatch.id}`);
    console.log(`[danmu] builtin comment: ${commentUrl}`);

    const body = await httpGet(commentUrl, {}, BUILTIN_TIMEOUT);
    if (!body) return "";
    return commentJsonToXml(body);
}

async function loadBuiltinBangumi(baseUrl, animeId, episode) {
    const bangumiUrl = `${baseUrl}/api/v2/bangumi/${animeId}`;
    const body = await httpGet(bangumiUrl, {}, BUILTIN_TIMEOUT);
    if (!body) return null;
    return findEpisode(body, episode);
}

async function searchBuiltinAnime(baseUrl, name, episode) {
    const searchUrl = `${baseUrl}/api/v2/search/anime?keyword=${encodeURIComponent(name)}`;
    console.log(`[danmu] builtin search anime: ${searchUrl}`);

    const body = await httpGet(searchUrl, {}, BUILTIN_TIMEOUT);
    if (!body) return null;
    const animeId = findAnimeId(body);
    if (!animeId) return null;
    return loadBuiltinBangumi(baseUrl, animeId, episode);
}

async function searchBuiltinEpisodes(baseUrl, name, episode, queryMode = 0) {
    const episodeQuery = getEpisodeQuery(episode, queryMode);
    let searchUrl = `${baseUrl}/api/v2/search/episodes?anime=${encodeURIComponent(name)}`;
    if (episodeQuery) searchUrl += `&episode=${encodeURIComponent(episodeQuery)}`;

    const body = await httpGet(searchUrl, {}, BUILTIN_TIMEOUT);
    if (!body) return null;

    const episodeMatch = findEpisodeFromSearchEpisodes(body, episode);
    if (episodeMatch) return episodeMatch;

    if (isSearchEpisodesMovieResult(body)) {
        console.log(`[danmu] builtin movie result not matched, skip anime fallback`);
        return null;
    }

    const nextMode = getNextEpisodeQueryMode(episode, queryMode);
    if (nextMode >= 0) {
        console.log(`[danmu] builtin retry episodes query mode: ${queryMode} -> ${nextMode}`);
        return searchBuiltinEpisodes(baseUrl, name, episode, nextMode);
    }

    console.log(`[danmu] builtin episode not matched, title: ${safeLog(name)}, episode: ${safeLog(episode)}`);
    return null;
}

async function searchDanmuFromApi(baseUrl, name, episode) {
    const base = normalizeBaseUrl(baseUrl);
    const epNum = episode || 1;

    for (let retry = 0; retry <= BUILTIN_MAX_RETRY; retry++) {
        if (retry > 0) {
            console.log(`[danmu] builtin retry ${retry} for: ${name}`);
            await delay(1500 * retry);
        }

        try {
            // 步骤1: 搜索 episodes
            let episodeMatch = await searchBuiltinEpisodes(base, name, String(epNum));
            if (episodeMatch) {
                const xml = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
                if (xml) return xml;
            }

            // 步骤2: 搜索 anime
            episodeMatch = await searchBuiltinAnime(base, name, String(epNum));
            if (episodeMatch) {
                const xml = await loadBuiltinComment(base, name, String(epNum), episodeMatch);
                if (xml) return xml;
            }

            // 本次重试失败，继续下一次
            console.log(`[danmu] builtin search failed (retry ${retry}/${BUILTIN_MAX_RETRY}) for: ${name}`);
        } catch (e) {
            console.log(`[danmu] builtin search error (retry ${retry}): ${e.message}`);
        }
    }

    console.log(`[danmu] builtin all retries exhausted for: ${name}`);
    return "";
}

// ── 路由注册 ──

export default (fastify, options, done) => {
    fastify.get("/danmu", async (req, reply) => {
        const name = req.query.name || req.query.vodName || "";
        const episode = parseInt(req.query.episode || req.query.vodIndex || "1", 10);

        console.log(`[danmu] 请求: name=${name}, episode=${episode}`);

        if (!name) {
            reply.header("Content-Type", "application/xml; charset=utf-8");
            return reply.send('<?xml version="1.0" encoding="UTF-8"?>\n<i></i>');
        }

        const realName = getRealName(name);
        console.log(`[danmu] realName=${realName}`);

        let danmakuXml = "";

        // 主源：konfan.cn 内置 API
        console.log(`[danmu] 尝试 konfan.cn 内置 API...`);
        danmakuXml = await searchDanmuFromApi(BUILTIN_API, realName, episode);

        if (!danmakuXml) {
            // 备用源：自建 danmu_api
            console.log(`[danmu] konfan.cn 无结果，尝试自建 danmu_api...`);
            danmakuXml = await searchDanmuFromApi(BACKUP_API, realName, episode);
        }

        if (danmakuXml) {
            danmakuXml = `<?xml version="1.0" encoding="UTF-8"?>\n` + danmakuXml;
            console.log(`[danmu] danmu_api 成功`);
        }

        if (!danmakuXml) {
            danmakuXml = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n  <chatserver></chatserver>\n  <chatid>0</chatid>\n  <source>k-v</source>\n</i>';
        }

        reply.header("Content-Type", "application/xml; charset=utf-8");
        return reply.send(danmakuXml);
    });

    done();
};
