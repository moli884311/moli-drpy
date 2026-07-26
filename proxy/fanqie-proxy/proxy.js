// 番茄短剧反代服务
// 部署: node proxy.js
// 默认端口 3001, 可设 PORT 环境变量

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
      headers: { 'User-Agent': UA, ...opts.headers },
      timeout: 8000,
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`非JSON响应: ${body.slice(0, 200)}`)); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('超时')); });
    req.on('error', reject);
    req.end();
  });
}

// /search → 番茄短剧搜索
async function handleSearch(query) {
  const p = new URLSearchParams(query);
  const keyword = p.get('query') || p.get('keyword') || '';
  const url = `https://fanqienovel.com/api/goodreads/v1/search/book?keyword=${encodeURIComponent(keyword)}&page=1&limit=20`;
  const data = await fetchJSON(url);
  const books = data?.data?.book_list || [];
  return {
    code: 0,
    data: books.map(b => ({
      series_id: b.book_id,
      book_id: b.book_id,
      title: b.book_name,
      cover: b.thumb_url || '',
      sub_title: b.sub_info || '',
      rec_text: b.status || ''
    }))
  };
}

// /catalog → 番茄短剧目录
async function handleCatalog(query) {
  const bookId = query.book_id || query.bookId || '';
  const url = `https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`;
  const data = await fetchJSON(url);
  const items = data?.data?.item_data_list || data?.data || [];
  return {
    code: 0,
    data: {
      book_info: {
        book_id: bookId,
        book_name: data?.data?.book_info?.book_name || '',
        thumb_url: data?.data?.book_info?.thumb_url || '',
        abstract: data?.data?.book_info?.abstract || '',
        tags: data?.data?.book_info?.tags || '',
        sub_info: data?.data?.book_info?.sub_info || ''
      },
      item_data_list: items.map(it => ({
        title: it.title || it.volume_name || '',
        item_id: it.item_id
      }))
    }
  };
}

// /video → 番茄短剧播放 (尝试从 reader 页面提取)
async function handleVideo(query) {
  const itemIds = query.item_ids || '';
  const url = `https://fanqienovel.com/api/reader/full?itemId=${itemIds}`;
  const data = await fetchJSON(url);
  const content = data?.data?.content || '';
  let videoUrl = '';
  const vm = content.match(/video_url["\s:=]+['"]([^'"]+)['"]/);
  if (vm) videoUrl = vm[1];
  return {
    code: 0,
    data: {
      [itemIds]: {
        video_model: JSON.stringify({
          video_list: {
            video_1: { main_url: Buffer.from(videoUrl).toString('base64') }
          }
        })
      }
    }
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    let result;
    if (path === '/search') {
      result = await handleSearch(Object.fromEntries(url.searchParams));
    } else if (path === '/catalog') {
      result = await handleCatalog(Object.fromEntries(url.searchParams));
    } else if (path === '/video') {
      result = await handleVideo(Object.fromEntries(url.searchParams));
    } else if (path === '/health') {
      result = { ok: true, time: Date.now() };
    } else {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: '未知接口' }));
    }
    res.end(JSON.stringify(result));
  } catch (e) {
    console.error(`${path} 错误:`, e.message);
    res.writeHead(500);
    res.end(JSON.stringify({ code: -1, message: e.message }));
  }
});

server.listen(PORT, () => {
  console.log(`番茄反代已启动: http://0.0.0.0:${PORT}`);
});
