# HealthTrack API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "Dr. John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "doctor"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "doctor"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "doctor"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Retrieves authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Patient Endpoints

### Create Patient
**POST** `/patients`

Creates a new patient record with embedded health information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "age": 45,
  "gender": "M",
  "contact": "9876543210",
  "address": "123 Main St, City",
  "condition": "Type 2 Diabetes",
  "emergencyContact": {
    "name": "Jane Smith",
    "relation": "Spouse",
    "phone": "9876543211"
  },
  "healthProfile": {
    "bloodGroup": "O+",
    "allergies": ["Penicillin", "Aspirin"],
    "chronicConditions": ["Diabetes", "Hypertension"]
  },
  "insuranceDetails": {
    "provider": "Aetna",
    "policyNumber": "POL123456"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "John Smith",
    "age": 45,
    "gender": "M",
    "contact": "9876543210",
    "address": "123 Main St, City",
    "condition": "Type 2 Diabetes",
    "emergencyContact": {...},
    "healthProfile": {...},
    "insuranceDetails": {...},
    "visits": [],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get All Patients
**GET** `/patients`

Retrieves all active patients.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Max records to return (default: 50)

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "patients": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "John Smith",
      "age": 45,
      "gender": "M",
      "contact": "9876543210",
      "condition": "Type 2 Diabetes",
      "isActive": true
    },
    ...
  ]
}
```

---

### Get Patient by ID
**GET** `/patients/:id`

Retrieves specific patient with all embedded documents.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "John Smith",
    "age": 45,
    "emergencyContact": {...},
    "healthProfile": {...},
    "insuranceDetails": {...},
    "visits": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "date": "2024-01-10T15:00:00Z",
        "doctor": "Dr. Sarah Johnson",
        "notes": "Regular checkup. BP okay."
      }
    ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Patient
**PUT** `/patients/:id`

Updates patient information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Johnson",
  "age": 46,
  "emergencyContact": {
    "name": "Jane Johnson",
    "relation": "Spouse",
    "phone": "9876543211"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "John Johnson",
    "age": 46,
    ...
  }
}
```

---

### Delete Patient (Soft Delete)
**DELETE** `/patients/:id`

Soft deletes a patient (marks as inactive).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

---

### Search Patients
**GET** `/patients/search/:name`

Searches patients by name (case-insensitive).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "patients": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "John Smith",
      "contact": "9876543210",
      "condition": "Type 2 Diabetes"
    }
  ]
}
```

---

### Add Visit to Patient
**POST** `/patients/:id/visit`

Adds a doctor visit to patient's visit history (array push).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "doctor": "Dr. Sarah Johnson",
  "notes": "Routine checkup completed. All vitals normal."
}
```

**Response (200):**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "John Smith",
    "visits": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "date": "2024-01-15T10:30:00Z",
        "doctor": "Dr. Sarah Johnson",
        "notes": "Routine checkup completed. All vitals normal."
      }
    ],
    ...
  }
}
```

---

## 3. Medication Endpoints

### Create Medication
**POST** `/medications`

Creates a medication record with embedded schedule.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "medicineName": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "schedule": {
    "morning": true,
    "afternoon": false,
    "night": true
  },
  "sideEffects": ["Nausea", "Headache"],
  "notes": "Take with food"
}
```

**Response (201):**
```json
{
  "success": true,
  "medication": {
    "_id": "507f1f77bcf86cd799439014",
    "patientId": "507f1f77bcf86cd799439012",
    "medicineName": "Metformin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "schedule": {
      "morning": true,
      "afternoon": false,
      "night": true
    },
    "sideEffects": ["Nausea", "Headache"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Medications for Patient
**GET** `/medications/patient/:patientId`

Retrieves all active medications for a patient.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "medications": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "patientId": "507f1f77bcf86cd799439012",
      "medicineName": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "schedule": {...},
      "sideEffects": ["Nausea"]
    },
    ...
  ]
}
```

---

### Get Medication by ID
**GET** `/medications/:id`

