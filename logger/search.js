// logger/search.js
const db = require('./db');
const { embed, cosineSim } = require('./embedder');

function rowsAll(sql, params = []) {
  return new Promise((res, rej) =>
    db.all(sql, params, (err, rows) => (err ? rej(err) : res(rows)))
  );
}

function bufToFloat32(buf) {
  // Node Buffer -> Float32Array
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new Float32Array(ab);
}

async function search(query, k = 5) {
  const qVec = await embed(query);
  const rows = await rowsAll(`SELECT day, text, embedding FROM summaries`);
  const scored = rows.map(r => {
    const vec = bufToFloat32(r.embedding);
    const score = cosineSim(qVec, vec);
    return { day: r.day, text: r.text, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

module.exports = { search };
