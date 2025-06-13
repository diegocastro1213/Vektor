// src/models/mediaAnalizada.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  telefono: String,
  fecha: { type: Date, default: Date.now },
  media_id: String,
  image_url: String,       // URL original de WhatsApp (opcional)
  image_base64: String,    // ✅ Imagen en base64 para reenviar a OpenAI
  analisis_ia: String
});

module.exports = mongoose.model('MediaAnalizada', mediaSchema);

