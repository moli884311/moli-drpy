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
};
