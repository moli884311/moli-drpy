const jx = {
    type: 2,
    ext: {
        flag: ['qiyi', 'imgo', '爱奇艺', '奇艺', 'qq', '腾讯', 'youku', '优酷', 'pptv', 'PPTV', 'letv', '乐视', 'leshi', 'mgtv', '芒果', 'sohu', 'xigua', 'fun', '风行']
    }
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function lazy(input, params) {
    let jxDict = getParsesDict(requestHost);
    jxDict = jxDict.filter(it => it.type === 1);
    jxDict = shuffle(jxDict);
    log('JSON并发: 待竞速的解析器数量=' + jxDict.length);
    let done = false;

    const tasks = jxDict.map(jxObj => ({
        func: async function ({jxObj}) {
            if (done) return;
            try {
                let resp = await request(jxObj.url + input, {
                    headers: jxObj.header || {'User-Agent': MOBILE_UA},
                    timeout: 5000
                });
                let url = pjfh(resp, '$..url');
                if (url && url.startsWith('http') && url.length > 30) {
                    return url;
                }
            } catch (e) {}
            throw new Error(jxObj.name + ' failed');
        },
        param: {jxObj}
    }));

    let winner = null;
    await batchExecute(tasks, {
        func: function (param, id, error, result) {
            if (result && !done) {
                winner = result;
                done = true;
            }
            if (winner) return 'break';
        },
        param: {}
    }, 10);

    return winner || input;
}
