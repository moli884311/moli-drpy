/*
@header({
  searchable: 2,
  filterable: 1,
  quickSearch: 0,
  title: '厂长资源',
  lang: 'ds'
})
*/

var rule = {
    title: '厂长资源',
    host: 'https://www.4kcz.com',
    url: '/vodshow/fyclass--------fypage---.html',
    searchUrl: '/vodsearch/**----------fypage---.html',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter_url: '{{fl.cateId}}',
    filter: 'H4sIAAAAAAAAA+2WUW/TMBSF/wvPSCiOc+v8nleQJm1CU6chRtkDQi5xGotgT0k6jQnx35GddemGEKMPE9r2kEo+9vnsa/fc2GkUMUYRn3Tf/mXe+5rn/c1ocmNGo58e+pgZ/CBuBzXGKX3ov9jO4ve5v55q0dA3mvbuHxylOC5HRHWk8bId71gN1hnsRHCykh2Gg4LmGsW8ALawtoLXu4jH28bFni5shK+WOGkmqJwKAcfJ8K0AR6mm4MBcEhsp0FLBw4aNn85r6f8uRyvnCUnfnK8EHCkcTE4qZicr9gVHioKDDfWXHcghhkNEM8tSRHojHKdlN88oxMqS/pXDSpu3ASm8jBEoj+JVs7dCO7w2U4tCYxTn+FJpe2kB71hFjx8rhWNwPPkA4N6mGyXMNVp1cW5r/pF2YRxRVmUnGf1/lwvjeHT1N/LT/gM+0j+AZ2gBQh3hQRkkbAj2NsEfNV1E8Y50L+7BPMmzA/uOf8P2e3H9Vg6EDWbL83Y1f99kMf+1n6EHLhQvphN++bGcb74m08ffP23yj9v8mxeDR60Zj9pRN7RtVswTmiLshH7FVrCbPfeHJ8vV6Yq8h7Woz3nx3+7lHrsh2nESrPTWuj/TJUO+z0skQ/Bz8GkYEvAUeO1GBo5nlDtAp4TpJIIQCa4gE0aqJNVE8F4KPSsjS0kmigZKp4NkUCgbS1JKk0iZRLJUSWqBB1KIQpFOiSSFkPIM8hCSj2NU4hgT0ZVCuq6ohqRU9JOkljJN0bBY4ZWS9BFNC6UnmtGQH2STBP8BywE2YC4HAAA=',
    filter_def: {},
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 10000,
    play_parse: true,
    search_match: true,
    class_name: '电影&电视剧&综艺&动漫&纪录片',
    class_url: '1&2&3&4&5',

    预处理: async function () {
        let html = await request(this.host);
        // 自动提取分类
        try {
            let navItems = JSON.parse(html.match(/class\s*=\s*'nav'(.*?)<\/ul>/s)?.[0]?.match(/<a[^>]*href="\/vodshow\/(\d+)-----------\.html"[^>]*>([^<]+)<\/a>/g) || '[]');
            if (!navItems || !navItems.length) {
                let cats = [];
                let regex = /<a[^>]*href="\/vodshow\/(\d+)-----------\.html"[^>]*>([^<]+)<\/a>/g;
                let m;
                while ((m = regex.exec(html)) !== null) cats.push({ id: m[1], name: m[2] });
                if (cats.length) {
                    this.class_name = cats.map(c => c.name).join('&');
                    this.class_url = cats.map(c => c.id).join('&');
                }
            }
        } catch (e) {}
        return [];
    },

    推荐: async function () {
        let { pdfa, pdfh, pd } = this;
        let html = await request(this.host);
        let d = [];
        let items = pdfa(html, '.module-item, .vodlist_item, .public-list-box .public-list-exp, ul.stui-vodlist li, .myui-vodlist li, .hl-list-item');
        items.slice(0, 18).forEach(it => {
            d.push({
                title: pdfh(it, '.module-item-title&&Text') || pdfh(it, 'a&&title') || pdfh(it, '.title&&Text') || '',
                img: pd(it, 'img&&data-original') || pd(it, 'img&&data-src') || pd(it, 'img&&src') || '',
                desc: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || '',
                url: pd(it, 'a&&href') || ''
            });
        });
        return setResult(d.filter(x => x.url));
    },

    一级: async function () {
        let { input, pdfa, pdfh, pd } = this;
        let html = await request(input);
        let d = [];
        let items = pdfa(html, '.module-item, .vodlist_item, .public-list-box .public-list-exp, ul.stui-vodlist li, .myui-vodlist li, .hl-list-item');
        items.forEach(it => {
            d.push({
                vod_id: pd(it, 'a&&href') || '',
                vod_name: pdfh(it, '.module-item-title&&Text') || pdfh(it, 'a&&title') || pdfh(it, '.title&&Text') || '',
                vod_pic: pd(it, 'img&&data-original') || pd(it, 'img&&data-src') || pd(it, 'img&&src') || '',
                vod_remarks: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || ''
            });
        });
        return setResult(d.filter(x => x.vod_id));
    },

    二级: async function (ids) {
        let { input, pdfa, pdfh, pd } = this;
        let html = await request(input);
        let VOD = {
            vod_id: input,
            vod_name: pdfh(html, 'h1&&Text') || pdfh(html, 'h2&&Text') || pdfh(html, '.video-title&&Text') || '',
            vod_pic: pd(html, '.lazyload&&data-original') || pd(html, '.lazyload&&data-src') || pd(html, '.video-cover img&&src') || pd(html, '.vod_img img&&src') || '',
            vod_content: pdfh(html, '.module-info-introduction-content&&Text') || pdfh(html, '.video-info-item:contains(简介)&&Text') || pdfh(html, '.vod_content&&Text') || '',
            type_name: '',
            vod_actor: '',
            vod_director: '',
            vod_remarks: pdfh(html, '.module-info-item-content:eq(3)&&Text') || '',
            vod_play_from: '',
            vod_play_url: ''
        };

        // 提取元数据
        let infoItems = pdfa(html, '.module-info-item, .video-info-item, .vodinfobox li');
        infoItems.forEach(it => {
            let text = pdfh(it, '*&&Text') || '';
            if (text.includes('类型')) VOD.type_name = text.replace(/.*?：\s*/, '');
            if (text.includes('主演')) VOD.vod_actor = text.replace(/.*?：\s*/, '');
            if (text.includes('导演')) VOD.vod_director = text.replace(/.*?：\s*/, '');
            if (text.includes('地区')) VOD.vod_area = text.replace(/.*?：\s*/, '');
            if (text.includes('年份')) VOD.vod_year = text.replace(/.*?：\s*/, '');
        });

        // 提取播放列表
        let playFrom = [];
        let playUrl = [];

        // 尝试多种常见模板的播放列表提取
        let playList = pdfa(html, '.module-play-list-content a, .playlist a, .stui-content__playlist a, .myui-content__list a, #playlist1 a, .hl-plays-list a');
        if (playList.length) {
            let episodes = playList.map(a => {
                let href = pd(a, 'a&&href') || '';
                let title = pdfh(a, 'a&&Text') || '';
                return title && href ? `${title}$${href}` : '';
            }).filter(Boolean);
            if (episodes.length) {
                playFrom.push('厂长线路');
                playUrl.push(episodes.join('#'));
            }
        }

        // 备用: 按播放来源分组
        if (!playList.length) {
            let fromItems = pdfa(html, '.module-tab-item, .play_source_tab a');
            let playBoxes = pdfa(html, '.module-play-list, .module-blocklist');
            if (fromItems.length && playBoxes.length) {
                fromItems.forEach((fi, i) => {
                    let name = pdfh(fi, '*&&Text') || `线路${i + 1}`;
                    let box = playBoxes[i];
                    if (!box) return;
                    let links = pdfa(box, 'a');
                    let eps = links.map(a => {
                        let href = pd(a, 'a&&href') || '';
                        let title = pdfh(a, 'a&&Text') || '';
                        return title && href ? `${title}$${href}` : '';
                    }).filter(Boolean);
                    if (eps.length) {
                        playFrom.push(name);
                        playUrl.push(eps.join('#'));
                    }
                });
            }
        }

        VOD.vod_play_from = playFrom.join('$$$') || '厂长资源';
        VOD.vod_play_url = playUrl.join('$$$') || '';

        return VOD;
    },

    搜索: async function () {
        let { input, pdfa, pdfh, pd, KEY } = this;
        let html = await request(input);
        let d = [];
        let items = pdfa(html, '.module-search-item, .module-item, .vodlist_item, .public-list-box .public-list-exp, ul.stui-vodlist li, .myui-vodlist li, .hl-list-item, .thumb');
        items.slice(0, 20).forEach(it => {
            d.push({
                vod_id: pd(it, 'a&&href') || '',
                vod_name: pdfh(it, 'a&&title') || pdfh(it, '.video-name&&Text') || pdfh(it, '.title&&Text') || '',
                vod_pic: pd(it, 'img&&data-original') || pd(it, 'img&&data-src') || pd(it, 'img&&src') || '',
                vod_remarks: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || ''
            });
        });
        return setResult(d.filter(x => x.vod_id));
    },

    lazy: async function (flag, id) {
        let { input } = this;
        // 直链或m3u8
        if (/\.m3u8|\.mp4/.test(input)) return { parse: 0, url: input };
        // 需要解析的链接
        let html = await request(input);
        let urlMatch = html.match(/url\s*[:=]\s*['"]([^'"]+)['"]/) || html.match(/player_data\s*=\s*({[^}]+})/);
        if (urlMatch) {
            try { return { parse: 0, url: JSON.parse(urlMatch[1]).url || urlMatch[1] }; } catch {}
            return { parse: 0, url: urlMatch[1] };
        }
        return { parse: 1, url: input, header: { 'User-Agent': 'Mozilla/5.0' } };
    }
};
