const jx = {
    type: 3,
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
    log('JSON合集: 并发解析器数量=' + jxDict.length);
    let results = [];
    let done = false;
    const MAX_RESULTS = 5;

    const tasks = jxDict.map(jxObj => ({
        func: async function ({jxObj}) {
            if (done) return;
            try {
                let resp = await request(jxObj.url + input, {
                    headers: jxObj.header || {'User-Agent': MOBILE_UA},
                    timeout: 5000
                });
                let url = pjfh(resp, '$..url');
                if (url && url.startsWith('http')) {
                    return {name: jxObj.name, url: url};
                }
            } catch (e) {}
            throw new Error(jxObj.name + ' failed');
        },
        param: {jxObj}
    }));

    await batchExecute(tasks, {
        func: function (param, id, error, result) {
            if (result && !done) {
                results.push(result);
                if (results.length >= MAX_RESULTS) done = true;
            }
            if (done) return 'break';
        },
        param: {}
    }, 2);

    if (results.length > 0) {
        return results;
    }
    return input;
}
