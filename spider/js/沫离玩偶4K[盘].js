/*
@header({
  searchable: 1,
  filterable: 1,
  quickSearch: 0,
  title: '沫离玩偶4K[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离玩偶4K[盘]',
    host: 'https://woog.nxog.eu.org',
    url: '/vodshow/fyclass-fyfilter.html',
    filter_url: '{{fl.area}}-{{fl.by or fl.time}}-{{fl.class}}-----fypage---{{fl.year}}',
    searchUrl: '/vodsearch/**--------fypage---.html',
    filter: 'H4sIAAAAAAAAA+2aa09aSRjHv8t57SYepbb1Xe/3+71NX7AN2W3Wuom6m5jGxIoXwAtoXJGC1bag2IjgZa3CAl+GmXP4Fo3McxnaakiWmnUz7/j/njMz55kz55l/hvPasq3OZ6+t33z9Vqf1osvb22u1WN3eVz6r0xLBFekfsVqsP71df/hq13Xv45F01Z/moNVpWQMtEJtLiOAKUBAYcwIb3AIExuSbiBycgxgI6jOUrhQT2KcS1OfKtNgrYJ9KUDv9DkHQeIH5Sj6I4ymBMTezLCY+QQwEjRfKOkWMgaDxwkn3I42nBMVSY3yfIOheMsuV0hLeixLUbnSmGlvFdkpQu3efZGAe2ynRyHzKoTVnbhpjSlDMH5JDbzGmBOVeCIuRXcxdCYxVF2bkfApiIKjPuTE3mMc+laD8SuvO7N+iuIEpkqYrpkZFeBPDSgw834+qNevt8Xm1JZvIiYn8QUuWgvqSrexmRLwokivV2CjE6lD9ddXlmNzN1l0H6Kv+wjm5V6rvTyGaztKUiBdxOpWgJZgqO+GME4zhKiRNk7r1F7cGQa3HNzgGgtpFUzKxhu2UoIe4uMrtQPB4OX28nB4Tpc8cA0GxyZzIL2NMCepzOCySKyKA65s1v/pLcrwsklRRSNMVIzuVAi50EPry6PJ2/8LLw81m3PTgAcuDg3UVLV50sxkcQAltojkGgh7vZpJjILSHwDEQ2kPgGAg9oX6ft4cTktGdanT7gIQ4qCfU1tp2Aljtp8Y9zD06b2fervM25m06t5nbOm9l3qpx+zRx+7TOTzE/pfOTzE/qvIN5h845X1vP1+Z8bT1fm/O19XxtztfW87U5X1vP1+Z87db6Venr6/Npj1FkojI7+e1jrGG5mJLB0teP8QyAM0TOAjlL5ByQc0TOAzlP5AKQC0QuArlI5BKQS0QuA7lM5AqQK0SuArlK5BqQa0SuA7lO5AaQG0RuArlJ5BaQW0RuA7lN5A6QO0TuArlL5B6Qe0TuA7lP5AGQB0QeAnlI5BGQR0QeA3lM5AmQJ0SeAnlKpPUnfBP2f+kL5ud+7Z2fmhH58DeLRb3tHLQ6rb6Xr3y8L+XzMjdbF//1ZV8vF7PssAiM1sV7X/ze49u/j+ctVpvxicYnGp9ofKLxicYnGp9ofKLxicYnfscntjfVJ0r/iBxeJJ9RE414Osefcd9jjQZBfU6lnQhu4SAoFnnnrJHnUaIRj+VGFtwp9IkgqM+l9yJOVVyJRjyrTOQ136YEjVeOiFAax1OiEc8qctNiD0s9CD2W2tJiqS2ez2Sp8g/6PRDsvBZFIE7OqyZ4MW2KTATtjRLUZzwkY2izQPC8bIhylOalJhrdyo/M6R3mkQ51bYf4rh/n6IwDMg7IOCDjgIwD+sEOyKM5oCM+dfh3pwlHdlZgdh2z65hdx+w6Ztdp3q5zQtt1TFE9sqJqioYpGse3aHQ09bDOmf1c/YCHZyCooqS2OAaC3n5/UewO4duvBPeZEOtL1GdNUJ9725XCR+xTCWq3WnZ3QthOCWp3yB+wlfwmZwaCczj4z1k3MiHWF7AqKkH5jU06s3iICYL6PORQsTo46n6gqqgEjReLyDfjOJ4S1C64zfcCgsZLTlYKYzieEpR7eb1SwIMnEMar/6e8utluzHZzfLcbj6e5+435UOi7e5H5UMh8KGQ+FDIfCv1fTRBzc2BpzKAxg8fUDHaYE0tTVU1VNVXVVNVmVdWBLyuBjHHQPQAA',
    cate_exclude: '网址|专题|全部影片',
    line_order: ['百度', '优汐', '夸克', '天翼', '123', '移动', '阿里'],
    play_parse: true,
    search_match: true,
    searchable: 1,
    filterable: 1,
    timeout: 30000,
    quickSearch: 1,
    class_parse: async () => {
        let classes = [{type_id:'1',type_name:'玩偶电影'},{type_id:'2',type_name:'玩偶剧集'},{type_id:'44',type_name:'臻彩视界'},{type_id:'6',type_name:'玩偶短剧'},{type_id:'3',type_name:'玩偶动漫'},{type_id:'4',type_name:'玩偶综艺'},{type_id:'5',type_name:'玩偶音乐'}];
        return {class: classes};
    },
    预处理: async () => {return []},
    推荐: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        data.forEach(it => {
            d.push({title: pdfh(it, 'a&&title'), img: pd(it, 'img&&data-src'), desc: pdfh(it, '.module-item-text&&Text'), url: pd(it, 'a&&href')});
        });
        return setResult(d);
    },
    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-item');
        data.forEach(it => {
            d.push({title: pdfh(it, 'a&&title'), img: pd(it, 'img&&data-src'), desc: pdfh(it, '.module-item-text&&Text'), url: pd(it, 'a&&href')});
        });
        return setResult(d);
    },
    二级: async function (ids) {
    try {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let data = pdfa(html, '.module-row-title');
        let vod = {
            vod_name: pdfh(html, '.video-info&&h1&&Text') || '',
            type_name: pdfh(html, '.tag-link&&Text') || '',
            vod_pic: pd(html, '.lazyload&&data-original||data-src||src') || '',
            vod_content: pdfh(html, '.sqjj_a--span&&Text') || '',
            vod_remarks: pdfh(html, '.video-info-items:eq(3)&&Text') || '',
            vod_year: pdfh(html, '.tag-link:eq(2)&&Text') || '',
            vod_area: pdfh(html, '.tag-link:eq(3)&&Text') || ''
        };
        let playPans = [];
        let counters = {夸克:1, 优汐:1, 百度:1, 天翼:1, '123':1, 移动:1, 阿里:1};
        let allLines = [];
        let allLinks = new Set();
        for (let item of data) {
            let link = pd(item, 'p&&Text');
            if (link) allLinks.add(link.trim());
        }
        let baiduLinks = Array.from(allLinks).filter(l => /pan\.baidu\.com/.test(l));
        let baiduLinkCount = baiduLinks.length;
        for (let link of allLinks) {
            if (/\.quark/.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await Quark.getShareData(link);
                    if (shareData) {
                        let videos = await Quark.getFilesByShareUrl(shareData);
                        let playUrl = videos.length > 0 ? videos.map(v => v.file_name+'$'+[shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid||'', v.subtitle?.share_fid_token||''].join('*')).join('#') : "资源已经失效";
                        allLines.push({name: '夸克#'+counters.夸克++, url: playUrl, type: '夸克'});
                    }
                } catch(e) {}
            } else if (/\.uc/i.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await UC.getShareData(link);
                    if (shareData) {
                        let videos = await UC.getFilesByShareUrl(shareData);
                        let playUrl = videos.length > 0 ? videos.map(v => v.file_name+'$'+[shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid||'', v.subtitle?.share_fid_token||''].join('*')).join('#') : "资源已经失效";
                        allLines.push({name: '优汐#'+counters.优汐++, url: playUrl, type: '优汐'});
                    }
                } catch(e) {}
            } else if (/\.189/.test(link)) {
                playPans.push(link);
                try {
                    let cloudData = await Cloud.getShareData(link);
                    Object.keys(cloudData).forEach(it => {
                        let urls = cloudData[it].map(item => item.name+'$'+[item.fileId, item.shareId].join('*')).join('#');
                        allLines.push({name: '天翼-'+it, url: urls, type: '天翼'});
                    });
                } catch(e) {}
            } else if (/\.139/.test(link)) {
                playPans.push(link);
                try {
                    let yunData = await Yun.getShareData(link);
                    Object.keys(yunData).forEach(it => {
                        let urls = yunData[it].map(item => item.name+'$'+[item.contentId, item.linkID].join('*')).join('#');
                        allLines.push({name: '移动-'+it, url: urls, type: '移动'});
                    });
                } catch(e) {}
            } else if (/\.123/.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await Pan.getShareData(link);
                    let videos = await Pan.getFilesByShareUrl(shareData);
                    Object.keys(videos).forEach(it => {
                        let urls = videos[it].map(v => v.FileName+'$'+[v.ShareKey, v.FileId, v.S3KeyFlag, v.Size, v.Etag].join('*')).join('#');
                        allLines.push({name: '123-'+it, url: urls, type: '123'});
                    });
                } catch(e) {}
            } else if (/\.baidu/.test(link)) {
                playPans.push(link);
                try {
                    let baiduData = await Baidu2.getShareData(link);
                    Object.keys(baiduData).forEach((it, idx) => {
                        let lineName = baiduLinkCount === 1 ? '百度#1' : '百度-'+it.split('/').pop();
                        let urls = baiduData[it].map(item => item.name+'$'+[item.path, item.uk, item.shareid, item.fsid].join('*')).join('#');
                        allLines.push({name: lineName, url: urls, type: '百度'});
                    });
                } catch(e) {}
            } else if (/\.alipan/.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await Ali.getShareData(link);
                    if (shareData) {
                        let videos = await Ali.getFilesByShareUrl(shareData);
                        let playUrl = videos.length > 0 ? videos.map(v => v.name+'$'+[v.share_id, v.file_id, v.subtitle?v.subtitle.file_id:''].join('*')).join('#') : "资源已经失效";
                        allLines.push({name: '阿里#'+counters.阿里++, url: playUrl, type: '阿里'});
                    }
                } catch(e) {}
            }
        }
        allLines.sort((a,b) => {
            let ai = rule.line_order.indexOf(a.type), bi = rule.line_order.indexOf(b.type);
            return (ai===-1?99:ai) - (bi===-1?99:bi);
        });
        vod.vod_play_from = allLines.map(l=>l.name).join('$$$');
        vod.vod_play_url = allLines.map(l=>l.url).join('$$$');
        vod.vod_play_pan = playPans.join('$$$');
        return vod;
    } catch(e) {
        return {vod_name: '加载失败', vod_play_from: '错误', vod_play_url: e.message};
    }
    },
    搜索: async function () {
        let {input, pdfa, pdfh, pd, KEY} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.module-items .module-search-item');
        data.forEach(it => {
            let title = pdfh(it, '.video-info&&a&&title');
            if (rule.search_match && KEY) {if(!title||!new RegExp(KEY,'i').test(title)) return;}
            d.push({title: title, img: pd(it, 'img&&data-src'), desc: pdfh(it, '.module-item-text&&Text'), url: pd(it, '.video-info&&a&&href')});
        });
        return setResult(d);
    },
    lazy: async function (flag, id, flags) {
    let {input, mediaProxyUrl} = this;
    let ids = input.split('*');
    let urls = [];
    if (flag.startsWith('夸克')) {
        let down = (await Quark.getUrl(ids[0], ids[1], ids[2], ids[3])) || (await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true));
        down.forEach(t => {if(t.url!==undefined){urls.push(t.name, t.url+'#isVideo=true##fastPlayMode##threads=20#');urls.push('猫'+t.name, 'http://127.0.0.1:5575/proxy?thread='+(ENV.get('thread')||6)+'&chunkSize=1024&url='+encodeURIComponent(t.url));}});
        let tc = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter(t=>t.accessable);
        tc.forEach(t=>urls.push(t.resolution==='low'?'流畅':t.resolution==='high'?'高清':t.resolution==='super'?'超清':t.resolution, t.video_info.url+'#isVideo=true##fastPlayMode##threads=20#'));
        return {parse:0, url:urls, header:{'Cookie':ENV.get('quark_cookie')}};
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
        return {parse:0, url: ['原画', url]};
    } else if (flag.startsWith('阿里')) {
        let tc = {UHD:'4K 超清', QHD:'2K 超清', FHD:'1080 全高清', HD:'720 高清', SD:'540 标清', LD:'360 流畅'};
        let down = await Ali.getDownload(ids[0], ids[1]);
        urls.push('原画', down.url+'#isVideo=true##ignoreMusic=true#');
        urls.push('极速原画', down.url+'#fastPlayMode##threads=10#');
        let tr = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a,b)=>b.template_width-a.template_width);
        tr.forEach(t=>{if(t.url) urls.push(tc[t.template_id], t.url)});
        return {parse:0, url:urls, header:{'User-Agent':'Mozilla/5.0','Referer':'https://www.aliyundrive.com/'}};
    } else if (flag.startsWith('百度')) {
        let url = await Baidu2.getAppShareUrl(ids[0], ids[1], ids[2], ids[3]);
        urls.push('原画', url+'#isVideo=true##fastPlayMode##threads=10#');
        urls.push('原代本', 'http://127.0.0.1:7777/?thread='+(ENV.get('thread')||6)+'&form=urlcode&randUa=1&url='+encodeURIComponent(url));
        return {parse:0, url:urls, header:{'User-Agent':'netdisk;P2SP;2.2.91.136;android-android;'}};
    }
    }
};
