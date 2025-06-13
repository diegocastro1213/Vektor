const mongoose = require("mongoose");
require("dotenv").config();

// Modelos
const Conversacion = require("./src/models/conversacion");
const ConversacionHistorica = require("./src/models/conversacionHistorica");
const MediaAnalizada = require("./src/models/mediaAnalizada");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Conectado a MongoDB");

  // Limpiar conversaciones activas
  await Conversacion.deleteMany({});
  console.log("🧹 Conversacion limpiada");

  // Limpiar historiales
  await ConversacionHistorica.deleteMany({});
  console.log("🧹 ConversacionHistorica limpiada");

  // Limpiar imágenes analizadas
  await MediaAnalizada.deleteMany({});
  console.log("🧹 MediaAnalizada limpiada");

  mongoose.disconnect();
  console.log("🔌 Desconectado de MongoDB");
}).catch(err => {
  console.error("❌ Error al conectar:", err);
});
