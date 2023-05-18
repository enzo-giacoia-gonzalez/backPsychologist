
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
        historyPayments} = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.get('/:id',[
    validarJWT,
    validarCampos
],
 usuarioGetId);

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
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('recordartucontrasena', 'Intenta ingresar un dato valido').not().isEmpty(),
    check('correo').custom( emailExiste ),
    check('recordartucontrasena', 'Esta palabra es obligatoria').not().isEmpty(),
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
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;