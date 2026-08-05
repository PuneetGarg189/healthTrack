import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DataContext } from '../context/DataContext';
import '../styles/MedicineScheduleOverview.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://health-track-tlss.vercel.app/api';

// Helper for avatar initials
const getInitials = (name) => {
  if (!name) return 'P';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const MedicineScheduleOverview = () => {
  const navigate = useNavigate();
  const { patients, fetchPatients } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicationsByPatient, setMedicationsByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const fetchMedications = async () => {
      if (patients.length === 0) {
        setMedicationsByPatient({});
        return;
      }

      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        const results = await Promise.all(
          patients.map(async (patient) => {
            const response = await fetch(`${API_BASE_URL}/medications/${patient._id}`, { headers });
            const data = await response.json();
            return [patient._id, data.success ? data.data : []];
          })
        );

        const medsMap = results.reduce((acc, [patientId, meds]) => {
          acc[patientId] = meds;
          return acc;
        }, {});

        setMedicationsByPatient(medsMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [patients]);

  const filteredPatients = patients.filter(p =>
    p.isActive && p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientMedicines = (patientId) => {
    return (medicationsByPatient[patientId] || []).filter(m => m.isActive);
  };

  const getScheduleDisplay = (medicine) => {
    const times = [];
    if (medicine.schedule?.morning) times.push('🌅 Morning');
    if (medicine.schedule?.afternoon) times.push('☀️ Afternoon');
    if (medicine.schedule?.night) times.push('🌙 Night');
    return times;
  };

  const handlePatientClick = (patientId) => {
    navigate(`/schedule/${patientId}`);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="schedule-overview-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Medicine Schedule Overview</h1>
              <p className="page-subtitle">Monitor daily intake timelines, active prescription schedules, and dose timings</p>
            </div>
          </div>

          <div className="search-bar-wrapper">
            <div className="search-input-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search patient schedules by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>
          </div>

          {loading && (
            <div className="loading">Loading patient medicine schedules...</div>
          )}

          {error && (
            <div className="error">Error loading schedules: {error}</div>
          )}

          {!loading && !error && filteredPatients.length > 0 ? (
            <div className="patients-schedules-grid">
              {filteredPatients.map(patient => {
                const patientMeds = getPatientMedicines(patient._id);
                const initials = getInitials(patient.fullName);

                return (
                  <div key={patient._id} className="patient-schedule-card">
                    <div className="card-top-header">
                      <div className="avatar-initials-badge">{initials}</div>
                      <div className="patient-main-info">
                        <h3 className="patient-name">{patient.fullName}</h3>
                        <span className="patient-condition-badge">🩺 {patient.condition || 'General Care'}</span>
                      </div>
                      <span className="med-count-pill">
                        {patientMeds.length} Medicine{patientMeds.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="patient-meta-row">
                      <span className="meta-item">Age: <strong>{patient.age} yrs</strong></span>
                      <span className="meta-item">Blood: <strong>🩸 {patient.healthProfile?.bloodGroup || 'O+'}</strong></span>
                    </div>

                    {patientMeds.length > 0 ? (
                      <div className="medicines-preview-box">
                        <div className="preview-heading">Active Prescriptions</div>
                        <div className="medicines-preview-list">
                          {patientMeds.slice(0, 3).map(med => (
                            <div key={med._id} className="medicine-preview-row">
                              <div className="med-title-dosage">
                                <span className="med-pill-icon">💊</span>
                                <div>
                                  <div className="med-preview-name">{med.medicineName}</div>
                                  <div className="med-preview-dosage">{med.dosage}</div>
                                </div>
                              </div>
                              <div className="schedule-pills-row">
                                {getScheduleDisplay(med).map((time, idx) => (
                                  <span key={idx} className="time-pill-badge">{time}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                          {patientMeds.length > 3 && (
                            <div className="more-medicines-tag">
                              +{patientMeds.length - 3} more prescription{patientMeds.length - 3 > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="no-medicines-notice">
                        <span>ℹ️ No active prescriptions assigned</span>
                      </div>
                    )}

                    <button
                      className="btn-view-schedule"
                      onClick={() => handlePatientClick(patient._id)}
                    >
                      View Full Schedule <span className="arrow-icon">→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="empty-state">No matching patient schedules found</div>
            )
          )}
        </div>
      </main>
    </div>
  );
};
