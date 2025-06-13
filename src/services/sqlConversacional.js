// src/services/sqlConversacional.js
const { consultarSQL } = require('../utils/sql');
const { obtenerRespuestaGPT } = require('../services/openai');
const { enviarMensajeWhatsApp } = require('../services/whatsapp');

/**
 * Maneja el flujo completo de consulta SQL conversacional.
 */
async function manejarFlujoSQLConversacional({ telefono, texto, respuesta, conversacion, config }) {
  try {
    const sqlQuery = respuesta.replace('[SQL]', '').trim();

    if (!sqlQuery.toLowerCase().startsWith('select')) {
      await enviarMensajeWhatsApp(telefono, '❌ Solo se permiten consultas SELECT.');
      return true;
    }

    await enviarMensajeWhatsApp(telefono, '🔍 Estoy consultando, dame unos segundos...');

    const resultado = await consultarSQL(sqlQuery, config.sql_config);

    if (!resultado || resultado.length === 0) {
      await enviarMensajeWhatsApp(telefono, 'No se encontraron resultados para esa consulta.');
      return true;
    }

    const resultadoTexto = resultado
      .slice(0, 5)
      .map(row => Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', '))
      .join('\n');

    const mensajeResultado = {
      role: 'assistant',
      content: `Resultado de la consulta SQL:\n${resultadoTexto}`,
      timestamp: new Date()
    };

    const mensajeSolicitaRedaccion = {
      role: 'user',
      content: 'Redacta un mensaje directo para enviarle al cliente con la información disponible.',
      timestamp: new Date()
    };

    conversacion.mensajes.push(
      { role: 'user', content: texto, timestamp: new Date() },
      { role: 'assistant', content: respuesta, timestamp: new Date() },
      mensajeResultado,
      mensajeSolicitaRedaccion
    );

    conversacion.ultima_interaccion = new Date();
    await conversacion.save();

    const historialReciente = conversacion.mensajes
      .filter(m => m.role && typeof m.content === 'string' && m.content.trim() !== '')
      .slice(-10);

    const { respuesta: respuestaFinal } = await obtenerRespuestaGPT(historialReciente, telefono);

    await enviarMensajeWhatsApp(telefono, respuestaFinal);

    conversacion.mensajes.push({
      role: 'assistant',
      content: respuestaFinal,
      timestamp: new Date()
    });
    await conversacion.save();

    return true;
  } catch (error) {
    console.error('❌ Error en flujo SQL conversacional:', error);
    await enviarMensajeWhatsApp(telefono, 'Ocurrió un error al procesar la consulta SQL.');
    return false;
  }
}

module.exports = { manejarFlujoSQLConversacional };
