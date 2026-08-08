/*
@header({
  searchable: 1,
  filterable: 0,
  quickSearch: 0,
  title: '沫离百度网盘[盘]',
  lang: 'ds'
})
*/

var rule = {
    title: '沫离百度网盘[盘]',
    host: 'https://pan.baidu.com',
    play_parse: true,
    searchable: 1,
    filterable: 0,
    timeout: 60000,
    quickSearch: 0,

    推荐: async function () {
        let cookie = ENV.get('baidu_cookie');
        if (!cookie) return setResult([]);
        try {
            let shareData = await Baidu2.getShareData('https://pan.baidu.com/disk/main');
            let d = [];
            Object.keys(shareData).forEach(path => {
                d.push({
                    vod_id: shareData[path][0] ? shareData[path][0].path : path,
                    vod_name: path.split('/').pop() || '百度网盘',
                    vod_pic: '',
                    vod_remarks: '文件夹',
                    type_name: '百度网盘'
                });
            });
            return setResult(d);
        } catch(e) {return setResult([]);}
    },
    lazy: async function (flag, id, flags) {
        let {input} = this;
        let ids = input.split('*');
        let url = await Baidu2.getAppShareUrl(ids[0], ids[1], ids[2], ids[3]);
        let urls = ['原画', url+'#isVideo=true##fastPlayMode##threads=10#'];
        return {parse: 0, url: urls, header: {'User-Agent': 'netdisk;P2SP;2.2.91.136;android-android;'}};
    }
};
