// logger/clear.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./logger/activity.db');

db.all(`DELETE FROM activity_logs`, [], (err) => {
    if (err) throw err;
    console.log('Activity logs cleared');
});