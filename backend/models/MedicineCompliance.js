const mongoose = require('mongoose');

// Medicine Compliance Log Schema
// Track daily medicine adherence: Taken or Missed
const medicineComplianceSchema = new mongoose.Schema(
  {
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
// Compound index: patientId + logDate for finding compliance on a specific date
medicineComplianceSchema.index({ patientId: 1, logDate: -1 });

// Index for medication compliance
medicineComplianceSchema.index({ medicationId: 1, logDate: -1 });

// Index for compliance reports
medicineComplianceSchema.index({ patientId: 1, status: 1, logDate: -1 });

module.exports = mongoose.model('MedicineCompliance', medicineComplianceSchema);
