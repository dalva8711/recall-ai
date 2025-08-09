// logger/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'activity.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT UNIQUE,           -- e.g., '2025-08-08'
      text TEXT NOT NULL,
      embedding BLOB NOT NULL    -- store Float32Array bytes
    )
  `);
});

module.exports = db;
