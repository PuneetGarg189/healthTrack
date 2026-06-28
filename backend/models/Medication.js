const mongoose = require('mongoose');

// Medication Schema with Embedded Documents
const medicationSchema = new mongoose.Schema(
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

// ==================== INDEXES ====================

// Find all medications for a patient's account
medicationSchema.index({
  owner: 1,
  patientId: 1
});

// Find active medications of a patient
medicationSchema.index({
  owner: 1,
  patientId: 1,
  isActive: 1
});

// Date range queries
medicationSchema.index({
  owner: 1,
  startDate: 1,
  endDate: 1
});

// Search medicine names
medicationSchema.index({
  owner: 1,
  medicineName: "text"
});

medicationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Medication', medicationSchema);
