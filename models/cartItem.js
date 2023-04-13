const { Schema, model } = require('mongoose');

const CartItemSchema = Schema({
        quantity: {
            type: Number,
            default : 0,
            required: [true, 'La cantidad es obligatoria']
        },

});


CartItemSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'CartItem', CartItemSchema );

