const asyncHandler = require("express-async-handler");
const Device = require("../models/deviceModel");
const { fileSizeFormatter } = require("../utils/fileUpload");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Create Device
const createDevice = asyncHandler(async (req, res) => {
  const {
    tipoEquipo,
    dependencia,
    codigoInterno,
    marcaEquipo,
    modeloEquipo,
    serieSN,
    fechaCompra,
    observaciones,
    procesadorMarca,
    procesadormodelo,
    almacenamientoCapacidadGb,
    almacenamientoTipo,
    ramCapacidadGB,
    ramFrecuenciaMHz,
    ramTecnologia,
    ramFactorForma,
    graficaTipo,
    graficaModelo,
    fuentePoderTiene,
    fuentePoderTipo,
    tarjetaMadreMarca,
    tarjetaMadreModelo,
    tarjetaMadreTamano,
    chasisTiene,
    chasisTamano,
    puertos,
    pantallaTiene,
    pantallaFuncional,
    pantallaMarca,
    pantallaModelo,
    tecladoTiene,
    tecladoFuncional,
    tecladoMarca,
    tecladoModelo,
    mouseTiene,
    mouseFuncional,
    mouseMarca,
    mouseModelo,
    oSVersion,
    oSFechaCaducidad,
    officeVersion,
    officeFechaCaducidad,
    antivirusNombre,
    antivirusFechaCaducidad,
    imagen,
  } = req.body;

  // Validation Fields
  const requiredFields = [
    "tipoEquipo",
    "dependencia",
    "marcaEquipo",
    "modeloEquipo",
    "serieSN",
    "almacenamientoTipo",
    "graficaTipo",
    "fuentePoderTiene",
    "chasisTamano",
    "puertos",
    "pantallaTiene",
    "pantallaFuncional",
    "tecladoTiene",
    "tecladoFuncional",
    "mouseTiene",
    "mouseFuncional",
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(
      `Por favor complete todos los campos. Faltan: ${missingFields.join(", ")}`
    );
  }

  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    //save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Geapp",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("La imagen no se subio.");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
    req.body.imagen = fileData;
  }

  try {
    // Create device
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    console.error("Error al crear el dispositivo:", error);

    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error(
        `Error de validación. Asegúrate de que todos los campos sean válidos.`
      );
    } else {
      res.status(500);
      throw new Error(`Error interno del servidor al crear el dispositivo.`);
    }
  }
});

//Get all Devices

const getDevices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Actual page
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of users per page

  const totalDevices = await Device.countDocuments();
  const totalPages = Math.ceil(totalDevices / pageSize);

  const devices = await Device.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (devices && devices.length > 0) {
    const devicesData = devices.map((device) => {
      const {
        _id,
        tipoEquipo,
        dependencia,
        codigoInterno,
        marcaEquipo,
        modeloEquipo,
        serieSN,
        fechaCompra,
        observaciones,
        procesadorMarca,
        procesadormodelo,
        almacenamientoCapacidadGb,
        almacenamientoTipo,
        ramCapacidadGB,
        ramFrecuenciaMHz,
        ramTecnologia,
        ramFactorForma,
        graficaTipo,
        graficaModelo,
        fuentePoderTiene,
        fuentePoderTipo,
        tarjetaMadreMarca,
        tarjetaMadreModelo,
        tarjetaMadreTamano,
        chasisTiene,
        chasisTamano,
        puertos,
        pantallaTiene,
        pantallaFuncional,
        pantallaMarca,
        pantallaModelo,
        tecladoTiene,
        tecladoFuncional,
        tecladoMarca,
        tecladoModelo,
        mouseTiene,
        mouseFuncional,
        mouseMarca,
        mouseModelo,
        oSVersion,
        oSFechaCaducidad,
        officeVersion,
        officeFechaCaducidad,
        antivirusNombre,
        antivirusFechaCaducidad,
        imagen,
      } = device;

      return {
        _id,
        tipoEquipo,
        dependencia,
        codigoInterno,
        marcaEquipo,
        modeloEquipo,
        serieSN,
        fechaCompra,
        observaciones,
        procesadorMarca,
        procesadormodelo,
        almacenamientoCapacidadGb,
        almacenamientoTipo,
        ramCapacidadGB,
        ramFrecuenciaMHz,
        ramTecnologia,
        ramFactorForma,
        graficaTipo,
        graficaModelo,
        fuentePoderTiene,
        fuentePoderTipo,
        tarjetaMadreMarca,
        tarjetaMadreModelo,
        tarjetaMadreTamano,
        chasisTiene,
        chasisTamano,
        puertos,
        pantallaTiene,
        pantallaFuncional,
        pantallaMarca,
        pantallaModelo,
        tecladoTiene,
        tecladoFuncional,
        tecladoMarca,
        tecladoModelo,
        mouseTiene,
        mouseFuncional,
        mouseMarca,
        mouseModelo,
        oSVersion,
        oSFechaCaducidad,
        officeVersion,
        officeFechaCaducidad,
        antivirusNombre,
        antivirusFechaCaducidad,
        imagen,
      };
    });

    res.status(200).json({
      devices: devicesData,
      totalPages,
      currentPage: page,
    });
  } else {
    res.status(404);
    throw new Error("No se encontraron dispositivos");
  }
});

