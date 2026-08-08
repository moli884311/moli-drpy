const express = require('express');
const { stmts } = require('./database');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PAGE_SIZE = 20;

function getLinks(videoId) {
  const rows = stmts.getVideoLinks.all(videoId);
  return rows.map(r => ({ label: r.label, url: r.url }));
}

// ========== ThinkPHP 兼容路由 ==========

// 首页
app.get('/', (req, res) => {
  res.redirect('/index.php/vod/show/id/1.html');
});

// 分类列表 /index.php/vod/show/id/<cid>.html
app.get('/index.php/vod/show/id/:cid.html', (req, res) => {
  const cid = parseInt(req.params.cid) || 1;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const categories = stmts.getCategories.all();
  const videos = stmts.getVideosByCategory.all(cid, PAGE_SIZE + 1, offset);
  const hasMore = videos.length > PAGE_SIZE;
  if (hasMore) videos.pop();
  const { total } = stmts.countVideosByCategory.get(cid);
  res.render('list', { categories, videos, cid, page, hasMore, total, PAGE_SIZE, title: categories.find(c => c.id === cid)?.name || '全部' });
});

// 搜索 /index.php/vod/search/page/<page>/wd/<keyword>.html
app.get('/index.php/vod/search/page/:page/wd/:keyword.html', (req, res) => {
  const keyword = req.params.keyword || '';
  const page = parseInt(req.params.page) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  const categories = stmts.getCategories.all();
  const videos = stmts.searchVideos.all(`%${keyword}%`, PAGE_SIZE + 1, offset);
  const hasMore = videos.length > PAGE_SIZE;
  if (hasMore) videos.pop();
  const { total } = stmts.countSearchVideos.get(`%${keyword}%`);
  res.render('list', { categories, videos, cid: 0, page, hasMore, total, PAGE_SIZE, keyword, title: '搜索: ' + keyword });
});

// 详情页 /index.php/vod/detail/id/<id>.html
app.get('/index.php/vod/detail/id/:id.html', (req, res) => {
  const vid = req.params.id;
  const video = stmts.getVideo.get(vid);
  if (!video) return res.status(404).send('影片不存在');
  const links = getLinks(vid);
  const categories = stmts.getCategories.all();
  const tagLinks = categories.map(c => ({ name: c.name, url: `/index.php/vod/show/id/${c.id}.html` }));
  res.render('detail', { video, links, tagLinks });
});

// ========== 管理 API ==========
const ADMIN_PWD = process.env.ADMIN_PWD || 'admin123';

function checkAuth(req, res, next) {
  const pwd = req.query.pwd || req.body.pwd || '';
  if (pwd !== ADMIN_PWD) return res.status(401).json({ error: '需要密码' });
  next();
}

// 管理首页
app.get('/admin', (req, res) => {
  const videos = stmts.getAllVideos.all();
  const categories = stmts.getCategories.all();
  res.render('admin', { videos, categories, ADMIN_PWD });
});

// 获取单个视频
app.get('/api/video/:id', checkAuth, (req, res) => {
  const video = stmts.getVideo.get(req.params.id);
  if (!video) return res.status(404).json({ error: 'not found' });
  const links = getLinks(req.params.id);
  res.json({ ...video, links });
});

// 新增/编辑视频
app.post('/api/video', checkAuth, (req, res) => {
  const { id, title, category_id, pic, content, year, area, remarks, links } = req.body;
  if (!title) return res.status(400).json({ error: '标题必填' });
  const vid = id || Date.now().toString(36);
  if (id) {
    stmts.updateVideo.run(title, parseInt(category_id) || 1, pic || '', content || '', year || '', area || '', remarks || '', vid);
  } else {
    stmts.insertVideo.run(vid, title, parseInt(category_id) || 1, pic || '', content || '', year || '', area || '', remarks || '');
  }
  if (links && Array.isArray(links)) {
    stmts.deleteVideoLinks.run(vid);
    links.forEach((l, i) => {
      if (l.url) stmts.insertVideoLink.run(vid, l.label || '', l.url, i);
    });
  }
  res.json({ ok: true, id: vid });
});

// 删除视频
app.delete('/api/video/:id', checkAuth, (req, res) => {
  stmts.deleteVideoLinks.run(req.params.id);
  stmts.deleteVideo.run(req.params.id);
  res.json({ ok: true });
});

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => console.log(`Video CMS running at http://localhost:${PORT}`));
