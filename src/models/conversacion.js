const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversacionActivaSchema = new mongoose.Schema({
  telefono: { type: String, required: true, unique: true },
  mensajes: [mensajeSchema],
  ultima_interaccion: {
    type: Date,
    default: Date.now
  },
  tipoBot: { type: String, default: 'asistente_ventas' } // ✅ NUEVO CAMPO
});

module.exports = mongoose.model("Conversacion", conversacionActivaSchema);

