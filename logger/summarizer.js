// logger/summarizer.js (Claude version)
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { Anthropic } = require('@anthropic-ai/sdk');

const db = new sqlite3.Database(path.join(__dirname, 'activity.db'));
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// TODO: Allow user to enter specify date


function fetchLogsForToday(callback) {
  const start = `${getTodayDate()}T00:00:00Z`;
  const end = `${getTodayDate()}T23:59:59Z`;

  const logs = { apps: [], tabs: [] };

  db.all(`SELECT timestamp, app, title FROM activity_logs WHERE timestamp BETWEEN ? AND ?`, [start, end], (err, rows) => {
    if (err) return callback(err);
    logs.apps = rows;

    db.all(`SELECT timestamp, title, url FROM browser_logs WHERE timestamp BETWEEN ? AND ?`, [start, end], (err2, rows2) => {
      if (err2) return callback(err2);
      logs.tabs = rows2;

      callback(null, logs);
    });
  });
}

function formatLogs(logs) {
  let content = `Summarize this user activity for ${getTodayDate()} in natural language.\n\n`;

  content += "App Activity:\n";
  logs.apps.forEach(log => {
    content += `• [${log.timestamp}] ${log.app} - ${log.title}\n`;
  });

  content += "\nBrowser Activity:\n";
  logs.tabs.forEach(log => {
    content += `• [${log.timestamp}] ${log.title} - ${log.url}\n`;
  });

  content += "\nSummary:";
  return content;
}

async function summarizeWithClaude(logs) {
  const input = formatLogs(logs);

  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    temperature: 0.5,
    messages: [
      {
        role: "user",
        content: input,
      },
    ]
  });

  return completion.content[0].text;
}

function saveSummary(summary) {
  const outPath = path.join(__dirname, `summaries/${getTodayDate()}.md`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, summary);
  console.log(`Summary saved to ${outPath}`);
}

fetchLogsForToday(async (err, logs) => {
  if (err) return console.error('Error fetching logs:', err);

  const summary = await summarizeWithClaude(logs);
  console.log('\nDAILY SUMMARY:\n');
  console.log(summary);

  saveSummary(summary);
});
