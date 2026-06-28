const mongoose = require('mongoose');

// Health Log Schema with Embedded Documents and Arrays
const healthLogSchema = new mongoose.Schema(
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

    logDate: {
      type: Date,
      required: true,
      default: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
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

// Patient history
healthLogSchema.index({
  owner: 1,
  patientId: 1,
  logDate: -1
});

// User logs by date
healthLogSchema.index({
  owner: 1,
  logDate: -1
});

// Prevent duplicate health log for same patient on same day
healthLogSchema.index(
  {
    owner: 1,
    patientId: 1,
    logDate: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model('HealthLog', healthLogSchema);
