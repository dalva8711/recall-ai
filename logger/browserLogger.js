// logger/browserLogger.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'activity.db');
const db = new sqlite3.Database(dbPath);

// ensure the table exists
db.run(`
    CREATE TABLE IF NOT EXISTS browser_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      title TEXT,
      url TEXT
    )
`);

const app = express();
app.use(express.json());

// POST endpoint to log browser activity
app.post('/log-tab', (req, res) => {
    const {title, url, timestamp} = req.body;

    if (!title || !url || !timestamp){
        return res.status(400).send('Missing required fields');
    }

    db.run(`
        INSERT INTO browser_logs (timestamp, title, url) VALUES (?, ?, ?)`,
        [timestamp, title, url],
        (err) => {
            if (err) {
                console.error(`DB error: `, err);
                return res.status(500).send('DB error');
            }
            console.log(`[Tab Logged] ${title} - ${url}`);
            res.sendStatus(200);
        }
    );
});

function startServer() {
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`🌐 Tab logger listening on http://localhost:${PORT}`);
    });
}

module.exports = {
    startServer
};