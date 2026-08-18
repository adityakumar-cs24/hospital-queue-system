const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @route POST /api/patients/appointments
// @access Private (patient only)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: 'Doctor not found or not active' });
    }

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    // Count only ACTIVE appointments — used for the capacity/maxTokens check
    const activeCount = await Appointment.countDocuments({
      doctor: doctorId,
      date: appointmentDate,
      status: { $ne: 'Cancelled' },
    });

    const weekday = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctor.availability.find((a) => a.day === weekday);

    if (!daySchedule) {
      return res.status(400).json({ message: `Doctor is not available on ${weekday}` });
    }

    if (activeCount >= daySchedule.maxTokens) {
      return res.status(400).json({ message: 'No more tokens available for this date' });
    }

    // Find the HIGHEST token number ever issued (including cancelled) — guarantees uniqueness
    const lastAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
    }).sort({ tokenNo: -1 });

    const tokenNo = lastAppointment ? lastAppointment.tokenNo + 1 : 1;

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: appointmentDate,
      tokenNo,
      reason,
      status: 'Booked',
    });

    const populated = await appointment.populate('doctor', 'name specialization');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route PUT /api/patients/appointments/:id/cancel
// @access Private (patient only)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Ensure the logged-in patient owns this appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/patients/appointments
// @access Private (patient only) — view own appointment history
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization')
      .sort({ date: -1, tokenNo: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/patients/appointments/:id
// @access Private (patient only) — view single appointment status/token
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/patients/doctors
// @access Private (patient only) — browse doctors to book with
const listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  getAppointmentById,
  listDoctors,
};