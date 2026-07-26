// 番茄短剧反代
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3001;
const UA = 'Mozilla/5.0 (Linux; Android 12; 22021211RC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

function fetchJSON(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(u, {
      method: 'GET',
      headers: { 'User-Agent': UA, Referer: 'https://fanqienovel.com/', ...opts.headers },
      timeout: 8000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`非JSON(${res.statusCode}): ${body.slice(0,300)}`)); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('超时')); });
    req.on('error', reject);
    req.end();
  });
}

// fanqienovel search → 统一格式
async function handleSearch(query) {
  const p = new URLSearchParams(query);
  const kw = p.get('query') || p.get('keyword') || '';
  const data = await fetchJSON(`https://fanqienovel.com/api/goodreads/v1/search/book?keyword=${encodeURIComponent(kw)}&page=1&limit=20`);
  const books = Array.isArray(data?.data?.book_list) ? data.data.book_list : [];
  return {
    code: 0,
    data: books.map(b => ({
      series_id: b.book_id, book_id: b.book_id,
      title: b.book_name || '', cover: b.thumb_url || '',
      sub_title: b.sub_info || '', rec_text: b.status || ''
    }))
  };
}

// fanqienovel directory → 章节目录
async function handleCatalog(query) {
  const bookId = query.book_id || query.bookId || '';
  const raw = await fetchJSON(`https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`);
  console.log('catalog raw keys:', Object.keys(raw?.data || {}), 'item_data_list type:', typeof raw?.data?.item_data_list, Array.isArray(raw?.data?.item_data_list) ? `len=${raw.data.item_data_list.length}` : '');
  const dd = raw?.data || {};

  // item_data_list 可能是数组或按卷分组的对象
  let chapters = [];
  const idl = dd.item_data_list;
  if (Array.isArray(idl)) {
    chapters = idl;
  } else if (idl && typeof idl === 'object') {
    chapters = Object.values(idl).flat();
  }

  return {
    code: 0,
    data: {
      book_info: {
        book_id: bookId,
        book_name: dd.book_info?.book_name || '',
        thumb_url: dd.book_info?.thumb_url || '',
        abstract: dd.book_info?.abstract || '',
        sub_info: dd.book_info?.sub_info || '',
      },
      item_data_list: chapters.map(it => ({
        title: it.title || it.volume_name || '',
        item_id: it.item_id
      }))
    }
  };
}

// video — 实验性: reader full → 提取 video_model
async function handleVideo(query) {
  const itemIds = query.item_ids || '';
  let videoUrl = '';
  try {
    const data = await fetchJSON(`https://fanqienovel.com/api/reader/full?itemId=${itemIds}`);
    const content = data?.data?.content || '';
    const vm = content.match(/video_url["\s:=]+['"]([^'"]+)['"]/);
    if (vm) videoUrl = vm[1];
  } catch (e) {
    console.error('video获取失败:', e.message);
  }
  return {
    code: 0,
    data: {
      [itemIds]: {
        video_model: JSON.stringify({
          video_list: { video_1: { main_url: Buffer.from(videoUrl).toString('base64') } }
        })
      }
    }
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const u = new URL(req.url, `http://localhost:${PORT}`);
  const path = u.pathname;
  const q = Object.fromEntries(u.searchParams);
  console.log(`${new Date().toISOString()} ${path}`, JSON.stringify(q));

  try {
    let result;
    if (path === '/search') result = await handleSearch(q);
    else if (path === '/catalog') result = await handleCatalog(q);
    else if (path === '/video') result = await handleVideo(q);
    else if (path === '/health') result = { ok: true, time: Date.now() };
    else if (path === '/debug') result = await fetchJSON(q.url || 'https://fanqienovel.com/api/reader/directory/detail?bookId=7076174298628313124');
    else { res.writeHead(404); return res.end(JSON.stringify({ error: '未知接口' })); }
    res.end(JSON.stringify(result));
  } catch (e) {
    console.error(`${path} 错误:`, e.message);
    res.writeHead(500);
    res.end(JSON.stringify({ code: -1, message: e.message }));
  }
});

server.listen(PORT, () => console.log(`番茄反代: http://0.0.0.0:${PORT}`));