Retrieves specific medication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "medication": {...}
}
```

---

### Update Medication
**PUT** `/medications/:id`

Updates medication details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "dosage": "750mg",
  "schedule": {
    "morning": true,
    "afternoon": true,
    "night": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "medication": {...}
}
```

---

### Delete Medication (Soft Delete)
**DELETE** `/medications/:id`

Soft deletes a medication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Medication deleted successfully"
}
```

---

## 4. Health Log Endpoints

### Create Health Log
**POST** `/health-logs`

Creates a daily health log with embedded vitals.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "logDate": "2024-01-15",
  "vitals": {
    "sleepHours": 7.5,
    "weight": 75.2,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "mood": "Happy"
  },
  "symptoms": ["Headache"],
  "notes": ["Had good sleep", "Exercised 30 minutes"]
}
```

**Response (201):**
```json
{
  "success": true,
  "healthLog": {
    "_id": "507f1f77bcf86cd799439015",
    "patientId": "507f1f77bcf86cd799439012",
    "logDate": "2024-01-15T00:00:00Z",
    "vitals": {
      "sleepHours": 7.5,
      "weight": 75.2,
      "bloodPressure": {
        "systolic": 120,
        "diastolic": 80
      },
      "mood": "Happy"
    },
    "symptoms": ["Headache"],
    "notes": ["Had good sleep", "Exercised 30 minutes"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Logs for Patient
**GET** `/health-logs/patient/:patientId`

Retrieves health logs for a patient with optional date range.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "patientId": "507f1f77bcf86cd799439012",
      "logDate": "2024-01-15T00:00:00Z",
      "vitals": {...},
      "symptoms": ["Headache"]
    },
    ...
  ]
}
```

---

### Get Health Log by ID
**GET** `/health-logs/:id`

Retrieves specific health log.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "log": {...}
}
```

---

### Update Health Log
**PUT** `/health-logs/:id`

Updates health log data.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "vitals": {
    "mood": "Better"
  },
  "notes": ["Feeling much better"]
}
```

**Response (200):**
```json
{
  "success": true,
  "log": {...}
}
```

---

### Delete Health Log
**DELETE** `/health-logs/:id`

Permanently deletes a health log.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Health log deleted successfully"
}
```

---

## 5. Medicine Compliance Endpoints

### Log Medicine Compliance
**POST** `/compliance`

Logs whether a medicine was taken, missed, or partially taken.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "medicationId": "507f1f77bcf86cd799439014",
  "medicineNamePlain": "Metformin",
  "status": "Taken",
  "logDate": "2024-01-15"
}
```

**Status values:** `"Taken"`, `"Missed"`, `"Partial"`

**Response (201):**
```json
{
  "success": true,
  "compliance": {
    "_id": "507f1f77bcf86cd799439016",
    "patientId": "507f1f77bcf86cd799439012",
    "medicationId": "507f1f77bcf86cd799439014",
    "medicineNamePlain": "Metformin",
    "status": "Taken",
    "logDate": "2024-01-15T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Compliance for Patient
**GET** `/compliance/patient/:patientId`

Retrieves compliance records for a patient.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "compliance": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "patientId": "507f1f77bcf86cd799439012",
      "medicationId": "507f1f77bcf86cd799439014",
      "medicineNamePlain": "Metformin",
      "status": "Taken",
      "logDate": "2024-01-15T00:00:00Z"
    },
    ...
  ]
}
```

---

### Update Compliance
**PUT** `/compliance/:id`

