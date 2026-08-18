const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Auth
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// All routes below require admin role
router.use(protect, authorize('admin'));

// Patients
router.get('/patients', getAllPatients);
router.delete('/patients/:id', deletePatient);

// Doctors
router.post('/doctors', createDoctor);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Appointments
router.get('/appointments', getAllAppointments);
router.delete('/appointments/:id', deleteAppointment);

// Reports
router.get('/reports/summary', getSummaryReport);
router.get('/reports/appointments-per-day', getAppointmentsPerDay);
router.get('/reports/doctor-load', getDoctorLoad);
router.get('/reports/no-show-rate', getNoShowRate);

module.exports = router;