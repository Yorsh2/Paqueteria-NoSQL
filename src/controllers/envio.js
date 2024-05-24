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
