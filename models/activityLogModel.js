const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateReported: { type: Date, default: Date.now },
  requiresUpdate: { type: Boolean, default: false },
  requiresMaintenance: { type: Boolean, default: false },
  responseActMant: { type: String },
  activities: [
    {
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ["Actualizar", "Mantenimiento"], required: true },
      description: { type: String, required: true },
      responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
