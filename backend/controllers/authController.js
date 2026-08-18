const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// ---------- PATIENT ----------

// @route POST /api/patients/register
const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, address } = req.body;

    const exists = await Patient.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Patient already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name, email, phone, password: hashedPassword, age, gender, address,
    });

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token: generateToken(patient._id, 'patient'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/patients/login
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token: generateToken(patient._id, 'patient'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- DOCTOR ----------

// @route POST /api/doctors/register
const registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, password, specialization, availability } = req.body;

    const exists = await Doctor.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Doctor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name, email, phone, password: hashedPassword, specialization, availability,
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      token: generateToken(doctor._id, 'doctor'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/doctors/login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      token: generateToken(doctor._id, 'doctor'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- ADMIN ----------

// @route POST /api/admin/register
// Note: In production you'd lock this down (e.g. only seed one admin manually).
// Keeping it open here for development/demo purposes.
const registerAdmin = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ username, password: hashedPassword, name });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient, loginPatient,
  registerDoctor, loginDoctor,
  registerAdmin, loginAdmin,
};