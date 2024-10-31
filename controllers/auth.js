const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const{ sendEmailreset} = require('../helpers/nodemailer')
const {getToken, getTokenData} = require ('../helpers/genandverify-jwt')


const login = async(req , res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false / desabilitado'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            msg:"Te has logeado correctamente",
            token,
            usuario
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        const usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                apellido,
                correo,
                dni,
                password: ':P',
                recordartucontrasena,
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}

const forgotPassword = async (req, res = response ) => {
try {
    const {correo, recordartucontrasena} = req.body 

    console.log(recordartucontrasena)

   
   

    const usuario = await Usuario.findOne({correo})
 
    const token = await generarJWT( usuario.id )
 
 
    
     if (!usuario) {
         return res.status(400).json({
             message:'Intenta insertar un correo valido'
         })
        }
     
     if (recordartucontrasena!=usuario.recordartucontrasena){
         return res.status(400).json({
             message:'Palabra incorrecta / recordar codigo para reestablecer contraseña es necesario'
         })
     }
 
 
        await sendEmailreset(correo, token)
        
        
        
 
 
         
         return res.status(200).json({
             msg:"Email de reestablecimiento enviado correctamente",
            token
         })
} catch (error) {
    return res.status(400).json({
        msg:"Error al enviar el correo",
        error
    })
}
    

  
   
   


   

      

  

}

const recoverPassword = async (req, res = response) => {

    try {
        
        const token = req.params.token;

        const id = req.usuario._id

        console.log(req.usuario)

        const {password, repeatPassword} = req.body

        
        const usuario = await Usuario.findById(id)


        if(!token) {
            return res.status(400).json({
                success: false,
                msg: 'Error al obtener data'
            });
       }
         

        
    
       if (password!=repeatPassword){
        return res.status(400).json('Contraseñas no coinciden')
       }

    
       if (password===usuario.password){
        return res.status(400).json('Contraseña usada Anteriormente intenta usar otra')
       }
      

       const validPassword = bcryptjs.compareSync( password, usuario.password );
       if ( validPassword ) {
           return res.status(400).json({
               msg: 'Contraseña usada anteriormente intenta usar otra'
           });
       }
    
       
    
       
       
      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync( password, salt );

      
         
      await usuario.save();
         
      
    
      return res.status(200).json({
        msg:"Contraseña Reestablecida correctamente",
        usuario
      })


    
    
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'Hubo en error consulte con el administrador'
        })
    }

   



    

    // Guardar en BD


}







const recoverPasswordInProfile = async (req, res = response) => {

    try {
        
        const token = req.headers

        const {id} = req.params

        const {password, repeatPassword} = req.body

        



        if(!token ) {
            return res.status(400).json({
                success: false,
                msg: 'No se puede modificar la contraseña - token invalido '
            });
       }
         
        
      

       const usuario = await Usuario.findById(id)
 
        if(!usuario) {
             return res.status(400).json({
                 success: false,
                 msg: 'Usuario no existe'
             });
        }

        if (usuario.estado === false) {
            return res.status(400).json({
                msg: "Usuario deshabilitado"
            })
        }
    
    

        
    
       if (password!=repeatPassword){
        return res.status(400).json('Contraseñas no coinciden')
       }

    
       if (password===usuario.password){
        return res.status(400).json('Contraseña usada Anteriormente intenta usar otra')
       }
      
       console.log(usuario.password)
       const validPassword = bcryptjs.compareSync( password, usuario.password );
       if ( validPassword ) {
           return res.status(400).json({
               msg: 'Contraseña usada anteriormente intenta usar otra'
           });
       }
    
       
    
       
       
      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync( password, salt );

      
         
      await usuario.save();
         
      
    
      return res.status(200).json({
        msg:"Contraseña actualizada Correctamente",
        usuario

      })


    
    
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg:'Hubo en error consulte con el administrador'
        })
    }

   



    

    // Guardar en BD


}


module.exports = {
    login,
    googleSignin,
    forgotPassword,
    recoverPassword,
    recoverPasswordInProfile
}
