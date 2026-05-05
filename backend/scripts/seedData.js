const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Patient = require('../models/Patient');
const Medication = require('../models/Medication');
const HealthLog = require('../models/HealthLog');
const MedicineCompliance = require('../models/MedicineCompliance');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthtrack');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Patient.deleteMany({});
    await Medication.deleteMany({});
    await HealthLog.deleteMany({});
    await MedicineCompliance.deleteMany({});
    await User.deleteMany({});

    console.log('✓ Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@healthtrack.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Dr. John Smith',
        email: 'doctor@healthtrack.com',
        password: 'password123',
        role: 'doctor'
      }
    ]);

    console.log('✓ Created users');

    // Create patients with embedded documents
    const patients = await Patient.create([
      {
        fullName: 'Raj Kumar',
        age: 45,
        gender: 'Male',
        contact: '9876543210',
        address: '123 Main St, Mumbai, India',
        condition: 'Type 2 Diabetes',
        emergencyContact: {
          name: 'Priya Kumar',
          relation: 'Spouse',
          phone: '9876543211'
        },
        healthProfile: {
          bloodGroup: 'O+',
          allergies: ['Penicillin', 'Peanuts'],
          chronicConditions: ['Diabetes', 'Hypertension']
        },
        insuranceDetails: {
          provider: 'ICICI Health',
          policyNumber: 'POL123456'
        }
      },
      {
        fullName: 'Anjali Singh',
        age: 38,
        gender: 'Female',
        contact: '9876543212',
        address: '456 Oak Ave, Delhi, India',
        condition: 'Hypertension',
        emergencyContact: {
          name: 'Vikram Singh',
          relation: 'Parent',
          phone: '9876543213'
        },
        healthProfile: {
          bloodGroup: 'A+',
          allergies: ['Sulfa'],
          chronicConditions: ['Hypertension']
        },
        insuranceDetails: {
          provider: 'Bajaj Health',
          policyNumber: 'POL789012'
        }
      },
      {
        fullName: 'Amit Patel',
        age: 52,
        gender: 'Male',
        contact: '9876543214',
        address: '789 Park Lane, Bangalore, India',
        condition: 'Cardiac Issues',
        emergencyContact: {
          name: 'Neha Patel',
          relation: 'Child',
          phone: '9876543215'
        },
        healthProfile: {
          bloodGroup: 'B+',
          allergies: [],
          chronicConditions: ['Cardiac Issues', 'High Cholesterol']
        },
        insuranceDetails: {
          provider: 'Max Health',
          policyNumber: 'POL345678'
        }
      }
    ]);

    console.log('✓ Created patients');

    // Create medications with embedded schedule
    const medications = await Medication.create([
      {
        patientId: patients[0]._id,
        medicineName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice Daily',
        schedule: {
          morning: true,
          afternoon: false,
          night: true
        },
        startDate: new Date('2024-01-01'),
        endDate: null,
        notes: 'Take after meals',
        sideEffects: ['Nausea', 'Diarrhea']
      },
      {
        patientId: patients[0]._id,
        medicineName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once Daily',
        schedule: {
          morning: true,
          afternoon: false,
          night: false
        },
        startDate: new Date('2023-06-15'),
        endDate: null,
        notes: 'For blood pressure control',
        sideEffects: ['Dry cough']
      },
      {
        patientId: patients[1]._id,
        medicineName: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once Daily',
        schedule: {
          morning: true,
          afternoon: false,
          night: false
        },
        startDate: new Date('2024-02-01'),
        endDate: null,
        notes: 'Take in morning',
        sideEffects: []
      },
      {
        patientId: patients[2]._id,
        medicineName: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once Daily',
        schedule: {
          morning: false,
          afternoon: false,
          night: true
        },
        startDate: new Date('2023-12-01'),
        endDate: null,
        notes: 'Take at bedtime',
        sideEffects: ['Muscle pain']
      }
    ]);

    console.log('✓ Created medications');

    // Create health logs with embedded vitals
    const today = new Date();
    const healthLogs = [];

    for (let i = 0; i < 30; i++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - i);

      healthLogs.push({
        patientId: patients[0]._id,
        logDate,
        vitals: {
          sleepHours: Math.random() * 4 + 6,
          weight: 75 + Math.random() * 5,
          bloodPressure: {
            systolic: 130 + Math.floor(Math.random() * 20),
            diastolic: 80 + Math.floor(Math.random() * 15)
          },
          mood: ['Very Happy', 'Happy', 'Neutral', 'Sad'][Math.floor(Math.random() * 4)]
        },
        symptoms: Math.random() > 0.7 ? ['Headache', 'Fatigue'] : [],
        notes: ['Felt good today', 'Had some stress at work', 'Great day'][Math.floor(Math.random() * 3)],
        temperature: 98.6 + Math.random() * 2
      });
    }

    await HealthLog.create(healthLogs);
    console.log('✓ Created health logs');

    // Create medicine compliance logs
    const complianceLogs = [];

    for (let i = 0; i < 30; i++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - i);

      // Patient 1 logs
      for (const med of medications.slice(0, 2)) {
        complianceLogs.push({
          patientId: patients[0]._id,
          medicationId: med._id,
          medicineName: med.medicineName,
          logDate,
          status: Math.random() > 0.15 ? 'Taken' : (Math.random() > 0.5 ? 'Missed' : 'Partial'),
          timeTaken: '08:30',
          notes: ''
        });
      }

      // Patient 2 logs
      if (medications[2]) {
        complianceLogs.push({
          patientId: patients[1]._id,
          medicationId: medications[2]._id,
          medicineName: medications[2].medicineName,
          logDate,
          status: Math.random() > 0.1 ? 'Taken' : (Math.random() > 0.5 ? 'Missed' : 'Partial'),
          timeTaken: '08:00',
          notes: ''
        });
      }
    }

    await MedicineCompliance.create(complianceLogs);
    console.log('✓ Created compliance logs');

    console.log('\n✓✓✓ Database seeded successfully! ✓✓✓\n');

    // Print login credentials
    console.log('═════════════════════════════════════════');
    console.log('📧 TEST CREDENTIALS:                    ');
    console.log('═════════════════════════════════════════');
    console.log('Admin Email:    admin@healthtrack.com    ');
    console.log('Doctor Email:   doctor@healthtrack.com   ');
    console.log('Password:       password123             ');
    console.log('═════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedDatabase);
