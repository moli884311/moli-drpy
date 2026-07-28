// 聚指[沫离] - CatVod Source for moli-drpy
// API: http://103.45.131.38:50001
// Encryption: AES-ECB (request) / AES-ECB+Base64 (response) + RSA sign

import crypto from 'crypto';
const BASE_URL = 'http://103.45.131.38:50001';

let AES_KEY = 'OC1A06E197EF10CF3F6058CA7A803B5E';
let RSA_PUB_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr8SzZhjYy+rsya1K09t8d2K50pWFoBkgUqMpKOiW+3IEVKd4eTdvg9RSOjQ82kypL6R9BnsmrS1V8s4PVDwjQbUtYhTPPC9Hz16qY7rpD6m0d2vr09/UpWQ5uOy9PR0QTrsioveZ+DIe9jc3C+zBCu/kZSY/R8stwJoiitki3gwIDAQAB';
let DEVICE_ID = '';
let APP_VERSION = '3.0.2.2';
let PKG = 'com.lxf.snzlcgtzxyx';

async function init(cfg) {
    let ext = cfg || {};
    if (typeof ext === 'string') {
        try { ext = JSON.parse(ext); } catch(e) { ext = {}; }
    }
    if (ext.keys) {
        let parts = String(ext.keys).split(',');
        if (parts.length >= 2) AES_KEY = parts[1] || AES_KEY;
    }
    if (ext.pub) RSA_PUB_KEY = ext.pub;
    if (ext.pkg) PKG = ext.pkg;
    DEVICE_ID = crypto.randomBytes(8).toString('hex').toUpperCase();
    return '';
}

function rsaEncrypt(plain) {
    let pubKey = crypto.createPublicKey({
        key: Buffer.from(RSA_PUB_KEY, 'base64'),
        format: 'der',
        type: 'spki'
    });
    return crypto.publicEncrypt({
        key: pubKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(plain, 'utf-8')).toString('base64');
}

function aesEncrypt(data) {
    let key = Buffer.from(AES_KEY, 'utf-8');
    if (key.length > 32) key = key.subarray(0, 32);
    
    let cipher = crypto.createCipheriv('aes-256-ecb', key, null);
    cipher.setAutoPadding(true);
    let encrypted = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
    return encrypted.toString('hex');
}

function aesDecrypt(encryptedBase64) {
    if (!encryptedBase64) return null;
    let key = Buffer.from(AES_KEY, 'utf-8');
    if (key.length > 32) key = key.subarray(0, 32);
    
    let decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
    decipher.setAutoPadding(true);
    let decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedBase64, 'base64')),
        decipher.final()
    ]);
    return decrypted.toString('utf-8');
}

function buildDeviceInfo() {
    return {
        appVersion: APP_VERSION,
        deviceId: DEVICE_ID,
        system: 'Android',
        model: 'Pixel 4',
        brand: 'Google',
        sdk: '29',
        pkg: PKG,
        uuid: crypto.randomBytes(16).toString('hex').toUpperCase(),
        abi: 'arm64-v8a',
        screen: '1080x1920',
        dpi: '420'
    };
}

function generatePublicParams(deviceInfo) {
    if (!deviceInfo) deviceInfo = buildDeviceInfo();
    let timestamp = Date.now();
    let randomStr = crypto.randomBytes(8).toString('hex');
    let deviceId = deviceInfo.deviceId || DEVICE_ID;
    
    let signPlain = timestamp + randomStr + deviceId;
    let sign = rsaEncrypt(signPlain);
    
    let finalJson = Object.assign({}, deviceInfo, {
        sign: sign,
        timestamp: timestamp,
        randomStr: randomStr
    });
    
    let jsonStr = JSON.stringify(finalJson);
    let paramsData = aesEncrypt(jsonStr);
    return JSON.stringify({ paramsData: paramsData });
}

async function request(path, query) {
    let url = BASE_URL + path;
    if (query) {
        let params = new URLSearchParams();
        for (let k in query) params.append(k, query[k]);
        url += '?' + params.toString();
    }
    
    let publicParams = generatePublicParams();
    console.log('[聚指] request:', path, 'publicParams length:', publicParams.length);
    
    let headers = {
        'Accept': 'application/json',
        'User-Agent': 'okhttp/3.12.1',
        'Content-Type': 'application/json; charset=utf-8',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'publicParams': publicParams
    };
    
    let resp = await req(url, { headers: headers });
    if (!resp || !resp.content) {
        console.error('[聚指] request failed: no response for', path);
        return null;
    }
    
    console.log('[聚指] response length:', resp.content.length);
    
    try {
        let json = JSON.parse(resp.content);
        if (json.data && typeof json.data === 'string' && json.data.length > 100) {
            let decrypted = aesDecrypt(json.data);
            if (decrypted) {
                console.log('[聚指] decrypted data length:', decrypted.length);
                try { json.data = JSON.parse(decrypted); } catch(e) {}
            }
        }
        return json;
    } catch(e) {
        console.error('[聚指] JSON parse error:', e.message, 'raw:', resp.content.substring(0, 200));
        return resp.content;
    }
}

