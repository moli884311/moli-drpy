/**
 * 弹幕控制器
 *
 * 从 TVBox JAR (Danmu.java) 反编译迁移
 * 支持通过 360kan + 公共弹幕 API 获取弹幕 XML
 */

import createAxiosInstance from "../utils/createAxiosAgent.js";

const _axios = createAxiosInstance({maxSockets: 64});

const COLORS = ["16711680", "16776960", "65280", "255", "16711935", "8388736", "16753920", "65535", "16777215", "16761087", "16777087", "8978431", "6527999", "16744447", "16756735", "8454143", "16724787", "16777215", "16752723", "16776951", "10000639", "5729279", "16645625", "16185078", "12334518", "13882321", "16777215", "16209488", "16772810", "16766758", "16777014", "16772362", "16773119", "14410239", "11835903", "16777215"];
const WHITE_COLORS = ["16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16777215", "16711680", "16776960", "255", "65280", "8388736"];

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRealName(str) {
    if (!str) return '';
    return str.replace(/[（(【<][臻真]彩[）)】>]/g, '').trim();
}

function parseEpisode(str) {
    if (!str) return null;
    let clean = str.replace(/\[.*?\]/g, '');
    let m = clean.match(/第(\d+)[集话]/);
    if (m) return parseInt(m[1]);
    m = clean.match(/S\d+E(\d{2,3})/i);
    if (m) return parseInt(m[1]);
    m = clean.match(/·E(\d+)·/i);
    if (m) return parseInt(m[1]);
    m = clean.match(/(\d{4})[-._]?(\d{2})[-._]?(\d{2})/);
    if (m) return parseInt(m[1] + m[2] + m[3]);
    m = clean.split('.')[0].match(/(\d+)/);
    if (m) return parseInt(m[1]);
    return 1;
}

async function httpGet(url, headers = {}) {
    try {
        const resp = await _axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                ...headers,
            },
            timeout: 10000,
            responseType: 'text',
        });
        return resp.data;
    } catch (e) {
        return '';
    }
}

