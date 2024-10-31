
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido:{
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    dni:{
        type:String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },

    recordartucontrasena: {
        type: String,
        required: true
    },
    video: {
        type: String,
    },
    img:{
        type:String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE','PATIENT_ROLE']
    },
    estado: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
    code:{
        type:String
    },

    historyPayments : {
        type: Array,
    }
        
});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