async function home(filter) {
    return {
        class: [
            { type_id: '1', type_name: '电影' },
            { type_id: '2', type_name: '电视剧' },
            { type_id: '3', type_name: '综艺' },
            { type_id: '4', type_name: '动漫' },
            { type_id: '5', type_name: '短剧' }
        ],
        filters: {}
    };
}

async function homeVod() {
    try {
        let resp = await request('/api/v3/drama/recommend');
        if (!resp || !resp.data) return { list: [] };
        
        let list = (Array.isArray(resp.data) ? resp.data : (resp.data.list || [])).map(item => ({
            vod_id: String(item.id || item.dramaId || ''),
            vod_name: item.title || item.name || '',
            vod_pic: item.cover || item.image || '',
            vod_remarks: item.score || item.remark || ''
        }));
        return { list: list };
    } catch(e) {
        return { list: [] };
    }
}

async function category(tid, pg, filter, extend) {
    try {
        pg = pg || 1;
        console.log('[聚指] category:', tid, pg);
        let resp = await request('/api/v3/drama/list', {
            categoryId: tid,
            page: pg,
            pageSize: 20,
            orderBy: 'updateTime'
        });
        
        if (!resp || !resp.data) return { list: [], page: pg, pagecount: 1, total: 0 };
        
        let data = resp.data;
        let list = (data.list || data.records || []).map(item => ({
            vod_id: String(item.id || item.dramaId || ''),
            vod_name: item.title || item.name || '',
            vod_pic: item.cover || item.image || '',
            vod_remarks: item.score || item.remark || ''
        }));
        
        return {
            list: list,
            page: pg,
            pagecount: Math.ceil((data.total || list.length) / 20) || 1,
            total: data.total || list.length
        };
    } catch(e) {
        console.error('[聚指] category error:', e.message, e.stack);
        return { list: [], page: pg, pagecount: 1, total: 0 };
    }
}

async function detail(id) {
    try {
        let resp = await request('/api/v3/drama/detail', { dramaId: id });
        if (!resp || !resp.data) return { list: [] };
        
        let d = resp.data;
        let vod = {
            vod_id: String(id),
            vod_name: d.title || d.name || '',
            vod_pic: d.cover || d.image || '',
            vod_remarks: d.score || d.remark || '',
            vod_year: d.year || '',
            vod_area: d.area || '',
            vod_actor: d.actor || d.actors || '',
            vod_director: d.director || '',
            vod_content: d.description || d.desc || ''
        };
        
        if (d.episodes && d.episodes.length > 0) {
            let playlist = {};
            d.episodes.forEach(ep => {
                let sourceName = ep.source || '默认';
                if (!playlist[sourceName]) playlist[sourceName] = [];
                playlist[sourceName].push(ep.title + '$' + ep.id);
            });
            vod.vod_play_from = Object.keys(playlist).join('$$$');
            vod.vod_play_url = Object.values(playlist).map(arr => arr.join('#')).join('$$$');
        }
        
        return { list: [vod] };
    } catch(e) {
        return { list: [] };
    }
}

async function search(wd, quick, pg) {
    try {
        pg = pg || 1;
        let resp = await request('/api/v3/drama/search', {
            keyword: wd,
            page: pg,
            pageSize: 20
        });
        
        if (!resp || !resp.data) return { list: [], page: pg, pagecount: 1, total: 0 };
        
        let data = resp.data;
        let list = (data.list || data.records || []).map(item => ({
            vod_id: String(item.id || item.dramaId || ''),
            vod_name: item.title || item.name || '',
            vod_pic: item.cover || item.image || '',
            vod_remarks: item.score || item.remark || ''
        }));
        
        return {
            list: list,
            page: pg,
            pagecount: Math.ceil((data.total || list.length) / 20) || 1,
            total: data.total || list.length
        };
    } catch(e) {
        return { list: [], page: pg, pagecount: 1, total: 0 };
    }
}

async function play(flag, id, flags) {
    try {
        let resp = await request('/api/v3/drama/play', { episodeId: id });
        if (!resp || !resp.data) return { parse: 0, url: '' };
        
        let playUrl = resp.data.url || resp.data.playUrl || '';
        let headers = resp.data.headers || {};
        
        return {
            parse: 0,
            url: playUrl,
            header: headers
        };
    } catch(e) {
        console.error('[聚指] play error:', e.message);
        return { parse: 0, url: '' };
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        search: search,
        play: play,
    };
}
