const Cliente = require('../models/cliente');

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.body = (clientes);
    res.status(200).json(clientes);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearClientes = async (req, res) => {
  const nuevoCliente = new Cliente(req.body);
  try {
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerClientesPorCURP = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ CURP: req.params.curp });
    if (!cliente) {
      return res.status(404).json({ message: 'No se encontró al cliente' });
    }
    res.body = (cliente);
    res.status(200).json(cliente);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findOneAndUpdate({ CURP: req.params.curp }, req.body, {
      new: true
    });
    if (!clienteActualizado) {
      return res.status(404).json({ message: 'No se encontró al cliente' });
    }
    res.status(200).json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndDelete({ CURP: req.params.curp });
    if (!cliente) {
      return res.status(404).json({ message: 'No se encontró al cliente' });
    }
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerClientes,
  crearClientes,
  obtenerClientesPorCURP,
  actualizarCliente,
  eliminarCliente
};
