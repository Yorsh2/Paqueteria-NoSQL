const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const clienteSchema = new Schema({
  CURP: {type: String, required: true},
  Nombre: {type: String, required: true},
  Apellidos: {type: String, required: true},
  Email: {type: String, required: true}
},{timestamps: true});


module.exports = mongoose.model('Clientes', clienteSchema);
