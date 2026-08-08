/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离夸父4K[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离夸父4K[盘]',
    host: 'https://www.kfzys.net',
    url: '/forum.php?mod=forumdisplay&fid=fyclass&page=fypage',
    searchUrl: '/search.php?mod=forum&searchsubmit=yes&srchtxt=**&page=fypage',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': 'bbs_sid=p5mugcm9r147o1d3qpi0su1ucm; bbs_token=gDMAOehNUQetTJv9Lnet0J_2FGJmgdvnx90iTZqzU_2FnO0_3D'
    },
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    class_parse: async function () {
        return {class: [
            {type_id: '44', type_name: '4K电影'},
            {type_id: '45', type_name: '4K剧集'},
            {type_id: '46', type_name: '4K纪录片'},
            {type_id: '47', type_name: '4K动漫'},
            {type_id: '89', type_name: '夸克分享'}
        ]};
    },

    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.threadlist .thread-item');
        if (data.length === 0) data = pdfa(html, '.tl .thread');
        data.forEach(it => {
            let title = pdfh(it, 'a&&Text') || pdfh(it, '.thread-title&&Text');
            let url = pd(it, 'a&&href') || '';
            d.push({
                vod_id: url,
                vod_name: title || '',
                vod_pic: '',
                vod_remarks: '',
                type_name: '夸父'
            });
        });
        return setResult(d);
    },

    二级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let allLinks = new Set();
        // Extract all cloud drive links from post content
        let links = pdfa(html, 'a[href*="pan.quark"], a[href*="pan.baidu"], a[href*="drive.uc"], a[href*="189.cn"], a[href*="123pan"], a[href*="alipan"], a[href*="caiyun.139"]');
        links.forEach(a => {
            let href = pd(a, 'a&&href') || '';
            if (href) allLinks.add(href.trim());
        });
        // Also check plain text links
        let content = pdfh(html, '.post-content&&Text') || pdfh(html, '.pct&&Text') || '';
        let urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
        let matches = content.match(urlPattern) || [];
        matches.forEach(m => {
            if (/pan\.(quark|baidu)|drive\.uc|189\.cn|123pan|alipan|139\.com/i.test(m)) {
                allLinks.add(m);
            }
        });
        let allLines = [];
        let playPans = [];
        let counters = {夸克:1, 优汐:1, 百度:1};
        for (let link of allLinks) {
            if (/\.quark/.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await Quark.getShareData(link);
                    if (shareData) {
                        let videos = await Quark.getFilesByShareUrl(shareData);
                        let playUrl = videos.length > 0 ? videos.map(v => v.file_name+'$'+[shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid||'', v.subtitle?.share_fid_token||''].join('*')).join('#') : "资源已经失效";
                        allLines.push({name: '夸克#'+counters.夸克++, url: playUrl});
                    }
                } catch(e) {}
            } else if (/drive\.uc/i.test(link)) {
                playPans.push(link);
                try {
                    let shareData = await UC.getShareData(link);
                    if (shareData) {
                        let videos = await UC.getFilesByShareUrl(shareData);
                        let playUrl = videos.length > 0 ? videos.map(v => v.file_name+'$'+[shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.subtitle?.fid||'', v.subtitle?.share_fid_token||''].join('*')).join('#') : "资源已经失效";
                        allLines.push({name: '优汐#'+counters.优汐++, url: playUrl});
                    }
                } catch(e) {}
            } else if (/\.baidu/.test(link)) {
                playPans.push(link);
                try {
                    let baiduData = await Baidu2.getShareData(link);
                    Object.keys(baiduData).forEach((it, idx) => {
                        let urls = baiduData[it].map(item => item.name+'$'+[item.path, item.uk, item.shareid, item.fsid].join('*')).join('#');
                        allLines.push({name: '百度#'+counters.百度++, url: urls});
                    });
                } catch(e) {}
            }
        }
        let vod = {
            vod_name: pdfh(html, 'h1&&Text') || pdfh(html, '.title&&Text') || '夸父资源',
            vod_play_from: allLines.map(l=>l.name).join('$$$'),
            vod_play_url: allLines.map(l=>l.url).join('$$$'),
            vod_play_pan: playPans.join('$$$')
        };
        return vod;
    },

    搜索: async function () {
        let {input, pdfa, pdfh, pd, KEY} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.threadlist .thread-item');
        data.forEach(it => {
            let title = pdfh(it, 'a&&Text');
            let url = pd(it, 'a&&href') || '';
            if (title && url) d.push({vod_id: url, vod_name: title, vod_pic: '', vod_remarks: ''});
        });
        return setResult(d);
    },

    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        let ids = input.split('*');
        let urls = [];
        if (flag.startsWith('夸克')) {
            let down = (await Quark.getUrl(ids[0], ids[1], ids[2], ids[3])) || (await Quark.getDownload(ids[0], ids[1], ids[2], ids[3], true));
            down.forEach(t => {if(t.url) urls.push(t.name, t.url+'#isVideo=true##fastPlayMode##threads=20#');});
            let tc = (await Quark.getLiveTranscoding(ids[0], ids[1], ids[2], ids[3])).filter(t=>t.accessable);
            tc.forEach(t=>urls.push(t.resolution==='low'?'流畅':t.resolution==='high'?'高清':t.resolution==='super'?'超清':t.resolution, t.video_info.url+'#isVideo=true##fastPlayMode##threads=20#'));
            return {parse:0, url:urls, header:{'Cookie':ENV.get('quark_cookie')}};
        } else if ((flag.startsWith('UC') || flag.startsWith('优汐'))) {
            let down = await UC.getDownload(ids[0], ids[1], ids[2], ids[3], true);
            return await UC.getLazyResult(down, mediaProxyUrl);
        } else if (flag.startsWith('百度')) {
            let url = await Baidu2.getAppShareUrl(ids[0], ids[1], ids[2], ids[3]);
            urls.push('原画', url+'#isVideo=true##fastPlayMode##threads=10#');
            return {parse:0, url:urls, header:{'User-Agent':'netdisk;P2SP;2.2.91.136;android-android;'}};
        }
    }
};
