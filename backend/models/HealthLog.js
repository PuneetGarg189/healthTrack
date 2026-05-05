const mongoose = require('mongoose');

// Health Log Schema with Embedded Documents and Arrays
const healthLogSchema = new mongoose.Schema(
  {
    // Reference to Patient
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please provide patient ID'],
      index: true
    },

    logDate: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true
    },

    // EMBEDDED DOCUMENT: Vitals
    vitals: {
      sleepHours: {
        type: Number,
        min: [0, 'Sleep hours cannot be negative'],
        max: [24, 'Sleep hours cannot exceed 24']
      },
      weight: {
        type: Number,
        min: [0, 'Weight cannot be negative']
        // in kg
      },
      bloodPressure: {
        systolic: Number,
        diastolic: Number
        // stored as "120/80"
      },
      mood: {
        type: String,
        enum: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'],
        default: 'Neutral'
      }
    },

    // ARRAY of Symptoms
    symptoms: {
      type: [String],
      default: []
      // e.g., ['Headache', 'Fever', 'Cough']
    },

    // ARRAY of Notes
    notes: {
      type: [String],
      default: [],
      trim: true
    },

    temperature: {
      type: Number,
      min: [90, 'Temperature seems too low'],
      max: [110, 'Temperature seems too high']
      // in Fahrenheit
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'healthLogs' }
);

// COMPOUND INDEX for patientId + logDate (very common query pattern)
healthLogSchema.index({ patientId: 1, logDate: -1 });

// Index on date for global queries
healthLogSchema.index({ logDate: -1 });

module.exports = mongoose.model('HealthLog', healthLogSchema);