Updates compliance status for a log.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Partial"
}
```

**Response (200):**
```json
{
  "success": true,
  "compliance": {...}
}
```

---

### Get Compliance Rate
**GET** `/compliance/rate/:patientId`

Returns aggregated compliance rate for a patient using MongoDB aggregation pipeline.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional): Number of days to consider (default: 30)

**Response (200):**
```json
{
  "success": true,
  "complianceRate": {
    "totalLogs": 30,
    "takenCount": 27,
    "missedCount": 3,
    "compliancePercentage": 90.0,
    "dateRange": {
      "from": "2023-12-16T00:00:00Z",
      "to": "2024-01-15T00:00:00Z"
    }
  }
}
```

---

### Get Most Missed Medicines
**GET** `/compliance/missed/:patientId`

Returns top most missed medicines for a patient using aggregation pipeline.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of medicines to return (default: 10)

**Response (200):**
```json
{
  "success": true,
  "mostMissed": [
    {
      "medicineId": "507f1f77bcf86cd799439014",
      "medicineName": "Aspirin",
      "missedCount": 5,
      "takenCount": 10,
      "missRate": 33.33
    },
    {
      "medicineId": "507f1f77bcf86cd799439017",
      "medicineName": "Metformin",
      "missedCount": 2,
      "takenCount": 15,
      "missRate": 11.76
    }
  ]
}
```

---

## 6. Dashboard Endpoints

### Get Global Dashboard
**GET** `/dashboard/global`

Returns aggregated dashboard data for overview using multiple aggregation pipelines.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "dashboard": {
    "statistics": {
      "totalPatients": 3,
      "totalMedicines": 4,
      "totalDoses": 60,
      "dosesTaken": 47,
      "dosesMissed": 13,
      "complianceRate": 78.33
    },
    "takenVsMissed": [
      { "_id": "Taken", count: 47 },
      { "_id": "Missed", count: 13 }
    ],
    "dailyTrend": [
      {
        "date": "2024-01-10",
        "taken": 8,
        "missed": 2
      },
      ...
    ],
    "mostMissedMedicines": [
      {
        "medicineName": "Aspirin",
        "missedCount": 5
      },
      {
        "medicineName": "Lisinopril",
        "missedCount": 4
      }
    ],
    "recentLogs": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "patientName": "John Smith",
        "logDate": "2024-01-15T00:00:00Z",
        "vitals": {...}
      }
    ],
    "patientsByCondition": [
      { "condition": "Diabetes", "count": 2 },
      { "condition": "Hypertension", "count": 1 }
    ]
  }
}
```

---

### Get Patient Analytics
**GET** `/dashboard/patient/:patientId`

Returns aggregated analytics specific to a patient.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "complianceSummary": {
      "totalLogs": 30,
      "takenCount": 27,
      "missedCount": 3,
      "complianceRate": 90.0
    },
    "takenVsMissed": [
      { "_id": "Taken", count: 27 },
      { "_id": "Missed", count: 3 }
    ],
    "weeklyAdherence": [
      {
        "week": 2,
        "year": 2024,
        "adherenceRate": 92.5
      },
      ...
    ],
    "healthTrends": [
      {
        "date": "2024-01-10",
        "weight": 74.5,
        "bloodPressure": { "systolic": 118, "diastolic": 78 }
      },
      ...
    ],
    "moodTrend": [
      { "date": "2024-01-10", "mood": "Happy" },
      { "date": "2024-01-11", "mood": "Great" }
    ],
    "missedMedicineFrequency": [
      {
        "medicineName": "Aspirin",
        "missCount": 2
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server error"
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@healthtrack.com", "password": "password123"}'
```

### Get All Patients
```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Health Log
```bash
curl -X POST http://localhost:5000/api/health-logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID",
    "logDate": "2024-01-15",
    "vitals": {
      "sleepHours": 7.5,
      "weight": 75.2,
      "bloodPressure": {"systolic": 120, "diastolic": 80},
      "mood": "Happy"
    }
  }'
```

---

## Rate Limits
- No rate limiting is currently implemented
- Recommended: Implement rate limiting in production

## Pagination
Most list endpoints support pagination:
- `?skip=0&limit=50`

## Filtering
Advanced filtering examples:
- `/patients/search/John` - Search by name
- `/health-logs/patient/:id?startDate=2024-01-01&endDate=2024-01-31` - Date range

---

**Last Updated:** January 2024
