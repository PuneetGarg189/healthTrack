# MongoDB Implementation Details

## Overview
HealthTrack is an academic MongoDB project that thoroughly demonstrates MongoDB's core features, including CRUD operations, indexing, aggregation pipelines, embedded documents, arrays, and references.

## 1. CRUD Operations

### CREATE (insertOne)
Located in: `backend/controllers/`

**Example: Creating a Patient**
```javascript
// patientController.js
const patient = await Patient.create({
  fullName,
  age,
  gender,
  contact,
  address,
  condition,
  emergencyContact,  // Embedded document
  healthProfile,     // Embedded document
  insuranceDetails   // Embedded document
});
```

**Demonstrated in**:
- `authController.js`: User registration
- `patientController.js`: New patient creation
- `medicationController.js`: Adding medicines
- `healthLogController.js`: Creating health logs
- `complianceController.js`: Logging compliance

### READ (find, findById)
**Basic Find**:
```javascript
// Get all active patients
const patients = await Patient.find({ isActive: true });

// Search by name with regex
const patients = await Patient.find({
  fullName: { $regex: name, $options: 'i' },
  isActive: true
});

// Find with specific ID
const patient = await Patient.findById(id);
```

**Demonstrated in**:
- Patient list with search
- Medication retrieval by patient
- Health logs with date filtering
- Compliance record queries

### UPDATE (updateOne, findByIdAndUpdate)
**Update Operations**:
```javascript
// Update with new values
const patient = await Patient.findByIdAndUpdate(
  id,
  { fullName, age, gender, ... },
  { new: true, runValidators: true }
);

// Push to array (add visit)
const patient = await Patient.findByIdAndUpdate(
  id,
  { $push: { visits: { date, doctor, notes } } },
  { new: true }
);

// Soft delete
const patient = await Patient.findByIdAndUpdate(
  id,
  { isActive: false, updatedAt: Date.now() },
  { new: true }
);
```

**Demonstrated in**:
- Patient information updates
- Medication modifications
- Health log edits
- Adding visits to patient history

### DELETE (findByIdAndDelete, soft delete)
**Hard Delete**:
```javascript
const log = await HealthLog.findByIdAndDelete(id);
```

**Soft Delete**:
```javascript
const patient = await Patient.findByIdAndUpdate(
  id,
  { isActive: false },
  { new: true }
);
```

**Demonstrated in**:
- Soft delete of patients
- Soft delete of medications
- Hard delete of health logs with cleanup

---

## 2. Indexing

### Index Creation
Located in: `backend/config/database.js`

```javascript
// Single field indexes
patientSchema.index({ _id: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ isActive: 1 });
patientSchema.index({ fullName: 'text' }); // Text index

// Compound indexes
medicationSchema.index({ patientId: 1, isActive: 1 });
healthLogSchema.index({ patientId: 1, logDate: -1 });
medicineComplianceSchema.index({ patientId: 1, logDate: -1 });
medicineComplianceSchema.index({ patientId: 1, status: 1, logDate: -1 });
```

### Performance Impact
- **Without index**: Full collection scan required
- **With index**: O(log n) lookup time

**Example queries benefiting from indexes**:
```javascript
// Efficient due to patientId index
db.medications.find({ patientId: ObjectId(...) })

// Efficient due to compound index
db.healthLogs.find({ patientId: ObjectId(...), logDate: { $gte: date } })

// Efficient due to compound index
db.medicineCompliance.find({ patientId: ObjectId(...), status: 'Missed' })
```

---

## 3. Aggregation Pipelines

Located in: `backend/controllers/dashboardController.js` and `complianceController.js`

### Aggregation 1: Overall Compliance Rate
```javascript
const result = await MedicineCompliance.aggregate([
  {
    $match: {
      patientId: patientObjId,
      logDate: { $gte: startDate }
    }
  },
  {
    $group: {
      _id: '$patientId',
      totalLogs: { $sum: 1 },
      takenCount: {
        $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
      },
      missedCount: {
        $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      complianceRate: {
        $round: [
          { $multiply: [{ $divide: ['$takenCount', '$totalLogs'] }, 100] },
          2
        ]
      }
    }
  }
]);
```

**Demonstrates**: $match, $group, $sum, $cond, $eq, $project, $multiply, $divide, $round

### Aggregation 2: Most Missed Medicines
```javascript
const result = await MedicineCompliance.aggregate([
  {
    $match: {
      patientId: patientObjId,
      logDate: { $gte: startDate }
    }
  },
  {
    $group: {
      _id: '$medicineName',
      missCount: {
        $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
      },
      totalCount: { $sum: 1 }
    }
  },
  {
    $project: {
      medicineName: '$_id',
      _id: 0,
      missRate: {
        $round: [
          { $multiply: [{ $divide: ['$missCount', '$totalCount'] }, 100] },
          2
        ]
      }
    }
  },
  { $sort: { missedCount: -1 } },
  { $limit: 10 }
]);
```

**Demonstrates**: $sort, $limit, ranking, calculation

