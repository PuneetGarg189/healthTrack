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
    console.log('MongoDB connected for seeding');
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

    console.log('✓ Cleared existing database records');

    // Create primary users
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

    const primaryOwner = users[0]._id;
    console.log('✓ Created system users');

    // Specified Patients
    const patientData = [
      {
        owner: primaryOwner,
        fullName: 'Tripat',
        age: 24,
        gender: 'Male',
        contact: '9876543201',
        address: '12 Health St, New Delhi, India',
        condition: 'Type 1 Diabetes',
        emergencyContact: { name: 'Harpreet', relation: 'Parent', phone: '9876543211' },
        healthProfile: { bloodGroup: 'O+', allergies: ['Penicillin'], chronicConditions: ['Diabetes'] },
        insuranceDetails: { provider: 'Star Health', policyNumber: 'POL-TRIPAT-01' }
      },
      {
        owner: primaryOwner,
        fullName: 'Deepanshu Agam',
        age: 26,
        gender: 'Male',
        contact: '9876543202',
        address: '45 Care Ave, Noida, India',
        condition: 'Hypertension',
        emergencyContact: { name: 'Sunil Agam', relation: 'Parent', phone: '9876543212' },
        healthProfile: { bloodGroup: 'B+', allergies: [], chronicConditions: ['High Blood Pressure'] },
        insuranceDetails: { provider: 'HDFC Ergo', policyNumber: 'POL-DEEP-02' }
      },
      {
        owner: primaryOwner,
        fullName: 'Kartik',
        age: 25,
        gender: 'Male',
        contact: '9876543203',
        address: '78 Sector 14, Gurgaon, India',
        condition: 'Asthma',
        emergencyContact: { name: 'Ramesh', relation: 'Sibling', phone: '9876543213' },
        healthProfile: { bloodGroup: 'A+', allergies: ['Dust', 'Pollen'], chronicConditions: ['Asthma'] },
        insuranceDetails: { provider: 'Max Bupa', policyNumber: 'POL-KART-03' }
      },
      {
        owner: primaryOwner,
        fullName: 'Heshane',
        age: 23,
        gender: 'Male',
        contact: '9876543204',
        address: '89 Rose Walk, Chandigarh, India',
        condition: 'Migraine',
        emergencyContact: { name: 'Kavita', relation: 'Parent', phone: '9876543214' },
        healthProfile: { bloodGroup: 'AB+', allergies: ['Sulfa'], chronicConditions: ['Chronic Migraine'] },
        insuranceDetails: { provider: 'ICICI Lombard', policyNumber: 'POL-HESH-04' }
      },
      {
        owner: primaryOwner,
        fullName: 'Nikhil',
        age: 27,
        gender: 'Male',
        contact: '9876543205',
        address: '102 Marine Drive, Mumbai, India',
        condition: 'Cardiac Care',
        emergencyContact: { name: 'Alok', relation: 'Spouse', phone: '9876543215' },
        healthProfile: { bloodGroup: 'O-', allergies: [], chronicConditions: ['Arrhythmia'] },
        insuranceDetails: { provider: 'Bajaj Allianz', policyNumber: 'POL-NIKH-05' }
      },
      {
        owner: primaryOwner,
        fullName: 'Lavish',
        age: 22,
        gender: 'Male',
        contact: '9876543206',
        address: '33 Pink City Rd, Jaipur, India',
        condition: 'Post-Op Recovery',
        emergencyContact: { name: 'Manish', relation: 'Friend', phone: '9876543216' },
        healthProfile: { bloodGroup: 'A-', allergies: ['Aspirin'], chronicConditions: [] },
        insuranceDetails: { provider: 'Care Health', policyNumber: 'POL-LAV-06' }
      },
      {
        owner: primaryOwner,
        fullName: 'Micky',
        age: 25,
        gender: 'Male',
        contact: '9876543207',
        address: '56 Tech Park, Bangalore, India',
        condition: 'Thyroid',
        emergencyContact: { name: 'Pooja', relation: 'Sibling', phone: '9876543217' },
        healthProfile: { bloodGroup: 'B-', allergies: [], chronicConditions: ['Hypothyroidism'] },
        insuranceDetails: { provider: 'Tata AIG', policyNumber: 'POL-MICK-07' }
      },
      {
        owner: primaryOwner,
        fullName: 'Ishant',
        age: 28,
        gender: 'Male',
        contact: '9876543208',
        address: '21 Jubilee Hills, Hyderabad, India',
        condition: 'General Wellness',
        emergencyContact: { name: 'Sanjay', relation: 'Parent', phone: '9876543218' },
        healthProfile: { bloodGroup: 'O+', allergies: ['Peanuts'], chronicConditions: [] },
        insuranceDetails: { provider: 'Niva Bupa', policyNumber: 'POL-ISH-08' }
      }
    ];

    const patients = await Patient.create(patientData);
    console.log(`✓ Created ${patients.length} patients: Tripat, Deepanshu Agam, Kartik, Heshane, Nikhil, Lavish, Micky, Ishant`);

    // Assign Medications
    const medicationTemplates = [
      { medicineName: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', notes: 'Take after meals' },
      { medicineName: 'DOLO 600', dosage: '1 tablet', frequency: 'Twice Daily', notes: 'Take for pain/fever' },
      { medicineName: 'Lisinopril', dosage: '10mg', frequency: 'Once Daily', notes: 'Blood pressure control' },
      { medicineName: 'Cold time', dosage: '1 tablet', frequency: 'Twice Daily', notes: 'Take with warm water' },
      { medicineName: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', notes: 'Morning dose' },
      { medicineName: 'Atorvastatin', dosage: '20mg', frequency: 'Once Daily', notes: 'Take at bedtime' },
      { medicineName: 'Levothyroxine', dosage: '50mcg', frequency: 'Once Daily', notes: 'Empty stomach in morning' },
      { medicineName: 'Paracetamol', dosage: '650mg', frequency: 'As Needed', notes: 'For general discomfort' }
    ];

    const createdMedications = [];
    for (let i = 0; i < patients.length; i++) {
      const p = patients[i];
      const med1 = medicationTemplates[i % medicationTemplates.length];
      const med2 = medicationTemplates[(i + 1) % medicationTemplates.length];

      const m1 = await Medication.create({
        owner: primaryOwner,
        patientId: p._id,
        medicineName: med1.medicineName,
        dosage: med1.dosage,
        frequency: med1.frequency,
        schedule: { morning: true, afternoon: false, night: true },
        startDate: new Date('2024-01-01'),
        notes: med1.notes
      });

      const m2 = await Medication.create({
        owner: primaryOwner,
        patientId: p._id,
        medicineName: med2.medicineName,
        dosage: med2.dosage,
        frequency: med2.frequency,
        schedule: { morning: true, afternoon: false, night: false },
        startDate: new Date('2024-02-01'),
        notes: med2.notes
      });

      createdMedications.push(m1, m2);
    }
    console.log(`✓ Created ${createdMedications.length} active medication records`);

    // Create Health Logs and Compliance Records over past 14 days
    const today = new Date();
    const healthLogs = [];
    const complianceLogs = [];

    const statuses = ['Taken', 'Taken', 'Taken', 'Missed', 'Partial'];
    const moods = ['Very Happy', 'Happy', 'Neutral', 'Sad'];

    for (let day = 0; day < 14; day++) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - day);

      for (let i = 0; i < patients.length; i++) {
        const p = patients[i];
        
        // Health Log
        healthLogs.push({
          owner: primaryOwner,
          patientId: p._id,
          logDate,
          vitals: {
            sleepHours: Number((6 + Math.random() * 3).toFixed(1)),
            weight: Number((65 + (i * 3) + Math.random() * 2).toFixed(1)),
            bloodPressure: {
              systolic: 115 + Math.floor(Math.random() * 20),
              diastolic: 75 + Math.floor(Math.random() * 15)
            },
            mood: moods[Math.floor(Math.random() * moods.length)]
          },
          symptoms: day % 4 === 0 ? ['Mild Headache'] : [],
          notes: `Daily health log recorded for ${p.fullName}`,
          temperature: Number((98.2 + Math.random() * 1.2).toFixed(1))
        });

        // Compliance logs for patient's medications
        const patientMeds = createdMedications.filter(m => m.patientId.toString() === p._id.toString());
        for (const med of patientMeds) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          complianceLogs.push({
            owner: primaryOwner,
            patientId: p._id,
            medicationId: med._id,
            medicineName: med.medicineName,
            logDate,
            status,
            timeTaken: status === 'Taken' ? '09:00 AM' : '',
            notes: status === 'Missed' ? 'Forgot dose' : 'Dose logged'
          });
        }
      }
    }

    await HealthLog.create(healthLogs);
    await MedicineCompliance.create(complianceLogs);
    console.log(`✓ Created ${healthLogs.length} health logs & ${complianceLogs.length} compliance entries`);

    console.log('\n═════════════════════════════════════════════════════════');
    console.log('🎉 SEEDING COMPLETE WITH SPECIFIED PATIENTS!              ');
    console.log('═════════════════════════════════════════════════════════');
    console.log('Patients Added:');
    patientData.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.fullName} (${p.condition})`);
    });
    console.log('═════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(seedDatabase);
