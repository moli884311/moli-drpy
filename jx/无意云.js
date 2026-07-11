const jx = {
    type: 1,
    url: 'https://qsy.wya6.cn/parse.php?url=',
    header: {
        'User-Agent': 'Mozilla/5.0',
        'X-Forwarded-For': '223.104.161.39'
    },
    ext: {
        flag: ['qiyi', 'imgo', '爱奇艺', '奇艺', 'qq', '腾讯', 'youku', '优酷', 'pptv', 'PPTV', 'letv', '乐视', 'leshi', 'mgtv', '芒果', 'sohu', 'xigua', 'fun', '风行']
    }
};

async function lazy(input, params) {
    const url = jx.url + input;
    log('无意云: ' + url);
    let resp = await request(url, {
        headers: jx.header,
        timeout: 8000
    });
    let result = pjfh(resp, '$..url');
    if (result && result.startsWith('http') && result.length > 30) {
        return result;
    }
    return input;
}
