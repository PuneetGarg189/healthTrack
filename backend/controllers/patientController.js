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
    const patients = await Patient.find({ isActive: true });

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
    const patient = await Patient.findById(id);

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
    const { fullName, age, gender, contact, address, condition, emergencyContact, healthProfile, insuranceDetails } = req.body;

    // UPDATE: updateOne operation
    const patient = await Patient.findByIdAndUpdate(
      id,
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
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete patient and related data
// @route DELETE /api/patients/:id
// @access Private
// DEMONSTRATES: DELETE (deleteMany + deleteOne)
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // DELETE: cascade related data, then delete the patient
    const [medicationsResult, logsResult, complianceResult] = await Promise.all([
      Medication.deleteMany({ patientId: id }),
      HealthLog.deleteMany({ patientId: id }),
      MedicineCompliance.deleteMany({ patientId: id })
    ]);

    await Patient.findByIdAndDelete(id);

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

    const patients = await Patient.find(
      {
        fullName: { $regex: name, $options: 'i' },
        isActive: true
      }
    );

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add visit to patient
// @route POST /api/patients/:id/visits
// @access Private
// DEMONSTRATES: UPDATE (push to array)
exports.addVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, doctor, notes } = req.body;

    // UPDATE: push to visits array
    const patient = await Patient.findByIdAndUpdate(
      id,
      {
        $push: {
          visits: { date, doctor, notes }
        }
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Visit added successfully',
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
