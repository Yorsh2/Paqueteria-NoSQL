

// Importamos el modelo de Mongoose para Materia
const Oficina = require('../models/oficina');

const getOficinas = async (req, res) => {
  try {
    const oficinas = await Oficina.find();
    res.body = (oficinas);
    res.status(200).json(oficinas);
    
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las oficinas', error });
  }
};

const getOficinasById = async (req, res) => {
  try {
    const oficina = await Oficina.findOne({ idOficina: req.params.idOficina });
    if (!oficina) {
      return res.status(404).json({ message: 'Oficina no encontrada' });
    }
    res.body = (oficina);
    res.status(200).json(oficina);
    
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la oficina', error });
  }
};

const crearOficina = async (req, res) => {
  try {
    const nuevaOficina = new Oficina(req.body);
    const oficinaGuardada = await nuevaOficina.save();
    res.status(201).json(oficinaGuardada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la oficina', error });
  }
};

const actualizarOficina = async (req, res) => {
  try {
    const oficinaActualizada = await Oficina.findOneAndUpdate({ idOficina: req.params.idOficina }, req.body, { new: true });
    if (!oficinaActualizada) {
      return res.status(404).json({ message: 'Oficina no encontrada' });
    }
    res.status(200).json(oficinaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la oficina', error });
  }
};

const deleteOficina = async (req, res) => {
  try {
    const oficinaEliminada = await Oficina.findOneAndDelete({ idOficina: req.params.idOficina });
    if (!oficinaEliminada) {
      return res.status(404).json({ message: 'Oficina no encontrada' });
    }
    res.status(200).json({ message: 'Oficina eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la oficina', error });
  }
};

module.exports = {
  getOficinas,
  getOficinasById,
  crearOficina,
  actualizarOficina,
  deleteOficina
};
