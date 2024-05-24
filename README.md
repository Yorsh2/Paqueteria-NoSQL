# Alumno: Guzman Alvarez Jorge Alberto
# Caso 01: Paqueteria
## Entidades:
```
Cliente:
	CURP
	Nombre
	Apellidos
	Email
Oficina:
	ID
	Nombre
	Dirección (calle, número, ciudad, código postal)
	Teléfono
	Email
Tipo de envío:
	ID
	Descripción (terrestre|aéreo|express)
	Precio por km
	Tiempo de entrega estimado
Envío:
	ID
	Fecha de envío
	Origen (oficina)
	Destino (oficina)
	Tipo de envío
	Cliente
	Peso
	Dimensiones
	Costo total
	Estatus (pendiente|tránsito|entregado)
```
## Esquema de archivo
```
/Paqueteria
|
|---/src
| |---/controllers
| | |---clientes.js
| | |---envio.js
| | |---oficinas.js
| | |---tipoEnvio.js
| |
| |---/data
| | |---clientes.js
| | |---envio.js
| | |---oficinas.js
| | |---tipoEnvio.js
| |
| |---/models
| | |---clientes.js
| | |---envio.js
| | |---oficinas.js
| | |---tipoEnvio.js
| |
| |---/routes
| | |---clientes.js
| | |---envio.js
| | |---oficinas.js
| | |---tipoEnvio.js
| |
| |---/middleware
| | |---logger.js
| |
| |---/config
| | |---db.js
| |
| |---server.js
|
|
|--Dockerfile
|--.dockerignore
|--docker-compose.yml
|--.env
```
##  Paquetes que se necesitan
```
npm install express
npm install mongoose
npm install redis
npm install body-parser dotenv
npm install cors
npm install morgan
```
# ARCHIVOS
## -------- Directorio controllers --------
### /src/controllers/clientes.js
```
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
```
### FIN /src/controllers/clientes.js

