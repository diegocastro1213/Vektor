const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera una respuesta desde OpenAI con el historial ya validado.
 * @param {Array} historialMensajes - Lista de mensajes [{role, content}]
 * @returns {object} { respuesta, tokens }
 */
async function obtenerRespuestaGPT(historialMensajes) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un asistente virtual profesional y amable, sé lo más breve, corto y puntual posible, sin dejar de ser cordial.' },
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
