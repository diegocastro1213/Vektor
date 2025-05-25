const mongoose = require("mongoose");
require("dotenv").config();

const Conversacion = require("./src/models/conversacion");
const ConversacionHistorica = require("./src/models/conversacionHistorica");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Conectado a MongoDB");

  await Conversacion.deleteMany({});
  console.log("🧹 Conversacion limpiada");

  await ConversacionHistorica.deleteMany({});
  console.log("🧹 ConversacionHistorica limpiada");

  mongoose.disconnect();
}).catch(err => {
  console.error("❌ Error al conectar:", err);
});
