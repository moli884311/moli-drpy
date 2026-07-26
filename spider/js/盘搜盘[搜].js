/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 1,
  title: '盘搜盘[搜]',
  lang: 'ds'
})
*/

const PAN_TYPES = '百度网盘,夸克网盘,UC网盘,阿里云盘,天翼云盘,移动云盘,115网盘,迅雷云盘,123云盘,磁力链接';

const diskMapping = [
    { name: '百度网盘', apiType: 'baidu', regex: /pan\.baidu\.com/ },
    { name: '夸克网盘', apiType: 'quark', regex: /pan\.quark\.cn/ },
    { name: 'UC网盘', apiType: 'uc', regex: /drive\.uc\.cn/ },
    { name: '阿里云盘', apiType: 'aliyun', regex: /ali(?:yundrive|pan)\.com/ },
    { name: '天翼云盘', apiType: 'tianyi', regex: /cloud\.189\.cn/ },
    { name: '移动云盘', apiType: 'mobile', regex: /(?:yun\.|caiyun\.)?139\.com/ },
    { name: '115网盘', apiType: '115', regex: /115\.com/ },
    { name: '迅雷云盘', apiType: 'xunlei', regex: /pan\.xunlei\.com/ },
    { name: '123云盘', apiType: '123', regex: /(?:123pan|123684|123865|123912|123592)\.(?:com|cn)/ },
    { name: '磁力链接', apiType: 'magnet', regex: /^magnet:\?/ },
];

const nameToApiType = {};
const apiTypeToName = {};
diskMapping.forEach(m => {
    nameToApiType[m.name] = m.apiType;
    apiTypeToName[m.apiType] = m.name;
});

const getDiskName = (url) => {
    for (const m of diskMapping) if (m.regex.test(url)) return m.name;
    return '其他网盘';
};

var rule = {
    title: '盘搜盘[搜]',
    host: 'https://pansou.app',
    url: '/api/search',
    searchUrl: '/api/search?kw=**',
    headers: { 'User-Agent': 'MOBILE_UA', 'Referer': 'https://pansou.app/' },
    searchable: 1, quickSearch: 1, filterable: 0,
    play_parse: true, search_match: true, limit: 20,
    pan_types: PAN_TYPES,
    max_results: 20,

    预加载: function (extend) {
        const cfg = extend ? (typeof extend === 'string' ? JSON.parse(extend) : extend) : {};
        this.pan_types = cfg.pan_types || PAN_TYPES;
        this.max_results = cfg.max_results ? Number(cfg.max_results) : 20;
    },

    推荐: function () {
        return [{
            vod_id: 'only_search',
            vod_name: '盘搜盘 - 纯搜索源，聚合阿里云盘/夸克/百度网盘等',
            vod_tag: 'action',
            vod_pic: this.publicUrl + '/images/icon_cookie/搜索.jpg'
        }];
    },

    二级: function () {
        let url = this.orId;
        if (url.startsWith('push://')) url = decodeURIComponent(url.slice(7));
        url = url.trim().replace(/&amp;/g, '&');
        const disk = getDiskName(url);
        return {
            vod_pic: '',
            vod_id: this.orId,
            vod_content: `盘搜分享\n链接: ${url}`,
            vod_play_from: disk,
            vod_play_url: `点我播放$push://${encodeURIComponent(url)}`,
            vod_name: `${disk}资源`
        };
    },

    搜索: async function () {
        const { input, KEY } = this;
        const wd = KEY || (input && new URL(input).searchParams.get('kw')) || '';
        const panTypes = (this.pan_types || '').split(',').map(s => s.trim()).filter(Boolean);
        const priorityTypes = panTypes.map(t => nameToApiType[t] || t);
        const apiUrl = `${this.host}/api/search?kw=${encodeURIComponent(wd)}`;

        let html;
        for (let i = 0; i <= 3; i++) {
            try {
                html = await request(apiUrl, {
                    headers: { 'User-Agent': 'MOBILE_UA', 'Referer': `${this.host}/` }
                });
                if (html) break;
            } catch (e) {
                if (i === 3) throw e;
                await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
            }
        }

        let data;
        try {
            data = JSON.parse(html);
        } catch (e) {
            throw new Error(`API返回非JSON数据(可能是IP被限制或API变更): ${html.slice(0, 200)}`);
        }
        if (!data || data.code !== 0) throw new Error(data?.message || '请求失败');

        const allItems = [];
        const merged = data.data?.merged_by_type || data.data?.results || {};

        // 处理 merged_by_type 格式（同 TG盘搜）
        if (data.data?.merged_by_type) {
            for (const [apiType, rows] of Object.entries(data.data.merged_by_type)) {
                if (!priorityTypes.some(t => t === apiType)) continue;
                const name = apiTypeToName[apiType] || '其他网盘';
                for (const row of (rows || []).slice(0, this.max_results)) {
                    const dt = row.datetime ? new Date(row.datetime) : new Date();
                    const timeStr = `${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`;
                    allItems.push({
                        title: row.note || row.title || '未知名称',
                        img: row.images?.[0] || '',
                        desc: timeStr,
                        url: row.url,
                        pan: name,
                        panApiType: apiType,
                        time: dt.getTime(),
                        source: row.source || 'pansou'
                    });
                }
            }
        }
        // 处理 results 数组格式（备用）
        else if (Array.isArray(data.data?.results) || Array.isArray(data.data)) {
            const results = data.data?.results || data.data || [];
            for (const row of results.slice(0, this.max_results * panTypes.length)) {
                const apiType = row.type || row.platform || '';
                const name = apiTypeToName[apiType] || getDiskName(row.url || '') || '其他网盘';
                if (!priorityTypes.some(t => t === apiType || t === apiTypeToName[apiType])) continue;
                const dt = row.datetime || row.time ? new Date(row.datetime || row.time) : new Date();
                const timeStr = `${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`;
                allItems.push({
                    title: row.note || row.title || row.name || '未知名称',
                    img: row.images?.[0] || row.image || '',
                    desc: timeStr,
                    url: row.url || row.link || '',
                    pan: name,
                    panApiType: apiType,
                    time: dt.getTime(),
                    source: row.source || 'pansou'
                });
            }
        }

        // 按优先级排序
        allItems.sort((a, b) => {
            const aIdx = priorityTypes.indexOf(a.panApiType);
            const bIdx = priorityTypes.indexOf(b.panApiType);
            if (aIdx !== -1 || bIdx !== -1) {
                if (aIdx === -1) return 1;
                if (bIdx === -1) return -1;
                return aIdx - bIdx;
            }
            return b.time - a.time;
        });

        const results = allItems
            .filter(item => !this.search_match || item.title.includes(wd))
            .map(item => ({
                vod_id: item.url,
                vod_name: item.title,
                vod_pic: item.img,
                vod_remarks: `${item.pan}:${item.desc}|${item.source}`
            }));

        return results.length ? results : [{ vod_id: 'empty', vod_name: '无搜索结果', vod_pic: '', vod_remarks: '换个关键词试试' }];
    },

    lazy: function (flag, id) {
        let url = id;
        if (url.startsWith('push://')) url = decodeURIComponent(url.slice(7));
        return {
            parse: 0,
            url: url,
            header: JSON.stringify(this.headers)
        };
    }
};
