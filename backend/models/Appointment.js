const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctor: {
      name: {
        type: String,
        required: true,
      },
      specialization: {
        type: String,
        required: true,
      },
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
      min: 15,
      max: 120,
    },
    appointmentType: {
      type: String,
      required: true,
      enum: ["Routine Check-Up", "Ultrasound", "Consultation", "Follow-up"],
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
