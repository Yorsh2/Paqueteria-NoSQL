const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tipoEnvioSchema = new Schema({
  idTDE: {
    type: Number,
    required: true
  },
  Descripcion: {
    type: String,
    required: true
  },
  PrecioKm: {
    type: Number,
    required: true
  },
  tiempoEstimado: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tipo_Envio', tipoEnvioSchema);