const { Schema, model } = require('mongoose');

const CartSchema = Schema({
    usuario: {
        type:Schema.Types.String,
        ref: 'Usuario'
      },
    items : {
        type: Array,

    },

});


CartSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Cart', CartSchema );