### /src/controllers/envio.js
```
const Envios = require('../models/envio');
const Clientes = require('../models/cliente');
const Oficinas = require('../models/oficina');
const TipoEnvio = require('../models/tipoEnvio');

const obtenerEnvios = async (req, res) => {
  try {
    const envio = await Envios.find();
    res.body = (envio);
    res.status(200).json(envio);
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearEnvios = async (req, res) => {
  const nuevoEnvio = new Envios(req.body);
  try {
    const enviosGuardados = await nuevoEnvio.save();
    res.status(201).json(enviosGuardados);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerEnviosPorID = async (req, res) => {
  try {
    const envio = await Envios.findOne({ idEnvio: req.params.idEnvio });
    if (envio == null) {
      return res.status(404).json({ message: 'No se encontró el tipo de envio' });
    }
    res.body = (envio);
    res.status(200).json(envio);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarEnvio = async (req, res) => {
  try {
    const EnvioActualizado = await Envios.findOneAndUpdate({ idEnvio: req.params.idEnvio }, req.body, { new: true });
    if (EnvioActualizado == null) {
      return res.status(404).json({ message: 'No se encontró el envio' });
    }
    res.status(200).json(EnvioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const eliminarEnvio = async (req, res) => {
  try {
    const envio = await Envios.findOneAndDelete({ idEnvio: req.params.idEnvio });
    if (envio == null) {
      return res.status(404).json({ message: 'No se encontró el envio' });
    }
    res.status(200).json({ message: 'Tipo de Envio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listarEnviosQ2 = async (req, res) => {
  const { Origen } = req.query;
  try {
    const query = { Origen: req.params.Origen, Estatus: "tránsito" };

    if (Origen) {query.Origen = Origen;}

    const envios = await Envios.find(query);

    const origenIds = [...new Set(envios.map(envio => envio.Origen))];
    const destinoIds = [...new Set(envios.map(envio => envio.Destino))];
    const oficinaIds = [...new Set([...origenIds, ...destinoIds])];

    const oficinas = await Oficinas.find({ idOficina: { $in: oficinaIds } });

    const oficinaMap = oficinas.reduce((map, oficina) => {
      map[oficina.idOficina] = oficina.Nombre;
      return map;
    }, {});

    const enviosConNombres = envios.map(envio => ({
      ...envio.toObject(),
      Origen: oficinaMap[envio.Origen] || 'Desconocido',
      Destino: oficinaMap[envio.Destino] || 'Desconocido'
    }));
    res.body = (enviosConNombres);
    res.status(200).json(enviosConNombres);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listarTEnviosQ3 = async (req, res) => {
  const { Tipo_Envio } = req.query;

  try {
    const query = { Tipo_Envio: req.params.Tipo_Envio };
    if (Tipo_Envio) {query.Tipo_Envio = Tipo_Envio;}

    const envios = await Envios.find(query);

    const tipoEnvioIds = [...new Set(envios.map(envio => envio.Tipo_Envio))];
    const tiposEnvio = await TipoEnvio.find({ idTDE: { $in: tipoEnvioIds } });

    const tipoEnvioMap = tiposEnvio.reduce((map, tipo) => {
      map[tipo.idTDE] = tipo.Descripcion;
      return map;
    }, {});

    const origenIds = [...new Set(envios.map(envio => envio.Origen))];
    const destinoIds = [...new Set(envios.map(envio => envio.Destino))];
    const oficinaIds = [...new Set([...origenIds, ...destinoIds])];

    const oficinas = await Oficinas.find({ idOficina: { $in: oficinaIds } });

    const oficinaMap = oficinas.reduce((map, oficina) => {
      map[oficina.idOficina] = oficina.Nombre;
      return map;
    }, {});

    const enviosConNombresYTipoEnvio = envios.map(envio => ({
      ...envio.toObject(),
      Origen: oficinaMap[envio.Origen] || 'Desconocido',
      Destino: oficinaMap[envio.Destino] || 'Desconocido',
      Tipo_Envio: tipoEnvioMap[envio.Tipo_Envio] || 'Desconocido'
    }));
    res.body = (enviosConNombresYTipoEnvio);  
    res.status(200).json(enviosConNombresYTipoEnvio);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listarEnviosQ4 = async (req, res) => {
  const { Cliente } = req.query;

  try {
    const query = { Cliente: req.params.Cliente };
    if (Cliente) {
      query.Cliente = Cliente;
    }

    const enviosCliente = await Envios.find(query);

    const clientesCURP = [...new Set(enviosCliente.map(envio => envio.Cliente))];

    const clientes = await Clientes.find({ CURP: { $in: clientesCURP } }, 'CURP Nombre Apellidos Email');

    const clientesYEnvios = await Promise.all(clientes.map(async (cliente) => {
      const enviosClienteCliente = enviosCliente.filter(envio => envio.Cliente === cliente.CURP);
      const enviosConInfo = await Promise.all(enviosClienteCliente.map(async (envio) => {
        const origen = await Oficinas.findOne({ idOficina: envio.Origen });
        const destino = await Oficinas.findOne({ idOficina: envio.Destino });

        return {
          ...envio.toObject(),
          Origen: origen ? origen.Nombre : 'Desconocido',
          Destino: destino ? destino.Nombre : 'Desconocido'
        };
      }));

      return {
        cliente,
        envios: enviosConInfo
      };
    }));
    res.body = (clientesYEnvios);
    res.status(200).json(clientesYEnvios);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const listarClientesPorOficinaQ5 = async (req, res) => {
  const { Origen } = req.query;

  try {
    const query = { Origen: req.params.Origen };
    if (Origen) {
      query.Origen = Origen;
    }
    const envios = await Envios.find(query);
    const clientesIds = [...new Set(envios.map(envio => envio.Cliente))];
    const clientes = await Clientes.find({ CURP: { $in: clientesIds } }, 'CURP Nombre Apellidos Email');
    res.body = (clientes);
    res.status(200).json(clientes);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listarEnviosQ6 = async (req, res) => {
  const { origen } = req.query;

  try {
    const query = { Estatus: "entregado" };
    if (origen) {
      query.Origen = origen;
    }

    const envios = await Envios.find(query);

    const origenIds = [...new Set(envios.map(envio => envio.Origen))];
    const destinoIds = [...new Set(envios.map(envio => envio.Destino))];
    const oficinaIds = [...new Set([...origenIds, ...destinoIds])];

    const oficinas = await Oficinas.find({ idOficina: { $in: oficinaIds } });

    const oficinaMap = oficinas.reduce((map, oficina) => {
      map[oficina.idOficina] = oficina.Nombre;
      return map;
    }, {});

    const enviosConNombres = envios.map(envio => ({
      ...envio.toObject(),
      Origen: oficinaMap[envio.Origen] || 'Desconocido',
      Destino: oficinaMap[envio.Destino] || 'Desconocido'
    }));
    res.body = (enviosConNombres);
    res.status(200).json(enviosConNombres);
    

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listarClientesYEnviosQ7 = async (req, res) => {
  try {
    const enviosTerrestres = await Envios.find({ Tipo_Envio: 1 });
    const clientesCURP = [...new Set(enviosTerrestres.map(envio => envio.Cliente))];
    const clientes = await Clientes.find({ CURP: { $in: clientesCURP } }, 'CURP Nombre Apellidos Email');

    // Obtener información de oficinas y tipos de envío
    const tipoEnvioIds = [...new Set(enviosTerrestres.map(envio => envio.Tipo_Envio))];
    const tiposEnvio = await TipoEnvio.find({ idTDE: { $in: tipoEnvioIds } });
    const tipoEnvioMap = tiposEnvio.reduce((map, tipo) => {
      map[tipo.idTDE] = tipo.Descripcion;
      return map;
    }, {});

    const origenIds = [...new Set(enviosTerrestres.map(envio => envio.Origen))];
    const destinoIds = [...new Set(enviosTerrestres.map(envio => envio.Destino))];
    const oficinaIds = [...new Set([...origenIds, ...destinoIds])];
    const oficinas = await Oficinas.find({ idOficina: { $in: oficinaIds } });
    const oficinaMap = oficinas.reduce((map, oficina) => {
      map[oficina.idOficina] = oficina.Nombre;
      return map;
    }, {});

    // Mapear clientes con sus envíos y agregar información de oficinas y tipos de envío
    const clientesYEnvios = clientes.map(cliente => ({
      cliente,
      envios: enviosTerrestres.filter(envio => envio.Cliente === cliente.CURP)
        .map(envio => ({
          ...envio.toObject(),
          Origen: oficinaMap[envio.Origen] || 'Desconocido',
          Destino: oficinaMap[envio.Destino] || 'Desconocido',
          Tipo_Envio: tipoEnvioMap[envio.Tipo_Envio] || 'Desconocido'
        }))
    }));
    res.body = (clientesYEnvios);
    res.status(200).json(clientesYEnvios);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Q8. Listar los clientes y sus envíos se han remitido por el servicio express considerando una oficina en específico.
const listarClientesYEnviosQ8 = async (req, res) => {
  const { Origen } = req.query;

  try {
    const query = { Origen: req.params.Origen, Tipo_Envio: 3 };
    if (Origen) { query.Origen = Origen; }

    const enviosExpress = await Envios.find(query);

    // Obtener clientes únicos de los envíos expres
    const clientesCURP = [...new Set(enviosExpress.map(envio => envio.Cliente))];

    // Encontrar la información de los clientes
    const clientes = await Clientes.find({ CURP: { $in: clientesCURP } }, 'CURP Nombre Apellidos Email');

    // Obtener información de oficinas y tipos de envío
    const origenIds = [...new Set(enviosExpress.map(envio => envio.Origen))];
    const destinoIds = [...new Set(enviosExpress.map(envio => envio.Destino))];
    const oficinaIds = [...new Set([...origenIds, ...destinoIds])];
    const oficinas = await Oficinas.find({ idOficina: { $in: oficinaIds } });
    const oficinaMap = oficinas.reduce((map, oficina) => {
      map[oficina.idOficina] = oficina.Nombre;
      return map;
    }, {});

    const tipoEnvioIds = [...new Set(enviosExpress.map(envio => envio.Tipo_Envio))];
    const tiposEnvio = await TipoEnvio.find({ idTDE: { $in: tipoEnvioIds } });
    const tipoEnvioMap = tiposEnvio.reduce((map, tipo) => {
      map[tipo.idTDE] = tipo.Descripcion;
      return map;
    }, {});

    // Mapear clientes con sus envíos y agregar información de oficinas y tipos de envío
    const clientesYEnvios = clientes.map(cliente => ({
      cliente,
      envios: enviosExpress.filter(envio => envio.Cliente === cliente.CURP)
        .map(envio => ({
          ...envio.toObject(),
          Origen: oficinaMap[envio.Origen] || 'Desconocido',
          Destino: oficinaMap[envio.Destino] || 'Desconocido',
          Tipo_Envio: tipoEnvioMap[envio.Tipo_Envio] || 'Desconocido'
        }))
    }));
    res.body = (clientesYEnvios);
    res.status(200).json(clientesYEnvios);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
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
};
```
### FIN /src/controllers/envio.js

