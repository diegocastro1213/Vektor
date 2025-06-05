const mongoose = require('mongoose');
const Cliente = require('./src/models/cliente');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ Conectado a MongoDB");

  const telefono = "50379387134";
  const datosCliente = {
    nombre_cliente: "Cliente de prueba",
    tipoBot: "1_asistente_ventas",
    estado: "activo",
    canal: "WhatsApp",
    notas: "Asignado manualmente con upsert"
  };

  const resultado = await Cliente.updateOne(
    { telefono },
    { $set: datosCliente },
    { upsert: true }
  );

  if (resultado.upserted) {
    console.log(`🆕 Cliente creado con número ${telefono}`);
  } else if (resultado.modifiedCount > 0) {
    console.log(`🔄 Cliente actualizado con número ${telefono}`);
  } else {
    console.log(`✅ Cliente ya existía y no requirió cambios`);
  }

  mongoose.disconnect();
}).catch(err => {
  console.error("❌ Error:", err.message);
});

