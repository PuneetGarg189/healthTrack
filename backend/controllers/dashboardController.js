// Dashboard Controller - Advanced Aggregation Pipelines
const Patient = require('../models/Patient');
const Medication = require('../models/Medication');
const HealthLog = require('../models/HealthLog');
const MedicineCompliance = require('../models/MedicineCompliance');
const mongoose = require('mongoose');

// @desc Get global dashboard analytics
// @route GET /api/dashboard
// @access Private
// DEMONSTRATES: Multiple AGGREGATION PIPELINES for global analytics
exports.getGlobalDashboard = async (req, res) => {
  try {
    const activePatients = await Patient.find({ isActive: true }).select('_id');
    const activePatientIds = activePatients.map((patient) => patient._id);
    if (activePatientIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalPatients: 0,
          totalMedications: 0,
          overallCompliance: {
            complianceRate: 0,
            totalLogs: 0,
            takenCount: 0,
            missedCount: 0
          },
          complianceChart: [],
          dailyTrend: [],
          medicinesSummary: [],
          mostMissedMedicines: [],
          recentLogs: [],
          patientsByCondition: []
        }
      });
    }

    // AGGREGATION 1: Total Statistics
    const stats = await Promise.all([
      // Total Active Patients
      Promise.resolve(activePatientIds.length),
      
      // Total Active Medications
      Medication.countDocuments({ isActive: true, patientId: { $in: activePatientIds } }),
      
      // Overall Compliance Rate (Aggregation Pipeline)
      MedicineCompliance.aggregate([
        {
          $match: {
            patientId: { $in: activePatientIds }
          }
        },
        {
          $group: {
            _id: null,
            totalLogs: { $sum: 1 },
            takenCount: {
              $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
            },
            missedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalLogs: 1,
            takenCount: 1,
            missedCount: 1,
            complianceRate: {
              $round: [
                { $multiply: [{ $divide: ['$takenCount', '$totalLogs'] }, 100] },
                2
              ]
            }
          }
        }
      ])
    ]);

    // AGGREGATION 2: Taken vs Missed Pie Chart Data
    const complianceData = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: { $in: activePatientIds }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1
        }
      }
    ]);

    // AGGREGATION 3: Daily Medication Trend (last 30 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const dailyTrend = await MedicineCompliance.aggregate([
      {
        $match: {
          logDate: { $gte: startDate },
          patientId: { $in: activePatientIds }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$logDate' }
          },
          taken: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          missed: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // AGGREGATION 4: Most Missed Medicines with Details
    const mostMissed = await MedicineCompliance.aggregate([
      {
        $match: {
          logDate: { $gte: startDate },
          patientId: { $in: activePatientIds }
        }
      },
      {
        $group: {
          _id: '$medicineName',
          missCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          takenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          totalCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'medications',
          localField: '_id',
          foreignField: 'medicineName',
          as: 'medicineDetails'
        }
      },
      {
        $unwind: {
          path: '$medicineDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          medicineName: '$_id',
          missCount: 1,
          takenCount: 1,
          totalCount: 1,
          dosage: { $ifNull: ['$medicineDetails.dosage', 'N/A'] },
          frequency: { $ifNull: ['$medicineDetails.frequency', 'N/A'] },
          missRate: {
            $round: [
              { $multiply: [{ $divide: ['$missCount', '$totalCount'] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { missCount: -1 } },
      { $limit: 5 }
    ]);

    // AGGREGATION 5: Medicine Summary (all medicines with compliance)
    const medicinesSummary = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: { $in: activePatientIds }
        }
      },
      {
        $group: {
          _id: '$medicineName',
          takenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          missedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          totalCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'medications',
          localField: '_id',
          foreignField: 'medicineName',
          as: 'medicineDetails'
        }
      },
      {
        $unwind: {
          path: '$medicineDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          medicineName: '$_id',
          takenCount: 1,
          missedCount: 1,
          totalCount: 1,
          dosage: { $ifNull: ['$medicineDetails.dosage', 'N/A'] },
          frequency: { $ifNull: ['$medicineDetails.frequency', 'N/A'] },
          complianceRate: {
            $round: [
              { $multiply: [{ $divide: ['$takenCount', '$totalCount'] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { takenCount: -1 } },
      { $limit: 10 }
    ]);

    // AGGREGATION 6: Recent Logs grouped by date
    const recentLogs = await HealthLog.aggregate([
      {
        $match: {
          logDate: { $gte: startDate },
          patientId: { $in: activePatientIds }
        }
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $unwind: '$patient'
      },
      {
        $sort: { logDate: -1 }
      },
      {
        $limit: 20
      }
    ]);

    // AGGREGATION 7: Patient statistics by condition
    const patientsByCondition = await Patient.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients: stats[0],
        totalMedications: stats[1],
        overallCompliance: stats[2][0] || {
          complianceRate: 0,
          totalLogs: 0,
          takenCount: 0,
          missedCount: 0
        },
        complianceChart: complianceData,
        dailyTrend,
        medicinesSummary,
        mostMissedMedicines: mostMissed,
        recentLogs,
        patientsByCondition
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get patient-specific analytics
// @route GET /api/dashboard/patient/:patientId
// @access Private
// DEMONSTRATES: AGGREGATION PIPELINES for patient analytics
exports.getPatientAnalytics = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const patientObjId = mongoose.Types.ObjectId(patientId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get patient details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // AGGREGATION 1: Patient Compliance Summary
    const complianceSummary = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: patientObjId,
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalDoses: { $sum: 1 },
          taken: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          missed: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          partial: {
            $sum: { $cond: [{ $eq: ['$status', 'Partial'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalDoses: 1,
          taken: 1,
          missed: 1,
          partial: 1,
          complianceRate: {
            $round: [
              { $multiply: [{ $divide: ['$taken', '$totalDoses'] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    // AGGREGATION 2: Taken vs Missed Pie Chart for patient
    const complianceChart = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: patientObjId,
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // AGGREGATION 3: Weekly medicine adherence
    const weeklyAdherence = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: patientObjId,
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$logDate' },
            year: { $year: '$logDate' }
          },
          taken: {
            $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
          },
          missed: {
            $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          week: '$_id.week',
          taken: 1,
          missed: 1,
          total: 1,
          adherenceRate: {
            $round: [
              { $multiply: [{ $divide: ['$taken', '$total'] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { week: 1 } }
    ]);

    // AGGREGATION 4: Health Trends (weight, BP, sleep)
    const healthTrends = await HealthLog.aggregate([
      {
        $match: {
          patientId: patientObjId,
          logDate: { $gte: startDate }
        }
      },
      {
        $sort: { logDate: 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$logDate' }
          },
          weight: '$vitals.weight',
          bloodPressure: '$vitals.bloodPressure',
          sleep: '$vitals.sleepHours',
          mood: '$vitals.mood'
        }
      }
    ]);

    // AGGREGATION 5: Mood trend
    const moodTrend = await HealthLog.aggregate([
      {
        $match: {
          patientId: patientObjId,
          logDate: { $gte: startDate },
          'vitals.mood': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$vitals.mood',
          count: { $sum: 1 }
        }
      }
    ]);

    // AGGREGATION 6: Missed medicine frequency
    const missedMedicineFreq = await MedicineCompliance.aggregate([
      {
        $match: {
          patientId: patientObjId,
          status: 'Missed',
          logDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$medicineName',
          missCount: { $sum: 1 }
        }
      },
      { $sort: { missCount: -1 } }
    ]);

    // Get active medicines
    const activeMedicines = await Medication.find({
      patientId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        patient: {
          name: patient.fullName,
          age: patient.age,
          condition: patient.condition,
          bloodGroup: patient.healthProfile.bloodGroup,
          allergies: patient.healthProfile.allergies
        },
        activeMedicines: activeMedicines.length,
        complianceSummary: complianceSummary[0] || {
          totalDoses: 0,
          taken: 0,
          missed: 0,
          partial: 0,
          complianceRate: 0
        },
        complianceChart,
        weeklyAdherence,
        healthTrends,
        moodTrend,
        missedMedicineFrequency: missedMedicineFreq,
        activeMedications: activeMedicines
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
