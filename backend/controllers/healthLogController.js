// Health Log Controller - CRUD Operations
const HealthLog = require('../models/HealthLog');

// @desc Create health log
// @route POST /api/logs
// @access Private
// DEMONSTRATES: CREATE (insertOne)
exports.createHealthLog = async (req, res) => {
  try {
    const { patientId, logDate, vitals, symptoms, notes, temperature } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: 'Please provide patient ID' });
    }

    // CREATE: insertOne operation
    const healthLog = await HealthLog.create({
        owner: req.user._id,
      patientId,
      logDate: logDate || new Date(),
      vitals: vitals || {},
      symptoms: symptoms || [],
      notes: notes || [],
      temperature
    });

    res.status(201).json({
      success: true,
      message: 'Health log created successfully',
      data: healthLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get health logs for patient
// @route GET /api/logs/:patientId
// @access Private
// DEMONSTRATES: READ (find with index)
exports.getLogsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // READ: find with compound index (patientId, logDate)
    const logs = await HealthLog.find({
        owner: req.user._id,

      patientId,
      logDate: { $gte: startDate }
    }).sort({ logDate: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single health log
// @route GET /api/logs/:id
// @access Private
// DEMONSTRATES: READ (findById)
exports.getHealthLog = async (req, res) => {
  try {
    const { id } = req.params;

const log = await HealthLog.findOne({
  _id: id,
  owner: req.user._id
});
    if (!log) {
      return res.status(404).json({ success: false, message: 'Health log not found' });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update health log
// @route PUT /api/logs/:id
// @access Private
// DEMONSTRATES: UPDATE (updateOne)
exports.updateHealthLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { vitals, symptoms, notes, temperature } = req.body;

    // UPDATE: updateOne operation
    const log = await HealthLog.findOneAndUpdate(
  {
    _id: id,
    owner: req.user._id
  },
      {
        vitals,
        symptoms,
        notes,
        temperature
      },
      { new: true, runValidators: true }
    );

    if (!log) {
      return res.status(404).json({ success: false, message: 'Health log not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Health log updated successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete health log
// @route DELETE /api/logs/:id
// @access Private
// DEMONSTRATES: DELETE (deleteOne)
exports.deleteHealthLog = async (req, res) => {
  try {
    const { id } = req.params;

    // DELETE: deleteOne operation
    const log = await HealthLog.findOneAndDelete({
      _id: id,
      owner: req.user._id
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Health log not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Health log deleted successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