### /src/controllers/oficinas.js
```
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
```
### FIN /src/controllers/oficinas.js

### /src/controllers/tipoEnvio.js
```
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
```
### FIN /src/controllers/tipoEnvio.js

## -------- Directorio data --------
### /src/data/clientes.js
```
module.exports = [
    {
        "CURP": "ABCDE12345",
        "Nombre": "Juan",
        "Apellidos": "Pérez",
        "Email": "juanperez@gmail.com"
    },
    {
        "CURP": "FGHIJ67890",
        "Nombre": "María",
        "Apellidos": "González",
        "Email": "mariagonzalez@gmail.com"
    },
    {
        "CURP": "KLMNO67890",
        "Nombre": "Carlos",
        "Apellidos": "López",
        "Email": "carloslopez@gmail.com"
    },
    {
        "CURP": "PQRST12345",
        "Nombre": "Laura",
        "Apellidos": "Martínez",
        "Email": "lauramartinez@gmail.com"
    },
    {
        "CURP": "UVWXY67890",
        "Nombre": "Alejandro",
        "Apellidos": "Hernández",
        "Email": "alejandrohernandez@gmail.com"
    },
    {
        "CURP": "ZABCD12345",
        "Nombre": "Fernanda",
        "Apellidos": "Sánchez",
        "Email": "fernandasanchez@gmail.com"
    },
    {
        "CURP": "EFGHI67890",
        "Nombre": "Roberto",
        "Apellidos": "Díaz",
        "Email": "robertodiaz@gmail.com"
    },
    {
        "CURP": "JKLMN12345",
        "Nombre": "Ana",
        "Apellidos": "Ramírez",
        "Email": "anaramirez@gmail.com"
    },
    {
        "CURP": "OPQRS67890",
        "Nombre": "Javier",
        "Apellidos": "Gutiérrez",
        "Email": "javiergutierrez@gmail.com"
    },
    {
        "CURP": "TUVWX12345",
        "Nombre": "Gabriela",
        "Apellidos": "Torres",
        "Email": "gabrielatorres@gmail.com"
    },
    {
        "CURP": "YZABC67890",
        "Nombre": "Sofía",
        "Apellidos": "Fernández",
        "Email": "sofiafernandez@gmail.com"
    },
    {
        "CURP": "DEFGH12345",
        "Nombre": "Ricardo",
        "Apellidos": "Martínez",
        "Email": "ricardomartinez@gmail.com"
    },
    {
        "CURP": "VWXYZ12345",
        "Nombre": "David",
        "Apellidos": "Gómez",
        "Email": "davidgomez@gmail.com"
    },
    {
        "CURP": "EFGHI67890",
        "Nombre": "Laura",
        "Apellidos": "Hernández",
        "Email": "laurahernandez@gmail.com"
    },
    {
        "CURP": "IJKLM12345",
        "Nombre": "Diego",
        "Apellidos": "Vargas",
        "Email": "diegovargas@gmail.com"
    },
    {
        "CURP": "NOPQR67890",
        "Nombre": "Patricia",
        "Apellidos": "Jiménez",
        "Email": "patriciajimenez@gmail.com"
    },
    {
        "CURP": "STUVW12345",
        "Nombre": "Roberta",
        "Apellidos": "Ruiz",
        "Email": "robertaruiz@gmail.com"
    },
    {
        "CURP": "XYZAB67890",
        "Nombre": "Luis",
        "Apellidos": "Torres",
        "Email": "luistorres@gmail.com"
    },
    {
        "CURP": "CDEFG12345",
        "Nombre": "Marcela",
        "Apellidos": "Sánchez",
        "Email": "marcelasanchez@gmail.com"
    },
    {
        "CURP": "HIJKL67890",
        "Nombre": "Pedro",
        "Apellidos": "Martínez",
        "Email": "pedromartinez@gmail.com"
    },
    {
        "CURP": "MNOPQ12345",
        "Nombre": "Lucía",
        "Apellidos": "Gutiérrez",
        "Email": "luciagutierrez@gmail.com"
    },
    {
        "CURP": "RSTUV67890",
        "Nombre": "Andrea",
        "Apellidos": "López",
        "Email": "andrealopez@gmail.com"
    },
    {
        "CURP": "WXYZA12345",
        "Nombre": "Pablo",
        "Apellidos": "Díaz",
        "Email": "pablodiaz@gmail.com"
    },
    {
        "CURP": "BCDEF67890",
        "Nombre": "Ana",
        "Apellidos": "Fernández",
        "Email": "anafernandez@gmail.com"
    },
    {
        "CURP": "GHIJK12345",
        "Nombre": "Diego",
        "Apellidos": "Martínez",
        "Email": "diegomartinez2@gmail.com"
    },
    {
        "CURP": "LMNOP67890",
        "Nombre": "Carolina",
        "Apellidos": "Hernández",
        "Email": "carolinahernandez@gmail.com"
    },
    {
        "CURP": "QRSTU12345",
        "Nombre": "Jorge",
        "Apellidos": "Pérez",
        "Email": "jorgeperez@gmail.com"
    },
    {
        "CURP": "VWXYZ67890",
        "Nombre": "Isabella",
        "Apellidos": "Sánchez",
        "Email": "isabelladsanchez@gmail.com"
    },
    {
        "CURP": "ABCDE24589",
        "Nombre": "Felipe",
        "Apellidos": "García",
        "Email": "felipegarcia@gmail.com"
    },
    {
        "CURP": "FGHIJ67890",
        "Nombre": "María",
        "Apellidos": "Torres",
        "Email": "mariatorres@gmail.com"
    },
    {
        "CURP": "KLMNO67890",
        "Nombre": "Alejandra",
        "Apellidos": "Martínez",
        "Email": "alejandramartinez@gmail.com"
    },
    {
        "CURP": "PQRST12345",
        "Nombre": "Ricardo",
        "Apellidos": "López",
        "Email": "ricardolopez@gmail.com"
    },
    {
        "CURP": "UVWXY67890",
        "Nombre": "Sofía",
        "Apellidos": "González",
        "Email": "sofiagonzalez@gmail.com"
    },
    {
        "CURP": "ZABCD12345",
        "Nombre": "Javier",
        "Apellidos": "Ramírez",
        "Email": "javierramirez@gmail.com"
    },
    {
        "CURP": "EFGHI67890",
        "Nombre": "Ana",
        "Apellidos": "Hernández",
        "Email": "anahernandez@gmail.com"
    },
    {
        "CURP": "JKLMN12345",
        "Nombre": "Diego",
        "Apellidos": "Sánchez",
        "Email": "diegosanchez@gmail.com"
    },
    {
        "CURP": "OPQRS67890",
        "Nombre": "Valentina",
        "Apellidos": "Gómez",
        "Email": "valentinagomez@gmail.com"
    },
    {
        "CURP": "TUVWX12345",
        "Nombre": "Carlos",
        "Apellidos": "Fernández",
        "Email": "carlosfernandez@gmail.com"
    },
    {
        "CURP": "YZABC67890",
        "Nombre": "Mariana",
        "Apellidos": "Martínez",
        "Email": "marianamartinez@gmail.com"
    },
    {
        "CURP": "DEFGH12345",
        "Nombre": "Luis",
        "Apellidos": "García",
        "Email": "luisgarcia@gmail.com"
    }
];
```
### FIN /src/data/clientes.js

