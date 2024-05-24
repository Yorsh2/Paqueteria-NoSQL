const mongoose = require('mongoose'); // Módulo para interactuar con MongoDB
const redis = require('redis'); // Módulo para interactuar con Redis
require('dotenv').config(); // Cargar variables de entorno desde un archivo .env
//------------------------------------------------------------------------------
const Cliente = require('../models/cliente');
const insertaClientes = require('../data/clientes');

const oficinaModel = require('../models/oficina');
const insertaOficina = require('../data/oficina');

const tEnvio = require('../models/tipoEnvio');
const insertarTEnvio = require('../data/tipoEnvio');

const Envios = require('../models/envio');
const insertEnvios = require('../data/envios');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then( async () => {
    console.log('Conectado a MongoDB'); // Mensaje de éxito en la conexión

    try{
      await Cliente.deleteMany();
      await Cliente.insertMany(insertaClientes);
      
      await oficinaModel.deleteMany();
      await oficinaModel.insertMany(insertaOficina);

      await tEnvio.deleteMany();
      await tEnvio.insertMany(insertarTEnvio);

      await Envios.deleteMany();
      await Envios.insertMany(insertEnvios);

      console.log('Se han insertado los archivos correctamente');
    }catch (error){
      console.error('Error al insertar los archivos',error);
    }
  })
  
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error); // Mensaje de error en la conexión
  });

// Configuración de Redis
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => {
  console.error('Error en la conexión a Redis:', err); // Mensaje de error en la conexión a Redis
});

redisClient.connect()
  .then(() => {
    console.log('Conectado a Redis'); // Mensaje de éxito en la conexión
  })
  .catch((err) => {
    console.error('No se pudo conectar a Redis:', err); // Mensaje de error en la conexión
  });

// Exportamos las instancias de mongoose y redisClient para usarlas en otras partes de la aplicación
module.exports = { mongoose, redisClient };
