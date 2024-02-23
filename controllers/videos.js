const { response } = require('express');
const {Video} = require('../models');


const obtenerVideos = async(req, res = response ) => {
    const query = { estado: true };

    const [ total, videos ] = await Promise.all([
        Video.countDocuments(query),
        Video.find(query)
    ]);

    res.json({
        total,
        videos
    });
}

const obtenerVideo = async(req, res = response ) => {

    const { id } = req.params;
    const query = { estado: true };

    const [ total, videos ] = await Promise.all([
        Video.countDocuments(query),
        Video.findById(id)
    ]);

    res.json({
        total,
        videos
    });

}

const crearVideo = async(req, res = response ) => {

    try {
        const { estado, usuario, ...body } = req.body;

    const videoDB = await Video.findOne({ nombre: body.nombre });

    if ( videoDB ) {
        return res.status(400).json({
            msg: `El video ${ videoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const video = new Video( data );

    // Guardar DB
    await video.save();

    res.status(201).json({
        video,
        msg:"Video creado exitosamente"
    });
    } catch (error) {
       res.status(400).json({
        msg:"Error al crear el video"
       }) 
    }

    

}

const actualizarVideo = async( req, res = response ) => {

    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        if(!data.nombre) {
            return res.status(400).json({
                msg: 'El campo nombre no puede estar vacio'
            })
        }
    
        if( data.nombre ) {
            data.nombre  = data.nombre.toUpperCase();
        }
    
        data.usuario = req.usuario._id;
    
        const video = await Video.findByIdAndUpdate(id, data, { new: true });
    
        return res.status(200).json({
            video,
            msg:'Video editado correctamente'
        });
        

    } catch (error) {
        return res.status(400).json({
            msg:'Error al actualizar el video',
            error
        })
    }
}
   

const borrarVideo = async(req, res = response ) => {
    try {

        const { id } = req.params;

        const video = await Video.findById(id)

        if (video.estado === false) {
            return res.status(400).json({
                msg: "Este video ya ha sido borrado"
            })
        }
    const videoBorrado = await Video.findByIdAndUpdate( id, { estado: false }, {new: true });

    return res.status(200).json({
        msg:"Video eliminado Exitosamente",
        videoBorrado
    })
    } catch (error) {
        res.status(400).json({
            msg: "Error al eliminar consulte al administrador"
        })
    }
}




module.exports = {
    crearVideo,
    obtenerVideos,
    obtenerVideo,
    actualizarVideo,
    borrarVideo
}