### /src/data/envios.js
```
module.exports = [
  {
    "idEnvio": 1,
    "FechaEnvio": "2024-04-11",
    "Origen": 1,
    "Destino": 2,
    "Tipo_Envio": 1,
    "Cliente": "ABCDE12345",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 25,
      "Ancho": 15,
      "Alto": 12
    },
    "CostoTotal": 150,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 2,
    "FechaEnvio": "2024-05-05",
    "Origen": 2,
    "Destino": 3,
    "Tipo_Envio": 2,
    "Cliente": "FGHIJ67890",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 30,
      "Ancho": 20,
      "Alto": 10
    },
    "CostoTotal": 300,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 3,
    "FechaEnvio": "2024-06-10",
    "Origen": 3,
    "Destino": 4,
    "Tipo_Envio": 3,
    "Cliente": "KLMNO67890",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 35,
      "Ancho": 25,
      "Alto": 15
    },
    "CostoTotal": 450,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 4,
    "FechaEnvio": "2024-07-15",
    "Origen": 4,
    "Destino": 1,
    "Tipo_Envio": 1,
    "Cliente": "PQRST12345",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 25,
      "Ancho": 15,
      "Alto": 12
    },
    "CostoTotal": 150,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 5,
    "FechaEnvio": "2024-08-20",
    "Origen": 1,
    "Destino": 3,
    "Tipo_Envio": 3,
    "Cliente": "UVWXY67890",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 30,
      "Ancho": 20,
      "Alto": 10
    },
    "CostoTotal": 300,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 6,
    "FechaEnvio": "2024-09-25",
    "Origen": 2,
    "Destino": 4,
    "Tipo_Envio": 1,
    "Cliente": "ZABCD12345",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 35,
      "Ancho": 25,
      "Alto": 15
    },
    "CostoTotal": 200,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 7,
    "FechaEnvio": "2024-10-30",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 2,
    "Cliente": "EFGHI67890",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 25,
      "Ancho": 15,
      "Alto": 12
    },
    "CostoTotal": 250,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 8,
    "FechaEnvio": "2024-11-05",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 1,
    "Cliente": "ABCDE12345",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 30,
      "Ancho": 20,
      "Alto": 10
    },
    "CostoTotal": 350,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 9,
    "FechaEnvio": "2024-12-10",
    "Origen": 1,
    "Destino": 4,
    "Tipo_Envio": 1,
    "Cliente": "KLMNO67890",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 35,
      "Ancho": 25,
      "Alto": 15
    },
    "CostoTotal": 400,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 10,
    "FechaEnvio": "2025-01-15",
    "Origen": 2,
    "Destino": 3,
    "Tipo_Envio": 2,
    "Cliente": "PQRST12345",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 25,
      "Ancho": 15,
      "Alto": 12
    },
    "CostoTotal": 200,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 11,
    "FechaEnvio": "2025-02-20",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 3,
    "Cliente": "DEFGH12345",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 30,
      "Ancho": 20,
      "Alto": 10
    },
    "CostoTotal": 300,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 12,
    "FechaEnvio": "2025-03-25",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 1,
    "Cliente": "EFGHI67890",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 25,
      "Ancho": 15,
      "Alto": 12
    },
    "CostoTotal": 200,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 13,
    "FechaEnvio": "2025-04-30",
    "Origen": 1,
    "Destino": 3,
    "Tipo_Envio": 2,
    "Cliente": "HIJKL67890",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 35,
      "Ancho": 25,
      "Alto": 15
    },
    "CostoTotal": 400,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 14,
    "FechaEnvio": "2025-05-05",
    "Origen": 2,
    "Destino": 4,
    "Tipo_Envio": 3,
    "Cliente": "MNOPQ12345",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 28,
      "Ancho": 18,
      "Alto": 8
    },
    "CostoTotal": 350,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 15,
    "FechaEnvio": "2025-06-10",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 1,
    "Cliente": "RSTUV67890",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 22,
      "Ancho": 12,
      "Alto": 7
    },
    "CostoTotal": 180,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 16,
    "FechaEnvio": "2025-07-15",
    "Origen": 4,
    "Destino": 3,
    "Tipo_Envio": 2,
    "Cliente": "WXYZA12345",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 38,
      "Ancho": 28,
      "Alto": 18
    },
    "CostoTotal": 420,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 17,
    "FechaEnvio": "2025-08-20",
    "Origen": 1,
    "Destino": 2,
    "Tipo_Envio": 1,
    "Cliente": "BCDEF67890",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 32,
      "Ancho": 22,
      "Alto": 12
    },
    "CostoTotal": 280,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 18,
    "FechaEnvio": "2025-09-25",
    "Origen": 2,
    "Destino": 1,
    "Tipo_Envio": 3,
    "Cliente": "GHIJK12345",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 24,
      "Ancho": 14,
      "Alto": 9
    },
    "CostoTotal": 220,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 19,
    "FechaEnvio": "2025-10-30",
    "Origen": 3,
    "Destino": 4,
    "Tipo_Envio": 2,
    "Cliente": "LMNOP67890",
    "Peso": 5,
    "Dimensiones": {
      "Largo": 40,
      "Ancho": 30,
      "Alto": 20
    },
    "CostoTotal": 480,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 20,
    "FechaEnvio": "2025-11-05",
    "Origen": 4,
    "Destino": 3,
    "Tipo_Envio": 1,
    "Cliente": "OPQRS67890",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 26,
      "Ancho": 16,
      "Alto": 11
    },
    "CostoTotal": 240,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 21,
    "FechaEnvio": "2025-12-10",
    "Origen": 1,
    "Destino": 4,
    "Tipo_Envio": 3,
    "Cliente": "TUVWX12345",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 36,
      "Ancho": 26,
      "Alto": 16
    },
    "CostoTotal": 400,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 22,
    "FechaEnvio": "2026-01-15",
    "Origen": 2,
    "Destino": 3,
    "Tipo_Envio": 2,
    "Cliente": "YZABC67890",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 27,
      "Ancho": 17,
      "Alto": 11
    },
    "CostoTotal": 320,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 23,
    "FechaEnvio": "2026-02-20",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 1,
    "Cliente": "DEFGH12345",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 34,
      "Ancho": 24,
      "Alto": 14
    },
    "CostoTotal": 380,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 24,
    "FechaEnvio": "2026-03-25",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 3,
    "Cliente": "VWXYZ67890",
    "Peso": 2,
    "Dimensiones": {
      "Largo": 23,
      "Ancho": 13,
      "Alto": 8
    },
    "CostoTotal": 210,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 25,
    "FechaEnvio": "2026-04-30",
    "Origen": 1,
    "Destino": 3,
    "Tipo_Envio": 1,
    "Cliente": "ABCDE12345",
    "Peso": 3,
    "Dimensiones": {
      "Largo": 31,
      "Ancho": 21,
      "Alto": 12
    },
    "CostoTotal": 290,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 26,
    "FechaEnvio": "2026-05-05",
    "Origen": 2,
    "Destino": 4,
    "Tipo_Envio": 2,
    "Cliente": "FGHIJ67890",
    "Peso": 5,
    "Dimensiones": {
      "Largo": 42,
      "Ancho": 32,
      "Alto": 22
    },
    "CostoTotal": 500,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 27,
    "FechaEnvio": "2026-06-10",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 3,
    "Cliente": "KLMNO67890",
    "Peso": 4,
    "Dimensiones": {
      "Largo": 37,
      "Ancho": 27,
      "Alto": 17
    },
    "CostoTotal": 420,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 28,
    "FechaEnvio": "2026-07-15",
    "Origen": 4,
    "Destino": 3,
    "Tipo_Envio": 1,
    "Cliente": "PQRST12345",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 33,
        "Ancho": 23,
        "Alto": 13
    },
    "CostoTotal": 320,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 29,
    "FechaEnvio": "2026-08-20",
    "Origen": 1,
    "Destino": 2,
    "Tipo_Envio": 2,
    "Cliente": "UVWXY67890",
    "Peso": 2,
    "Dimensiones": {
        "Largo": 26,
        "Ancho": 16,
        "Alto": 11
    },
    "CostoTotal": 250,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 30,
    "FechaEnvio": "2026-09-25",
    "Origen": 2,
    "Destino": 1,
    "Tipo_Envio": 3,
    "Cliente": "ZABCD12345",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 29,
        "Ancho": 19,
        "Alto": 10
    },
    "CostoTotal": 280,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 31,
    "FechaEnvio": "2026-10-30",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 1,
    "Cliente": "EFGHI67890",
    "Peso": 4,
    "Dimensiones": {
        "Largo": 38,
        "Ancho": 28,
        "Alto": 18
    },
    "CostoTotal": 400,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 32,
    "FechaEnvio": "2026-11-05",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 2,
    "Cliente": "ABCDE12345",
    "Peso": 5,
    "Dimensiones": {
        "Largo": 43,
        "Ancho": 33,
        "Alto": 23
    },
    "CostoTotal": 450,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 33,
    "FechaEnvio": "2026-12-10",
    "Origen": 1,
    "Destino": 3,
    "Tipo_Envio": 3,
    "Cliente": "FGHIJ67890",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 32,
        "Ancho": 22,
        "Alto": 12
    },
    "CostoTotal": 330,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 34,
    "FechaEnvio": "2027-01-15",
    "Origen": 2,
    "Destino": 4,
    "Tipo_Envio": 1,
    "Cliente": "HIJKL67890",
    "Peso": 4,
    "Dimensiones": {
        "Largo": 37,
        "Ancho": 27,
        "Alto": 17
    },
    "CostoTotal": 380,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 35,
    "FechaEnvio": "2027-02-20",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 2,
    "Cliente": "MNOPQ12345",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 31,
        "Ancho": 21,
        "Alto": 11
    },
    "CostoTotal": 300,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 36,
    "FechaEnvio": "2027-03-25",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 3,
    "Cliente": "RSTUV67890",
    "Peso": 2,
    "Dimensiones": {
        "Largo": 26,
        "Ancho": 16,
        "Alto": 10
    },
    "CostoTotal": 250,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 37,
    "FechaEnvio": "2027-04-30",
    "Origen": 1,
    "Destino": 3,
    "Tipo_Envio": 1,
    "Cliente": "WXYZA12345",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 33,
        "Ancho": 23,
        "Alto": 13
    },
    "CostoTotal": 320,
    "Estatus": "entregado"
  },
  {
    "idEnvio": 38,
    "FechaEnvio": "2027-05-05",
    "Origen": 2,
    "Destino": 4,
    "Tipo_Envio": 2,
    "Cliente": "BCDEF67890",
    "Peso": 4,
    "Dimensiones": {
        "Largo": 38,
        "Ancho": 28,
        "Alto": 18
    },
    "CostoTotal": 370,
    "Estatus": "pendiente"
  },
  {
    "idEnvio": 39,
    "FechaEnvio": "2027-06-10",
    "Origen": 3,
    "Destino": 1,
    "Tipo_Envio": 3,
    "Cliente": "GHIJK12345",
    "Peso": 5,
    "Dimensiones": {
        "Largo": 43,
        "Ancho": 33,
        "Alto": 23
    },
    "CostoTotal": 430,
    "Estatus": "tránsito"
  },
  {
    "idEnvio": 40,
    "FechaEnvio": "2027-07-15",
    "Origen": 4,
    "Destino": 2,
    "Tipo_Envio": 1,
    "Cliente": "LMNOP67890",
    "Peso": 3,
    "Dimensiones": {
        "Largo": 32,
        "Ancho": 22,
        "Alto": 12
    },
    "CostoTotal": 310,
    "Estatus": "entregado"
  }
];
```
### FIN /src/data/envios.js

