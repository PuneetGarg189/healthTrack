# HealthTrack - Personal Health Analytics System

A complete full-stack web application for managing patient health data, medications, health logs, and analytics dashboards with comprehensive MongoDB implementation.

## 📚 Documentation Guide

**Start Here:**
- 📖 [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - High-level project overview and architecture
- ⚡ [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes

**Comprehensive Guides:**
- 🌍 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All 20+ API endpoints with examples
- 🗄️ [MONGODB_IMPLEMENTATION.md](MONGODB_IMPLEMENTATION.md) - Deep dive into MongoDB patterns
- 🚀 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deploy to production (Heroku, AWS, Digital Ocean)
- ✅ [FEATURES_CHECKLIST.md](FEATURES_CHECKLIST.md) - Complete feature list

---

## 🏥 Project Overview

HealthTrack is an academic MongoDB project that demonstrates:

- **Full CRUD Operations**: insertOne, find, updateOne, deleteOne
- **Advanced Indexing**: Single indexes, compound indexes for optimal query performance
- **Aggregation Pipelines**: Complex data aggregations for analytics
- **Embedded Documents**: Multiple embedded document patterns in schemas
- **Arrays**: Dynamic arrays for storing collections of data
- **References**: Proper use of foreign keys and references between collections

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**: REST API server
- **MongoDB** + **Mongoose**: NoSQL database with ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

### Frontend
- **React.js**: UI library
- **React Router**: Client-side routing
- **Pure CSS**: Styling (no Tailwind)
- **Context API**: State management

## 📋 Features

### 1. Authentication
- User registration and login
- JWT token-based authentication
- Secure password hashing

### 2. Patient Management
- ✅ Create patients with embedded emergency contact, health profile, and insurance details
- ✅ View all patients
- ✅ Search patients by name
- ✅ Edit patient information
- ✅ Delete patients (soft delete)
- ✅ Add visit history (array of visits)

### 3. Medication Management
- ✅ Add medicines with embedded schedule (morning/afternoon/night)
- ✅ Track side effects (array)
- ✅ Edit medication details
- ✅ Delete medications
- ✅ View patient-specific medicines

### 4. Daily Health Logs
- ✅ Record sleep hours, weight, blood pressure (embedded vitals)
- ✅ Track mood and symptoms (arrays)
- ✅ Add notes (array)
- ✅ Track temperature
- ✅ View logs with timeline

### 5. Medicine Compliance Tracking
- ✅ Mark medicines as Taken/Missed/Partial
- ✅ Track compliance per dose
- ✅ Aggregation: Calculate overall compliance rate
- ✅ Aggregation: Find most missed medicines
- ✅ Weekly medicine adherence tracking

### 6. Global Dashboard
- ✅ Total patients and medications counters
- ✅ Overall compliance rate (aggregation)
- ✅ Taken vs Missed compliance chart
- ✅ Daily medication trend (30 days)
- ✅ Most missed medicines
- ✅ Recent health logs

### 7. Patient Analytics Dashboard
- ✅ Patient overview with allergies and conditions
- ✅ Compliance progress bar
- ✅ Weekly medicine adherence bar chart
- ✅ Health trends (weight, BP, sleep)
- ✅ Mood trend chart
- ✅ Most commonly missed medicines
- ✅ Active medications list

## 📊 MongoDB Schema Design

### Patient Collection
```javascript
{
  fullName, age, gender, contact, address, condition,
  emergencyContact: { name, relation, phone },
  healthProfile: { 
    bloodGroup, 
    allergies[], 
    chronicConditions[]
  },
  insuranceDetails: { provider, policyNumber },
  visits[]: [{ date, doctor, notes }],
  createdAt, updatedAt
}
```
**Indexes**: patientId, createdAt, isActive, fullName (text)

### Medication Collection
```javascript
{
  patientId (ref), medicineName, dosage, frequency,
  schedule: { morning, afternoon, night },
  startDate, endDate,
  notes, sideEffects[],
  isActive, createdAt
}
```
**Indexes**: patientId, patientId+isActive, startDate+endDate

### HealthLog Collection
```javascript
{
  patientId (ref), logDate,
  vitals: { sleepHours, weight, bloodPressure, mood },
  symptoms[], notes[], temperature,
  createdAt
}
```
**Indexes**: patientId+logDate, logDate

### MedicineCompliance Collection
```javascript
{
  patientId (ref), medicationId (ref), medicineName,
  logDate, status (Taken/Missed/Partial),
  timeTaken, notes, createdAt
}
```
**Indexes**: patientId+logDate, medicationId+logDate, patientId+status+logDate

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas connection string)
- npm or yarn

### Backend Setup

1. **Clone/Navigate to project**
```bash
cd healthtrack/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/healthtrack
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
NODE_ENV=development
```

4. **Seed database with sample data**
```bash
npm run seed
```

This creates:
- 2 test users (admin and doctor)
- 3 sample patients with complete data
- 4 medications
- 30 health logs with vitals
- 30+ compliance logs

**Test Credentials**:
- Email: `admin@healthtrack.com`
- Password: `password123`

5. **Start backend server**
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd healthtrack/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Patients
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search/:name` - Search patients
- `POST /api/patients/:id/visits` - Add visit

### Medications
- `POST /api/medications` - Add medication
- `GET /api/medications/:patientId` - Get patient's medications
- `GET /api/medications/single/:id` - Get single medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Health Logs
- `POST /api/logs` - Create health log
- `GET /api/logs/:patientId` - Get patient's logs
- `GET /api/logs/single/:id` - Get single log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

### Medicine Compliance
- `POST /api/compliance` - Log compliance
- `GET /api/compliance/:patientId` - Get patient's compliance
- `PUT /api/compliance/:id` - Update compliance
- `GET /api/compliance/:patientId/rate` - Get compliance rate (Aggregation)
- `GET /api/compliance/:patientId/most-missed` - Get most missed medicines (Aggregation)

### Dashboard
- `GET /api/dashboard` - Get global dashboard (Multiple Aggregations)
- `GET /api/dashboard/patient/:patientId` - Get patient analytics (Aggregations)

## 📁 Project Structure

```
healthtrack/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── Patient.js
│   │   ├── Medication.js
│   │   ├── HealthLog.js
│   │   ├── MedicineCompliance.js
│   │   └── User.js
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── config/           # Database config
│   ├── scripts/          # Seed data
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── context/          # Auth & Data contexts
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🎨 UI/UX Design

- Professional healthcare theme with blue/white color palette
- Responsive layout that works on mobile and desktop
- Sidebar navigation with smooth transitions
- Card-based components with shadows
- Modern form design with validation feedback
- Dashboard with analytics charts
- Patient profile with detailed analytics

## 📊 MongoDB Features Highlighted

### CRUD Operations
1. **CREATE (insertOne)**
   - Patient creation with nested documents
   - Medication addition
   - Health log creation
   - Compliance logging

2. **READ (find)**
   - Patient search by name (regex)
   - Medications for specific patient
   - Health logs with date range
   - Compliance records

3. **UPDATE (updateOne)**
   - Patient information updates
   - Medication modifications
   - Health log edits
   - Compliance updates
   - Push to arrays (add visits, symptoms, notes)

4. **DELETE (deleteOne)**
   - Soft delete of patients
   - Medication deletion
   - Hard delete of logs

### Indexing
- **Single indexes**: patientId, createdAt, isActive
- **Compound indexes**: patientId + logDate, patientId + status
- **Text indexes**: fullName for search

### Aggregation Pipelines
1. **Global aggregations**
   - Overall compliance rate with $group, $sum, $cond
   - Taken vs Missed counts
   - Most missed medicines ranking
   - Daily trend with $dateToString

2. **Patient-specific aggregations**
   - Per-patient compliance calculation
   - Weekly adherence with $week operator
   - Health trends with $match and $sort
   - Mood sentiment analysis with $group

Example: Compliance Rate Aggregation
```javascript
MedicineCompliance.aggregate([
  { $match: { patientId, logDate: { $gte: startDate } } },
  {
    $group: {
      _id: '$patientId',
      totalLogs: { $sum: 1 },
      takenCount: { $sum: { $cond: [{ $eq: ['$status', 'Taken'] }, 1, 0] } }
    }
  },
  {
    $project: {
      complianceRate: { $multiply: [{ $divide: ['$takenCount', '$totalLogs'] }, 100] }
    }
  }
])
```

### Embedded Documents
- **Patient**: emergencyContact, healthProfile, insuranceDetails
- **Medication**: schedule (morning/afternoon/night)
- **HealthLog**: vitals (sleep, weight, BP, mood)

### Arrays
- Patient: allergies[], chronicConditions[], visits[]
- Medication: sideEffects[]
- HealthLog: symptoms[], notes[]

## 🧪 Testing the Application

1. **Login with demo credentials**
   - Email: admin@healthtrack.com
   - Password: password123

2. **Explore Global Dashboard**
   - View total patients (3)
   - See compliance statistics
   - Check recent health logs

3. **Navigate to Patients**
   - View all seeded patients
   - Click on a patient to see detailed analytics
   - See patient profile with charts and trends

4. **Add/Manage Medications**
   - Select a patient
   - Add new medication with schedule
   - View patient medications

5. **Create Health Logs**
   - Add daily vitals, symptoms, and notes
   - View health log timeline

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes on frontend
- Authorization middleware on backend
- Secure database connection

## 📈 Performance Optimizations

- Database indexes for faster queries
- Compound indexes for common query patterns
- Embedded documents to reduce joins
- Pagination ready (can be added to API)

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development with MERN principles
- MongoDB schema design best practices
- RESTful API design
- React context API for state management
- CSS styling without frameworks
- Authentication and authorization
- Data visualization and analytics

## 📝 Notes for Teachers/Evaluators

1. **MongoDB Embedded Documents**: Clearly demonstrated in Patient, Medication, and HealthLog schemas
2. **CRUD Operations**: All four operations visible in controllers
3. **Indexing**: Created on common query fields for performance
4. **Aggregation Pipelines**: Used extensively in dashboard and analytics endpoints
5. **Arrays**: Used for collections like allergies, symptoms, notes, visits
6. **Complex Queries**: Compliance rate calculations show advanced pipeline usage

## 🚀 Future Enhancements

- Chart.js/Recharts integration for visual charts
- Pagination for large datasets
- Email notifications for medicine reminders
- Mobile app version
- Advanced analytics and reporting
- Doctor appointment scheduling
- Multi-language support

## 📄 License

MIT License - Feel free to use this for academic purposes

## 👨‍💻 Author

Created as an academic project for MongoDB and Full-Stack Web Development

---

**Last Updated**: April 2026
**Version**: 1.0.0
**MongoDB Version**: 7.0+
**Node.js Version**: 14.0+
**React Version**: 18.2+