### Aggregation 3: Weekly Medicine Adherence
```javascript
const result = await MedicineCompliance.aggregate([
  {
    $match: {
      patientId: patientObjId,
      logDate: { $gte: startDate }
    }
  },
  {
    $group: {
      _id: {
        week: { $week: '$logDate' },
        year: { $year: '$logDate' }
      },
      taken: {
        $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
      },
      missed: {
        $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
      },
      total: { $sum: 1 }
    }
  },
  {
    $project: {
      adherenceRate: {
        $round: [{ $multiply: [{ $divide: ['$taken', '$total'] }, 100] }, 2]
      }
    }
  },
  { $sort: { week: 1 } }
]);
```

**Demonstrates**: $week, $year, date operators, percentage calculation

### Aggregation 4: Global Compliance Chart
```javascript
const result = await MedicineCompliance.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
]);
// Result: [{ _id: 'Taken', count: 45 }, { _id: 'Missed', count: 15 }, ...]
```

### Aggregation 5: Daily Trend with Date Grouping
```javascript
const result = await MedicineCompliance.aggregate([
  {
    $match: { logDate: { $gte: startDate } }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: '%Y-%m-%d', date: '$logDate' }
      },
      taken: {
        $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] }
      },
      missed: {
        $sum: { $cond: [{ $eq: ['$status', 'Missed'] }, 1, 0] }
      }
    }
  },
  { $sort: { _id: 1 } }
]);
```

**Demonstrates**: $dateToString for formatting dates in aggregation

### Aggregation 6: Complex Patient Analytics with $lookup
```javascript
const result = await HealthLog.aggregate([
  {
    $match: {
      patientId: patientObjId,
      logDate: { $gte: startDate }
    }
  },
  {
    $lookup: {
      from: 'patients',
      localField: 'patientId',
      foreignField: '_id',
      as: 'patient'
    }
  },
  {
    $unwind: '$patient'
  },
  {
    $sort: { logDate: -1 }
  },
  {
    $limit: 20
  }
]);
```

**Demonstrates**: $lookup (join operation), $unwind, combining data from multiple collections

---

## 4. Embedded Documents

### Definition
Embedded documents are documents nested directly within another document, avoiding the need for separate collections and lookups.

### Pattern: Patient Schema
```javascript
// Patient with THREE embedded document types

// 1. Emergency Contact (1:1 relationship)
emergencyContact: {
  name: String,
  relation: String,
  phone: String
}

// 2. Health Profile (1:1 relationship with multiple fields)
healthProfile: {
  bloodGroup: String,
  allergies: [String],        // Array inside embedded doc
  chronicConditions: [String]  // Array inside embedded doc
}

// 3. Insurance Details (1:1 relationship)
insuranceDetails: {
  provider: String,
  policyNumber: String
}
```

**Benefit**: All patient data retrieved in single query, atomic updates possible

### Pattern: Medication Schema
```javascript
// Medication with embedded schedule

schedule: {
  morning: Boolean,
  afternoon: Boolean,
  night: Boolean
}
```

### Pattern: HealthLog Schema
```javascript
// Health log with embedded vitals

vitals: {
  sleepHours: Number,
  weight: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  mood: String
}
```

### Pattern: Array of Embedded Documents
```javascript
// Patient with array of visit records

visits: [
  {
    date: Date,
    doctor: String,
    notes: String,
    _id: ObjectId  // Each has its own ID
  }
]
```

**Advantages**:
- Reduces joins and network round-trips
- Enables atomic transactions
- Better for frequently accessed related data
- Maintains data locality

### Query Examples with Embedded Docs
```javascript
// Create with embedded docs
const patient = await Patient.create({
  fullName: 'John Doe',
  emergencyContact: { name: 'Jane Doe', relation: 'Spouse', phone: '1234567890' },
  healthProfile: { bloodGroup: 'O+', allergies: ['Penicillin'], ... },
  insuranceDetails: { provider: 'Max Health', policyNumber: 'POL123' }
});

// Query by embedded field
const patients = await Patient.find({ 'healthProfile.bloodGroup': 'O+' });

// Update embedded field
const patient = await Patient.findByIdAndUpdate(
  id,
  { 'emergencyContact.phone': '9999999999' },
  { new: true }
);

// Add to embedded array
const patient = await Patient.findByIdAndUpdate(
  id,
  { $push: { 'healthProfile.allergies': 'Aspirin' } },
  { new: true }
);
```

---

## 5. Arrays

### Single-Level Arrays
```javascript
// Allergies array (simple strings)
allergies: [String]

// Symptoms array
symptoms: [String]

// Notes array
notes: [String]

// Side effects array
sideEffects: [String]
```

### Array Operations
```javascript
// Add to array
db.patients.updateOne(
  { _id: patientId },
  { $push: { allergies: 'Penicillin' } }
);

// Remove from array
db.patients.updateOne(
  { _id: patientId },
  { $pull: { allergies: 'Penicillin' } }
);

// Query with array element
db.patients.find({ allergies: 'Penicillin' });

// Array size
db.patients.find({ allergies: { $size: 2 } });

// Contains all elements
db.patients.find({ allergies: { $all: ['Penicillin', 'Peanuts'] } });
```

