// logger/index_summaries.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const db = require('./db');
const { embed } = require('./embedder');

const SUM_DIR = path.join(__dirname, 'summaries');

async function indexOne(day, text) {
  const vec = await embed(text);
  const buf = Buffer.from(new Float32Array(vec).buffer); // store as BLOB
  await new Promise((res, rej) =>
    db.run(
      `INSERT OR REPLACE INTO summaries (day, text, embedding) VALUES (?, ?, ?)`,
      [day, text, buf],
      err => (err ? rej(err) : res())
    )
  );
  console.log(`✓ Indexed ${day}`);
}

(async () => {
  if (!fs.existsSync(SUM_DIR)) {
    console.log('No summaries dir yet'); process.exit(0);
  }
  console.log('Looking for files in:', SUM_DIR);
  const pattern = '**/*.md';
  console.log('Using glob pattern:', pattern);
  const files = glob.sync(pattern, { cwd: SUM_DIR, absolute: true });
  console.log('Found files:', files);
  for (const f of files) {
    console.log('Processing file:', f);
    const day = path.basename(f, '.md');
    const text = fs.readFileSync(f, 'utf-8');
    await indexOne(day, text);
  }
  console.log('Done indexing.');
  process.exit(0);
})();
