const mongoose = require('mongoose');

// Medicine Compliance Log Schema
// Track daily medicine adherence: Taken or Missed
const medicineComplianceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Reference to Patient
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },

    // Reference to Medication
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: true
    },

    medicineName: {
      type: String,
      required: true,
      trim: true
    },

    logDate: {
      type: Date,
      required: true,
      default: () => new Date()
    },

    // Status of medicine for this day
    status: {
      type: String,
      enum: ['Taken', 'Missed', 'Partial'],
      required: true,
      default: 'Missed'
    },

    // Time when medicine was taken (if applicable)
    timeTaken: {
      type: String
      // HH:MM format
    },

    notes: {
      type: String,
      trim: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'medicineCompliance' }
);

// INDEXES
// Patient history
medicineComplianceSchema.index({
  owner: 1,
  patientId: 1,
  logDate: -1
});

// Medication history
medicineComplianceSchema.index({
  owner: 1,
  medicationId: 1,
  logDate: -1
});

// Compliance analytics
medicineComplianceSchema.index({
  owner: 1,
  patientId: 1,
  status: 1,
  logDate: -1
});

medicineComplianceSchema.index(
  {
    owner: 1,
    medicationId: 1,
    logDate: 1
  },
  {
    unique: true
  }
);
module.exports = mongoose.model('MedicineCompliance', medicineComplianceSchema);
