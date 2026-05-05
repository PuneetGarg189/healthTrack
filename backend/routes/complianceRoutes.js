const express = require('express');
const router = express.Router();
const {
  logCompliance,
  getComplianceForPatient,
  updateCompliance,
  getComplianceRate,
  getMostMissedMedicines
} = require('../controllers/complianceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route POST /api/compliance
router.post('/', logCompliance);

// @route GET /api/compliance/:patientId
router.get('/:patientId', getComplianceForPatient);

// @route PUT /api/compliance/:id
router.put('/:id', updateCompliance);

// @route GET /api/compliance/:patientId/rate
router.get('/:patientId/rate', getComplianceRate);

// @route GET /api/compliance/:patientId/most-missed
router.get('/:patientId/most-missed', getMostMissedMedicines);

module.exports = router;
