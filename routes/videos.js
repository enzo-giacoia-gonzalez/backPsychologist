const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {  crearVideo,
    obtenerVideos,
    obtenerVideo,
    actualizarVideo,
    borrarVideo } = require('../controllers/videos');

const { existeVideoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerVideos );


// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeVideoPorId ),
    validarCampos,
], obtenerVideo );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    esAdminRole,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearVideo );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeVideoPorId ),
    validarCampos
], actualizarVideo );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeVideoPorId ),
    validarCampos,
], borrarVideo);


module.exports = router;