const fs = require('fs');
const path = require('path');

/**
 * Carga la configuración del bot desde /config/presets/${tipoBot}.json
 * @param {string} tipoBot - Nombre del bot (ej: "1_asistente_ventas")
 * @returns {object} configuración del bot
 * @throws Error si el bot no existe
 */
function getBotConfig(tipoBot) {
  if (!tipoBot) {
    throw new Error('❌ [getBotConfig] tipoBot es requerido y no fue proporcionado.');
  }

  const presetPath = path.join(__dirname, `../config/presets/${tipoBot}.json`);

  try {
    return JSON.parse(fs.readFileSync(presetPath, 'utf8'));
  } catch (error) {
    throw new Error(`❌ No se pudo cargar el preset '${tipoBot}': ${error.message}`);
  }
}

module.exports = { getBotConfig };


