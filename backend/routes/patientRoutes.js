const express = require('express');
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  searchPatients
} = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');

// All patient routes are protected
router.use(verifyToken);

// @route POST /api/patients
// @desc Create patient
router.post('/', createPatient);

// @route GET /api/patients
// @desc Get all patients
router.get('/', getAllPatients);


// @route GET /api/patients/search/:name
// @desc Search patients
router.get('/search/:name', searchPatients);

// @route GET /api/patients/:id
// @desc Get single patient
router.get('/:id', getPatient);

// @route PUT /api/patients/:id
// @desc Update patient
router.put('/:id', updatePatient);

// @route DELETE /api/patients/:id
// @desc Delete patient
router.delete('/:id', deletePatient);


module.exports = router;
