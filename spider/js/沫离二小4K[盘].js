/*
@header({
  searchable: 1,
  filterable: 1,
  quickSearch: 0,
  title: '沫离二小4K[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离二小4K[盘]',
    host: 'https://www.2xiaopan.top',
    url: '/index.php/vod/show/id/fyclass.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    },
    line_order: ['百度', '夸克', '优汐', '天翼', '123', '移动', '阿里'],
    play_parse: true,
    search_match: true,
    searchable: 1,
    filterable: 1,
    timeout: 30000,
    quickSearch: 1,

    class_parse: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let host = rule.host;
        let classes = [];
        // Try ThinkPHP format first
        let html = await request(input);
        let navItems = pdfa(html, '.stui-header__menu li');
        if (navItems.length === 0) navItems = pdfa(html, '.nav-menu-items li');
        if (navItems.length === 0) navItems = pdfa(html, '.myui-header__menu li');
        navItems.forEach(item => {
            let href = pd(item, 'a&&href') || '';
            let text = pdfh(item, 'a&&Text') || '';
            // Extract type_id from URL patterns
            let match = href.match(/\/id\/(\d+)/) || href.match(/\/(\d+)\.html/);
            if (match && text && text.trim()) {
                classes.push({type_id: match[1], type_name: text.trim()});
            }
        });
        // Fallback: fetch homepage and parse navigation
        if (classes.length === 0 && host) {
            try {
                let homeHtml = await request(host);
                let menuItems = pdfa(homeHtml, '.stui-header__menu li');
                if (menuItems.length === 0) menuItems = pdfa(homeHtml, '.nav-menu-items li');
                if (menuItems.length === 0) menuItems = pdfa(homeHtml, '.myui-header__menu li');
                menuItems.forEach(item => {
                    let href = pd(item, 'a&&href') || '';
                    let text = pdfh(item, 'a&&Text') || '';
                    let match = href.match(/\/id\/(\d+)/) || href.match(/\/(\d+)\.html/);
                    if (match && text && text.trim()) {
                        classes.push({type_id: match[1], type_name: text.trim()});
                    }
                });
            } catch(e) {}
        }
        // Hardcoded default categories if detection fails
        if (classes.length === 0) {
            classes = [
                {type_id: '1', type_name: '电影'},
                {type_id: '2', type_name: '剧集'},
                {type_id: '3', type_name: '动漫'},
                {type_id: '4', type_name: '综艺'}
            ];
        }
        return {class: classes};
    },

    预处理: async function () {
        return [];
    },

    推荐: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        if (data.length === 0) data = pdfa(html, '.stui-vodlist li');
        if (data.length === 0) data = pdfa(html, '.myui-vodlist li');
        data.forEach(it => {
            let title = pdfh(it, 'a&&title') || pdfh(it, '.title&&Text');
            d.push({
                title: title,
                img: pd(it, 'img&&data-src||data-original||src'),
                desc: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || '',
                url: pd(it, 'a&&href')
            });
        });
        return setResult(d);
    },

    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        if (data.length === 0) data = pdfa(html, '.stui-vodlist li');
        if (data.length === 0) data = pdfa(html, '.myui-vodlist li');
        data.forEach(it => {
            let title = pdfh(it, 'a&&title') || pdfh(it, '.title&&Text');
            d.push({
                title: title,
                img: pd(it, 'img&&data-src||data-original||src'),
                desc: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || '',
                url: pd(it, 'a&&href')
            });
        });
        return setResult(d);
    },

    二级: async function (ids) {
        try {
            let {input, pdfa, pdfh, pd} = this;
            let html = await request(input);
            let vod = {
                vod_name: pdfh(html, 'h1&&Text') || pdfh(html, '.title&&Text') || '',
                type_name: pdfh(html, '.tag-link&&Text') || '',
                vod_pic: pd(html, '.lazyload&&data-original||data-src||src') || '',
                vod_content: pdfh(html, '.sqjj_a--span&&Text') || pdfh(html, '.desc&&Text') || '',
                vod_remarks: pdfh(html, '.video-info-items:eq(3)&&Text') || '',
                vod_year: pdfh(html, '.tag-link:eq(2)&&Text') || '',
                vod_area: pdfh(html, '.tag-link:eq(3)&&Text') || ''
            };
            let allLines = [];
            let playPans = [];
            let allLinks = new Set();
            // Collect all cloud drive links
            let rows = pdfa(html, '.module-row-title');
            if (rows.length === 0) rows = pdfa(html, '.playlist .module-row-title');
            rows.forEach(item => {
                let link = pd(item, 'p&&Text') || pd(item, 'a&&href') || '';
                if (link) allLinks.add(link.trim());
            });
            // Also check for links in detail page content
            let contentLinks = pdfa(html, 'a[href*="pan.quark"],a[href*="pan.baidu"],a[href*="drive.uc"],a[href*="189.cn"],a[href*="123pan"],a[href*="caiyun.139"],a[href*="alipan"]');
            contentLinks.forEach(a => allLinks.add(pd(a, 'a&&href') || ''));
            let baiduCount = Array.from(allLinks).filter(l => /pan\.baidu/.test(l)).length;
            let counters = {夸克:1, 优汐:1, 百度:1, 天翼:1, '123':1, 移动:1, 阿里:1};
            for (let link of allLinks) {
                if (/\.quark/.test(link)) {
                    playPans.push(link);
                    try {
                        let shareData = await Quark.getShareData(link);
                        if (shareData) {
                            let videos = await Quark.getFilesByShareUrl(shareData);
                            let playUrl = videos.length > 0
                                ? videos.map(v => v.file_name + '$' + [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid || '', v.subtitle?.share_fid_token || ''].join('*')).join('#')
                                : "资源已经失效";
                            allLines.push({name: '夸克#' + counters.夸克++, url: playUrl, type: '夸克'});
                        }
                    } catch(e) {}
                } else if (/\.uc/i.test(link)) {
                    playPans.push(link);
                    try {
                        let shareData = await UC.getShareData(link);
                        if (shareData) {
                            let videos = await UC.getFilesByShareUrl(shareData);
                            let playUrl = videos.length > 0
                                ? videos.map(v => v.file_name + '$' + [shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid || '', v.subtitle?.share_fid_token || ''].join('*')).join('#')
                                : "资源已经失效";
                            allLines.push({name: '优汐#' + counters.优汐++, url: playUrl, type: '优汐'});
                        }
                    } catch(e) {}
                } else if (/\.189/.test(link)) {
                    playPans.push(link);
                    try {
                        let cloudData = await Cloud.getShareData(link);
                        Object.keys(cloudData).forEach(it => {
                            let urls = cloudData[it].map(item => item.name + '$' + [item.fileId, item.shareId].join('*')).join('#');
                            allLines.push({name: '天翼-' + it, url: urls, type: '天翼'});
                        });
                    } catch(e) {}
                } else if (/\.139/.test(link)) {
                    playPans.push(link);
                    try {
                        let yunData = await Yun.getShareData(link);
                        Object.keys(yunData).forEach(it => {
                            let urls = yunData[it].map(item => item.name + '$' + [item.contentId, item.linkID].join('*')).join('#');
                            allLines.push({name: '移动-' + it, url: urls, type: '移动'});
                        });
                    } catch(e) {}
                } else if (/\.123/.test(link)) {
                    playPans.push(link);
                    try {
                        let shareData = await Pan.getShareData(link);
                        let videos = await Pan.getFilesByShareUrl(shareData);
                        Object.keys(videos).forEach(it => {
                            let urls = videos[it].map(v => v.FileName + '$' + [v.ShareKey, v.FileId, v.S3KeyFlag, v.Size, v.Etag].join('*')).join('#');
                            allLines.push({name: '123-' + it, url: urls, type: '123'});
                        });
                    } catch(e) {}
                } else if (/\.baidu/.test(link)) {
                    playPans.push(link);
                    try {
                        let baiduData = await Baidu2.getShareData(link);
                        Object.keys(baiduData).forEach((it, idx) => {
                            let lineName = baiduCount === 1 ? '百度#1' : '百度-' + it.split('/').pop();
                            let urls = baiduData[it].map(item => item.name + '$' + [item.path, item.uk, item.shareid, item.fsid].join('*')).join('#');
                            allLines.push({name: lineName, url: urls, type: '百度'});
                        });
                    } catch(e) {}
                } else if (/\.alipan/.test(link)) {
                    playPans.push(link);
                    try {
                        let shareData = await Ali.getShareData(link);
                        if (shareData) {
                            let videos = await Ali.getFilesByShareUrl(shareData);
                            let playUrl = videos.length > 0
                                ? videos.map(v => v.name + '$' + [v.share_id, v.file_id, v.subtitle ? v.subtitle.file_id : ''].join('*')).join('#')
                                : "资源已经失效";
                            allLines.push({name: '阿里#' + counters.阿里++, url: playUrl, type: '阿里'});
                        }
                    } catch(e) {}
                }
            }
            allLines.sort((a, b) => {
                let ai = rule.line_order.indexOf(a.type), bi = rule.line_order.indexOf(b.type);
                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
            });
            vod.vod_play_from = allLines.map(l => l.name).join('$$$');
            vod.vod_play_url = allLines.map(l => l.url).join('$$$');
            vod.vod_play_pan = playPans.join('$$$');
            return vod;
        } catch (e) {
            return {vod_name: '加载失败', vod_play_from: '错误', vod_play_url: e.message};
        }
    },

    搜索: async function () {
        let {input, pdfa, pdfh, pd, KEY} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-search-item');
        if (data.length === 0) data = pdfa(html, '.module-items .module-item');
        if (data.length === 0) data = pdfa(html, '.stui-vodlist li');
        data.forEach(it => {
            let title = pdfh(it, '.video-info&&a&&title') || pdfh(it, 'a&&title') || pdfh(it, '.title&&Text');
            if (rule.search_match && KEY) {
                if (!title || !new RegExp(KEY, 'i').test(title)) return;
            }
            d.push({
                title: title,
                img: pd(it, 'img&&data-src||data-original||src'),
                desc: pdfh(it, '.module-item-text&&Text') || pdfh(it, '.pic-text&&Text') || '',
                url: pd(it, '.video-info&&a&&href') || pd(it, 'a&&href')
            });
        });
        return setResult(d);
    },

    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        let ids = input.split('*');
        let urls = [];
        if (flag.startsWith('夸克')) {
            let down = (await Quark.getUrl(ids[0], ids[1], ids[2], ids[3])) || (await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true));
            down.forEach(t => {if(t.url!==undefined){urls.push(t.name, t.url+'#isVideo=true##fastPlayMode##threads=20#');}});
            let transcoding = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter(t => t.accessable);
            transcoding.forEach(t => urls.push(t.resolution === 'low' ? '流畅' : t.resolution === 'high' ? '高清' : t.resolution === 'super' ? '超清' : t.resolution, t.video_info.url+'#isVideo=true##fastPlayMode##threads=20#'));
            return {parse: 0, url: urls, header: {'Cookie': ENV.get('quark_cookie')}};
        } else if (flag.startsWith('UC')) {
            let down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            return await UC.getLazyResult(down, mediaProxyUrl);
        } else if (flag.startsWith('移动')) {
            let url = await Yun.getSharePlay(ids[0], ids[1]);
            return {url: url};
        } else if (flag.startsWith('天翼')) {
            let url = await Cloud.getShareUrl(ids[0], ids[1]);
            return {url: url};
        } else if (flag.startsWith('123')) {
            let url = await Pan.getDownload(ids[0], ids[1], ids[2], ids[3], ids[4]);
            return {parse: 0, url: ['原画', url]};
        } else if (flag.startsWith('阿里')) {
            let tc = {UHD:'4K 超清', QHD:'2K 超清', FHD:'1080 全高清', HD:'720 高清', SD:'540 标清', LD:'360 流畅'};
            let down = await Ali.getDownload(ids[0], ids[1]);
            urls.push('原画', down.url+'#isVideo=true##ignoreMusic=true#');
            urls.push('极速原画', down.url+'#fastPlayMode##threads=10#');
            let tr = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a,b) => b.template_width - a.template_width);
            tr.forEach(t => {if(t.url) urls.push(tc[t.template_id], t.url);});
            return {parse: 0, url: urls, header: {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.aliyundrive.com/'}};
        } else if (flag.startsWith('百度')) {
            let url = await Baidu2.getAppShareUrl(ids[0], ids[1], ids[2], ids[3]);
            urls.push('原画', url+'#isVideo=true##fastPlayMode##threads=10#');
            urls.push('原代本', 'http://127.0.0.1:7777/?thread='+(ENV.get('thread')||6)+'&form=urlcode&randUa=1&url='+encodeURIComponent(url));
            return {parse: 0, url: urls, header: {'User-Agent': 'netdisk;P2SP;2.2.91.136;android-android;'}};
        }
    }
};
