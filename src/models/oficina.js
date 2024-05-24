const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const oficinaSchema = new Schema({
  idOficina: {type: Number,required: true,},
  Nombre: {type: String,required: true},
  Dirección: {
    Calle: { type: String, required: true },
    Número: { type: String, required: true },
    Ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true }
  },
  Teléfono: {type: String,required: true},
  Email: {type: String,required: true,}
}, {
  timestamps: true
});

module.exports = mongoose.model('Oficinas', oficinaSchema);