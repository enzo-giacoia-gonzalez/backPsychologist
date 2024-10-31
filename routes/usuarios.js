const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');



const { esRoleValido, emailExiste, emailExistePut, existeUsuarioPorId, emailCorrecto } = require('../helpers/db-validators');

const { usuariosGet,
        usuarioGetId,
        usuarioConfirm,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch, 
        historyPayments,
        usuarioGetCorreo,
        changeState} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );




router.get('/:id',[
    validarJWT,
    validarCampos
],
usuarioGetId);

router.get('/correo/:correo',[
    validarJWT,
    validarCampos
],
usuarioGetCorreo);

router.get(
    '/confirm/:token',
    [],
    usuarioConfirm
    
);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('correo').custom( emailExiste ),
    check('id').custom( existeUsuarioPorId ),
    //check('rol').custom( esRoleValido ), 
    validarCampos
],usuariosPut );

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('dni', 'El dni es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('recordartucontrasena', 'Intenta ingresar un dato valido').not().isEmpty(),
    check('recordartucontrasena', 'Esta palabra es obligatoria').not().isEmpty(),
    check('correo').custom( emailExiste ),
    
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //check('rol').custom( esRoleValido ), 
    validarCampos,

], usuariosPost );

router.post('/history/payments', [
    validarJWT,
    validarCampos
], historyPayments)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.put('/rol/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    //check('rol').custom( esRoleValido ), 
    validarCampos
],changeState );

router.patch('/', usuariosPatch );





module.exports = router;