### /src/data/oficina.js
```
module.exports = [
    {
    "idOficina": 1,
    "Nombre": "Oficina Central",
    "Dirección": {
        "Calle": "Av. Principal",
        "Número": "123",
        "Ciudad": "Ciudad de México",
        "codigoPostal": "12345"
    },
    "Teléfono": "1234567890",
    "Email": "oficina@empresa.com"    
    },
    {
    "idOficina": 2,
    "Nombre": "Oficina Norte",
    "Dirección": {
        "Calle": "Av. Norte",
        "Número": "456",
        "Ciudad": "Monterrey",
        "codigoPostal": "54321"
    },
    "Teléfono": "0987654321",
    "Email": "oficina.norte@empresa.com"    
    },
    {
    "idOficina": 3,
    "Nombre": "Oficina Sur",
    "Dirección": {
        "Calle": "Av. Sur",
        "Número": "789",
        "Ciudad": "Guadalajara",
        "codigoPostal": "67890"
        },
        "Teléfono": "9876543210",
        "Email": "oficina.sur@empresa.com"
    },
    {
    "idOficina": 4,
    "Nombre": "Oficina Este",
    "Dirección": {
        "Calle": "Av. Este",
        "Número": "1011",
        "Ciudad": "Tijuana",
        "codigoPostal": "54321"
    },
        "Teléfono": "1357924680",
        "Email": "oficina.este@empresa.com"
    },
    {
    "idOficina": 5,
    "Nombre": "Oficina Oeste",
    "Dirección": {
        "Calle": "Av. Oeste",
        "Número": "1213",
        "Ciudad": "Acapulco",
        "codigoPostal": "24680"
        },
        "Teléfono": "2468013579",
        "Email": "oficina.oeste@empresa.com"
    }
];
```
### FIN /src/data/oficina.js

