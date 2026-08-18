const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient } = require('../controllers/authController');
const {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  getAppointmentById,
  listDoctors,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Auth
router.post('/register', registerPatient);
router.post('/login', loginPatient);

// Doctor browsing (for booking)
router.get('/doctors', protect, authorize('patient'), listDoctors);

// Appointments
router.post('/appointments', protect, authorize('patient'), bookAppointment);
router.get('/appointments', protect, authorize('patient'), getMyAppointments);
router.get('/appointments/:id', protect, authorize('patient'), getAppointmentById);
router.put('/appointments/:id/cancel', protect, authorize('patient'), cancelAppointment);

module.exports = router;