async function getDanmuFromOK360(name, episode) {
    try {
        const kw = encodeURIComponent(name);
        const html = await httpGet(`https://api.so.360kan.com/index?force_v=1&kw=${kw}&from=&pageno=1&v_ap=1&tab=all`);
        if (!html || !html.startsWith('{')) {
            console.log(`[danmu] 360kan 请求失败或非JSON: name=${name}`);
            return '';
        }

        const data = JSON.parse(html).data;
        if (!data || !data.longData) {
            console.log(`[danmu] 360kan 无 longData: name=${name}`);
            return '';
        }

        const rows = data.longData.rows;
        if (!rows || rows.length === 0) {
            console.log(`[danmu] 360kan 无 rows: name=${name}`);
            return '';
        }

        for (const row of rows) {
            const catName = row.cat_name;
            let playUrl = '';
            const hasPlaylinks = !!row.playlinks;
            const hasSeriesPlaylinks = !!(row.seriesPlaylinks && row.seriesPlaylinks.length > 0);
            console.log(`[danmu] 360kan row: cat=${catName}, hasPlaylinks=${hasPlaylinks}, hasSeriesPlaylinks=${hasSeriesPlaylinks}`);

            if (catName === '电影') {
                const links = row.playlinks;
                if (!links) continue;
                playUrl = links.qq || links.qiyi || links.youku || links.imgo || '';
            } else {
                const seriesLinks = row.seriesPlaylinks;
                if (!seriesLinks || seriesLinks.length === 0) continue;
                const idx = Math.max(0, (episode || 1) - 1);
                if (idx >= seriesLinks.length) continue;
                const ep = seriesLinks[idx];
                if (!ep) continue;
                playUrl = ep.url || '';
            }

            if (!playUrl) continue;

            if (playUrl.includes('v.qq.com') && playUrl.includes('.html')) {
                const idx = playUrl.indexOf('.html');
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes('www.iqiyi.com') && playUrl.includes('.html')) {
                const idx = playUrl.indexOf('.html');
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes('www.mgtv.com') && playUrl.includes('.html')) {
                const idx = playUrl.indexOf('.html');
                playUrl = playUrl.substring(0, idx + 5);
            } else if (playUrl.includes('v.youku.com')) {
                const vidIdx = playUrl.indexOf('vid=');
                if (vidIdx !== -1) {
                    const start = vidIdx + 4;
                    const endIdx = playUrl.indexOf('&', start);
                    const vid = playUrl.substring(start, endIdx === -1 ? playUrl.length : endIdx);
                    if (vid) playUrl = `https://v.youku.com/v_show/id_${vid}.html`;
                }
            }

            console.log(`[danmu] 360kan 获取到播放链接: ${playUrl}`);
            return playUrl;
        }
        console.log(`[danmu] 360kan 未找到有效播放链接: name=${name}`);
        return '';
    } catch (e) {
        console.log(`[danmu] 360kan 异常: ${e.message}`);
        return '';
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
    return '';
}

function parseDanmakuJson(jsonStr) {
    try {
        const obj = JSON.parse(jsonStr);
        const danmuku = obj.danmuku;
        if (!danmuku || !Array.isArray(danmuku)) return [];
        return danmuku.filter(item => {
            if (!Array.isArray(item) || item.length < 5) return false;
            const text = item[4] || '';
            if (text.includes('请遵守弹幕礼仪') || text.includes('官方弹幕库') ||
                text.includes('未传入链接调用') || text.includes('弹幕列队') ||
                text.includes('火花剧场') || text.includes('云烟小助手') ||
                text.includes('微信公众号')) {
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
    xml += '  <chatserver></chatserver>\n';
    xml += '  <chatid>0</chatid>\n';
    xml += '  <mission>0</mission>\n';
    xml += '  <maxlimit>1500</maxlimit>\n';
    xml += '  <state>0</state>\n';
    xml += '  <real_name>0</real_name>\n';
    xml += '  <source>k-v</source>\n';

    const colors = useColor ? COLORS : WHITE_COLORS;
    const colorsCount = colors.length;

    for (let i = 0; i < danmuku.length; i++) {
        const entry = danmuku[i];
        const time = entry[0] || '0';
        const text = String(entry[4] || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const color = randomColor(colors);
        xml += `  <d p="${time},1,25,${color}">${text}</d>\n`;
    }

    xml += '</i>';
    return xml;
}

export default (fastify, options, done) => {
    fastify.get('/danmu', async (req, reply) => {
        const name = req.query.name || req.query.vodName || '';
        const episode = parseInt(req.query.episode || req.query.vodIndex || '1', 10);
        const useColor = req.query.color !== '0';

        console.log(`[danmu] 请求: name=${name}, episode=${episode}`);

        if (!name) {
            reply.header('Content-Type', 'application/xml; charset=utf-8');
            return reply.send('<?xml version="1.0" encoding="UTF-8"?>\n<i></i>');
        }

        const realName = getRealName(name);
        console.log(`[danmu] realName=${realName}`);
        let danmakuData = '';

        const playUrl = await getDanmuFromOK360(realName, episode);
        console.log(`[danmu] playUrl=${playUrl || '(空)'}`);

        if (playUrl) {
            const jsonResp = await fetchDanmakuJsonFromApi(playUrl);
            console.log(`[danmu] jsonResp length=${jsonResp ? jsonResp.length : 0}`);
            if (jsonResp) {
                const entries = parseDanmakuJson(jsonResp);
                console.log(`[danmu] entries count=${entries.length}`);
                if (entries.length > 0) {
                    danmakuData = generateXml(entries, useColor);
                }
            }
        }

        if (!danmakuData) {
            danmakuData = '<?xml version="1.0" encoding="UTF-8"?>\n<i>\n  <chatserver></chatserver>\n  <chatid>0</chatid>\n  <source>k-v</source>\n</i>';
        }

        reply.header('Content-Type', 'application/xml; charset=utf-8');
        return reply.send(danmakuData);
    });

    done();
};
