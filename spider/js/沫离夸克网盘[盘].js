/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离夸克网盘[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离夸克网盘[盘]',
    host: 'https://pan.quark.cn',
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    推荐: async function () {
        let cookie = ENV.get('quark_cookie');
        if (!cookie) return setResult([]);
        try {
            let shareData = {shareId: '0', stoken: '', fid: '0', share_fid_token: ''};
            let files = await Quark.getFilesByShareUrl(shareData);
            let d = [];
            files.forEach(f => {
                d.push({
                    vod_id: f.fid,
                    vod_name: f.file_name,
                    vod_pic: '',
                    vod_remarks: f.dir ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                    type_name: '夸克网盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    一级: async function () {
        let {input} = this;
        let cookie = ENV.get('quark_cookie');
        if (!cookie) return setResult([]);
        try {
            let shareData = {shareId: '0', stoken: '', fid: input || '0', share_fid_token: ''};
            let files = await Quark.getFilesByShareUrl(shareData);
            let d = [];
            files.forEach(f => {
                d.push({
                    vod_id: f.fid,
                    vod_name: f.file_name,
                    vod_pic: '',
                    vod_remarks: f.dir ? '文件夹' : f.size ? (f.size / 1073741824).toFixed(2) + 'GB' : '',
                    type_name: '夸克网盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        let down = await Quark.downloadDirect(input);
        let urls = [];
        if (down) down.forEach(t => {if(t.url) urls.push(t.name, t.url+'#isVideo=true##fastPlayMode##threads=20#');});
        return {parse: 0, url: urls, header: {'Cookie': ENV.get('quark_cookie')}};
    }
};
