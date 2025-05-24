const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function obtenerRespuestaGPT(textoUsuario) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // o 'gpt-4o' si tienes acceso
    messages: [
      { role: 'system', content: 'Eres un asistente virtual profesional y amable.' },
      { role: 'user', content: textoUsuario }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { obtenerRespuestaGPT };
