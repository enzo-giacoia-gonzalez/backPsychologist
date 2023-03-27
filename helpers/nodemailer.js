
const nodemailer = require ('nodemailer')


sendEmail = async (correo , subject, html) => {
try {
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
    subject,
    html
  }


  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje)

  console.log(info)


} catch (error) {
  return error
}
  
};


const getTemplate = (nombre, token) => {
  return `
    <head>
        <link rel="stylesheet" href="./style.css">
    </head>
    
    <div id="email___content">
        <img src="https://i.imgur.com/eboNR82.png" alt="">
        <h2>Hola ${ nombre }</h2>
        <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
        <a
            href="http://localhost:8080/api/usuarios/confirm/${ token }"
            target="_blank"
        >Confirmar Cuenta</a>
    </div>
  `;
}

const getTemplate2 = (nombre, token) => {
  return `
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrarme</title>

  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="container">
      <form
          id="form"
          class="form"
          autocomplete="off"
      >
      <p id="alert__submit-success">Registrado correctamente</p>
      <p id="alert__submit-error">Error al registrar</p>

      <h2 class="form__title">Registrarme</h2>
          <input
              type="password"
              name="password"
              placeholder="password"
              class="form__input"
          />

          <input
              type="email"
              name="correo"
              placeholder="correo"
              class="form__input"
          />

          <button
              id="form__btn"
              type="submit"
              class="form__btn btn__signup"
          >Registrarme</button>
      </form>
  </div>
  `;
}




sendEmailreset = async (correo = correo, token = token) => {

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
    text:`Reestrablesca su contraseña ingresando al siguiente link http://localhost:8080/api/auth/recoverPassword/${token}`
  }



  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje)



  console.log(info)

};





 
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account








 
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account




module.exports = {
 sendEmail,
 getTemplate,
 sendEmailreset
}