//Get single Device
const getDevice = asyncHandler(async (req, res) => {
  const device = await Device.findById(req.params.id);
  if (!device) {
    res.status(404);
    throw new Error("Dispositivo no encontrado");
  }

  res.status(200).json(device);
});

//Delete device
const deleteDevice = asyncHandler(async (req, res) => {
  try {
    const deviceId = req.params.id;

    const device = await Device.findById(deviceId);
    //verify if device exists
    if (!device) {
      res.status(400);
      throw new Error("Dispositivo no encontrado");
    }
    //Delete Device
    await Device.findByIdAndDelete(deviceId);
    res.status(200).json({
      message: "Dispositivo eliminado correctamente.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error al eliminar el dispositivo.");
  }
});

//Update Device
const updateDevice = asyncHandler(async (req, res) => {
  const deviceId = req.params.id;

  const {
    tipoEquipo,
    dependencia,
    codigoInterno,
    marcaEquipo,
    modeloEquipo,
    serieSN,
    fechaCompra,
    observaciones,
    procesadorMarca,
    procesadormodelo,
    almacenamientoCapacidadGb,
    almacenamientoTipo,
    ramCapacidadGB,
    ramFrecuenciaMHz,
    ramTecnologia,
    ramFactorForma,
    graficaTipo,
    graficaModelo,
    fuentePoderTiene,
    fuentePoderTipo,
    tarjetaMadreMarca,
    tarjetaMadreModelo,
    tarjetaMadreTamano,
    chasisTiene,
    chasisTamano,
    puertos,
    pantallaTiene,
    pantallaFuncional,
    pantallaMarca,
    pantallaModelo,
    tecladoTiene,
    tecladoFuncional,
    tecladoMarca,
    tecladoModelo,
    mouseTiene,
    mouseFuncional,
    mouseMarca,
    mouseModelo,
    oSVersion,
    oSFechaCaducidad,
    officeVersion,
    officeFechaCaducidad,
    antivirusNombre,
    antivirusFechaCaducidad,
    imagen,
  } = req.body;

  try {
    // Find device by ID
    const existingDevice = await Device.findById(deviceId);

    if (!existingDevice) {
      res.status(404);
      throw new Error("Dispositivo no encontrado");
    }

    // Update device fields
    if (tipoEquipo) existingDevice.tipoEquipo = tipoEquipo;
    if (dependencia) existingDevice.dependencia = dependencia;
    if (codigoInterno) existingDevice.codigoInterno = codigoInterno;
    if (marcaEquipo) existingDevice.marcaEquipo = marcaEquipo;
    if (modeloEquipo) existingDevice.modeloEquipo = modeloEquipo;
    if (serieSN) existingDevice.serieSN = serieSN;
    if (fechaCompra) existingDevice.fechaCompra = fechaCompra;
    if (observaciones) existingDevice.observaciones = observaciones;
    if (procesadorMarca) existingDevice.procesadorMarca = procesadorMarca;
    if (procesadormodelo) existingDevice.procesadormodelo = procesadormodelo;
    if (almacenamientoCapacidadGb)
      existingDevice.almacenamientoCapacidadGb = almacenamientoCapacidadGb;
    if (almacenamientoTipo)
      existingDevice.almacenamientoTipo = almacenamientoTipo;
    if (ramCapacidadGB) existingDevice.ramCapacidadGB = ramCapacidadGB;
    if (ramFrecuenciaMHz) existingDevice.ramFrecuenciaMHz = ramFrecuenciaMHz;
    if (ramTecnologia) existingDevice.ramTecnologia = ramTecnologia;
    if (ramFactorForma) existingDevice.ramFactorForma = ramFactorForma;
    if (graficaTipo) existingDevice.graficaTipo = graficaTipo;
    if (graficaModelo) existingDevice.graficaModelo = graficaModelo;
    if (fuentePoderTiene) existingDevice.fuentePoderTiene = fuentePoderTiene;
    if (fuentePoderTipo) existingDevice.fuentePoderTipo = fuentePoderTipo;
    if (tarjetaMadreMarca) existingDevice.tarjetaMadreMarca = tarjetaMadreMarca;
    if (tarjetaMadreModelo)
      existingDevice.tarjetaMadreModelo = tarjetaMadreModelo;
    if (tarjetaMadreTamano)
      existingDevice.tarjetaMadreTamano = tarjetaMadreTamano;
    if (chasisTiene) existingDevice.chasisTiene = chasisTiene;
    if (chasisTamano) existingDevice.chasisTamano = chasisTamano;
    if (puertos) existingDevice.puertos = puertos;
    if (pantallaTiene) existingDevice.pantallaTiene = pantallaTiene;
    if (pantallaFuncional) existingDevice.pantallaFuncional = pantallaFuncional;
    if (pantallaMarca) existingDevice.pantallaMarca = pantallaMarca;
    if (pantallaModelo) existingDevice.pantallaModelo = pantallaModelo;
    if (tecladoTiene) existingDevice.tecladoTiene = tecladoTiene;
    if (tecladoFuncional) existingDevice.tecladoFuncional = tecladoFuncional;
    if (tecladoMarca) existingDevice.tecladoMarca = tecladoMarca;
    if (tecladoModelo) existingDevice.tecladoModelo = tecladoModelo;
    if (mouseTiene) existingDevice.mouseTiene = mouseTiene;
    if (mouseFuncional) existingDevice.mouseFuncional = mouseFuncional;
    if (mouseMarca) existingDevice.mouseMarca = mouseMarca;
    if (mouseModelo) existingDevice.mouseModelo = mouseModelo;
    if (oSVersion) existingDevice.oSVersion = oSVersion;
    if (oSFechaCaducidad) existingDevice.oSFechaCaducidad = oSFechaCaducidad;
    if (officeVersion) existingDevice.officeVersion = officeVersion;
    if (officeFechaCaducidad)
      existingDevice.officeFechaCaducidad = officeFechaCaducidad;
    if (antivirusNombre) existingDevice.antivirusNombre = antivirusNombre;
    if (antivirusFechaCaducidad)
      existingDevice.antivirusFechaCaducidad = antivirusFechaCaducidad;
    if (imagen) existingDevice.imagen = imagen;

    // Handle Image Upload
    if (req.file) {
      // save imagen cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Geapp",
          resource_type: "image",
        });
      } catch (error) {
        res.status(500);
        throw new Error("La imagen no se subió.");
      }

      existingDevice.imagen = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }

    // Guardar el dispositivo actualizado
    const updatedDevice = await existingDevice.save();

    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error("Error al actualizar el dispositivo:", error);

    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error(
        `Error de validación. Asegúrate de que todos los campos sean válidos.`
      );
    } else {
      res.status(500);
      throw new Error(
        `Error interno del servidor al actualizar el dispositivo.`
      );
    }
  }
});

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  deleteDevice,
  updateDevice,
};
