// logger/query.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./logger/activity.db');

db.all(`SELECT * FROM activity_logs ORDER BY timestamp`, [], (err, rows) => {
  if (err) throw err;
  console.table(rows);
});
