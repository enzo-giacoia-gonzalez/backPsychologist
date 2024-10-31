const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { getToken, getTokenData } = require("../helpers/genandverify-jwt");

const { getTemplate, sendEmail } = require("../helpers/nodemailer");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 0, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuarioGetCorreo = async (req = request, res = response) => {
  try {
    const { correo } = req.params;
    const usuario = await Usuario.findOne({correo});

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      msg: "El correo no es valido",
    });
  }
};


const usuarioGetId = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    res.status(400).json({
      msg: "La id no es valida",
    });
  }
};

const usuariosPost = async (req, res = response) => {
  try {
    const { nombre, apellido, correo, dni, password, repeatpassword, recordartucontrasena, rol } = req.body;

    if (password!=repeatpassword) {
      return res.status(400).json({
        msg:'La contraseñas no coinciden'
      })
    }

    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
      return res.status(400).json({
        msg: "El correo ya existe",
      });
    }
  
    const existeDni = await Usuario.findOne({ dni });
    if (existeDni) {
      return res.status(400).json({
        msg: "El dni ya existe",
      });
    }



    const code = uuidv4();

    const usuario = new Usuario({
      nombre,
      apellido,
      correo,
      dni,
      password,
      recordartucontrasena,
      rol,
      code,
    });
    

    const token = getToken({ correo, code });

    const template = getTemplate(nombre, token);

    await sendEmail(correo, "Email de confirmacion de cuenta", template);

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    return res.status(200).json({
      usuario,
      msg: "Registrado correctamente, verifique su casilla de email para confirmar",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Error al registrar usuario",
      success: false,
    });
  }
};

const historyPayments = async (req, res) => {
  try {
    const { id } = req.usuario;
    const { amount, quantity, nombre, trafficLightTTL } = req.body;
    const usuario = await Usuario.findById(id);
    const historyPayments = {
      nombre,
      amount,
      quantity,
      trafficLightTTL,
    };

    usuario.historyPayments.push(historyPayments);

    usuario.markModified("historyPayments");

    await usuario.save();

    res.status(200).json({
      usuario
    });
  } catch (error) {
    console.log(error)
  }
};

const usuarioConfirm = async (req, res) => {
  try {
    // Obtener el token
    const { token } = req.params;

    // Verificar la data
    const data = await getTokenData(token);

    if (data === null) {
      return res.json({
        success: false,
        msg: "Error al obtener data",
      });
    }

    console.log(data);

    const { correo, code } = data.data;

    // Verificar existencia del usuario
    const usuario = (await Usuario.findOne({ correo })) || null;

    if (usuario === null) {
      return res.json({
        success: false,
        msg: "Usuario no existe",
      });
    }

    // Verificar el código
    if (code !== usuario.code) {
      return res.redirect("/error.html");
    }

    // Actualizar usuario
    usuario.estado = true;
    await usuario.save();

    // Redireccionar a la confirmación
    return res.redirect("/confirm.html");
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      msg: "Error al confirmar usuario",
    });
  }
};

const usuariosPut = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, recordartucontrasena, google, correo, ...resto } =
      req.body;

    let correito = await Usuario.findById(id);

    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    if (correito.estado === false) {
      return res.status(400).json({
        msg: "falta confirmar su usuario o el usuario esta desabilitado",
      });
    }

    if (!correito.correo || correito.correo != correo) {
      correito = await Usuario.findByIdAndUpdate(id, resto, { new: true });

      res.status(200).json({
        msg: "Usuario actualizado correctamente",
        correito
      });

      await correito.save();
    } else {
      correito = await Usuario.findByIdAndUpdate(id, resto, { new: true });

      const UsuarioActualizado = await Usuario.findById(id);

      return res.status(200).json({
        msg: "Usuario actualizado correctamente",
        UsuarioActualizado,
      });
    }
    
  } catch (error) {
    res.status(500).json({
      msg: "Error al editar el usuario",
    });
  }
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - usuariosPatch",
  });
};

const usuariosDelete = async (req, res = response) => {
  try {
    const { id } = req.params;
    const token = req.headers;

    if (!token) {
      res.status.json("No hay token");
    }

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
      msg: "Usuario borrado",
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      msg: "No hay sido posible borrar el usuario",
    });
  }
};

const changeState = async (req, res= response) => {
  try {
    const { id } = req.params;
    const {rol} = req.body
    const token = req.headers;

    usuarioFind = await Usuario.findById(id)

    if (!token) {
      return res.status(401).json("No hay token");
    }

    if (usuarioFind.estado == false) {
      return res.status(400).json({
        msg:'El usuario ha sido deshabilitado no se puede cambiar el rol'
      })
    }

      if (usuarioFind.rol==rol) {
         return res.status(400).json({
          msg:`Intenta cambiar el rol por uno distinto, el usuario ${usuarioFind.nombre} ya posee el rol de ${usuarioFind.rol}`
        })
      }

      const estadoActualizado = await Usuario.findByIdAndUpdate(id,{rol}, { new: true })

      await estadoActualizado.save()

      return res.status(200).json({
        msg:`${usuarioFind.nombre} ahora es ${rol}`,
        estadoActualizado
      })

    

    
    
  } catch (error) {
    return res.status(500).json({
      msg: "No ha sido posible cambiar el rol del usuario",
    });
  }
};


module.exports = {
  usuariosGet,
  usuarioGetId,
  usuarioGetCorreo,
  usuariosPost,
  historyPayments,
  usuarioConfirm,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
  changeState
};