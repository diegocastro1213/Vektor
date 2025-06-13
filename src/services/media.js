const axios = require('axios');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');
const OpenAI = require('openai');
const Conversacion = require('../models/conversacion');
const Cliente = require('../models/cliente');
const MediaAnalizada = require('../models/mediaAnalizada');
const { getBotConfig } = require('../utils/getBotConfig');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function obtenerMediaUrl(mediaId) {
  const token = process.env.WHATSAPP_TOKEN;
  const url = `https://graph.facebook.com/v22.0/${mediaId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.url;
}

async function descargarImagenComoBase64(mediaUrl) {
  const token = process.env.WHATSAPP_TOKEN;
  const response = await axios.get(mediaUrl, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'arraybuffer'
  });
  const buffer = Buffer.from(response.data, 'binary');
  return buffer.toString('base64');
}

async function procesarImagenDePago(message) {
  const telefono = message.from;

  try {
    const cliente = await Cliente.findOne({ telefono });

    if (!cliente?.tipoBot) {
      console.error(`🚫 Acceso no autorizado para imagen (sin tipoBot) → ${telefono}`);
      await enviarMensajeWhatsApp(telefono, '❌ Este número no está autorizado para usar este servicio.');
      return;
    }

    const config = getBotConfig(cliente.tipoBot);

    if (!config?.funcionalidades?.imagen) {
      await enviarMensajeWhatsApp(telefono, '❌ Este bot no tiene habilitada la función de análisis de imágenes.');
      return;
    }

    const mediaId = message.image.id;
    const caption = message.image.caption || '';

    await enviarMensajeWhatsApp(telefono, '🔄 Procesando imagen...');

    const mediaUrl = await obtenerMediaUrl(mediaId);
    const base64 = await descargarImagenComoBase64(mediaUrl);

    // 1️⃣ Generar análisis descriptivo completo
    const completionAnalisis = await openai.chat.completions.create({
      model: config.modelo || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: config.prompt_imagen || 'Describe exhaustivamente todo lo que aparece en la imagen. No omitas ningún detalle.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe detalladamente esta imagen.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
          ]
        }
      ]
    });

    const analisisCompleto = completionAnalisis.choices[0].message.content.trim();

    // 💾 Guardar análisis en MongoDB
    await MediaAnalizada.create({
      telefono,
      media_id: mediaId,
      image_url: mediaUrl,
      image_base64: base64,
      analisis_ia: analisisCompleto
    });

    // 🧠 Recuperar o crear la conversación activa
    const { obtenerConversacionActiva } = require('../utils/sesion');
    const conversacion = await obtenerConversacionActiva(telefono);

    // 2️⃣ Actualizar historial con análisis completo
    conversacion.mensajes.push({
      role: 'assistant',
      content: analisisCompleto
    });
    conversacion.ultima_interaccion = new Date();
    await conversacion.save();

    // 3️⃣ Preparar contexto para respuesta al usuario
    const historial = conversacion.mensajes
      .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '')
      .slice(-10);

    const captionOHistorial = caption?.trim() || 'Describe de la forma mas breve posible lo que ves en la imagen';

    const completionRespuesta = await openai.chat.completions.create({
      model: config.modelo || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tienes acceso al análisis completo de una imagen. Si el usuario ha hecho una pregunta antes o junto con la imagen, responde únicamente a esa pregunta de forma puntual y lo más breve posible, no es necesario describir lo demás de la imagen. Si no hay ninguna pregunta, allí sí, responde con una descripción general muy breve sobre el contenido de la imagen, basada en el análisis realizado.'
        },
        ...historial,
        { role: 'user', content: captionOHistorial }
      ]
    });

    const respuestaFinal = completionRespuesta.choices[0].message.content.trim();
    await enviarMensajeWhatsApp(telefono, respuestaFinal);

    conversacion.mensajes.push({
      role: 'assistant',
      content: respuestaFinal
    });
    await conversacion.save();

  } catch (error) {
    console.error('❌ Error procesando imagen:', error.message);
    await enviarMensajeWhatsApp(telefono, '❌ Ocurrió un error al procesar tu imagen. Intenta nuevamente.');
  }
}

module.exports = { procesarImagenDePago };

