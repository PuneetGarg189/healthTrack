# 🏥 HealthTrack

A full-stack healthcare management and analytics platform built using the MERN stack. HealthTrack helps healthcare providers manage patients, track medications, monitor compliance, record health logs, and gain insights through interactive dashboards.

🔗 **Live Demo:** https://health-track-five-zeta.vercel.app

---

## 📌 Overview

HealthTrack is designed to simplify patient care management by providing a centralized platform for:

* Patient record management
* Medication scheduling
* Health monitoring
* Compliance tracking
* Healthcare analytics

The application enables healthcare professionals to efficiently monitor patient health and medication adherence while maintaining organized medical records.

---

## ✨ Features

### 👥 Patient Management

* Add, edit, and delete patient records
* Store demographic information
* Maintain allergy information
* Search and filter patients
* Detailed patient profiles

### 💊 Medication Management

* Create medication schedules
* Assign medications to patients
* Track dosage and frequency
* Monitor medication adherence
* Manage active prescriptions

### 📅 Medicine Scheduling

* Daily medication schedules
* Multiple dosage timings
* Medication tracking system
* Schedule overview dashboard

### ❤️ Health Logs

* Record patient vitals
* Track symptoms
* Store medical notes
* View historical health records
* Monitor patient progress

### 📊 Analytics Dashboard

* Total patient statistics
* Medication compliance metrics
* Missed medication tracking
* Health monitoring insights
* Interactive healthcare analytics

### 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Secure API Access
* Session Management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3
* Responsive Design

### Backend

* Node.js
* Express.js
* JWT Authentication
* RESTful APIs

### Database

* MongoDB Atlas
* Mongoose ODM

### Deployment

* Frontend: Vercel
* Backend: Render/Railway
* Database: MongoDB Atlas

---

## 🏗️ System Architecture

```text
React Frontend
      │
      ▼
REST API
      │
      ▼
Node.js + Express Backend
      │
      ▼
MongoDB Atlas
```

---

## 📸 Screenshots

### Login Page

![Login Page](screenshots/login-page.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Patient Management

![Medicine Schedule](screenshots/patient-schedule.png)
![Patients](screenshots/patients.png)

### Medication Management

![Medications](screenshots/medications.png)

### Health Logs

![Health Logs](screenshots/health-logs.png)

### Medicine Schedule

![Medicine Schedule](screenshots/patient-schedule.png)
---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/PuneetGarg189/healthTrack.git

cd healthTrack
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthtrack
JWT_SECRET=supersecretkey
```

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Patients

```http
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Medications

```http
GET    /api/medications
POST   /api/medications
PUT    /api/medications/:id
DELETE /api/medications/:id
```

### Health Logs

```http
GET    /api/logs
POST   /api/logs
PUT    /api/logs/:id
DELETE /api/logs/:id
```

---

## 📂 Project Structure

```text
healthTrack/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── screenshots/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 📈 Future Enhancements

* Email medication reminders
* SMS notifications
* Appointment scheduling
* Doctor/Admin dashboards
* PDF report generation
* AI-powered health insights
* Data visualization improvements
* Role-based access control

---

## 👨‍💻 Author

### Puneet Garg

* GitHub: https://github.com/PuneetGarg189
* LinkedIn: https://www.linkedin.com/in/puneet-garg-a01485332/

Feel free to connect for collaborations, internships, and software development opportunities.

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project useful:

* Star the repository
* Fork the project
* Share feedback
* Connect with me on LinkedIn

Thank you for checking out HealthTrack!
