// Medication Controller - CRUD Operations
const Medication = require('../models/Medication');

// @desc Create medication for patient
// @route POST /api/medications
// @access Private
// DEMONSTRATES: CREATE (insertOne)
exports.createMedication = async (req, res) => {
  try {
    const { patientId, medicineName, dosage, frequency, schedule, startDate, endDate, notes, sideEffects } = req.body;

    if (!patientId || !medicineName || !dosage || !frequency) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // CREATE: insertOne operation
    const medication = await Medication.create({
      patientId,
      medicineName,
      dosage,
      frequency,
      schedule,
      startDate,
      endDate: endDate || null,
      notes,
      sideEffects: sideEffects || []
    });

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      data: medication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all medications for a patient
// @route GET /api/medications/:patientId
// @access Private
// DEMONSTRATES: READ (find with filter)
exports.getMedicationsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // READ: find with patientId index
    const medications = await Medication.find({
      patientId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single medication
// @route GET /api/medications/:id
// @access Private
// DEMONSTRATES: READ (findById)
exports.getMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findById(id);

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update medication
// @route PUT /api/medications/:id
// @access Private
// DEMONSTRATES: UPDATE (updateOne)
exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicineName, dosage, frequency, schedule, endDate, notes, sideEffects } = req.body;

    // UPDATE: updateOne operation
    const medication = await Medication.findByIdAndUpdate(
      id,
      {
        medicineName,
        dosage,
        frequency,
        schedule,
        endDate,
        notes,
        sideEffects,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Medication updated successfully',
      data: medication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete medication (soft delete)
// @route DELETE /api/medications/:id
// @access Private
// DEMONSTRATES: DELETE (updateOne - soft delete)
exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    // DELETE: soft delete using updateOne
    const medication = await Medication.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully',
      data: medication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
