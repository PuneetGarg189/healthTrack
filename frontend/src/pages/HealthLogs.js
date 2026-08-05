import React, { useState, useContext, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DataContext } from '../context/DataContext';
import { HealthLogForm } from '../components/HealthLogForm';
import '../styles/HealthLogs.css';

export const HealthLogs = () => {
  const { patients, fetchHealthLogs, healthLogs, loading } = useContext(DataContext);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0]._id);
    }
  }, [patients, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) {
      fetchHealthLogs(selectedPatientId);
    }
  }, [selectedPatientId, fetchHealthLogs]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="health-logs-container">
          <div className="logs-header">
            <div>
              <h1 className="page-title">Patient Health Logs</h1>
              <p className="page-subtitle">Track daily vitals, sleep hours, weight, symptoms, and clinical observations</p>
            </div>
            <button
              className="btn-add-log"
              onClick={() => setShowForm(!showForm)}
              disabled={!selectedPatientId}
            >
              {showForm ? '✕ Close Form' : '➕ Add Health Log'}
            </button>
          </div>

          <div className="patient-selector-card">
            <label className="selector-label">Select Patient Profile:</label>
            <div className="selector-control">
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">-- Choose a patient --</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    👤 {patient.fullName} ({patient.condition || 'Patient'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showForm && selectedPatientId && (
            <div className="form-section">
              <HealthLogForm
                patientId={selectedPatientId}
                onLogAdded={() => {
                  setShowForm(false);
                  fetchHealthLogs(selectedPatientId);
                }}
              />
            </div>
          )}

          <div className="logs-list-section">
            <div className="section-header">
              <h2>Recorded Log Entries</h2>
              <span className="log-count-badge">{healthLogs.length} Entries Logged</span>
            </div>

            {loading ? (
              <div className="loading">Loading patient health logs...</div>
            ) : healthLogs.length === 0 ? (
              <div className="empty-log-state">
                <span className="empty-icon">📋</span>
                <h3>No Health Logs Recorded</h3>
                <p>No health logs have been created for this patient yet.</p>
              </div>
            ) : (
              <div className="logs-vertical-list">
                {healthLogs.map(log => (
                  <div key={log._id} className="log-entry-card">
                    <div className="log-card-header">
                      <div className="log-date-badge">
                        <span className="calendar-icon">📅</span>
                        <span className="date-text">
                          {new Date(log.logDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="vitals-display-grid">
                      {log.vitals?.sleepHours != null && (
                        <div className="vital-box vital-sleep">
                          <span className="vital-icon">💤</span>
                          <div className="vital-info">
                            <span className="vital-label">Sleep</span>
                            <span className="vital-val">{log.vitals.sleepHours.toFixed(1)} hrs</span>
                          </div>
                        </div>
                      )}

                      {log.vitals?.weight != null && (
                        <div className="vital-box vital-weight">
                          <span className="vital-icon">⚖️</span>
                          <div className="vital-info">
                            <span className="vital-label">Weight</span>
                            <span className="vital-val">{log.vitals.weight.toFixed(1)} kg</span>
                          </div>
                        </div>
                      )}

                      {log.vitals?.mood && (
                        <div className="vital-box vital-mood">
                          <span className="vital-icon">😊</span>
                          <div className="vital-info">
                            <span className="vital-label">Mood</span>
                            <span className="vital-val">{log.vitals.mood}</span>
                          </div>
                        </div>
                      )}

                      {log.temperature != null && (
                        <div className="vital-box vital-temp">
                          <span className="vital-icon">🌡️</span>
                          <div className="vital-info">
                            <span className="vital-label">Temp</span>
                            <span className="vital-val">{log.temperature.toFixed(1)}°F</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {log.symptoms && log.symptoms.length > 0 && (
                      <div className="symptoms-box">
                        <span className="symptoms-label">⚠️ Symptoms Reported:</span>
                        <div className="symptom-tags">
                          {log.symptoms.map((symptom, idx) => (
                            <span key={idx} className="symptom-pill">{symptom}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.notes && (Array.isArray(log.notes) ? log.notes.length > 0 : log.notes) && (
                      <div className="notes-box">
                        <span className="notes-label">📝 Notes:</span>
                        {Array.isArray(log.notes) ? (
                          log.notes.map((n, idx) => <p key={idx} className="note-item">{n}</p>)
                        ) : (
                          <p className="note-item">{log.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
