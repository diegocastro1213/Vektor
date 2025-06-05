const express = require('express');
const router = express.Router();

const { obtenerRespuestaGPT } = require('../services/openai');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');
const Conversacion = require('../models/conversacion');
const ConversacionHistorica = require('../models/conversacionHistorica');
const { obtenerConversacionActiva } = require('../utils/sesion');

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

// Webhook para recibir mensajes
router.post('/', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text && message.from) {
      const texto = message.text.body;
      const telefono = message.from;
      console.log(`📥 Mensaje recibido de ${telefono}: ${texto}`);

      const conversacion = await obtenerConversacionActiva(telefono);

      // Crear nuevos mensajes con timestamp
      const nuevoMensajeUsuario = { role: 'user', content: texto, timestamp: new Date() };

      // Preparar historial reciente (máximo 10)
      const historialFiltrado = conversacion.mensajes
        .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '');

      historialFiltrado.push(nuevoMensajeUsuario);

      const { respuesta, tokens } = await obtenerRespuestaGPT(historialFiltrado);
      console.log(`🔢 Tokens usados en esta interacción: ${tokens}`);
      const nuevoMensajeBot = { role: 'assistant', content: respuesta, timestamp: new Date() };

      // Guardar en conversación activa
      conversacion.mensajes = [...conversacion.mensajes, nuevoMensajeUsuario, nuevoMensajeBot];
      conversacion.ultima_interaccion = new Date();
      await conversacion.save();

      // Guardar en conversación histórica
      await ConversacionHistorica.create({
        telefono,
        mensajes: [nuevoMensajeUsuario, nuevoMensajeBot],
        fecha: new Date()
      });

      // Enviar respuesta al usuario
      await enviarMensajeWhatsApp(telefono, respuesta);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error en el webhook:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
