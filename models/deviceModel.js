const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    tipoEquipo: {
      type: String,
      enum: ["Computador de Escritorio", "Portatil", "Impresora"],
    },
    dependencia: {
      type: String,
      trim: true,
      default: "N/A"
    },
    codigoInterno: {
      type: String,
      default: "N/A",
      trim: true,
    },
    marcaEquipo: {
      type: String,
      trim: true,
      default: "N/A"
    },
    modeloEquipo: {
      type: String,
      trim: true,
      default: "N/A"
    },
    serieSN: {
      type: String,
      trim: true,
      default: "N/A"
    },
    fechaCompra: {
      type: String,
      default: "N/A"
    },
    image: { 
      type: Object,
      default: {}
    },
    observaciones: {
      type: String,
      maxlength: [500, "Las observaciones no pueden tener más de 500 caracteres."],
      default: "N/A"
    },
    procesadorMarca: {
      type: String,
      trim: true,
      default: "N/A"
    },
    procesadormodelo: {
      type: String,
      trim: true,
      default: "N/A"
    },
    almacenamientoCapacidadGb: {
      type: String,
      default: "N/A"
    },
    almacenamientoTipo: {
      type: String,
      enum: ["HDD", "SSD", "N/A"],
      default: "N/A"
    },
    ramCapacidadGB: {
      type: String,
      default: "N/A"
    },
    ramFrecuenciaMHz: {
      type: String,
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
      default: "N/A"
    },
    graficaModelo: {
      type: String,
      default: "N/A",
      trim: true,
    },
    fuentePoderTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
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
      default: "N/A",
    },
    chasisTamano: {
      type: String,
      trim: true,
      default: "N/A",
    },
    puertos: {
      type: String,
      default: "N/A",
    },
    pantallaTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
    },
    pantallaFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
    },
    pantallaMarca: {
      type: String,
      trim: true,
      default: "N/A",
    },
    pantallaModelo: {
      type: String,
      trim: true,
      default: "N/A",
    },
    tecladoTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
    },
    tecladoFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
    },
    tecladoMarca: {
      type: String,
      trim: true,
      default: "N/A",
    },
    tecladoModelo: {
      type: String,
      trim: true,
      default: "N/A",
    },
    mouseTiene: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
    },
    mouseFuncional: {
      type: String,
      enum: ["Si", "No", "N/A"],
      default: "N/A",
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