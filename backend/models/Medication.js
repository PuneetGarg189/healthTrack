const mongoose = require('mongoose');

// Medication Schema with Embedded Documents
const medicationSchema = new mongoose.Schema(
  {
    // Reference to Patient
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please provide patient ID'],
      index: true
    },

    medicineName: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
      maxlength: [100, 'Medicine name cannot exceed 100 characters']
    },

    dosage: {
      type: String,
      required: [true, 'Please provide dosage'],
      trim: true,
      // e.g., "500mg", "1 tablet", "2 capsules"
    },

    frequency: {
      type: String,
      enum: ['Once Daily', 'Twice Daily', 'Thrice Daily', 'As Needed', 'Weekly', 'Bi-weekly', 'Monthly'],
      required: true
    },

    // EMBEDDED DOCUMENT: Medicine Schedule
    schedule: {
      morning: {
        type: Boolean,
        default: false
      },
      afternoon: {
        type: Boolean,
        default: false
      },
      night: {
        type: Boolean,
        default: false
      }
    },

    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
      default: () => new Date()
    },

    endDate: {
      type: Date,
      default: null
      // null = ongoing medication
    },

    // Notes about medicine (e.g., take with food)
    notes: {
      type: String,
      trim: true
    },

    // Side effects array
    sideEffects: {
      type: [String],
      default: []
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'medications' }
);

// INDEXES
// Index on patientId for finding all medicines of a patient
medicationSchema.index({ patientId: 1 });

// Compound index for patientId + active status
medicationSchema.index({ patientId: 1, isActive: 1 });

// Index for date range queries
medicationSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Medication', medicationSchema);
