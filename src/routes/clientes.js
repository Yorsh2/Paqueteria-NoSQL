
// Importar los módulos necesarios
const express = require('express'); // Framework para construir aplicaciones web y APIs
const router = express.Router(); // Módulo de enrutador de Express
const {
  obtenerClientes,
  crearClientes,
  obtenerClientesPorCURP,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clientes'); // Importamos las funciones del controlador de alumnos

// Ruta para obtener todos los clientes
router.get('/', obtenerClientes);

// Ruta para obtener un cliente por su CURP
router.get('/:curp', obtenerClientesPorCURP);

// Ruta para crear un nuevo cliente
router.post('/', crearClientes);

// Ruta para actualizar un cliente por su CURP
router.put('/:curp', actualizarCliente);

// Ruta para eliminar un cliente por su CURP
router.delete('/:curp', eliminarCliente);

// Exportamos el enrutador para cuando se requiera ser utilizado en otros archivos


module.exports = router;
