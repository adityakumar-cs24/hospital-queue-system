const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor } = require('../controllers/authController');
const {
  getQueue,
  updateAppointmentStatus,
  updateAvailability,
  getDoctorProfile,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Auth
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// Profile & availability
router.get('/profile', protect, authorize('doctor'), getDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);

// Queue management
router.get('/queue', protect, authorize('doctor'), getQueue);
router.put('/appointments/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

module.exports = router;