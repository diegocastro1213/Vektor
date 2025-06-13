const OpenAI = require('openai');
const Conversacion = require('../models/conversacion');
const Cliente = require('../models/cliente');
const { getBotConfig } = require('../utils/getBotConfig');
const { consultarSQL } = require('../utils/sql'); // ✅ añadimos esto

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function obtenerRespuestaGPT(historialMensajes, telefono) {
  try {
    const cliente = await Cliente.findOne({ telefono });

    if (!cliente?.tipoBot) {
      console.error(`🚫 No autorizado: número ${telefono} sin tipoBot.`);
      return {
        respuesta: '❌ Este número no está autorizado para usar este servicio.',
        tokens: 0
      };
    }

    const config = getBotConfig(cliente.tipoBot);

    const mensajes = [
      {
        role: 'system',
        content: config.prompt_inicial || 'Eres un asistente virtual.'
      }
    ];

    // ✅ Inyectar catálogo si SQL está habilitado
    if (config.sql_config?.enabled && config.funcionalidades?.sql === true) {
      try {
        const tiposRaw = await consultarSQL("SELECT DISTINCT Tipo FROM Productos", config.sql_config);
        const modelosRaw = await consultarSQL("SELECT DISTINCT CompatibleCon FROM Productos", config.sql_config);

        const tipos = tiposRaw?.map(r => r.Tipo).filter(Boolean) || [];
        const modelos = modelosRaw?.map(r => r.CompatibleCon).filter(Boolean) || [];

        mensajes.push({
          role: 'system',
          content: `Catálogos actualizados:\nTipos disponibles: ${tipos.join(', ')}\nModelos compatibles: ${modelos.join(', ')}\n\nUsa únicamente estos valores reales para construir cualquier consulta SQL.`
        });
      } catch (e) {
        console.warn('⚠️ No se pudo inyectar catálogo SQL dinámico:', e.message);
      }
    }

    mensajes.push(...historialMensajes);

    const completion = await openai.chat.completions.create({
      model: config.modelo || 'gpt-4o',
      messages: mensajes
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


