const Role = require('../models/role');
const { Usuario, Video } = require('../models');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo }) ;
    if ( existeEmail ) {
        throw new Error(`Estas intentando editar el correo ${ correo } por el mismo intentar poner uno nuevo o directamente no poner nada`);
    }
}


const emailCorrecto = ( correo = '' ) => {

     const regexcorreo = correo.match(
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      );

      if (regexcorreo) {
        throw new Error(`El correo ${correo } es incorrecto`);
      }

};




const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


const existeVideoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeVideo = await Video.findById(id);
    if ( !existeVideo ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeVideoPorId,
    emailCorrecto,
    coleccionesPermitidas
    
}

