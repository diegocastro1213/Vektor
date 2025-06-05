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

<<<<<<< HEAD
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


      const similares = await buscarSimilares(texto, 3);

      let resumen = similares.map((item, i) => {
        const meta = item.metadata || {};
        return `${i + 1}. ${meta.nombre || 'Sin nombre'} – ${meta.categoria || 'Sin categoría'} – $${meta.precio || 'N/D'}`;
      }).join('\n');

      const historialFiltrado = conversacion.mensajes
        .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '')
        .slice(-10); // conserva solo los últimos 10

      historialFiltrado.push({ role: 'user', content: texto });
      historialFiltrado.push({
        role: 'system',
        content: `Estos son los productos más cercanos encontrados:\n${resumen}`
      });

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
=======
>>>>>>> parent of 5099430 (Agregar funcionalidad y tipo de bot)
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
