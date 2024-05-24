
// Importar los módulos necesarios
const express = require('express'); // Framework para construir aplicaciones web y APIs
const router = express.Router(); // Módulo de enrutador de Express
const {
  getOficinas,
  getOficinasById,
  crearOficina,
  actualizarOficina,
  deleteOficina
} = require('../controllers/oficinas'); // Importamos las funciones del controlador de alumnos

router.get('/', getOficinas);

router.post('/', crearOficina);

router.get('/:idOficina', getOficinasById);

router.put('/:idOficina', actualizarOficina);

router.delete('/:idOficina', deleteOficina);

// Exportamos el enrutador para cuando se requiera ser utilizado en otros archivos
module.exports = router;
