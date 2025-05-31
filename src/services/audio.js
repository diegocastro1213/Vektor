const axios = require('axios');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const Cliente = require('../models/cliente');
const { getBotConfig } = require('../utils/getBotConfig');
const { enviarMensajeWhatsApp } = require('./whatsapp');

async function obtenerMediaUrl(mediaId) {
  const token = process.env.WHATSAPP_TOKEN;
  const url = `https://graph.facebook.com/v22.0/${mediaId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.url;
}

async function descargarAudio(mediaUrl) {
  const token = process.env.WHATSAPP_TOKEN;
  const response = await axios.get(mediaUrl, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'arraybuffer'
  });

  const ruta = path.join(__dirname, '../../temp_audio.ogg');
  fs.writeFileSync(ruta, response.data);
  return ruta;
}

async function procesarAudioDeWhatsapp(message) {
  const mediaId = message.voice?.id || message.audio?.id;
  const telefono = message.from;

  try {
    const cliente = await Cliente.findOne({ telefono });

    if (!cliente?.tipoBot) {
      console.error(`🚫 Acceso no autorizado para audio (sin tipoBot) → ${telefono}`);
      await enviarMensajeWhatsApp(telefono, '❌ Este número no está autorizado para usar este servicio.');
      return null;
    }

    const config = getBotConfig(cliente.tipoBot);

    if (!config?.funcionalidades?.audio) {
      console.log(`🚫 Audio no permitido para el bot ${cliente.tipoBot}`);
      await enviarMensajeWhatsApp(telefono, '❌ Este bot no tiene habilitada la función de notas de voz.');
      return null;
    }

    const mediaUrl = await obtenerMediaUrl(mediaId);
    const rutaAudio = await descargarAudio(mediaUrl);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(rutaAudio),
      model: 'whisper-1',
      language: 'es'
    });

    fs.unlinkSync(rutaAudio); // Limpieza

    const textoTranscrito = `Nota de voz: ${transcription.text.trim()}`;
    console.log('🗣️ Audio transcrito:', textoTranscrito);

    return textoTranscrito;
  } catch (err) {
    console.error('❌ Error al procesar audio:', err.message);
    return null;
  }
}

module.exports = {
  procesarAudioDeWhatsapp
};
