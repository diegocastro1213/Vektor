const axios = require('axios');

async function enviarMensajeWhatsApp(numeroDestino, mensaje) {
  const url = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_TOKEN;

  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: numeroDestino,
      type: 'text',
      text: { body: mensaje }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

module.exports = { enviarMensajeWhatsApp };
