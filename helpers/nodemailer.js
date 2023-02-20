const nodemailer = require ('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.hotmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'enzogiacoia@hotmail.com', // generated ethereal user
      pass: 'tpffiejyrsizeeyl,' // generated ethereal password
    },
  });


  module.exports = {
    transporter
  }