### /src/data/tipoEnvio.js
```
module.exports = [
    {
        "idTDE": 1,
        "Descripcion": "Terrestre",
        "PrecioKm": 150,
        "tiempoEstimado": "2 días"
    },
    {
        "idTDE": 2,
        "Descripcion": "Aéreo",
        "PrecioKm": 250,
        "tiempoEstimado": "1 día"
    },  
    {
        "idTDE": 3,
        "Descripcion": "Express",
        "PrecioKm": 300,
        "tiempoEstimado": "12 horas"
    }
];
```
### FIN /src/data/tipoEnvio.js

## -------- Directorio models --------
### /src/models/cliente.js
```
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const clienteSchema = new Schema({
  CURP: {type: String, required: true},
  Nombre: {type: String, required: true},
  Apellidos: {type: String, required: true},
  Email: {type: String, required: true}
},{timestamps: true});


module.exports = mongoose.model('Clientes', clienteSchema);
```
### FIN /src/models/cliente.js

### /src/models/envio.js
```
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const envioSchema = new Schema({
  idEnvio: {type: Number, required: true},
  FechaEnvio: {type: String, required: true},
  Origen: {type: Number, required: true},
  Destino: {type: Number, required: true},
  Tipo_Envio: {type: Number, required: true},
  Cliente: {type: String,required: true},
  Peso: {type: Number,required: true},
  Dimensiones: {
    Largo: { type: Number, required: true },
    Ancho: { type: Number, required: true },
    Alto: { type: Number, required: true }
  },
  CostoTotal: {type: Number,required: true},
  Estatus: {type: String,required: true}
}, {
  timestamps: true
});

module.exports = mongoose.model('Envios', envioSchema);
```
### FIN /src/models/envio.js

