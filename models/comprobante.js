const { Schema, model } = require('mongoose');

const ComprobantesSchema = Schema({
    titulo:{
        type:String,
        required:[true, 'El titulo es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    linksesion:{
        type:String,
        required:[true,'El link es requerido']
    },
    fechayhora:{
        type:String,
        required:true,
    },
    pago: {
        type: String,
        required: [true, 'Selecciona una opcion, es obligatorio'],
        enum: ['APROBADO', 'RECHAZADO']
    },
    precio:{
        type: Number,
        required: [true, 'Coloque el precio que la persona pago'],
    },
    moneda: {
        type: String,
        required: [true, 'Selecciona una opcion, es obligatorio'],
        enum: ['ARG', 'USD'],
    }
});


ComprobantesSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Comprobante', ComprobantesSchema );