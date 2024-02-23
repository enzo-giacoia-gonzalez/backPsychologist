
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


        
    
const { agregarComprobante, obtenerComprobantes, obtenerComprobanteID, editarComprobante, borrarComprobante } = require('../controllers/comprobantes');
        
        const router = Router();
   

       router.get('/', obtenerComprobantes);
       

router.get('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
], obtenerComprobanteID );

router.post('/', [ 
    validarJWT,
    esAdminRole,
    check('titulo','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], agregarComprobante );


router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('titulo','El nombre es obligatorio').not().isEmpty(),
    check('usuario','El usuario es obligatorio').not().isEmpty(),
    check('pago','El pago es obligatorio').not().isEmpty(),
    check('precio','El precio es obligatorio').not().isEmpty(),
    validarCampos
],editarComprobante );


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
],borrarComprobante);



module.exports = router;