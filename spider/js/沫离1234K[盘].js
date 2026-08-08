/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离1234K[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离1234K[盘]',
    host: 'https://pan1.me',
    url: '/index.php/vod/show/id/fyclass.html',
    searchUrl: '/index.php/vod/search/page/fypage/wd/**.html',
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 30000,
    quickSearch: 0,

    class_parse: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let classes = [];
        let navItems = pdfa(html, '.nav-menu-items li');
        if (navItems.length === 0) navItems = pdfa(html, '.stui-header__menu li');
        navItems.forEach(item => {
            let href = pd(item, 'a&&href') || '';
            let text = pdfh(item, 'a&&Text') || '';
            let match = href.match(/\/id\/(\d+)/);
            if (match && text) classes.push({type_id: match[1], type_name: text.trim()});
        });
        if (classes.length === 0) {
            classes = [{type_id:'1',type_name:'电影'},{type_id:'2',type_name:'剧集'}];
        }
        return {class: classes};
    },

    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        data.forEach(it => {
            d.push({vod_id: pd(it, 'a&&href'), vod_name: pdfh(it, 'a&&title')||'', vod_pic: pd(it, 'img&&data-src')||''});
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
        let allLines = []; let playPans = [];
        for (let link of allLinks) {
            if (/\.123/.test(link)) {
                playPans.push(link);
                try {
                    let sd = await Pan.getShareData(link);
                    let videos = await Pan.getFilesByShareUrl(sd);
                    Object.keys(videos).forEach(it => {
                        let urls = videos[it].map(v => v.FileName+'$'+[v.ShareKey, v.FileId, v.S3KeyFlag, v.Size, v.Etag].join('*')).join('#');
                        allLines.push({name: '123-'+it, url: urls});
                    });
                } catch(e) {}
            }
        }
        return {
            vod_name: pdfh(html, 'h1&&Text') || '123资源',
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
        let {input} = this;
        let ids = input.split('*');
        let url = await Pan.getDownload(ids[0], ids[1], ids[2], ids[3], ids[4]);
        return {parse:0, url:['原画', url]};
    }
};
