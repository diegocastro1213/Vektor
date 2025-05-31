const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function esAnticipoDeImagen(texto) {
  const prompt = `Este es un mensaje del usuario: "${texto}". tu eres un validador. Si el usuario está indicando que enviara a futuro algo ya sea una imagen, archivo, documento, pdf etc pero aún no lo ha hecho, responde solamente con "1". Si no está indicando eso, responde solamente con "0". No agregues ningún otro texto ni explicación.`;

  const resultado = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  });

  const decision = resultado.choices[0].message.content.trim();

  // 👇 Consola para revisar clasificación en tiempo real
  console.log('🔍 Clasificación GPT:', {
    texto,
    decision_cruda: resultado.choices[0].message.content,
    decision_final: decision
  });

  return decision === '1'; // ✅ Comparación correcta ahora
}

module.exports = { esAnticipoDeImagen };

