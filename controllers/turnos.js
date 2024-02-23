const { response, request } = require("express");
const { Usuario, Turno } = require("../models");

const obtenerTurnos = async (req, res = response) => {
  try {
    const turnos = await Turno.find();

    res.status(200).json({
      msg: "Exito al obtener los comprobantes",
      turnos,
    });
  } catch (error) {
    res.status(400).json({
      msg: "No se han podido obtener los comprobantes",
      error,
    });
  }
};

const obtenerTurnoID = async (req, res = response) => {
  try {
    const { id } = req.params;

    const turnos = await Turno.findById(id);

    res.status(200).json({
      msg: "Comprobantes obtenidos",
      turnos,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error al obtener los comprobantes",
      error,
    });
  }
};

const agregarTurno = async (req, res = response) => {
  try {
    const {
      estado,
      img,
      usuario,
      titulo,
      precio,
      pago,
      linksesion,
      fechayhora,
      ...body
    } = req.body;

    const usuarioEncontrado = await Usuario.findById(usuario);

    const turnoHora = await Turno.findOne({ fechayhora });

    let turnos = await Turno.find();

    const turnoUsuario = await Turno.findOne({ usuario });

    if (!usuarioEncontrado) {
      return res.status(400).json({
        msg: "No hay usuario",
      });
    }

    let i = 0;
    let horatotalacumulada = [];

    let añoenbasededatos;

    let mesdb;

    let diadb;

    let acumulacionañosdb = []

    let acumulacionmesesdb = []

    let acumulaciondiasdb = []

    let horadb;

    let minutosdb;

    let horatotaldb;

    let año

    let mes;

    let dia;

    let hora;

    let minutos;

    let horatotal;

    let horariosdisponibles = [];

    año = fechayhora.slice(0,4)

    mes = fechayhora.slice(5, 7);

    dia = fechayhora.slice(8, 10);

    hora = fechayhora.slice(11, 13);

    minutos = fechayhora.slice(14);

    horatotal = hora + minutos;

    for (const turno of turnos) {
      añoenbasededatos = turno.fechayhora.slice(0, 4);

      mesdb = turno.fechayhora.slice(5, 7);

      diadb = turno.fechayhora.slice(8, 10);

      acumulacionañosdb[i] = añoenbasededatos

      acumulacionmesesdb[i] = mesdb

      acumulaciondiasdb[i] = diadb

      horadb = turno.fechayhora.slice(11, 13);

      minutosdb = turno.fechayhora.slice(14);

      horatotaldb = horadb + minutosdb;

      


      if ((acumulacionañosdb[i]==año) && (acumulacionmesesdb[i]==mes && acumulaciondiasdb[i]==dia)){
        horatotalacumulada[i] = horatotaldb;

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }

      

      if ((acumulacionañosdb[i]==año && acumulacionmesesdb[i]==mes) && (acumulaciondiasdb[i]==dia)){

        horatotalacumulada[i] = horatotaldb;

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }

      if ((acumulacionañosdb[i]==año && acumulaciondiasdb[i]==dia)&& (acumulacionmesesdb[i]==mes)){

        horatotalacumulada[i] = horatotaldb;

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }




      if (acumulacionañosdb[i]==año && acumulacionmesesdb[i]==mes && acumulaciondiasdb[i]==dia){
        horatotalacumulada[i] = horatotaldb;

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }
      

      
      
    }

    console.log(horariosdisponibles)
    console.log(horatotalacumulada);
    console.log(acumulacionañosdb)
    

    const sinhorarios = horariosdisponibles.filter(
      (horario) => horario < 100
    );

  
 

 
  
      if (sinhorarios[0]) {
          return res.status(400).json({
            msg: "La hora que queres poner no cumple con los requisitos",
          });
        }
      
    

    if (turnoHora) {
      return res.status(400).json({
        msg: `Ya existe un turno asignado en ese horario a nombre de ${turnoHora.usuario}`,
      });
    }

    if (turnoUsuario) {
      return res.status(400).json({
        msg: `Ya existe un turno asignado a nombre de ${turnoUsuario}`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
      titulo: titulo.toLowerCase(),
      linksesion: linksesion,
      precio,
      fechayhora: fechayhora.toString(),
      usuario: usuarioEncontrado._id,
    };

    const nuevoTurno = new Turno(data);

    // Guardar DB
    nuevoTurno.save(true);

    res.status(201).json({
      nuevoTurno,
      msg: "comprobante creado exitosamente",
    });
  } catch (error) {
    res.status(400).json(console.log(error));
  }
};

const editarTurno = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { estado, usuario, precio, pago, titulo, linksesion,fechayhora,img,...body } = req.body;

    const turnoencontrado = await Turno.findById(id)

    let turnos = await Turno.find();

    console.log(turnos)
    const Fechaturno = await Turno.findOne({ fechayhora });

    if(!turnoencontrado){
      return res.status(400).json({
        msg:'No hay un turno para editar'
      })
    }

    if (body.titulo === turnos.titulo) {
      return res.status(400).json({
        msg:'Intenta colocar otro titulo diferente'
      })
    }

     if (!precio && !titulo && !usuario && !linksesion && !fechayhora &&!pago ) {
      return res.status(400).json({
        msg: "los campos titulo, precio, linksesion ,fecha, hora y pago no pueden estar vacios",
      });
    }

    let i = 0;
    let horatotalacumulada = [];

    let añoenbasededatos;

    let mesdb;

    let diadb;

    let acumulacionañosdb = []

    let acumulacionmesesdb = []

    let acumulaciondiasdb = []

    let horadb;

    let minutosdb;

    let horatotaldb;

    let año

    let mes;

    let dia;

    let hora;

    let minutos;

    let horatotal;

    let horariosdisponibles = [];

    año = fechayhora.slice(0,4)

    mes = fechayhora.slice(5, 7);

    dia = fechayhora.slice(8, 10);

    hora = fechayhora.slice(11, 13);

    minutos = fechayhora.slice(14);

    horatotal = hora + minutos;

    for (const turno of turnos) {
      añoenbasededatos = turno.fechayhora.slice(0, 4);

      mesdb = turno.fechayhora.slice(5, 7);

      diadb = turno.fechayhora.slice(8, 10);

      acumulacionañosdb[i] = añoenbasededatos

      acumulacionmesesdb[i] = mesdb

      acumulaciondiasdb[i] = diadb

      horadb = turno.fechayhora.slice(11, 13);

      minutosdb = turno.fechayhora.slice(14);

      horatotaldb = horadb + minutosdb;

      if(turno._id==id){
        i= i + 1 
      }

      horatotalacumulada[i] = horatotaldb;

      if ((acumulacionañosdb[i]==año) && (acumulacionmesesdb[i]==mes && acumulaciondiasdb[i]==dia)){
      
        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }

      

      if ((acumulacionañosdb[i]==año && acumulacionmesesdb[i]==mes) && (acumulaciondiasdb[i]==dia)){

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }

      if ((acumulacionañosdb[i]==año && acumulaciondiasdb[i]==dia)&& (acumulacionmesesdb[i]==mes)){

        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }




      if (acumulacionañosdb[i]==año && acumulacionmesesdb[i]==mes && acumulaciondiasdb[i]==dia){
        
        horariosdisponibles[i] = horatotal - horatotalacumulada[i];

        horariosdisponibles[i] = Math.abs(horariosdisponibles[i])

        i = i + 1
      }
      

      
      
    }

    console.log(horariosdisponibles)
    console.log(horatotalacumulada);
    console.log(acumulacionañosdb)
    

    const sinhorarios = horariosdisponibles.filter(
      (horario) => horario < 100
    );

  
    console.log(sinhorarios)

 
  
      if (sinhorarios[0]) {
          return res.status(400).json({
            msg: "La hora que queres poner no cumple con los requisitos",
          });
        }


   
    
    

    for (const turno of turnos) {
      if (id!=turno._id && usuario==turno.usuario ) {
        return res.status(400).json({
          msg:'EL usuario que intentas agregar ya tiene un turno asignado intenta asignar otro usuario o elimina y intentalo nuevamente'
        })
      }
    }
    
    

    body.pago = pago
    body.precio = precio
    body.linksesion = linksesion
    body.titulo = titulo.toLowerCase();
    body.fechayhora = fechayhora
    body.usuario = usuario
    
    const TurnoActualizado = await Turno.findByIdAndUpdate(id, body, {
      new: true,
    });

    return res.status(200).json({
      TurnoActualizado,
      msg: "Producto editado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const borrarTurno = async (req, res = response) => {
  try {
    const { id } = req.params;

    const TurnoExiste = await Turno.findById(id);

    if (!TurnoExiste) {
      res.status(400).json({
        msg: "Comprobante no existe",
      });
    }

    if (TurnoExiste.estado === false) {
      res.status(400).json({
        msg: "El comprobante ya ha sido borrado",
      });
    }

    const turnoBorrado = await Turno.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.status(200).json({
      msg: "Comprobante eliminado",
      turnoBorrado,
    });
  } catch (error) {
    res.status(400).json({
      msg: "No se ha podido eliminar el comprobante",
    });
  }
};

module.exports = {
  agregarTurno,
  editarTurno,
  obtenerTurnos,
  obtenerTurnoID,
  borrarTurno,
};
