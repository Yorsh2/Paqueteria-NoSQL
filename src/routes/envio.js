// /src/routes/alumnos.js

// Importar los módulos necesarios
const express = require('express'); // Framework para construir aplicaciones web y APIs
const router = express.Router(); // Módulo de enrutador de Express
const {
  obtenerEnvios,
  crearEnvios,
  obtenerEnviosPorID,
  actualizarEnvio,
  eliminarEnvio,
  listarEnviosQ2,
  listarTEnviosQ3,
  listarEnviosQ4,
  listarClientesPorOficinaQ5,
  listarEnviosQ6,
  listarClientesYEnviosQ7,
  listarClientesYEnviosQ8
} = require('../controllers/envio'); // Importamos las funciones del controlador de alumnos

// Ruta para obtener todos los alumnos
// Cuando se hace una solicitud GET a la ruta raíz ("/"), se ejecuta la función obtenerAlumnos del controlador
router.get('/', obtenerEnvios);

// Ruta para obtener un alumno por su ID
// Cuando se hace una solicitud GET a la ruta con un parámetro de ID ("/:id"), se ejecuta la función obtenerAlumnoPorId del controlador
router.get('/:idEnvio', obtenerEnviosPorID);

// Ruta para crear un nuevo alumno
// Cuando se hace una solicitud POST a la ruta raíz ("/"), se ejecuta la función crearAlumno del controlador
router.post('/', crearEnvios);

// Ruta para actualizar un alumno por su ID
// Cuando se hace una solicitud PUT a la ruta con un parámetro de ID ("/:id"), se ejecuta la función actualizarAlumno del controlador
router.put('/:idEnvio', actualizarEnvio);

// Ruta para eliminar un alumno por su ID
// Cuando se hace una solicitud DELETE a la ruta con un parámetro de ID ("/:id"), se ejecuta la función eliminarAlumno del controlador
router.delete('/:idEnvio', eliminarEnvio);

router.get('/query/q2/:Origen',listarEnviosQ2);
router.get('/query/q3/:Tipo_Envio',listarTEnviosQ3);
router.get('/query/q4/:Cliente',listarEnviosQ4);
router.get('/query/q5/:Origen',listarClientesPorOficinaQ5);
router.get('/query/q6',listarEnviosQ6);
router.get('/query/q7',listarClientesYEnviosQ7);
router.get('/query/q8/:Origen',listarClientesYEnviosQ8);
// Exportamos el enrutador para cuando se requiera ser utilizado en otros archivos
module.exports = router;
