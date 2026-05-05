# HealthTrack Quick Start Guide

## 🚀 One-Minute Setup

### 1. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/healthtrack
JWT_SECRET=secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Backend
```bash
npm run dev
```

Backend: http://localhost:5000

### 5. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm start
```

Frontend: http://localhost:3000

## 🔑 Login Credentials

**Email**: admin@healthtrack.com  
**Password**: password123

## 📊 Sample Data Included

✅ 3 Patients with complete profiles  
✅ 4 Medications with schedules  
✅ 30 Health logs with vitals  
✅ 2 Test user accounts  

## 🎯 Key Features to Test

1. **Login & Authentication**
   - Use provided credentials
   - JWT token automatically stored

2. **Global Dashboard**
   - View total patients & medications
   - See compliance statistics
   - Check medication trends

3. **Patient Management**
   - Click patient cards to view detailed profiles
   - See analytics dashboards per patient
   - View health trends and compliance tracking

4. **Create New Data**
   - Add new patients with embedded documents
   - Add medications with schedules
   - Log health vitals and symptoms

5. **Advanced Aggregations**
   - Patient analytics use aggregation pipelines
   - Dashboard shows aggregated statistics
   - Compliance rates calculated server-side

## 📋 API Testing

Use Postman or curl to test APIs:

```bash
# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@healthtrack.com", "password": "password123" }

# Get dashboard
GET http://localhost:5000/api/dashboard
Header: Authorization: Bearer <TOKEN>

# Get patient analytics
GET http://localhost:5000/api/dashboard/patient/<PATIENT_ID>
Header: Authorization: Bearer <TOKEN>
```

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB is running: `mongod` or MongoDB Atlas connection
- Verify PORT 5000 is available
- Check .env file exists

**Frontend won't load?**
- Make sure backend is running on port 5000
- Clear browser cache
- Try `npm install` again

**Login fails?**
- Run `npm run seed` in backend to populate test data
- Check MongoDB is connected
- Verify JWT_SECRET in .env

## 📚 MongoDB Concepts Demonstrated

| Feature | Location |
|---------|----------|
| CRUD Operations | controllers/*.js |
| Embedded Documents | models/*.js (healthProfile, schedule, vitals) |
| Arrays | models/*.js (allergies, symptoms, notes) |
| Indexes | models/*.js (index() calls) |
| Aggregations | dashboardController.js (aggregation pipelines) |
| References | patientId foreign keys |
| Compound Indexes | Patient+Date indexes |

---

**Ready to explore HealthTrack!** 🏥
