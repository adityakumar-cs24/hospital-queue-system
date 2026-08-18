const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

// ---------- PATIENT MANAGEMENT ----------

// @route GET /api/admin/patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/patients/:id
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.deleteOne();
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- DOCTOR MANAGEMENT ----------

// @route POST /api/admin/doctors  (admin creates a doctor account directly)
const createDoctor = async (req, res) => {
  try {
    const { name, email, phone, password, specialization, availability } = req.body;

    const exists = await Doctor.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Doctor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name, email, phone, password: hashedPassword, specialization, availability,
    });

    res.status(201).json({ _id: doctor._id, name: doctor.name, email: doctor.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/doctors/:id  (edit doctor details, e.g. specialization, isActive)
const updateDoctor = async (req, res) => {
  try {
    const { name, phone, specialization, isActive, availability } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (name !== undefined) doctor.name = name;
    if (phone !== undefined) doctor.phone = phone;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (isActive !== undefined) doctor.isActive = isActive;
    if (availability !== undefined) doctor.availability = availability;

    await doctor.save();
    res.json({ message: 'Doctor updated', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/doctors/:id
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await doctor.deleteOne();
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- APPOINTMENT MANAGEMENT ----------

// @route GET /api/admin/appointments  (supports optional filters)
// e.g. /api/admin/appointments?date=2026-08-24&doctorId=...&status=Completed
const getAllAppointments = async (req, res) => {
  try {
    const { date, doctorId, status } = req.query;
    const filter = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    }
    if (doctorId) filter.doctor = doctorId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialization')
      .sort({ date: -1, tokenNo: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/appointments/:id  (admin override, e.g. cleanup/testing)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- REPORTS & ANALYTICS ----------

// @route GET /api/admin/reports/summary
// Overall counts: total patients, doctors, appointments by status
const getSummaryReport = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, statusCounts] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const statusBreakdown = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments: statusCounts.reduce((sum, item) => sum + item.count, 0),
      statusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/reports/appointments-per-day?from=2026-08-01&to=2026-08-31
const getAppointmentsPerDay = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};

    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to) match.date.$lte = new Date(to);
    }

    const results = await Appointment.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(results.map((r) => ({ date: r._id, count: r.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/reports/doctor-load
// Appointment count per doctor (helps identify overloaded doctors)
const getDoctorLoad = async (req, res) => {
  try {
    const results = await Appointment.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: '$doctor', totalAppointments: { $sum: 1 } } },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo',
        },
      },
      { $unwind: '$doctorInfo' },
      {
        $project: {
          _id: 0,
          doctorId: '$doctorInfo._id',
          name: '$doctorInfo.name',
          specialization: '$doctorInfo.specialization',
          totalAppointments: 1,
        },
      },
      { $sort: { totalAppointments: -1 } },
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/reports/no-show-rate
const getNoShowRate = async (req, res) => {
  try {
    const results = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          noShows: {
            $sum: { $cond: [{ $eq: ['$status', 'No-Show'] }, 1, 0] },
          },
        },
      },
    ]);

    const data = results[0] || { total: 0, noShows: 0 };
    const rate = data.total > 0 ? ((data.noShows / data.total) * 100).toFixed(2) : '0.00';

    res.json({
      totalAppointments: data.total,
      noShows: data.noShows,
      noShowRatePercent: Number(rate),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPatients,
  deletePatient,
  createDoctor,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getAllAppointments,
  deleteAppointment,
  getSummaryReport,
  getAppointmentsPerDay,
  getDoctorLoad,
  getNoShowRate,
};