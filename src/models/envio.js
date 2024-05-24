const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const envioSchema = new Schema({
  idEnvio: {type: Number, required: true},
  FechaEnvio: {type: String, required: true},
  Origen: {type: Number, required: true},
  Destino: {type: Number, required: true},
  Tipo_Envio: {type: Number, required: true},
  Cliente: {type: String,required: true},
  Peso: {type: Number,required: true},
  Dimensiones: {
    Largo: { type: Number, required: true },
    Ancho: { type: Number, required: true },
    Alto: { type: Number, required: true }
  },
  CostoTotal: {type: Number,required: true},
  Estatus: {type: String,required: true}
}, {
  timestamps: true
});

module.exports = mongoose.model('Envios', envioSchema);
