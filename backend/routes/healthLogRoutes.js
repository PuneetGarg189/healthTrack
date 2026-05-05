const express = require('express');
const router = express.Router();
const {
  createHealthLog,
  getLogsForPatient,
  getHealthLog,
  updateHealthLog,
  deleteHealthLog
} = require('../controllers/healthLogController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route POST /api/logs
router.post('/', createHealthLog);

// @route GET /api/logs/:patientId
router.get('/:patientId', getLogsForPatient);

// @route GET /api/logs/single/:id
router.get('/single/:id', getHealthLog);

// @route PUT /api/logs/:id
router.put('/:id', updateHealthLog);

// @route DELETE /api/logs/:id
router.delete('/:id', deleteHealthLog);

module.exports = router;
