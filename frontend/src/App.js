import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Medications } from './pages/Medications';
import { HealthLogs } from './pages/HealthLogs';
import { MedicineScheduleOverview } from './pages/MedicineScheduleOverview';
import MedicineSchedule from './pages/MedicineSchedule';

// Styles
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DataProvider>
                <Dashboard />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <DataProvider>
                <Patients />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/medications"
          element={
            <ProtectedRoute>
              <DataProvider>
                <Medications />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-logs"
          element={
            <ProtectedRoute>
              <DataProvider>
                <HealthLogs />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicine-schedule"
          element={
            <ProtectedRoute>
              <DataProvider>
                <MedicineScheduleOverview />
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule/:patientId"
          element={
            <ProtectedRoute>
              <DataProvider>
                <MedicineSchedule />
              </DataProvider>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
