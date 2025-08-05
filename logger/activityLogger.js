// logger/activityLogger.js
const activeWin = require('active-win');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'activity.db');

// 1. Setup the SQLite database
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      app TEXT,
      title TEXT
    )`);
});

// 2. Log current window activity
async function logActiveWindow() {
    try {
        const window = await activeWin();
        if (window) {
            const timestamp = new Date().toISOString();
            const app = window.owner.name;
            const title = window.title.replace(` - ${app}`, '');

            db.run(`INSERT INTO activity_logs (timestamp, app, title) VALUES (?, ?, ?)`, 
                [timestamp, app, title],                
            );

            console.log(`[${timestamp}] ${app} - ${title}`);
        }
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

module.exports = {
    logActiveWindow
};