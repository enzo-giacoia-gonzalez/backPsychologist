

const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const nodemailer =   require ('./nodemailer')
const genandverify = require ('./genandverify-jwt')




module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...nodemailer,
    ...genandverify,
}