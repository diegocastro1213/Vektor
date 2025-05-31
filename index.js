console.log("🔐 API Key cargada:", process.env.OPENAI_API_KEY?.slice(0, 10), "...");


// Cargar variables de entorno
require('dotenv').config();

// Conectar a MongoDB
const connectDB = require('./src/db/mongo');
connectDB();

// Requerir Express
const express = require('express');
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Cargar rutas
const webhookRoutes = require('./src/routes/webhook');
app.use('/webhook', webhookRoutes);

//configuración del tipo de bot y funcionalidades
const configRoutes = require('./src/routes/config');
app.use('/config', configRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


