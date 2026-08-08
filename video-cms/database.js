const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

const db = new Database('data.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category_id INTEGER DEFAULT 1,
    pic TEXT DEFAULT '',
    content TEXT DEFAULT '',
    year TEXT DEFAULT '',
    area TEXT DEFAULT '',
    remarks TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS video_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort INTEGER DEFAULT 0,
    FOREIGN KEY (video_id) REFERENCES videos(id)
  );

  INSERT OR IGNORE INTO categories (id, name, sort) VALUES (1, '电影', 1);
  INSERT OR IGNORE INTO categories (id, name, sort) VALUES (2, '剧集', 2);
  INSERT OR IGNORE INTO categories (id, name, sort) VALUES (3, '动漫', 3);
  INSERT OR IGNORE INTO categories (id, name, sort) VALUES (4, '综艺', 4);
`);

const stmts = {
  getCategories: db.prepare('SELECT * FROM categories ORDER BY sort'),
  getVideosByCategory: db.prepare(`
    SELECT v.*, c.name as category_name FROM videos v
    JOIN categories c ON v.category_id = c.id
    WHERE v.category_id = ? ORDER BY v.created_at DESC LIMIT ? OFFSET ?
  `),
  countVideosByCategory: db.prepare('SELECT COUNT(*) as total FROM videos WHERE category_id = ?'),
  searchVideos: db.prepare(`
    SELECT v.*, c.name as category_name FROM videos v
    JOIN categories c ON v.category_id = c.id
    WHERE v.title LIKE ? ORDER BY v.created_at DESC LIMIT ? OFFSET ?
  `),
  countSearchVideos: db.prepare('SELECT COUNT(*) as total FROM videos WHERE title LIKE ?'),
  getVideo: db.prepare(`
    SELECT v.*, c.name as category_name FROM videos v
    JOIN categories c ON v.category_id = c.id
    WHERE v.id = ?
  `),
  getVideoLinks: db.prepare('SELECT * FROM video_links WHERE video_id = ? ORDER BY sort'),
  deleteVideoLinks: db.prepare('DELETE FROM video_links WHERE video_id = ?'),
  insertVideoLink: db.prepare('INSERT INTO video_links (video_id, label, url, sort) VALUES (?, ?, ?, ?)'),
  insertVideo: db.prepare(`
    INSERT OR REPLACE INTO videos (id, title, category_id, pic, content, year, area, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateVideo: db.prepare(`
    UPDATE videos SET title=?, category_id=?, pic=?, content=?, year=?, area=?, remarks=? WHERE id=?
  `),
  deleteVideo: db.prepare('DELETE FROM videos WHERE id = ?'),
  getAllVideos: db.prepare('SELECT v.*, c.name as category_name FROM videos v JOIN categories c ON v.category_id = c.id ORDER BY v.created_at DESC'),
};

module.exports = { db, stmts };
