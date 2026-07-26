/*
@header({
  searchable: 2,
  filterable: 1,
  quickSearch: 0,
  title: '厂长资源[优]',
  lang: 'ds'
})
*/

var rule = {
    title: '厂长资源[优]',
    host: 'https://www.4kcz.com',
    url: '/fyclass/page/fypage',
    searchUrl: '/boss1O1?q=**',
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    filter: 'H4sIAAAAAAAAA+2WUW/TMBSF/wvPSCiOc+v8nleQJm1CU6chRtkDQi5xGotgT0k6jQnx35GddemGEKMPE9r2kEo+9vnsa/fc2GkUMUYRn3Tf/mXe+5rn/c1ocmNGo58e+pgZ/CBuBzXGKX3ov9jO4ve5v55q0dA3mvbuHxylOC5HRHWk8bId71gN1hnsRHCykh2Gg4LmGsW8ALawtoLXu4jH28bFni5shK+WOGkmqJwKAcfJ8K0AR6mm4MBcEhsp0FLBw4aNn85r6f8uRyvnCUnfnK8EHCkcTE4qZicr9gVHioKDDfWXHcghhkNEM8tSRHojHKdlN88oxMqS/pXDSpu3ASm8jBEoj+JVs7dCO7w2U4tCYxTn+FJpe2kB71hFjx8rhWNwPPkA4N6mGyXMNVp1cW5r/pF2YRxRVmUnGf1/lwvjeHT1N/LT/gM+0j+AZ2gBQh3hQRkkbAj2NsEfNV1E8Y50L+7BPMmzA/uOf8P2e3H9Vg6EDWbL83Y1f99kMf+1n6EHLhQvphN++bGcb74m08ffP23yj9v8mxeDR60Zj9pRN7RtVswTmiLshH7FVrCbPfeHJ8vV6Yq8h7Woz3nx3+7lHrsh2nESrPTWuj/TJUO+z0skQ/Bz8GkYEvAUeO1GBo5nlDtAp4TpJIIQCa4gE0aqJNVE8F4KPSsjS0kmigZKp4NkUCgbS1JKk0iZRLJUSWqBB1KIQpFOiSSFkPIM8hCSj2NU4hgT0ZVCuq6ohqRU9JOkljJN0bBY4ZWS9BFNC6UnmtGQH2STBP8BywE2YC4HAAA=',
    filter_def: {},
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 15000,
    play_parse: true,
    // 使用首页"更多"链接对应的 taxonomy 归档页 (有 .bt_img 结构)
    class_name: '电影&国产剧&美剧&韩剧&日剧&追番(动漫)',
    class_url: 'movie_bt_series/dyy&movie_bt_series/guochanju&movie_bt_series/mj&movie_bt_series/hj&movie_bt_series/rj&movie_bt_view_cat/fjj',

    预处理: async function () {
        return [];
    },

    推荐: async function () {
        let { pdfa, pdfh, pd } = this;
        let html = await request(this.host);
        let d = [];
        let items = pdfa(html, '.mi_btcon .bt_img ul li');
        if (!items.length) items = pdfa(html, '.bt_img ul li');
        items.slice(0, 18).forEach(it => {
            let link = pd(it, 'h3.dytit&&a&&href') || pd(it, '.dytit&&a&&href') || pd(it, 'a&&href') || '';
            d.push({
                title: pdfh(it, 'h3.dytit&&a&&Text') || pdfh(it, '.dytit&&a&&Text') || pdfh(it, 'a&&title') || '',
                img: pd(it, 'img&&data-original') || pd(it, 'img&&src') || '',
                desc: pdfh(it, '.jidi&&span&&Text') || pdfh(it, '.jidi&&Text') || '',
                url: link
            });
        });
        return setResult(d.filter(x => x.url && x.title));
    },

    一级: async function () {
        let { input, pdfa, pdfh, pd } = this;
        let html = await request(input);
        let d = [];
        // 匹配 taxonomy 归档页 (含 .bt_img) 和搜索页
        let items = pdfa(html, '.bt_img ul li');
        if (!items.length) items = pdfa(html, '.mi_btcon .bt_img ul li');
        if (!items.length) items = pdfa(html, '.search_list ul li');
        items.forEach(it => {
            let link = pd(it, 'h3.dytit&&a&&href') || pd(it, '.dytit&&a&&href') || pd(it, 'a&&href') || '';
            if (link && !link.startsWith('http')) link = this.host + link;
            d.push({
                vod_id: link,
                vod_name: pdfh(it, 'h3.dytit&&a&&Text') || pdfh(it, '.dytit&&a&&Text') || pdfh(it, 'a&&title') || pdfh(it, 'a&&Text') || '',
                vod_pic: pd(it, 'img&&data-original') || pd(it, 'img&&src') || '',
                vod_remarks: pdfh(it, '.jidi&&span&&Text') || pdfh(it, '.jidi&&Text') || pdfh(it, '.qb&&Text') || ''
            });
        });
        return setResult(d.filter(x => x.vod_id && x.vod_name));
    },

    二级: async function (ids) {
        let { input, pdfa, pdfh, pd } = this;
        let html = await request(input);
        let VOD = {
            vod_id: input,
            vod_name: '',
            vod_pic: '',
            type_name: '',
            vod_year: '',
            vod_area: '',
            vod_actor: '',
            vod_director: '',
            vod_remarks: '',
            vod_content: '',
            vod_play_from: '厂长线路',
            vod_play_url: ''
        };

        // 标题
        VOD.vod_name = pdfh(html, '.moviedteail_tt h1&&Text') || pdfh(html, 'h3.dy_tit_big&&Text') || pdfh(html, 'meta[property="og:title"]&&content') || '';
        if (VOD.vod_name.includes('|')) {
            let parts = VOD.vod_name.split('|');
            VOD.vod_name = parts[0].trim();
            if (parts[1]) VOD.vod_remarks = parts[1].trim();
        }

        // 封面
        VOD.vod_pic = pd(html, '.dyimg&&img&&src') || pd(html, 'meta[property="og:image"]&&content') || '';

        // 元数据
        let infoItems = pdfa(html, 'ul.moviedteail_list li');
        if (!infoItems.length) infoItems = pdfa(html, '.moviedteail_list li');
        infoItems.forEach(it => {
            let text = (pdfh(it, '*&&Text') || '').trim();
            if (/类型/.test(text)) VOD.type_name = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/地区/.test(text)) VOD.vod_area = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/年份/.test(text)) VOD.vod_year = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/主演/.test(text)) VOD.vod_actor = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/导演/.test(text)) VOD.vod_director = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/语言/.test(text)) VOD.vod_lang = text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (/上映/.test(text)) VOD.vod_year = VOD.vod_year || text.replace(/.*?[：:]\s*/, '').replace(/<[^>]+>/g, '').trim();
        });

        // 简介
        VOD.vod_content = pdfh(html, '.yp_context&&Text') || pdfh(html, 'meta[property="og:description"]&&content') || '';
        VOD.vod_content = VOD.vod_content.replace(/<[^>]+>/g, '').trim();

        // 播放列表
        let playList = pdfa(html, '.paly_list_btn a');
        if (playList.length) {
            let episodes = playList.map(a => {
                let href = pd(a, 'a&&href') || '';
                let title = pdfh(a, 'a&&Text') || '';
                if (!title || !href) return '';
                title = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                return title + '$' + href;
            }).filter(Boolean);
            if (episodes.length) {
                VOD.vod_play_url = episodes.join('#');
            }
        }

        // 备用选择器
        if (!VOD.vod_play_url) {
            let altList = pdfa(html, '.module-play-list a, .playlist a, .stui-content__playlist a, .myui-content__list a, #playlist1 a, .hl-plays-list a');
            if (altList.length) {
                let episodes = altList.map(a => {
                    let href = pd(a, 'a&&href') || '';
                    let title = pdfh(a, 'a&&Text') || '';
                    return title && href ? title + '$' + href : '';
                }).filter(Boolean);
                if (episodes.length) VOD.vod_play_url = episodes.join('#');
            }
        }

        return VOD;
    },

    搜索: async function () {
        let { input, pdfa, pdfh, pd, KEY } = this;
        let html = await request(input);
        let d = [];
        let items = pdfa(html, '.search_list ul li');
        if (!items.length) items = pdfa(html, '.bt_img ul li');
        if (!items.length) items = pdfa(html, '.mi_btcon .bt_img ul li');
        items.slice(0, 20).forEach(it => {
            let link = pd(it, 'h3.dytit&&a&&href') || pd(it, '.dytit&&a&&href') || pd(it, 'a&&href') || '';
            if (link && !link.startsWith('http')) link = this.host + link;
            d.push({
                vod_id: link,
                vod_name: pdfh(it, 'h3.dytit&&a&&Text') || pdfh(it, '.dytit&&a&&Text') || pdfh(it, 'a&&title') || pdfh(it, 'a&&Text') || '',
                vod_pic: pd(it, 'img&&data-original') || pd(it, 'img&&src') || '',
                vod_remarks: pdfh(it, '.jidi&&span&&Text') || pdfh(it, '.jidi&&Text') || ''
            });
        });
        return setResult(d.filter(x => x.vod_id && x.vod_name));
    },

    lazy: async function (flag, id, flags) {
        let { input } = this;
        if (/\.(m3u8|mp4|mkv|flv|avi|ts)(\?|$)/i.test(input)) {
            return { parse: 0, url: input };
        }

        let html = await request(input);

        // 步骤1: player_data
        let match = html.match(/r player_.*?=(.*?)<\/script>/);
        if (match?.[1]) {
            try {
                let playerData = JSON.parse(match[1]);
                let url = playerData.url;
                if (playerData.encrypt === '1') url = unescape(url);
                else if (playerData.encrypt === '2') url = unescape(base64Decode(url));
                if (/m3u8|mp4/.test(url)) return { parse: 0, url: url };
            } catch (e) {}
        }

        // 步骤2: iframe → py.php → 视频直链
        let iframeSrc = this.pdfh(html, '.viframe&&src') || this.pdfh(html, 'iframe&&src');
        if (iframeSrc) {
            iframeSrc = iframeSrc.replace(/&amp;/g, '&');
            let urlMatch = iframeSrc.match(/[?&]url=([^&]+)/);
            if (urlMatch) {
                let encodedUrl = urlMatch[1];
                let pyUrl = 'https://159.75.162.215:3001/player/py.php?code=cs&if=1&url=' + encodedUrl;
                let playerHtml = await request(pyUrl, {
                    headers: { 'Referer': input }
                });
                let videoMatch = playerHtml.match(/(?:const|var)\s+mysvg\s*=\s*'([^']+)'/);
                if (!videoMatch) videoMatch = playerHtml.match(/art\.url\s*=\s*["']([^"']+)["']/);
                if (videoMatch) {
                    return { parse: 0, url: videoMatch[1] };
                }
            }
        }

        // 步骤3: url 正则
        let urlMatch2 = html.match(/url["\s:=]+['"]([^'"]+\.(?:m3u8|mp4)[^'"]*)['"]/);
        if (urlMatch2) return { parse: 0, url: urlMatch2[1] };

        // 步骤4: 解析接口
        return { parse: 1, url: input, header: { 'User-Agent': 'Mozilla/5.0' } };
    }
};
