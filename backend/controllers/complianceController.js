// Medicine Compliance Controller - CRUD and Aggregation Operations
const mongoose = require('mongoose');
const MedicineCompliance = require('../models/MedicineCompliance');
const Medication = require('../models/Medication');

// @desc Log medicine compliance
// @route POST /api/compliance
// @access Private
// DEMONSTRATES: CREATE (insertOne)
exports.logCompliance = async (req, res) => {
  try {
    const { patientId, medicationId, medicineName, logDate, status, timeTaken, notes } = req.body;

    if (!patientId || !medicationId || !status) {
      return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }

    // CREATE: insertOne operation
    const compliance = await MedicineCompliance.create({
      patientId,
      medicationId,
      medicineName,
      logDate: logDate || new Date(),
      status,
      timeTaken,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Compliance logged successfully',
      data: compliance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get compliance logs for patient
// @route GET /api/compliance/:patientId
// @access Private
// DEMONSTRATES: READ (find with index)
exports.getComplianceForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // READ: find with compound index (patientId, logDate)
    const compliance = await MedicineCompliance.find({
      patientId,
      logDate: { $gte: startDate }
    })
      .populate('medicationId', 'medicineName dosage')
      .sort({ logDate: -1 });

    res.status(200).json({
      success: true,
      count: compliance.length,
      data: compliance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update compliance log
// @route PUT /api/compliance/:id
// @access Private
// DEMONSTRATES: UPDATE (updateOne)
exports.updateCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, timeTaken, notes } = req.body;

    // UPDATE: updateOne operation
    const compliance = await MedicineCompliance.findByIdAndUpdate(
      id,
      { status, timeTaken, notes },
      { new: true, runValidators: true }
    );

    if (!compliance) {
      return res.status(404).json({ success: false, message: 'Compliance record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Compliance updated successfully',
      data: compliance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get compliance rate for patient
// @route GET /api/compliance/:patientId/rate
// @access Private
// DEMONSTRATES: AGGREGATION PIPELINE - Calculate compliance rate per patient
exports.getComplianceRate = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // AGGREGATION PIPELINE
    const result = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: new mongoose.Types.ObjectId(patientId),
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$patientId',
          totalLogs: { $sum: 1 },
          takenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          missedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          partialCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Partial'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          patientId: '$_id',
          totalLogs: 1,
          takenCount: 1,
          missedCount: 1,
          partialCount: 1,
          complianceRate: {
            $round: [
              { $multiply: [{ $divide: ['$takenCount', '$totalLogs'] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          complianceRate: 0,
          totalLogs: 0,
          takenCount: 0,
          missedCount: 0,
          partialCount: 0}
      });
    }

    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get most missed medicines
// @route GET /api/compliance/:patientId/most-missed
// @access Private
// DEMONSTRATES: AGGREGATION PIPELINE - Find most missed medicines
exports.getMostMissedMedicines = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // AGGREGATION PIPELINE
    const result = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: new mongoose.Types.ObjectId(patientId),
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$medicineName',
          totalCount: { $sum: 1 },
          missedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          takenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          medicineName: '$_id',
          _id: 0,
          totalCount: 1,
          missedCount: 1,
          takenCount: 1,
          missRate: {
            $round: [
              { $multiply: [{ $divide: ['$missedCount', '$totalCount'] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { missedCount: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