### /src/models/oficina.js
```
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const oficinaSchema = new Schema({
  idOficina: {type: Number,required: true,},
  Nombre: {type: String,required: true},
  Dirección: {
    Calle: { type: String, required: true },
    Número: { type: String, required: true },
    Ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true }
  },
  Teléfono: {type: String,required: true},
  Email: {type: String,required: true,}
}, {
  timestamps: true
});

module.exports = mongoose.model('Oficinas', oficinaSchema);
```
### FIN /src/models/oficina.js

### /src/models/tipoEnvio.js
```
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tipoEnvioSchema = new Schema({
  idTDE: {
    type: Number,
    required: true
  },
  Descripcion: {
    type: String,
    required: true
  },
  PrecioKm: {
    type: Number,
    required: true
  },
  tiempoEstimado: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tipo_Envio', tipoEnvioSchema);   
```
### FIN /src/models/tipoEnvio.js

## -------- Directorio routes --------
### /src/routes/clientes.js
```
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
```
### FIN /src/routes/clientes.js

### /src/routes/envio.js
```
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
```
### FIN /src/routes/envio.js

### /src/routes/oficina.js
```
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
```
### FIN /src/routes/oficina.js

### /src/routes/tipoEnvio.js
```
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
```
### FIN /src/routes/tipoEnvio.js

