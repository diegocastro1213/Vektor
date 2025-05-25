const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conversacionHistoricaSchema = new mongoose.Schema({
  telefono: { type: String, required: true },
  mensajes: [mensajeSchema],
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ConversacionHistorica", conversacionHistoricaSchema);
