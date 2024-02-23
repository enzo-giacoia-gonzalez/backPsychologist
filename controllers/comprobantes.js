const { response, request } = require("express");
const { Usuario, Comprobante } = require("../models");


	

const obtenerComprobantes = async (req, res = response) => {
  try {
    const comprobantes = await Comprobante.find();

    res.status(200).json({
      msg: "Exito al obtener los comprobantes",
      comprobantes,
    });
  } catch (error) {
    res.status(400).json({
      msg: "No se han podido obtener los comprobantes",
      error,
    });
  }
};

const obtenerComprobanteID = async (req, res = response) => {
  try {
    const { id } = req.params;

    const comprobantes = await Comprobante.findById(id);

    res.status(200).json({
      msg: "Comprobantes obtenidos",
      comprobantes,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error al obtener los comprobantes",
      error,
    });
  }
};

const agregarComprobante = async (req = request, res = response) => {
  try {
    const { estado, usuario, titulo, pago, precio, fechayhora, ...body } =
      req.body;

    const comprobante = await Comprobante.findOne({ titulo });

    const comprobanteHora = await Comprobante.findOne({ fechayhora });


    const usuarioo = await Usuario.findById(usuario);

    if (!usuarioo) {
      res.status(400).json({
        msg: "No hay usuario",
      });
    }

    if (comprobante || comprobanteHora) {
      return res.status(400).json({
        msg: `El comprobante ${comprobante} con ese nombre y/o hora, ya existe elige otro nombre y/o hora`,
      });
    }


    let año

    let mes;

    let dia;

    let hora;

    let minutos;

    let horatotal;


    año = fechayhora.slice(0,4)

    mes = fechayhora.slice(5, 7);

    dia = fechayhora.slice(8, 10);

    hora = fechayhora.slice(11, 13);

    minutos = fechayhora.slice(14);

    horatotal = año + "-"+ mes + "-" + dia  + "T" + hora + ":" + minutos;

    

    // Generar la data a guardar
    const data = {
      ...body,
      titulo: titulo.toLowerCase(),
      pago: pago,
      precio:precio,
      fechayhora:horatotal,
      usuario: usuarioo._id,
    };

    const nuevoComprobante = new Comprobante(data);

    // Guardar DB
    nuevoComprobante.save(true);

    res.status(201).json({
      nuevoComprobante,
      msg: "comprobante creado exitosamente",
    });
  } catch (error) {
    res.status(400).json(console.log(error));
  }
};

const editarComprobante = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { estado, usuario, precio, titulo, pago,fechayhora, ...body } = req.body;

    const usuarioencontrado = await Usuario.findById(usuario);


    console.log(usuarioencontrado)

    if (!precio || !titulo || !usuario || !pago) {
      return res.status(400).json({
        msg: "los campos Titulo, precio, usuario y pago no pueden estar vacios",
      });
    }

    if (body.titulo) {
      body.titulo = body.titulo.toLowerCase();
    }

    let año

    let mes;

    let dia;

    let hora;

    let minutos;

    let horatotal;


    año = fechayhora.slice(0,4)

    mes = fechayhora.slice(5, 7);

    dia = fechayhora.slice(8, 10);

    hora = fechayhora.slice(11, 13);

    minutos = fechayhora.slice(14);

    horatotal = año + "-"+ mes + "-" + dia  + "T" + hora + ":" + minutos;


    const data = {
      ...body,
      titulo: titulo.toLowerCase(),
      pago: pago,
      precio:precio,
      fechayhora:horatotal,
      usuario: usuarioencontrado._id,
    };

    

    const comprobante = await Comprobante.findByIdAndUpdate(id, data, {
      new: true,
    });

    return res.status(200).json({
      comprobante,
      msg: "Producto editado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};





const borrarComprobante = async (req, res = response) => {

  try {
    const {id} = req.params

const comprobanteExiste = await Comprobante.findById(id)

if (!comprobanteExiste) {
  res.status(400).json({
    msg:'Comprobante no existe'
  })
}

if (comprobanteExiste.estado === false) {
  res.status(400).json({
    msg:'El comprobante ya ha sido borrado'
  })
}


const comprobanteBorrado = await Comprobante.findByIdAndUpdate( id, { estado: false }, {new: true });

res.status(200).json({
  msg:'Comprobante eliminado',
  comprobanteBorrado
})
  } catch (error) {
    res.status(400).json({
      msg:'No se ha podido eliminar el comprobante'
    })
  }




};



module.exports = {
  agregarComprobante,
  editarComprobante,
  obtenerComprobantes,
  obtenerComprobanteID,
  borrarComprobante
};
