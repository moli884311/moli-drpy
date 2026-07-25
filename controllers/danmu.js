/**
 * 弹幕控制器
 *
 * 从 TVBox JAR (DanmakuApi.java) 反编译迁移并优化
 * 优先使用 konfan.cn 内置弹幕 API（多级搜索+回退），
 * 保留 360kan + 公共弹幕 API 作为 fallback
 */

import createAxiosInstance from "../utils/createAxiosAgent.js";

const _axios = createAxiosInstance({ maxSockets: 64 });

// ── 内置弹幕 API 配置 ──
const BUILTIN_API = "https://logvardanmu.konfan.cn/87654321";
const BUILTIN_TIMEOUT = 20000;
const BUILTIN_MAX_RETRY = 2;

// ── 公共弹幕 API 配置 ──
const COLORS = ["16711680", "16776960", "65280", "255", "16711935", "8388736", "16753920", "65535", "16777215", "16761087", "16777087", "8978431", "6527999", "16744447", "16756735", "8454143", "16724787", "16777215", "16752723", "16776951", "10000639", "5729279", "16645625", "16185078", "12334518", "13882321", "16777215", "16209488", "16772810", "16766758", "16777014", "16772362", "16773119", "14410239", "11835903", "16777215"];
const WHITE_COLORS = ["16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16711680", "16776960", "255", "65280", "8388736"];

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

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

// ── konfan.cn 内置弹幕 API 搜索 ──

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

// ── konfan.cn 内置 API 完整搜索流程 ──

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

