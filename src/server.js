

require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express'); // Framework para construir aplicaciones web y APIs
const cors = require('cors'); // Middleware para permitir solicitudes de recursos cruzados
const morgan = require('morgan'); // Middleware para el registro de solicitudes HTTP
const logger = require('./middleware/logger'); // Middleware personalizado para registrar solicitudes en Redis
const { mongoose, redisClient } = require('./config/db'); // Importamos las configuraciones de MongoDB y Redis
const router = express.Router(); // Módulo de enrutador de Express

// Importamos las rutas
const clienteRuta = require('./routes/clientes'); 
const envioRuta = require('./routes/envio'); 
const oficinaRuta = require('./routes/oficina'); 
const tEnvioRuta = require('./routes/tipoEnvio'); 

const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan('dev'));
app.use(logger);

// Usamos las rutas importadas
app.use('/api/clientes', clienteRuta);
app.use('/api/envios', envioRuta);
app.use('/api/oficina', oficinaRuta);
app.use('/api/tipoEnvio', tEnvioRuta);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
