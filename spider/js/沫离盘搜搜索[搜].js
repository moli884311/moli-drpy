/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离盘搜搜索[搜]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离盘搜搜索[搜]',
    host: '',
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    搜索: async function () {
        let {KEY} = this;
        if (!KEY) return setResult([]);
        let allResults = [];
        let seen = new Set();
        let sources = [
            {name: '玩偶', host: 'https://woog.nxog.eu.org', searchUrl: '/vodsearch/**--------fypage---.html'},
            {name: '多多', host: 'https://tv.yydsys.top', searchUrl: '/index.php/vod/search/page/fypage/wd/**.html'},
            {name: '二小', host: 'https://www.2xiaopan.top', searchUrl: '/index.php/vod/search/page/fypage/wd/**.html'},
            {name: '虎斑', host: 'http://xhban.xyz:20720', searchUrl: '/index.php/vod/search/page/fypage/wd/**.html'},
        ];
        try {
            let results = await Promise.all(sources.map(async (s) => {
                try {
                    let url = s.host + s.searchUrl.replace('**', encodeURIComponent(KEY)).replace('fypage', '1');
                    let html = await request(url, {timeout: 15000, headers: {'User-Agent': 'Mozilla/5.0'}});
                    let items = pdfa(html, '.module-items .module-item');
                    if (items.length === 0) items = pdfa(html, '.module-items .module-search-item');
                    let d = [];
                    items.forEach(it => {
                        let title = pdfh(it, 'a&&title') || pdfh(it, '.title&&Text');
                        let vodId = pd(it, 'a&&href') || '';
                        let img = pd(it, 'img&&data-src||data-original||src') || '';
                        if (title && vodId) {
                            let key = s.name + ':' + title.trim();
                            if (!seen.has(key)) {
                                if (vodId.startsWith('/')) vodId = s.host + vodId;
                                d.push({vod_name: '['+s.name+'] '+title, vod_pic: img, vod_remarks: '盘搜'});
                                seen.add(key);
                            }
                        }
                    });
                    return d;
                } catch(e) {return [];}
            }));
            results.forEach(r => allResults = allResults.concat(r));
        } catch(e) {}
        return setResult(allResults.slice(0, 50));
    }
};
