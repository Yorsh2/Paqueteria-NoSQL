
const tEnvio = require('../models/tipoEnvio');

const obtenerTipoEnvio = async (req, res) => {
  try {
    const tenvio = await tEnvio.find();
    res.body = (tenvio);
    res.status(200).json(tenvio);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearTEnvio = async (req, res) => {
  const nuevoTE = new tEnvio(req.body);
  try {
    const tEGuardado = await nuevoTE.save();
    res.status(201).json(tEGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerTEbyID = async (req, res) => {
  try {
    const tipoEnvio = await tEnvio.findOne({ idTDE: req.params.idTDE });
    if (tipoEnvio == null) {
      return res.status(404).json({ message: 'No se encontró el tipo de envío' });
    }
    res.body = (tipoEnvio);
    res.status(200).json(tipoEnvio);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarTEnvio = async (req, res) => {
  try {
    const TEnvioActualizado = await tEnvio.findOneAndUpdate({ idTDE: req.params.idTDE }, req.body, { new: true });
    if (TEnvioActualizado == null) {
      return res.status(404).json({ message: 'No se encontró el tipo de envío' });
    }
    res.status(200).json(TEnvioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const eliminarTEnvio = async (req, res) => {
  try {
    const tipoEnvio = await tEnvio.findOneAndDelete({ idTDE: req.params.idTDE });
    if (tipoEnvio == null) {
      return res.status(404).json({ message: 'No se encontró el tipo de envío' });
    }
    res.status(200).json({ message: 'Tipo de Envío eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Exportamos las funciones del controlador
module.exports = {
  obtenerTipoEnvio,
  crearTEnvio,
  obtenerTEbyID,
  actualizarTEnvio,
  eliminarTEnvio
};
