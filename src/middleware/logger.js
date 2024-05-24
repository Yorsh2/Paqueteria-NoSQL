// /src/middleware/logger.js

// Importar el módulo 'redis' para interactuar con una base de datos Redis
const redis = require('redis');

// Crear un cliente de Redis usando las variables de entorno para la configuración
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Manejar el evento de error del cliente de Redis
client.on('error', (err) => {
  console.error('Redis error de conexión:', err);
});

// Conectar el cliente de Redis
client.connect().then(() => {
  console.log('Conectado a Redis');
}).catch((err) => {
  console.error('Error de conexión a Redis:', err);
});

// Middleware para registrar solicitudes y respuestas
module.exports = (req, res, next) => {
  res.on('finish', async () => {
    if (!client.isOpen) {
      console.error('Redis client no conectado.');
      return;
    }

    // Crear una clave única para cada solicitud
    const key = `${req.method}:${Date.now()}:${req.originalUrl}`;

    // Crear una entrada de registro con la información de la solicitud y la respuesta
    const logEntry = JSON.stringify({
      time: new Date(),
      req: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body
      },
      res: {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        res: res.body
      }
    });

    // Guardar la entrada de registro en Redis con una expiración de 24 horas
    try {
      await client.set(key, logEntry, 'EX', 60 * 60 * 24);
    } catch (err) {
      console.error('Error al salvar:', err);
    }
  });

  // Pasar al siguiente middleware
  next();
};
