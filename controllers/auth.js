const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const transporter = require ('../helpers/nodemailer')


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
                msg: 'Usuario / Password no son correctos - estado: false'
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

        res.json({
            usuario,
            token
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
                correo,
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

    const sendEmail = require ('../helpers/nodemailer')
    

   const {correo, recordartucontrasena} = req.body 
   
   const usuario = await Usuario.findOne({correo})


   try {
    if (!usuario) {
        return res.status(400).json({
            message:'Intenta insertar un correo valido'
        })
       }
    
    if (recordartucontrasena!=usuario.recordartucontrasena){
        return res.status(400).json({
            message:'Palabra incorrecta'
        })
    }



       const token = await generarJWT( usuario.id );

       sendEmail.sendEmail(correo)
       

        


        
        res.status(200).json({
         token
        })
   } catch (error) {
    res.status(400).json({
        error
    })
   
   }


   

      

  

}

const recoverPassword = async (req, res = response) => {

    try {
        

        token = req.headers


        const {correo} = req.params

        let usuario = await Usuario.findOne({correo})
        
        const {password, repeatPassword} = req.body
    
        
    
        if(!usuario) {
           return res.status(400).json('No existe un usuario con ese correo')
        }
    
    
        if(!token) {
            return res.status(400).json('No hay token')
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
    
      res.status(200).json({
        usuario,
        msg:"Contraseña actualizada"
        
      })
    
    } catch (error) {
        res.status(401).json({
            msg:error
        })
    }

   



    

    // Guardar en BD


}


module.exports = {
    login,
    googleSignin,
    forgotPassword,
    recoverPassword
}
