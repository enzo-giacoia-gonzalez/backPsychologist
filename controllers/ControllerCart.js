const { response } = require('express');
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(
 'TEST-6121932480493916-041316-e48c71ffa07f76bd23b3e45080271e78-202778498'
);
const {Cart, Producto, Usuario, CartItem } = require('../models');
const cartItem = require('../models/cartItem');


const getProductCart = async (req, res) => {
    try {
        const token = req.headers 
        const usuario = req.usuario._id
        let usuarioIncart = await Cart.findOne({usuario})

    if (!token) {
        res.status(400).json({
            msg: "No hay un token valido "
        })
    }


    if (!usuarioIncart) {
        const data = {
            usuario,
            items: [

            ]
        }
        usuarioIncart = new Cart(data)
        await usuarioIncart.save()
    }

    
    
    res.status(200).json({
        usuarioIncart
    });
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
    
}


const getProductCartId = async(req, res = response ) => {

    const { id } = req.params;
    const Cart = await Cart.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.status(200).json( Cart );

}


const addProductCart = async (req, res = response) => {

    try {
        const {id} = req.params
        const usuario = req.usuario._id

        let usuarioIncart = await Cart.findOne({usuario})
        const product = await Producto.findById(id)


        if (product.disponible<1) {
            return res.status(400).json({
                msg: 'No hay stock'
            })
        }

        const ProductExist = usuarioIncart.items.find((item)=>item._id == id)
        
        if (ProductExist){
            return res.status(400).json({
                msg: "Ya hay un producto agregado"
            })
        }


        const dataItem = {
            _id: id,
            quantity: 1
        }

        const newItem = new cartItem(dataItem)

        usuarioIncart.items.push(newItem)

        usuarioIncart.save()



        res.status(200).json({
            msg: "Producto agregado al carrito",
            usuarioIncart
        })

        


    } catch (error) {
        res.status(400).json({
            error
        })
    }

 }



const  putProductCart = async (req, res = response) => {

    try {
        const {id} = req.params
        const usuario = req.usuario._id

        const producto = await Producto.findById(id)

        let usuarioIncart = await Cart.findOne({usuario})

        const ProductExist = usuarioIncart.items.find((item)=>item._id == id)

        if (producto.disponible<1) {
            return res.status(400).json({
                msg: 'No hay stock'
            })
        }

        if (producto.disponible<=ProductExist.quantity) {
            return res.status(400).json({
                msg: 'No hay stock'
            })
        }


        if (!ProductExist) {
            res.status(400).json({
                msg: "Producto no existe primero hay que agregar"
            })
        }

        for (let Item of usuarioIncart.items) {
            if(Item._id == id) {
                Item.quantity += 1
            }
        }

        usuarioIncart.markModified("items")
        await usuarioIncart.save()

        res.status(200).json({
            msg: "Producto agregado al carrito con exito",
            usuarioIncart
        })
    } catch (error) {
        res.status(400).json(error.message)
    }


//     try {


//         const token = req.headers
//         const {id} = req.params
//     const productIncart = await Cart.findOne({usuario: req.usuario._id})
//     const productDisponible = await Producto.findById(id)

//     if (!token) {
//         res.status(400).json({
//             msg: "No hay un token valido "
//         })
//     }

//     if (!productIncart) {
//         res.status(400).json({
//             msg: "No existe un carrito con ese usuario"
//         })
//     }

//     const itemIncart = productIncart.items.find((item)=> item._id == id)
//     console.log(itemIncart)

//     if (!itemIncart) {
// return res.status(400).json({
//     msg: "No hay producto para editar"
// })
//     }


//     if(!productIncart.items) {
//         return res.status(400).json({
//             msg: "no se puede editar porque no hay un producto en el carrito"
//         })
//     }
    

//     if (productDisponible.disponible <= productIncart.items.quantity) {
// return res.status(400).json({
//     msg: "No hay productos disponibles para agregar en el carrito"
// })
//     } 

    
//     productIncart.items[productIncart.items.indexOf(itemIncart)].quantity += 1

//     await productIncart.save()

//     res.status(200).json({
//         msg: "Producto agregado con exito",

//     })
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({
//             msg: "No se ha podido añadir el producto al carrito consulte con un administrador",
    
//         })
//     }



   
    
}

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params
        const usuario = req.usuario._id

        let usuarioIncart = await Cart.findOne({usuario})

        if (!usuarioIncart) {
           return res.status(400).json({
                msg: "No hay producto en el carrito para eliminar"
            })
        }

        const ProductExist = usuarioIncart.items.find((item)=>item._id == id)

        if (!ProductExist) {
            return res.status(400).json({
                msg: "No hay producto en el carrito para eliminar"
            })
        }


        const cartDelete = usuarioIncart.items.find((item)=>item._id == id)


        if (cartDelete.quantity==1) {
            const cartDelete = usuarioIncart.items.filter((item)=>item._id != id)
            usuarioIncart.items = cartDelete
            usuarioIncart.save()

        } else {
            for (let Item of usuarioIncart.items) {
                if(Item._id == id) {
                    Item.quantity -= 1
                
                }
            }
            usuarioIncart.markModified("items")
            usuarioIncart.save()
        }

    return res.status(200).json({
        msg: "borrado exitosamente"
    })







        
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

const ProductinCartEdited = async (req, res) => {
    try {
        const usuario = req.usuario._id

 const productIncart = await Cart.findOne({usuario})

 

 for (const product of productIncart.items) {
    const producto = await Producto.findById(product._id)
    const ProductIncartActualizado = await Producto.findByIdAndUpdate(product._id, {disponible: producto.disponible-product.quantity})
 }

const productIncartEliminado = await Cart.findOneAndDelete({usuario})

res.status(200).json({
    productIncartEliminado
})
    } catch (error) {
        
    }
 


    }

    const purchaseCartItems = (req, res) => {
mercadopago.payment.save(req.body)
.then(function(response) {
  const { status, status_detail, id } = response.body;
//   console.log(response.body)
  res.status(200).json({status, status_detail, id});
})
.catch(function(error) {
  console.error(error);
});

     
        //   const { status, status_detail, id } = response.body;
        //   res.status(200).json({msg: "pago exitoso", status, status_detail, id });

       
        }
        
        
    
   

module.exports = {
    getProductCartId,
    getProductCart,
    addProductCart,
    putProductCart,
    deleteProduct,
    ProductinCartEdited,
    purchaseCartItems,
}