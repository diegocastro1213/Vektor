const express = require('express');
const router = express.Router();

const { obtenerRespuestaGPT } = require('../services/openai');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');
const Conversacion = require('../models/conversacion');
const ConversacionHistorica = require('../models/conversacionHistorica');
const { obtenerConversacionActiva } = require('../utils/sesion');
const { procesarImagenDePago } = require('../services/media');
const { procesarAudioDeWhatsapp } = require('../services/audio');
const { manejarFlujoSQLConversacional } = require('../services/sqlConversacional');

// Webhook de verificación
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'mibotseguro') {
    console.log('✅ Webhook verificado por Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Función reutilizable para procesar texto o transcripción
async function procesarMensajeTexto(telefono, texto, conversacion, config, res) {
  const nuevoMensajeUsuario = { role: 'user', content: texto, timestamp: new Date() };

  const historialFiltrado = conversacion.mensajes
    .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '');

  historialFiltrado.push(nuevoMensajeUsuario);

  const { respuesta, tokens } = await obtenerRespuestaGPT(historialFiltrado, telefono);
  console.log(`🔢 Tokens usados: ${tokens}`);

  // 🔍 Validación del flujo SQL
  if (
    config.sql_config?.enabled &&
    config.funcionalidades?.sql === true &&
    /\[SQL\]\s*SELECT[\s\S]+/i.test(respuesta)
  ) {
    const match = respuesta.trim().match(/^\[SQL\]\s*(SELECT[\s\S]*)$/i);

    if (!match) {
      console.warn('⚠️ Consulta con [SQL] malformada. No se ejecutará.');
      await enviarMensajeWhatsApp(telefono, '⚠️ Hubo un error al preparar la consulta. ¿Podés repetir tu solicitud?');
      return res.sendStatus(200);
    }

    const soloSQL = `[SQL]\n${match[1].trim()}`;

    const gestionado = await manejarFlujoSQLConversacional({
      telefono,
      texto,
      respuesta: soloSQL,
      conversacion,
      config
    });

    if (gestionado) return res.sendStatus(200);
  }

  // 🟢 Si no fue SQL, continuar normalmente
  const nuevoMensajeBot = { role: 'assistant', content: respuesta, timestamp: new Date() };
  conversacion.mensajes.push(nuevoMensajeUsuario, nuevoMensajeBot);
  conversacion.ultima_interaccion = new Date();
  await conversacion.save();

  await ConversacionHistorica.create({
    telefono,
    mensajes: [nuevoMensajeUsuario, nuevoMensajeBot],
    fecha: new Date()
  });

  await enviarMensajeWhatsApp(telefono, respuesta);
  res.sendStatus(200);
}

// Webhook para recibir mensajes
router.post('/', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    // ✅ Procesar imagen
    if (message && message.type === 'image') {
      await procesarImagenDePago(message);
      return res.sendStatus(200);
    }

    // ✅ Procesar audio
    if (message && (message.type === 'audio' || message.type === 'voice')) {
      const textoTranscrito = await procesarAudioDeWhatsapp(message);
      if (!textoTranscrito) return res.sendStatus(200);

      const telefono = message.from;
      const conversacion = await obtenerConversacionActiva(telefono);
      const config = require('../utils/getBotConfig').getBotConfig(conversacion.tipoBot);

      return await procesarMensajeTexto(telefono, textoTranscrito, conversacion, config, res);
    }

    // ✅ Procesar texto
    if (message && message.text && message.from) {
      const texto = message.text.body;
      const telefono = message.from;
      console.log(`📥 Mensaje recibido de ${telefono}: ${texto}`);

      const conversacion = await obtenerConversacionActiva(telefono);
      const config = require('../utils/getBotConfig').getBotConfig(conversacion.tipoBot);

      return await procesarMensajeTexto(telefono, texto, conversacion, config, res);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error en el webhook:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
