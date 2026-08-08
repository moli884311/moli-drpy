/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离阿里云盘[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离阿里云盘[盘]',
    host: 'https://www.aliyundrive.com',
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    推荐: async function () {
        let token = ENV.get('ali_token');
        if (!token) return {class: [], list: []};
        try {
            let shareData = await Ali.getShareData(null);
            let files = await Ali.getFilesByShareUrl({share_id: 'root', file_id: 'root'});
            let d = [];
            files.forEach(f => {
                if (f.type === 'folder' || /\.(mp4|mkv|avi|mov|flv|ts|m3u8)/i.test(f.name)) {
                    d.push({
                        vod_id: f.file_id + '|' + (f.share_id || 'root'),
                        vod_name: f.name,
                        vod_pic: f.thumbnail || '',
                        vod_remarks: f.type === 'folder' ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                        type_name: '阿里云盘'
                    });
                }
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    一级: async function () {
        let {input, pdfa, pdfh, pd} = this;
        let token = ENV.get('ali_token');
        if (!token) return setResult([]);
        let [file_id, share_id] = (input || 'root|root').split('|');
        try {
            let files = await Ali.getFilesByShareUrl({share_id: share_id || 'root', file_id: file_id || 'root'});
            let d = [];
            files.forEach(f => {
                d.push({
                    vod_id: f.file_id + '|' + (f.share_id || share_id || 'root'),
                    vod_name: f.name,
                    vod_pic: f.thumbnail || '',
                    vod_remarks: f.type === 'folder' ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                    type_name: '阿里云盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    二级: async function (ids) {
        let {input} = this;
        let [file_id, share_id] = (input || ids || 'root|root').split('|');
        return {
            vod_name: '阿里文件',
            vod_pic: '',
            vod_play_from: '阿里',
            vod_play_url: share_id + '*' + file_id
        };
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        let ids = input.split('*');
        let down = await Ali.getDownload(ids[0], ids[1]);
        let urls = [];
        urls.push('原画', down.url + '#isVideo=true##ignoreMusic=true#');
        urls.push('极速原画', down.url + '#fastPlayMode##threads=10#');
        let tr = (await Ali.getLiveTranscoding(ids[0], ids[1])).sort((a, b) => b.template_width - a.template_width);
        let tc = {UHD: '4K 超清', QHD: '2K 超清', FHD: '1080 全高清', HD: '720 高清', SD: '540 标清', LD: '360 流畅'};
        tr.forEach(t => { if (t.url) urls.push(tc[t.template_id], t.url); });
        return {parse: 0, url: urls, header: {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.aliyundrive.com/'}};
    }
};
