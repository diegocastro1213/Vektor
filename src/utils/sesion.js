const Conversacion = require('../models/conversacion');

async function obtenerConversacionActiva(telefono) {
  const ahora = new Date();
  let conversacion = await Conversacion.findOne({ telefono });

  if (!conversacion) {
    conversacion = new Conversacion({
      telefono,
      mensajes: [],
      ultima_interaccion: ahora
    });
    await conversacion.save();
    return conversacion;
  }

  const ultimoMensajeUsuario = [...conversacion.mensajes]
    .reverse()
    .find(m => m.role === 'user');

  if (!ultimoMensajeUsuario) {
    conversacion.ultima_interaccion = ahora;
    await conversacion.save();
    return conversacion;
  }

  const minutosDesdeUltimoMensaje =
    (ahora - new Date(ultimoMensajeUsuario.timestamp)) / (1000 * 60);
  const timeout = parseInt(process.env.SESSION_TIMEOUT_MINUTES || '60');

  if (minutosDesdeUltimoMensaje > timeout) {
    // 🧹 Replace: limpiar y reusar mismo documento
    conversacion.mensajes = [];
    conversacion.ultima_interaccion = ahora;
    await conversacion.save();
    return conversacion;
  }

  conversacion.ultima_interaccion = ahora;
  await conversacion.save();
  return conversacion;
}

module.exports = { obtenerConversacionActiva };
