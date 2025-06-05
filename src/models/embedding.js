const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
  texto: String,             // Texto base que se vectorizó
  vector: [Number],          // Embedding OpenAI
  metadata: mongoose.Schema.Types.Mixed, // Info extra: puede incluir ID, categoría, etc.
  creado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Embedding", embeddingSchema);
