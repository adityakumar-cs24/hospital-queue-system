const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @route GET /api/doctors/queue?date=2026-08-24
// @access Private (doctor only) — view queue for a specific date (defaults to today)
const getQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;

    let queryDate = req.query.date ? new Date(req.query.date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: queryDate,
      status: { $ne: 'Cancelled' },
    })
      .populate('patient', 'name phone email age gender')
      .sort({ tokenNo: 1 });

    res.json({
      date: queryDate,
      totalInQueue: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/doctors/appointments/:id/status
// @access Private (doctor only) — mark as In-Queue / Completed / No-Show
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['In-Queue', 'Completed', 'No-Show'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Ensure the logged-in doctor owns this appointment
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot update a cancelled appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: `Appointment marked as ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/doctors/availability
// @access Private (doctor only) — replace full availability array
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'availability must be an array' });
    }

    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.availability = availability;
    await doctor.save();

    res.json({ message: 'Availability updated', availability: doctor.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/doctors/profile
// @access Private (doctor only) — view own profile
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQueue,
  updateAppointmentStatus,
  updateAvailability,
  getDoctorProfile,
};