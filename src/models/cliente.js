const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre_cliente: { type: String, required: true },
  telefono: { type: String, required: true, unique: true },
  tipoBot: { type: String, required: true },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  canal: { type: String },
  fecha_activacion: { type: Date, default: Date.now },
  notas: { type: String }
});

module.exports = mongoose.model('Cliente', clienteSchema);
