// Medicine Compliance Controller - CRUD and Aggregation Operations
const mongoose = require('mongoose');
const MedicineCompliance = require('../models/MedicineCompliance');
// @desc Log medicine compliance
// @route POST /api/compliance
// @access Private
// DEMONSTRATES: CREATE (insertOne)
exports.logCompliance = async (req, res) => {
  try {
    const {
      patientId,
      medicationId,
      medicineName,
      logDate,
      status,
      timeTaken,
      notes
    } = req.body;

    if (!patientId || !medicationId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields'
      });
    }

    const compliance = await MedicineCompliance.create({
      owner: req.user._id,
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
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Compliance for this medication has already been logged today.'
    });
  }

  res.status(500).json({
    success: false,
    message: error.message
  });
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

    const compliance = await MedicineCompliance.find({
      owner: req.user._id,
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
    res.status(500).json({
      success: false,
      message: error.message
    });
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

    const compliance = await MedicineCompliance.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id
      },
      {
        status,
        timeTaken,
        notes
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Compliance updated successfully',
      data: compliance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get compliance rate for patient
// @route GET /api/compliance/:patientId/rate
// @access Private
// DEMONSTRATES: AGGREGATION PIPELINE
exports.getComplianceRate = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const result = await MedicineCompliance.aggregate([
      {
        $match: {
          owner: req.user._id,
          patientId: new mongoose.Types.ObjectId(patientId),
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$patientId',
          totalLogs: { $sum: 1 },
          takenCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0]
            }
          },
          missedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0]
            }
          },
          partialCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Partial'] }, 1, 0]
            }
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
              {
                $multiply: [
                  {
                    $divide: ['$takenCount', '$totalLogs']
                  },
                  100
                ]
              },
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
          partialCount: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Get most missed medicines
// @route GET /api/compliance/:patientId/most-missed
// @access Private
// DEMONSTRATES: AGGREGATION PIPELINE
exports.getMostMissedMedicines = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const result = await MedicineCompliance.aggregate([
      {
        $match: {
          owner: req.user._id,
          patientId: new mongoose.Types.ObjectId(patientId),
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$medicineName',
          totalCount: { $sum: 1 },
          missedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0]
            }
          },
          takenCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          medicineName: '$_id',
          totalCount: 1,
          missedCount: 1,
          takenCount: 1,
          missRate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: ['$missedCount', '$totalCount']
                  },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: {
          missedCount: -1
        }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};