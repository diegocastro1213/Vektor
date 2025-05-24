const express = require('express');
const router = express.Router();
const { obtenerRespuestaGPT } = require('../services/openai');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');
const Conversacion = require('../models/conversacion');

// Webhook de verificación (Meta lo usa para validar la URL)
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

      // Buscar o crear conversación en MongoDB
      let conversacion = await Conversacion.findOne({ telefono });

      if (!conversacion) {
        conversacion = new Conversacion({ telefono, mensajes: [] });
      }

      // Agregar mensaje del usuario
      conversacion.mensajes.push({ role: 'user', content: texto });
      conversacion.ultima_interaccion = new Date();
      await conversacion.save();

      // Preparar historial para OpenAI (últimos 10 mensajes)
      const historial = conversacion.mensajes.slice(-10);

      // Obtener respuesta de OpenAI
      const respuesta = await obtenerRespuestaGPT(historial);

      // Guardar respuesta del bot
      conversacion.mensajes.push({ role: 'assistant', content: respuesta });
      conversacion.ultima_interaccion = new Date();
      await conversacion.save();

      // Enviar mensaje por WhatsApp
      await enviarMensajeWhatsApp(telefono, respuesta);
    }

    res.sendStatus(200); // WhatsApp espera un 200 OK
  } catch (error) {
    console.error('❌ Error en el webhook:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
