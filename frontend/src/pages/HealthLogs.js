import React, { useState, useContext } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DataContext } from '../context/DataContext';
import { HealthLogForm } from '../components/HealthLogForm';
import '../styles/HealthLogs.css';

export const HealthLogs = () => {
  const { patients, fetchHealthLogs, healthLogs, loading } = useContext(DataContext);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0]._id);
    }
  }, [patients]);

  React.useEffect(() => {
    if (selectedPatientId) {
      fetchHealthLogs(selectedPatientId);
    }
  }, [selectedPatientId]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="health-logs-container">
          <div className="logs-header">
            <h1>📝 Health Logs</h1>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
              disabled={!selectedPatientId}
            >
              {showForm ? '✕ Cancel' : '➕ Add Log'}
            </button>
          </div>

          <div className="patient-selector">
            <label>Select Patient:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">-- Select a patient --</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
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
            <h2>Recent Health Logs</h2>
            {loading ? (
              <div className="loading">Loading health logs...</div>
            ) : healthLogs.length === 0 ? (
              <div className="empty-state">No health logs found for selected patient</div>
            ) : (
              <div className="logs-vertical-list">
                {healthLogs.map(log => (
                  <div key={log._id} className="log-card">
                    <div className="log-date">
                      📅 {new Date(log.logDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    <div className="vitals-grid">
                      {log.vitals?.sleepHours && (
                        <div className="vital">
                          <span className="vital-icon">💤</span>
                          <span className="vital-label">Sleep</span>
                          <span className="vital-value">{log.vitals.sleepHours.toFixed(1)}h</span>
                        </div>
                      )}
                      {log.vitals?.weight && (
                        <div className="vital">
                          <span className="vital-icon">⚖️</span>
                          <span className="vital-label">Weight</span>
                          <span className="vital-value">{log.vitals.weight.toFixed(1)}kg</span>
                        </div>
                      )}
                      {log.vitals?.mood && (
                        <div className="vital">
                          <span className="vital-icon">😊</span>
                          <span className="vital-label">Mood</span>
                          <span className="vital-value">{log.vitals.mood}</span>
                        </div>
                      )}
                      {log.temperature && (
                        <div className="vital">
                          <span className="vital-icon">🌡️</span>
                          <span className="vital-label">Temp</span>
                          <span className="vital-value">{log.temperature.toFixed(1)}°F</span>
                        </div>
                      )}
                    </div>

                    {log.symptoms && log.symptoms.length > 0 && (
                      <div className="symptoms-section">
                        <strong>Symptoms:</strong>
                        <div className="symptoms-tags">
                          {log.symptoms.map((symptom, idx) => (
                            <span key={idx} className="symptom-tag">{symptom}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.notes && log.notes.length > 0 && (
                      <div className="notes-section">
                        <strong>Notes:</strong>
                        {log.notes.map((note, idx) => (
                          <p key={idx}>{note}</p>
                        ))}
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
