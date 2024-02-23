const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const { agregarTurno, borrarTurno, obtenerTurnoID, editarTurno, obtenerTurnos } = require('../controllers/turnos');
        
        const router = Router();
   

       router.get('/', obtenerTurnos);
       

router.get('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
], obtenerTurnoID );

router.post('/', [ 
    validarJWT,
    esAdminRole,
    validarCampos
], agregarTurno );


router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('titulo','El nombre es obligatorio').not().isEmpty(),
    check('usuario','El usuario es obligatorio').not().isEmpty(),
    check('precio','El precio es obligatorio').not().isEmpty(),
    validarCampos
],editarTurno );


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
],borrarTurno);



module.exports = router;