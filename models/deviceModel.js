const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    tipoEquipo: {
      type: String,
      required: [true, "Por favor selecciona uno de la lista."],
      enum: ["Computador de Escritorio", "Portatil", "Impresora"],
    },
    dependencia: {
      type: String,
      required: [true, "Por favor digita la dependencia"],
      trim: true,
    },
    codigoInterno: {
      type: String,
      default: "N/A",
      trim: true,
    },
    marcaEquipo: {
      type: String,
      required: [true, "Por favor Digita una marca."],
      trim: true,
    },
    modeloEquipo: {
      type: String,
      required: [true, "Por favor Digita un modelo."],
      trim: true,
    },
    serieSN: {
      type: String,
      required: [true, "Por favor Digita un numero de serie."],
      trim: true,
    },
    fechaCompra: {
      type: Date,
      default: null
    },
    imagen: { 
      type: Object,
      default: {}
    },
    observaciones: {
      type: String,
      maxlength: [500, "Las observaciones no pueden tener más de 500 caracteres."],
    },
    procesadorMarca: {
      type: String,
      trim: true,
    },
    procesadormodelo: {
      type: String,
      trim: true,
      default: "N/A"
    },
    almacenamientoCapacidadGb: {
      type: Number,
      default: "N/A"
    },
    almacenamientoTipo: {
      type: String,
      required: [true, "Por favor selecciona uno de la lista."],
      enum: ["HDD", "SSD", "N/A"],
    },
    ramCapacidadGB: {
      type: Number,
      default: "N/A"
    },
    ramFrecuenciaMHz: {
      type: Number,
      default: "N/A"
    },
    ramTecnologia: {
      type: String,
      default: "N/A"
    },
    ramFactorForma: {
      type: String,
      default: "N/A"
    },
    graficaTipo: {
      type: String,
      enum: ["Integrada", "Dedicada", "N/A"],
      required: [ true, "Tipo de grafica no válida. Selecciona una de la lista."],
    },
    graficaModelo: {
      type: String,
      default: "N/A",
      trim: true,
    },
    fuentePoderTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    fuentePoderTipo: {
      type: String,
      default: "N/A",
      trim: true,
    },
    tarjetaMadreMarca: {
      type: String,
      default: "N/A",
    },
    tarjetaMadreModelo: {
      type: String,
      default: "N/A",
      trim: true,
    },
    tarjetaMadreTamano: {
      type: String,
      default: "N/A",
      trim: true,
    },
    chasisTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    chasisTamano: {
      type: String,
      trim: true,
    },
    puertos: {
      type: String,
      required: [true, "Por favor ingresa un listado de puertos."],
    },
    pantallaTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    pantallaFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    pantallaMarca: {
      type: String,
      trim: true,
    },
    pantallaModelo: {
      type: String,
      trim: true,
    },
    tecladoTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    tecladoFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    tecladoMarca: {
      type: String,
      trim: true,
    },
    tecladoModelo: {
      type: String,
      trim: true,
    },
    mouseTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    mouseFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      required: [true, "Por favor selecciona Si/No de la lista."],
    },
    mouseMarca: {
      type: String,
      trim: true,
      default: "N/A",
    },
    mouseModelo: {
      type: String,
      trim: true,
      default: "N/A",
    },
    oSVersion: {
      type: String,
      trim: true,
      default: "N/A",
    },
    oSFechaCaducidad: {
      type: String,
      default: "N/A",
    },
    officeVersion: {
      type: String,
      trim: true,
      default: "N/A",
    },
    officeFechaCaducidad: {
      type: String,
      default: "N/A",
    },
    antivirusNombre: {
      type: String,
      trim: true,
      default: "N/A",
    },
    antivirusFechaCaducidad: {
      type: String,
      default: "N/A",
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;