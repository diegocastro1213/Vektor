const express = require('express');
const router = express.Router();
const Conversacion = require('../models/conversacion');

router.post('/asignar-bot', async (req, res) => {
  const { telefono, tipoBot } = req.body;

  if (!telefono || !tipoBot) {
    return res.status(400).send('Faltan datos: debes enviar { telefono, tipoBot }');
  }

  const conversacion = await Conversacion.findOne({ telefono });

  if (!conversacion) {
    return res.status(404).send('No se encontró conversación con ese número');
  }

  conversacion.tipoBot = tipoBot;
  await conversacion.save();

  res.send(`✅ Bot asignado correctamente: ${tipoBot}`);
});

module.exports = router;
