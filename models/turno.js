const { Schema, model } = require('mongoose');

const TurnosSchema = Schema({
    titulo:{
        type:String,
        required:[true, 'El titulo es obligatorio']
    },
    img:{
        type:String,
    },
    fechayhora:{
        type:String,
        required:true,
    },
    linksesion:{
        type:String,
        required:[true,'El link es requerido']
    },
    precio:{
        type: Number,
        required: [true, 'Coloque el precio que la persona pago']
    },
    pago: {
        type: String,
        required: [true, 'Selecciona una opcion, es obligatorio'],
        enum: ['APROBADO', 'RECHAZADO'],
        default:'RECHAZADO'
    },
    moneda: {
        type: String,
        required: [true, 'Selecciona una opcion, es obligatorio'],
        enum: ['ARG', 'USD'],
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
    // createdAt: { type: Date, default: Date.now, expires: '43200' },
// },{
//     timestamps: true
});


TurnosSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Turno', TurnosSchema );