
const nodemailer = require ('nodemailer')


sendEmail = async (correo = correo) => {

  const config = {
    host: "smtp.gmail.com", // hostname
    port: 587, // port for secure SMTP
    secureConnection: false,
    auth: {
        user: 'enzogiacoiasteam@gmail.com',
        pass: 'krpbsjxefmxlnbge'
    }
  }

  const mensaje = {
    from:'enzogiacoia@hotmail.com',
    to:correo,
    subject:'Envio de correo',
    text:`Reestrablesca su contraseña ingresando al siguiente link localhost:8080/api/auth/recoverPassword/${correo}`
  }



  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje)



  console.log(info)

};





 
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account




module.exports = {
 sendEmail
}