## -------- Directorio config --------
### /src/config/db.js
```
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
```
### FIN /src/config/db.js

## -------- Directorio middleware --------
### /src/middleware/logger.js
```
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
```
### FIN /src/middleware/logger.js
## -------- Server --------
## /src/server.js
```
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
```
### FIN /src/server.js

## .env
```
# URI de conexión a la base de datos MongoDB
# Formato: mongodb://[usuario:contraseña@]host:puerto/baseDeDatos
MONGO_URI=mongodb://mongo01:27017/Paqueteria
# Host del servidor Redis
# Generalmente es el nombre del servicio definido en docker-compose o la dirección IP del servidor Redis
REDIS_HOST=redis01
# Puerto en el que Redis está escuchando
REDIS_PORT=6379
# Puerto en el que nuestra aplicaci'on Node.js escuchará
PORT=3000
#
```
## FIN .env

## docker-compose.yml
```
version: '3.8'

services:
  app01:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo01
      - redis01
    environment:
      - MONGO_URI=mongodb://mongo01:27017/Paqueteria
      - REDIS_HOST=redis01
      - REDIS_PORT=6379
      - PORT=3000
    networks:
      - red01

  mongo01:
    image: mongo:latest
    command: mongod --replSet replica01
    ports:
      - "27018:27017"
    healthcheck:
      test: >
        echo "try { rs.status() } catch (err) { 
          rs.initiate({
            _id: 'replica01', 
            members: [
              { _id: 0, host: 'mongo01:27017', priority: 1 },
              { _id: 1, host: 'mongo-secondary1:27017', priority: 0.5 },
              { _id: 2, host: 'mongo-secondary2:27017', priority: 0.5 },
              { _id: 3, host: 'mongo-secondary3:27017', priority: 0.5 }
            ]
          }) 
        }" | mongosh --port 27017 --quiet
      interval: 5s
      timeout: 30s
      start_period: 0s
      retries: 30
    depends_on:
      - redis01
    networks:
      - red01

  mongo-secondary1:
    image: mongo:latest
    command: mongod --replSet replica01
    ports:
      - "27019:27017"
    depends_on:
      - mongo01
      - redis01
    networks:
      - red01

  mongo-secondary2:
    image: mongo:latest
    command: mongod --replSet replica01
    ports:
      - "27020:27017"
    depends_on:
      - mongo-secondary1
      - redis01
    networks:
      - red01

  mongo-secondary3:
    image: mongo:latest
    command: mongod --replSet replica01
    ports:
      - "27021:27017"
    depends_on:
      - mongo-secondary2
      - redis01
    networks:
      - red01

  redis01:
    image: redis:latest
    ports:
      - "6379:6379"
    networks:
      - red01

networks:
  red01:
    driver: bridge
```
## FIN docker-compose.yml

## Dockerfile
```
# Usar la imagen oficial de Node.js como base
FROM node
# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./
# Instalar las dependencias del proyecto
RUN npm install
# Copiar el resto de los archivos del proyecto al directorio de trabajo
COPY . .
# Exponer el puerto en el que la aplicación va a correr
EXPOSE 3000
# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]
```
## FIN Dockerfile