### Array of Embedded Documents
```javascript
// Array of visits
visits: [
  {
    date: Date,
    doctor: String,
    notes: String
  }
]

// Array query
db.patients.find({ 'visits.doctor': 'Dr. Smith' });
```

---

## 6. References (Foreign Keys)

### Pattern Usage
```javascript
// MedicineCompliance references both Patient and Medication

patientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Patient',
  required: true,
  index: true
}

medicationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Medication',
  required: true
}
```

### Populated Queries
```javascript
// Without populate (just ID)
const compliance = await MedicineCompliance.findById(id);
// Result: { patientId: ObjectId(...), medicationId: ObjectId(...), ... }

// With populate (joins data)
const compliance = await MedicineCompliance.findById(id)
  .populate('medicationId', 'medicineName dosage');
// Result: { medicationId: { _id: ..., medicineName: 'Aspirin', dosage: '500mg' }, ... }
```

### Use Cases
- References used when:
  - Data can be updated independently
  - Data accessed separately
  - Many-to-many relationships
  - Avoiding array limits (unbounded)

- Embedding preferred when:
  - Data always accessed together
  - No independent updates needed
  - One-to-many with bounded array

---

## 7. Schema Validation

```javascript
// JSON Schema validation in MongoDB

const patientSchema = new mongoose.Schema({
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
  contact: {
    type: String,
    required: [true, 'Please provide contact number'],
    match: [/^\d{10}$/, 'Valid 10-digit phone number required']
  },
  emergencyContact: {
    name: { type: String, required: true },
    relation: { type: String, enum: ['Parent', 'Spouse', ...], required: true },
    phone: { type: String, required: true }
  }
});
```

---

## 8. MongoDB in Action

### Sample Scenarios Demonstrating All Features

**Scenario 1**: View Patient Dashboard
```javascript
// Use: Patient document with embedded docs + References + Aggregation

// 1. Fetch patient (embedded health profile retrieved)
const patient = await Patient.findById(patientId);

// 2. Get medications (references patient, uses index)
const medications = await Medication.find({ patientId }, null, { _id: 1, patientId: 1, isActive: 1 });

// 3. Calculate compliance (Aggregation Pipeline)
const compliance = await MedicineCompliance.aggregate([
  { $match: { patientId } },
  { $group: { _id: null, taken: { $sum: ... } } }
]);
```

**Scenario 2**: Add Health Log
```javascript
// Use: CRUD (Create), Embedded documents, Arrays

const healthLog = await HealthLog.create({
  patientId,
  logDate: new Date(),
  vitals: {  // Embedded document
    sleepHours: 7.5,
    weight: 75.2,
    bloodPressure: { systolic: 120, diastolic: 80 },  // Nested embedded
    mood: 'Happy'
  },
  symptoms: ['Headache', 'Fatigue'],  // Array
  notes: ['Had stress today', 'Took medicine on time']  // Array
});
```

**Scenario 3**: Track Compliance
```javascript
// Use: CRUD (Create), References, Indexes, Aggregations

// Log medicine taken (Create with compound indexed fields)
const compliance = await MedicineCompliance.create({
  patientId,
  medicationId,
  logDate: new Date(),
  status: 'Taken'
});

// Query efficiently (uses patientId + logDate index)
const weekLogs = await MedicineCompliance.find({
  patientId,
  logDate: { $gte: weekStart, $lte: weekEnd }
});

// Calculate compliance rate (Aggregation)
const stats = await MedicineCompliance.aggregate([
  { $match: { patientId, logDate: { $gte: startDate } } },
  { $group: {
      _id: null,
      total: { $sum: 1 },
      taken: { $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] } }
    }
  }
]);
```

---

## Summary Table: MongoDB Features Used

| Feature | Collection | Example |
|---------|-----------|---------|
| **CRUD Create** | All | Patient.create({...}) |
| **CRUD Read** | All | Patient.find(), Patient.findById() |
| **CRUD Update** | All | Patient.findByIdAndUpdate() |
| **CRUD Delete** | All | HealthLog.findByIdAndDelete() |
| **Indexes** | All | patientId: 1, patientId+logDate: -1 |
| **Aggregation** | MedicineCompliance | Compliance rate, trends |
| **Embedded Docs** | Patient | emergencyContact, healthProfile |
| **Embedded Docs** | Medication | schedule |
| **Embedded Docs** | HealthLog | vitals |
| **Arrays** | Patient | allergies[], visits[] |
| **Arrays** | HealthLog | symptoms[], notes[] |
| **Arrays** | Medication | sideEffects[] |
| **References** | Medication | patientId |
| **References** | HealthLog | patientId |
| **Text Index** | Patient | fullName |

---

## Performance Metrics

- **Patient Search**: O(log n) with text index
- **Medication Fetch**: O(log n) with patientId index
- **Compliance Aggregation**: O(n) - processes all documents in collection
- **Weekly Trend**: O(n) with date filtering and grouping

---

**This project serves as a comprehensive MongoDB learning resource demonstrating production-grade schema design!**
