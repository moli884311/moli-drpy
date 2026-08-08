/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离盘它4K[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离盘它4K[盘]',
    host: 'https://www.91panta.cn',
    url: '/vodshow/fyclass-fyfilter.html',
    searchUrl: '/vodsearch/**--------fypage---.html',
    play_parse: true,
    search_match: true,
    searchable: 1,
    filterable: 0,
    timeout: 30000,
    quickSearch: 0,

    class_parse: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let classes = [];
        let navItems = pdfa(html, '.nav-menu-items li');
        navItems.forEach(item => {
            let href = pd(item, 'a&&href') || '';
            let text = pdfh(item, 'a&&Text') || '';
            let match = href.match(/\/vodshow\/(\d+)/);
            if (match && text) classes.push({type_id: match[1], type_name: text.trim()});
        });
        if (classes.length === 0) {
            classes = [{type_id:'1',type_name:'电影'},{type_id:'2',type_name:'剧集'},{type_id:'3',type_name:'动漫'},{type_id:'4',type_name:'综艺'}];
        }
        return {class: classes};
    },

    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        data.forEach(it => {
            d.push({vod_id: pd(it, 'a&&href'), vod_name: pdfh(it, 'a&&title')||'', vod_pic: pd(it, 'img&&data-src')||'', vod_remarks: pdfh(it, '.module-item-text&&Text')||''});
        });
        return setResult(d);
    },

    二级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let allLinks = new Set();
        let rows = pdfa(html, '.module-row-title');
        rows.forEach(item => {
            let link = pd(item, 'p&&Text') || '';
            if (link) allLinks.add(link.trim());
        });
        let allLines = []; let playPans = []; let counters = {夸克:1, 百度:1, 阿里:1};
        for (let link of allLinks) {
            if (/\.quark/.test(link)) {
                playPans.push(link);
                try {
                    let sd = await Quark.getShareData(link);
                    if (sd) {
                        let videos = await Quark.getFilesByShareUrl(sd);
                        let pu = videos.length > 0 ? videos.map(v => v.file_name+'$'+[sd.shareId, v.stoken, v.fid, v.share_fid_token].join('*')).join('#') : "已失效";
                        allLines.push({name: '夸克#'+counters.夸克++, url: pu});
                    }
                } catch(e) {}
            } else if (/\.baidu/.test(link)) {
                playPans.push(link);
                try {
                    let bd = await Baidu2.getShareData(link);
                    Object.keys(bd).forEach(it => {
                        let urls = bd[it].map(item => item.name+'$'+[item.path, item.uk, item.shareid, item.fsid].join('*')).join('#');
                        allLines.push({name: '百度#'+counters.百度++, url: urls});
                    });
                } catch(e) {}
            } else if (/\.alipan/.test(link)) {
                playPans.push(link);
                try {
                    let sd = await Ali.getShareData(link);
                    if (sd) {
                        let videos = await Ali.getFilesByShareUrl(sd);
                        let pu = videos.length > 0 ? videos.map(v => v.name+'$'+[v.share_id, v.file_id].join('*')).join('#') : "已失效";
                        allLines.push({name: '阿里#'+counters.阿里++, url: pu});
                    }
                } catch(e) {}
            }
        }
        return {
            vod_name: pdfh(html, 'h1&&Text') || '盘它资源',
            vod_play_from: allLines.map(l=>l.name).join('$$$'),
            vod_play_url: allLines.map(l=>l.url).join('$$$'),
            vod_play_pan: playPans.join('$$$')
        };
    },

    搜索: async function () {
        let {input, pdfa, pdfh, pd, KEY} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        data.forEach(it => {
            let title = pdfh(it, 'a&&title');
            if (KEY && title && !new RegExp(KEY,'i').test(title)) return;
            d.push({vod_id: pd(it, 'a&&href'), vod_name: title||'', vod_pic: pd(it, 'img&&data-src')||''});
        });
        return setResult(d);
    },

    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        let ids = input.split('*'); let urls = [];
        if (flag.startsWith('夸克')) {
            let down = (await Quark.getUrl(ids[0], ids[1], ids[2], ids[3])) || (await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true));
            down.forEach(t => {if(t.url) urls.push(t.name, t.url+'#isVideo=true##fastPlayMode##threads=20#');});
            return {parse:0, url:urls, header:{'Cookie':ENV.get('quark_cookie')}};
        } else if (flag.startsWith('百度')) {
            let url = await Baidu2.getAppShareUrl(ids[0], ids[1], ids[2], ids[3]);
            return {parse:0, url:['原画', url+'#isVideo=true##fastPlayMode##threads=10#']};
        } else if (flag.startsWith('阿里')) {
            let down = await Ali.getDownload(ids[0], ids[1]);
            return {parse:0, url:['原画', down.url+'#isVideo=true#']};
        }
    }
};
