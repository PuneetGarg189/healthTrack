const mongoose = require('mongoose');

// Patient Schema with Embedded Documents
const patientSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Basic Information
    fullName: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    age: {
      type: Number,
      required: [true, 'Please provide age'],
      min: [0, 'Age cannot be negative'],
      max: [150, 'Invalid age']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true
    },
    condition: {
      type: String,
      required: [true, 'Please provide medical condition'],
      trim: true
    },

    // EMBEDDED DOCUMENT 1: Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        trim: true
      },
      relation: {
        type: String,
        enum: ['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other'],
        trim: true
      },
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            // Allow empty strings or valid 10-digit numbers
            return !v || /^\d{10}$/.test(v);
          },
          message: 'Please provide a valid 10-digit phone number'
        }
      }
    },

    // EMBEDDED DOCUMENT 2: Health Profile
    healthProfile: {
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        default: 'O+'
      },
      // ARRAY of allergies
      allergies: {
        type: [String],
        default: [],
        trim: true
      },
      // ARRAY of chronic conditions
      chronicConditions: {
        type: [String],
        default: [],
        trim: true
      }
    },

    // EMBEDDED DOCUMENT 3: Insurance Details
    insuranceDetails: {
      provider: {
        type: String,
        trim: true
      },
      policyNumber: {
        type: String,
        trim: true
      }
    },

    // Active status
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
  { collection: 'patients' }
);

// ==================== INDEXES ====================

// Find all patients of a user
patientSchema.index({
  owner: 1,
  isActive: 1
});

// Search patients by name
patientSchema.index({
  owner: 1,
  fullName: "text"
});

// Sort by creation date
patientSchema.index({
  owner: 1,
  createdAt: -1
});

// Fast lookup by owner + patient name
patientSchema.index({
  owner: 1,
  fullName: 1
});

patientSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('Patient', patientSchema);
