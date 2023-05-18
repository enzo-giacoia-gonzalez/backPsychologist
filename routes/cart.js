const {Router} = require ('express');
const {check} = require ('express-validator')

const {validarJWT, validarCampos} = require ('../middlewares')

const {getProductCart, addProductCart, putProductCart, deleteProduct, getProductCartId, purchaseCartItems, ProductinCartEdited} = require ('../controllers/ControllerCart')

const router = Router()


router.get('/', [
    validarJWT,
    validarCampos
],
getProductCart
)

router.get('/:id', [
],
getProductCartId
)



router.post('/:id', [
    validarJWT,
    validarCampos
],
addProductCart
)


router.post('/cartItems/process_payment', [

],purchaseCartItems)

router.put('/productInCart/edited', [
validarJWT,
validarCampos
], ProductinCartEdited)

router.put('/:id', [
    validarJWT,
    validarCampos
],
putProductCart
)

router.delete('/:id', [
    validarJWT,
    validarCampos
],
deleteProduct
)


module.exports = router