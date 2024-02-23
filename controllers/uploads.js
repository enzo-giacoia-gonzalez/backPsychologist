const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");

const { Usuario, Video, Turno } = require("../models");
const { firebaseConfig } = require("../database/config");


const CargarImagenCloudinary = async (req, res = response) => {
  try {
    const { coleccion } = req.params;

  switch (coleccion) {
    case "usuarios":
      if (!coleccion) {
        return res.status(400).json({
          msg: `Manda una coleccion correcta`,
        });
      }
    case "videos":
      if (!coleccion) {
        return res.status(400).json({
          msg: `Manda una coleccion correcta`,
        });
      }
      case "turnos":
      if (!coleccion) {
        return res.status(400).json({
          msg: `Manda una coleccion correcta`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //subir imagen
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  const img = secure_url;

  res.status(200).json({
    msg: "Imagen cargada Correctamente",
    img
  });
  } catch (error) {
    res.status(400).json({
      msg:error
    })
  }
  
};


const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "videos":
      modelo = await Video.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un video con el id ${id}`,
        });
      }

      break;

      case "turnos":
        modelo = await Turno.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un video con el id ${id}`,
          });
        }
  
        break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.status(200).json({
    msg: "Imagen cargada Correctamente",
    modelo,
  });
};

//borrar imagen
const borrarImagen = async (req, res) => {
  try {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          });
        }

        break;

      case "videos":
        modelo = await Video.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un video con el id ${id}`,
          });
        }

        break;

        case "turnos":
        modelo = await Turno.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un video con el id ${id}`,
          });
        }

        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    if (modelo.img) {
      const nombreArr = modelo.img.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);
      modelo.img = "";
      modelo.save();
    }

    res.status(200).json({
      msg: "Eliminado Correctamente",
      modelo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error al eliminar el usuario",
    });
  }
};



const CargarVideoCloudinary = async (req, res = response) => {
  try {
    const { coleccion } = req.params;

  switch (coleccion) {
    case "usuarios":
      if (!coleccion) {
        return res.status(400).json({
          msg: `Manda una coleccion correcta`,
        });
      }

      break;

    case "videos":
      if (!coleccion) {
        return res.status(400).json({
          msg: `Manda una coleccion correcta`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //subir imagen
  const { tempFilePath } = req.files.archivo;
  const result = await cloudinary.uploader.upload(tempFilePath, {
    resource_type: "video",
  });
  const video = result.secure_url;
 

  res.status(200).json({
    msg: "Imagen cargada Correctamente",
    video,
  });
  } catch (error) {
    res.status(400).json(
      error
    )
  }
  
};




const actualizarVideoCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "videos":
      modelo = await Video.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un video con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  // Limpiar imágenes previas
  if (modelo.video) {
    const nombreArr = modelo.video.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const result = await cloudinary.uploader.upload(tempFilePath, {
    resource_type: "video",
  });
  modelo.video = result.secure_url;
  await modelo.save();

  res.status(200).json({
    msg: "Imagen cargada Correctamente",
    modelo,
  });
};



//borrar imagen
const borrarVideoCloudinary = async (req, res) => {
  try {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
      case "usuarios":
        modelo = await Usuario.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          });
        }

        break;

      case "videos":
        modelo = await Video.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un video con el id ${id}`,
          });
        }

        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    if (modelo.video) {
      const nombreArr = modelo.video.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);
      modelo.video = "";
      modelo.save();
    }

    res.status(200).json({
      msg: "Eliminado Correctamente",
      modelo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Error al eliminar el usuario",
    });
  }
};

module.exports = {
  CargarImagenCloudinary,
  actualizarImagenCloudinary,
  borrarImagen,
  CargarVideoCloudinary,
  actualizarVideoCloudinary,
  borrarVideoCloudinary
};
