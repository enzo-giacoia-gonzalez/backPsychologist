const { response, request } = require("express");
const { Usuario, Comprobante } = require("../models");
const { getTemplatePay, sendEmailPay  } = require("../helpers/nodemailer");


	

const obtenerComprobantes = async (req, res = response) => {
  const query = { estado: true };

  
  try {
    const comprobantes = await Comprobante.find(query);

    res.status(200).json({
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

    return res.status(200).json({
      comprobantes,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los comprobantes",
      error,
    });
  }
};

const agregarComprobante = async (req = request, res = response) => {
  try {
    const { estado, usuario, titulo, pago, precio, moneda, fechayhora, linksesion, ...body } =
      req.body;


    const usuarioo = await Usuario.findById(usuario);

    if (!usuarioo) {
      return res.status(400).json({
        msg: "No hay usuario",
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
      moneda:moneda,
      linksesion:linksesion,
      fechayhora:horatotal,
      usuario: usuarioo._id,
    };

    const nuevoComprobante = new Comprobante(data);

    // Guardar DB
    nuevoComprobante.save(true);


    const template = getTemplatePay(usuarioo.nombre,linksesion,fechayhora);

    await sendEmailPay(usuarioo.correo, "Datos de la sesion", template);

    

    return res.status(201).json({
      nuevoComprobante,
      msg: "Pago realizado exitosamente. Revisa tu email y tus comprobantes",
    });
  } catch (error) {
    return res.status(400).json(console.log(error));
  }
};

const editarComprobante = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { estado,titulo, usuario, fechayhora, precio, pago,moneda, ...body } = req.body;

    const usuarioencontrado = await Usuario.findById(usuario);


    console.log(usuarioencontrado)

    if (!precio || !titulo || !usuario || !pago || !moneda) {
      return res.status(400).json({
        msg: "los campos Titulo, usuario, precio, pago y moneda no pueden estar vacios",
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
      moneda:moneda,
      fechayhora:horatotal,
      usuario: usuarioencontrado._id,
    };

    

    const comprobante = await Comprobante.findByIdAndUpdate(id, data, {
      new: true,
    });

    return res.status(200).json({
      comprobante,
      msg: "Comprobante editado correctamente",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      msg:'No se pudo editar el comprobante consulte con un administrador'
    })
  }
};





const borrarComprobante = async (req, res = response) => {

  try {
    const {id} = req.params

const comprobanteExiste = await Comprobante.findById(id)

if (!comprobanteExiste) {
  return res.status(400).json({
    msg:'Comprobante no existe'
  })
}

if (comprobanteExiste.estado === false) {
  return res.status(400).json({
    msg:'El comprobante ya ha sido borrado'
  })
}


const comprobanteBorrado = await Comprobante.findByIdAndUpdate( id, { estado: false }, {new: true });

return res.status(200).json({
  msg:'Comprobante eliminado',
  comprobanteBorrado
})
  } catch (error) {
    return res.status(400).json({
      msg:'No se ha podido eliminar el comprobante, consulte con el administrador'
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
