// logger/embeddings.js
const { pipeline } = require('@xenova/transformers');

// Lazy-load singleton
let encoderPromise = null;
function getEncoder() {
  if (!encoderPromise) {
    encoderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return encoderPromise;
}

// Mean-pool last hidden state
function meanPool(arr2d) {
  const n = arr2d.length;
  const d = arr2d[0].length;
  const out = new Float32Array(d);
  for (let i = 0; i < n; i++) {
    const row = arr2d[i];
    for (let j = 0; j < d; j++) out[j] += row[j];
  }
  for (let j = 0; j < d; j++) out[j] /= n;
  return out;
}

async function embed(text) {
  const encoder = await getEncoder();
  const output = await encoder(text, { normalize: true }); // returns [tokens, dims], L2-normalized
  // Some builds already return pooled embeddings; if not, pool:
  const arr = Array.isArray(output.data?.[0]) ? output.data : output; // handle both shapes
  const vec = meanPool(arr);
  // ensure unit norm (cosine)
  let norm = 0; for (const v of vec) norm += v*v; norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  return vec;
}

function cosineSim(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // unit-normalized => cosine
}

module.exports = { embed, cosineSim };
