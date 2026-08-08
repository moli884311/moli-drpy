/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离UC网盘[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离UC网盘[盘]',
    host: 'https://drive.uc.cn',
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    推荐: async function () {
        let cookie = ENV.get('uc_cookie');
        if (!cookie) return setResult([]);
        try {
            let shareData = {shareId: '0', stoken: '', fid: '0', share_fid_token: ''};
            let files = await UC.getFilesByShareUrl(shareData);
            let d = [];
            files.forEach(f => {
                d.push({
                    vod_id: f.fid,
                    vod_name: f.file_name,
                    vod_pic: '',
                    vod_remarks: f.dir ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                    type_name: 'UC网盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    一级: async function () {
        let {input} = this;
        let cookie = ENV.get('uc_cookie');
        if (!cookie) return setResult([]);
        try {
            let shareData = {shareId: '0', stoken: '', fid: input || '0', share_fid_token: ''};
            let files = await UC.getFilesByShareUrl(shareData);
            let d = [];
            files.forEach(f => {
                d.push({
                    vod_id: f.fid,
                    vod_name: f.file_name,
                    vod_pic: '',
                    vod_remarks: f.dir ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                    type_name: 'UC网盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    二级: async function (ids) {
        let {input} = this;
        let fid = (input || ids || '').split('*')[0];
        return {
            vod_name: 'UC文件',
            vod_pic: '',
            vod_play_from: 'UC',
            vod_play_url: fid
        };
    },
    lazy: async function (flag, id, flags) {
        let {input, mediaProxyUrl} = this;
        let down = await UC.downloadDirect(input);
        return await UC.getLazyResult(down, mediaProxyUrl);
    }
};
