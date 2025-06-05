const Embedding = require('../models/embedding');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

async function buscarSimilares(mensaje, topN = 3) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: mensaje
  });

  const embeddingConsulta = response.data[0].embedding;
  const todos = await Embedding.find();

  const similares = todos
    .map(item => ({
      ...item.toObject(),
      similitud: cosineSimilarity(embeddingConsulta, item.vector)
    }))
    .sort((a, b) => b.similitud - a.similitud)
    .slice(0, topN);

  return similares;
}

module.exports = { buscarSimilares };
