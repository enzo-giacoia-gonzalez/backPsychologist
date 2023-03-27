const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');


const { login, googleSignin, forgotPassword, recoverPassword } = require('../controllers/auth');
const { validarlogin } = require('../middlewares/validar-login');
const { validarJWT } = require('../middlewares');


const router = Router();

router.post('/login',[
    validarlogin,
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
],login );

router.post('/google',[
    validarlogin,
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

router.put('/forgotPassword',
forgotPassword );


router.put('/recoverPassword/:token' ,[
], recoverPassword);



module.exports = router;