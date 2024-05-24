// /src/routes/alumnos.js

// Importar los módulos necesarios
const express = require('express'); // Framework para construir aplicaciones web y APIs
const router = express.Router(); // Módulo de enrutador de Express
const {
  obtenerTipoEnvio,
  crearTEnvio,
  obtenerTEbyID,
  actualizarTEnvio,
  eliminarTEnvio
} = require('../controllers/tipoEnvio'); // Importamos las funciones del controlador de alumnos

// Ruta para obtener todos los tipos de envío
router.get('/', obtenerTipoEnvio);

// Ruta para obtener un tipo de envío por su ID
router.get('/:idTDE', obtenerTEbyID);

// Ruta para crear un nuevo tipo de envío
router.post('/', crearTEnvio);

// Ruta para actualizar un tipo de envío por su ID
router.put('/:idTDE', actualizarTEnvio);

// Ruta para eliminar un tipo de envío por su ID
router.delete('/:idTDE', eliminarTEnvio);

// Exportamos el enrutador para cuando se requiera ser utilizado en otros archivos
module.exports = router;
