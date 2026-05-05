const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthtrack', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Create indexes on startup
    await createIndexes();
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Create indexes for better query performance
const createIndexes = async () => {
  try {
    const Patient = require('../models/Patient');
    const Medication = require('../models/Medication');
    const HealthLog = require('../models/HealthLog');
    const MedicineCompliance = require('../models/MedicineCompliance');

    await Patient.collection.createIndex({ _id: 1 });
    await Patient.collection.createIndex({ createdAt: -1 });
    await Patient.collection.createIndex({ isActive: 1 });

    await Medication.collection.createIndex({ patientId: 1 });
    await Medication.collection.createIndex({ patientId: 1, isActive: 1 });
    await Medication.collection.createIndex({ startDate: 1, endDate: 1 });

    await HealthLog.collection.createIndex({ patientId: 1, logDate: -1 });
    await HealthLog.collection.createIndex({ logDate: -1 });

    await MedicineCompliance.collection.createIndex({ patientId: 1, logDate: -1 });
    await MedicineCompliance.collection.createIndex({ medicationId: 1, logDate: -1 });
    await MedicineCompliance.collection.createIndex({ patientId: 1, status: 1, logDate: -1 });

    console.log('✓ Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = connectDB;
