const express = require('express');
const router = express.Router();
const {
  createMedication,
  getMedicationsForPatient,
  getMedication,
  updateMedication,
  deleteMedication
} = require('../controllers/medicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route POST /api/medications
router.post('/', createMedication);


// @route GET /api/medications/:id
router.get('/single/:id', getMedication);

// @route GET /api/medications/:patientId
router.get('/:patientId', getMedicationsForPatient);

// @route PUT /api/medications/:id
router.put('/:id', updateMedication);

// @route DELETE /api/medications/:id
router.delete('/:id', deleteMedication);

module.exports = router;
