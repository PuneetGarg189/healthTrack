const express = require('express');
const router = express.Router();
const {
  getGlobalDashboard,
  getPatientAnalytics
} = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route GET /api/dashboard
router.get('/', getGlobalDashboard);

// @route GET /api/dashboard/patient/:patientId
router.get('/patient/:patientId', getPatientAnalytics);

module.exports = router;
