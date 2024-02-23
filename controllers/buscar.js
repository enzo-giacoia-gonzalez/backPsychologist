const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Turno, Comprobante } = require('../models');

const coleccionesPermitidas = [
    'comprobantes',
    'roles',
    'turnos',
    'usuarios',
];


const buscarComprobantes= async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const comprobante = await Comprobante.findById(termino);
        return res.json({
            results: ( comprobante ) ? [ comprobante ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const comprobantes  = await Comprobante.find({
        $or: [{ titulo: regex }, { fechayhora: regex } ],
        $and: [{ estado: true }]
    });

    res.json({
        results: comprobantes
    });

}

const buscarTurnos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const turno = await Turno.findById(termino);
        return res.json({
            results: ( turno ) ? [ turno ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const turnos  = await Turno.find({
        $or: [{ titulo: regex }, { fechayhora: regex } ],
        $and: [{ estado: true }]
    });

    res.json({
        results: turnos
    });

}


const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    

    res.json({
        results: usuarios,
    });

}


const buscar = ( req, res = response ) => {
    
    const { coleccion, termino  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'comprobantes':
            buscarComprobantes(termino, res);
        break;
        case 'turnos':
            buscarTurnos(termino, res);
        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }

}



module.exports = {
    buscar
}