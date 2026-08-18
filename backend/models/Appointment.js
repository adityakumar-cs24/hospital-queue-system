const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true }, // appointment date (day only, time via token order)
    tokenNo: { type: Number, required: true }, // position in that day's queue for that doctor
    status: {
      type: String,
      enum: ['Booked', 'In-Queue', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Booked',
    },
    reason: { type: String }, // optional: reason for visit
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent same doctor+date+token duplication
appointmentSchema.index({ doctor: 1, date: 1, tokenNo: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
