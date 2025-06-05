const express = require('express');
const router = express.Router();

const { obtenerRespuestaGPT } = require('../services/openai');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');
const Conversacion = require('../models/conversacion');
const ConversacionHistorica = require('../models/conversacionHistorica');
const { obtenerConversacionActiva } = require('../utils/sesion');
const { procesarImagenDePago } = require('../services/media');
//const { esAnticipoDeImagen } = require('../utils/clasificacion'); por si deseo activarlo a futuro.
const { procesarAudioDeWhatsapp } = require('../services/audio');

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

    // ✅ Procesar imagen
    if (message && message.type === 'image') {
      await procesarImagenDePago(message);
      return res.sendStatus(200);
    }

    // ✅ Procesar audio o mensaje de voz
    if (message && (message.type === 'audio' || message.type === 'voice')) {
      const textoTranscrito = await procesarAudioDeWhatsapp(message);

      if (!textoTranscrito) return res.sendStatus(200);

      const telefono = message.from;
      const conversacion = await obtenerConversacionActiva(telefono);
      const nuevoMensajeUsuario = { role: 'user', content: textoTranscrito, timestamp: new Date() };

      const historialFiltrado = conversacion.mensajes
        .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '');

      historialFiltrado.push(nuevoMensajeUsuario);

      const { respuesta, tokens } = await obtenerRespuestaGPT(historialFiltrado, telefono);
      console.log(`🔢 Tokens usados en respuesta por audio: ${tokens}`);

      const nuevoMensajeBot = { role: 'assistant', content: respuesta, timestamp: new Date() };

      conversacion.mensajes = [...conversacion.mensajes, nuevoMensajeUsuario, nuevoMensajeBot];
      conversacion.ultima_interaccion = new Date();
      await conversacion.save();

      await ConversacionHistorica.create({
        telefono,
        mensajes: [nuevoMensajeUsuario, nuevoMensajeBot],
        fecha: new Date()
      });

      await enviarMensajeWhatsApp(telefono, respuesta);
      return res.sendStatus(200);
    }

    // ✅ Procesar mensaje de texto
    if (message && message.text && message.from) {
      const texto = message.text.body;
      const telefono = message.from;
      console.log(`📥 Mensaje recibido de ${telefono}: ${texto}`);

      // 🧠 Verificar si es un mensaje que anticipa una imagen
      /*if (await esAnticipoDeImagen(texto)) {
        console.log('📎 Mensaje anticipado detectado. Se guardará como contexto.');
        const conversacion = await obtenerConversacionActiva(telefono);
        const mensajeUsuario = { role: 'user', content: texto, timestamp: new Date() };
        conversacion.mensajes.push(mensajeUsuario);
        conversacion.ultima_interaccion = new Date();
        await conversacion.save();
        await enviarMensajeWhatsApp(telefono, "👌 Recibido. Espero el archivo.");
        return res.sendStatus(200);
      }*/

      const conversacion = await obtenerConversacionActiva(telefono);
      const nuevoMensajeUsuario = { role: 'user', content: texto, timestamp: new Date() };

      const historialFiltrado = conversacion.mensajes
        .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '');

      historialFiltrado.push(nuevoMensajeUsuario);

      const { respuesta, tokens } = await obtenerRespuestaGPT(historialFiltrado, telefono);
      console.log(`🔢 Tokens usados en esta interacción: ${tokens}`);

      const nuevoMensajeBot = { role: 'assistant', content: respuesta, timestamp: new Date() };

      conversacion.mensajes = [...conversacion.mensajes, nuevoMensajeUsuario, nuevoMensajeBot];
      conversacion.ultima_interaccion = new Date();
      await conversacion.save();

      await ConversacionHistorica.create({
        telefono,
        mensajes: [nuevoMensajeUsuario, nuevoMensajeBot],
        fecha: new Date()
      });

      await enviarMensajeWhatsApp(telefono, respuesta);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error en el webhook:', error);
    res.sendStatus(500);
  }
});

module.exports = router;


