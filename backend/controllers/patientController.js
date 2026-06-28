// Patient Controller - CRUD Operations and Aggregations
const Patient = require('../models/Patient');
const Medication = require('../models/Medication');
const HealthLog = require('../models/HealthLog');
const MedicineCompliance = require('../models/MedicineCompliance');

// @desc Create a new patient
// @route POST /api/patients
// @access Private
// DEMONSTRATES: CREATE (insertOne)
exports.createPatient = async (req, res) => {
  try {
    const { fullName, age, gender, contact, address, condition, emergencyContact, healthProfile, insuranceDetails } = req.body;

    // Validation
    if (!fullName || !age || !gender || !contact || !address || !condition) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // CREATE: insertOne operation
    const patient = await Patient.create({
      owner: req.user._id,
      fullName,
      age,
      gender,
      contact,
      address,
      condition,
      emergencyContact,
      healthProfile,
      insuranceDetails
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all patients
// @route GET /api/patients
// @access Private
// DEMONSTRATES: READ (find)
exports.getAllPatients = async (req, res) => {
  try {
    // READ: find operation
    const patients = await Patient.find({
      owner: req.user._id,
      isActive: true
    });
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single patient
// @route GET /api/patients/:id
// @access Private
// DEMONSTRATES: READ (find)
exports.getPatient = async (req, res) => {
  try {
    const { id } = req.params;

    // READ: find operation with specific id
    const patient = await Patient.findOne({
      _id: id,
      owner: req.user._id
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update patient
// @route PUT /api/patients/:id
// @access Private
// DEMONSTRATES: UPDATE (updateOne)
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      age,
      gender,
      contact,
      address,
      condition,
      emergencyContact,
      healthProfile,
      insuranceDetails
    } = req.body;

    const patient = await Patient.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id
      },
      {
        fullName,
        age,
        gender,
        contact,
        address,
        condition,
        emergencyContact,
        healthProfile,
        insuranceDetails,
        updatedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc Delete patient and related data
// @route DELETE /api/patients/:id
// @access Private
// DEMONSTRATES: DELETE (deleteMany + deleteOne)
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      _id: id,
      owner: req.user._id
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // DELETE: cascade related data, then delete the patient
    const [medicationsResult, logsResult, complianceResult] = await Promise.all([
      Medication.deleteMany({
        owner: req.user._id,
        patientId: id
      }),
      HealthLog.deleteMany({
        owner: req.user._id,
        patientId: id
      }),
      MedicineCompliance.deleteMany({
        owner: req.user._id,
        patientId: id
      })
    ]);

    await Patient.findOneAndDelete({
      _id: id,
      owner: req.user._id
    });
    res.status(200).json({
      success: true,
      message: 'Patient and related data deleted successfully',
      data: {
        patientId: id,
        deleted: {
          medications: medicationsResult.deletedCount || 0,
          healthLogs: logsResult.deletedCount || 0,
          complianceLogs: complianceResult.deletedCount || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Search patients by name
// @route GET /api/patients/search/:name
// @access Private
// DEMONSTRATES: READ (find with regex)
exports.searchPatients = async (req, res) => {
  try {
    const { name } = req.params;

    const patients = await Patient.find({
      owner: req.user._id,
      fullName: { $regex: name, $options: 'i' },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

