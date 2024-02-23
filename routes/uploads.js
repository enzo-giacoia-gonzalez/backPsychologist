const { Router } = require('express');
const { check } = require('express-validator');
const {validarArchivoSubir } = require('../middlewares/validar-archivo');
const {validarCampos} = require ('../middlewares/validar-campos')
const { actualizarImagenCloudinary, borrarImagen, CargarImagenCloudinary,CargarVideoCloudinary, actualizarVideoCloudinary, borrarVideoCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();


router.post('/:coleccion', [ 
    validarArchivoSubir,
    validarCampos
], CargarImagenCloudinary)

router.post('/video/:coleccion', [ 
    validarArchivoSubir,
    validarCampos
], CargarVideoCloudinary)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
     check('coleccion').custom( c => coleccionesPermitidas( c, ['videos','usuarios','turnos'] ) ),
    validarCampos
 ], actualizarImagenCloudinary )

 router.put('/video/:coleccion/:id', [
     validarArchivoSubir,
     check('id','El id debe de ser de mongo').isMongoId(),
     check('coleccion').custom( c => coleccionesPermitidas( c, ['videos','usuarios','turnos'] ) ),
    validarCampos
 ], actualizarVideoCloudinary )


router.delete('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['videos','usuarios','turnos'] ) ),
    validarCampos 
], borrarImagen)

router.delete('/video/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['videos','usuarios','turnos'] ) ),
    validarCampos 
], borrarVideoCloudinary)



module.exports = router;