async function searchKonfanDanmaku(name, episode) {
    const baseUrl = normalizeBaseUrl(BUILTIN_API);
    const epNum = episode || 1;

    for (let retry = 0; retry <= BUILTIN_MAX_RETRY; retry++) {
        if (retry > 0) {
            console.log(`[danmu] builtin retry ${retry} for: ${name}`);
            await delay(1500 * retry);
        }

        try {
            // 步骤1: 搜索 episodes
            let episodeMatch = await searchBuiltinEpisodes(baseUrl, name, String(epNum));
            if (episodeMatch) {
                const xml = await loadBuiltinComment(baseUrl, name, String(epNum), episodeMatch);
                if (xml) return xml;
            }

            // 步骤2: 搜索 anime
            episodeMatch = await searchBuiltinAnime(baseUrl, name, String(epNum));
            if (episodeMatch) {
                const xml = await loadBuiltinComment(baseUrl, name, String(epNum), episodeMatch);
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

// ── 360kan + 公共 API 弹幕搜索（原有逻辑，作为 fallback）──

async function getDanmuFromOK360(name, episode) {
    try {
        const kw = encodeURIComponent(name);
        const html = await httpGet(`https://api.so.360kan.com/index?force_v=1&kw=${kw}&from=&pageno=1&v_ap=1&tab=all`);
        if (!html || !html.startsWith("{")) {
            console.log(`[danmu] 360kan 请求失败或非JSON: name=${name}`);
            return "";
        }

        const data = JSON.parse(html).data;
        if (!data || !data.longData) {
            console.log(`[danmu] 360kan 无 longData: name=${name}`);
            return "";
        }

        const rows = data.longData.rows;
        if (!rows || rows.length === 0) {
            console.log(`[danmu] 360kan 无 rows: name=${name}`);
            return "";
        }

        for (const row of rows) {
            const catName = row.cat_name;
            let playUrl = "";
            const hasPlaylinks = !!row.playlinks;
            const hasSeriesPlaylinks = !!(row.seriesPlaylinks && row.seriesPlaylinks.length > 0);
            console.log(`[danmu] 360kan row: cat=${catName}, hasPlaylinks=${hasPlaylinks}, hasSeriesPlaylinks=${hasSeriesPlaylinks}`);

            if (catName === "\u7535\u5f71") {
                const links = row.playlinks;
                if (!links) continue;
                playUrl = links.qq || links.qiyi || links.youku || links.imgo || "";
            } else {
                const seriesLinks = row.seriesPlaylinks;
                if (!seriesLinks || seriesLinks.length === 0) continue;
                const idx = Math.max(0, (episode || 1) - 1);
                if (idx >= seriesLinks.length) continue;
                const ep = seriesLinks[idx];
                if (!ep) continue;
                playUrl = ep.url || "";
            }

            if (!playUrl) continue;

            if (playUrl.includes("v.qq.com") && playUrl.includes(".html")) {
                const idx = playUrl.indexOf(".html");
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes("www.iqiyi.com") && playUrl.includes(".html")) {
                const idx = playUrl.indexOf(".html");
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes("www.mgtv.com") && playUrl.includes(".html")) {
                const idx = playUrl.indexOf(".html");
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes("v.youku.com")) {
                const vidIdx = playUrl.indexOf("vid=");
                if (vidIdx !== -1) {
                    const start = vidIdx + 4;
                    const endIdx = playUrl.indexOf("&", start);
                    const vid = playUrl.substring(start, endIdx === -1 ? playUrl.length : endIdx);
                    if (vid) playUrl = `https://v.youku.com/v_show/id_${vid}.html`;
                }
            }

            console.log(`[danmu] 360kan 获取到播放链接: ${playUrl}`);
            return playUrl;
        }
        console.log(`[danmu] 360kan 未找到有效播放链接: name=${name}`);
        return "";
    } catch (e) {
        console.log(`[danmu] 360kan 异常: ${e.message}`);
        return "";
    }
}

async function fetchDanmakuJsonFromApi(playUrl) {
    const apis = [
        (url) => `https://danmu.huaqi.pro/?url=${encodeURIComponent(url)}`,
        (url) => `https://dmku.hls.one/?ac=dm&url=${encodeURIComponent(url)}`,
        (url) => `https://danmu.zxz.ee/?type=json&id=${encodeURIComponent(url)}`,
        (url) => `https://dm.ruyijx.com?ac=dm&url=${encodeURIComponent(url)}`,
    ];

    for (const buildUrl of apis) {
        const apiUrl = buildUrl(playUrl);
        const resp = await httpGet(apiUrl);
        if (resp && resp.includes('"code":23')) {
            return resp;
        }
    }
    return "";
}

function parseDanmakuJson(jsonStr) {
    try {
        const obj = JSON.parse(jsonStr);
        const danmuku = obj.danmuku;
        if (!danmuku || !Array.isArray(danmuku)) return [];
        return danmuku.filter(item => {
            if (!Array.isArray(item) || item.length < 5) return false;
            const text = item[4] || "";
            if (text.includes("\u8bf7\u9075\u5b88\u5f39\u5e55\u793c\u4eea") || text.includes("\u5b98\u65b9\u5f39\u5e55\u5e93") ||
                text.includes("\u672a\u4f20\u5165\u94fe\u63a5\u8c03\u7528") || text.includes("\u5f39\u5e55\u5217\u961f") ||
                text.includes("\u706b\u82b1\u5267\u573a") || text.includes("\u4e91\u70df\u5c0f\u52a9\u624b") ||
                text.includes("\u5fae\u4fe1\u516c\u4f17\u53f7")) {
                return false;
            }
            return true;
        });
    } catch (e) {
        return [];
    }
}

function generateXml(danmuku, useColor = false) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n';
    xml += "  <chatserver></chatserver>\n";
    xml += "  <chatid>0</chatid>\n";
    xml += "  <mission>0</mission>\n";
    xml += "  <maxlimit>1500</maxlimit>\n";
    xml += "  <state>0</state>\n";
    xml += "  <real_name>0</real_name>\n";
    xml += "  <source>k-v</source>\n";

    const colors = useColor ? COLORS : WHITE_COLORS;
    const colorsCount = colors.length;

    for (let i = 0; i < danmuku.length; i++) {
        const entry = danmuku[i];
        const time = entry[0] || "0";
        const text = escapeXml(String(entry[4] || ""));
        const color = randomColor(colors);
        xml += `  <d p="${time},1,25,${color}">${text}</d>\n`;
    }

    xml += "</i>";
    return xml;
}

// ── 路由注册 ──

export default (fastify, options, done) => {
    fastify.get("/danmu", async (req, reply) => {
        const name = req.query.name || req.query.vodName || "";
        const episode = parseInt(req.query.episode || req.query.vodIndex || "1", 10);
        const useColor = req.query.color !== "0";

        console.log(`[danmu] 请求: name=${name}, episode=${episode}`);

        if (!name) {
            reply.header("Content-Type", "application/xml; charset=utf-8");
            return reply.send('<?xml version="1.0" encoding="UTF-8"?>\n<i></i>');
        }

        const realName = getRealName(name);
        console.log(`[danmu] realName=${realName}`);

        let danmakuXml = "";

        // 优先使用 konfan.cn 内置弹幕 API
        console.log(`[danmu] 尝试 konfan.cn 内置 API...`);
        danmakuXml = await searchKonfanDanmaku(realName, episode);

        if (danmakuXml) {
            danmakuXml = `<?xml version="1.0" encoding="UTF-8"?>\n` + danmakuXml;
            console.log(`[danmu] konfan.cn API 成功`);
        } else {
            console.log(`[danmu] konfan.cn API 无结果，回退到 360kan + 公共 API`);
            const playUrl = await getDanmuFromOK360(realName, episode);
            console.log(`[danmu] playUrl=${playUrl || "(空)"}`);

            if (playUrl) {
                const jsonResp = await fetchDanmakuJsonFromApi(playUrl);
                console.log(`[danmu] jsonResp length=${jsonResp ? jsonResp.length : 0}`);
                if (jsonResp) {
                    const entries = parseDanmakuJson(jsonResp);
                    console.log(`[danmu] entries count=${entries.length}`);
                    if (entries.length > 0) {
                        danmakuXml = generateXml(entries, useColor);
                    }
                }
            }
        }

        if (!danmakuXml) {
            danmakuXml = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n  <chatserver></chatserver>\n  <chatid>0</chatid>\n  <source>k-v</source>\n</i>';
        }

        reply.header("Content-Type", "application/xml; charset=utf-8");
        return reply.send(danmakuXml);
    });

    done();
};
