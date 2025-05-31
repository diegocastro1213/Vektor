const OpenAI = require('openai');
const Conversacion = require('../models/conversacion');
const Cliente = require('../models/cliente');
const { getBotConfig } = require('../utils/getBotConfig');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera una respuesta desde OpenAI con el historial ya validado.
 * @param {Array} historialMensajes - Lista de mensajes [{role, content}]
 * @param {string} telefono - Teléfono del usuario (para obtener tipoBot)
 * @returns {object} { respuesta, tokens }
 */
async function obtenerRespuestaGPT(historialMensajes, telefono) {
  try {
    // Buscar tipoBot en base de clientes, no en conversación
    const cliente = await Cliente.findOne({ telefono });

    if (!cliente?.tipoBot) {
      console.error(`🚫 No autorizado: número ${telefono} sin tipoBot.`);
      return {
        respuesta: '❌ Este número no está autorizado para usar este servicio.',
        tokens: 0
      };
    }

    const config = getBotConfig(cliente.tipoBot);

    const completion = await openai.chat.completions.create({
      model: config.modelo || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: config.prompt_inicial || 'Eres un asistente virtual.'
        },
        ...historialMensajes
      ]
    });

    const respuesta = completion.choices[0].message.content;
    const tokens = completion.usage?.total_tokens || 0;

    return { respuesta, tokens };
  } catch (error) {
    console.error('❌ Error en OpenAI:', error);
    return { respuesta: 'Ocurrió un error al procesar tu mensaje.', tokens: 0 };
  }
}

module.exports = { obtenerRespuestaGPT };


