import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/PatientProfile.css';

export const PatientProfile = ({ patientId, onBack }) => {
  const { fetchPatientAnalytics, fetchMedicationsForPatient, fetchHealthLogs, loading } = useContext(DataContext);
  const [analytics, setAnalytics] = useState(null);
  const [medications, setMedications] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    const analyticsData = await fetchPatientAnalytics(patientId);
    setAnalytics(analyticsData);
    
    const medsData = await fetchMedicationsForPatient(patientId);
    setMedications(medsData.data || []);
    
    const logsData = await fetchHealthLogs(patientId);
    setHealthLogs(logsData.data || []);
  };

  if (loading) return <div className="loading">Loading patient profile...</div>;
  if (!analytics) return <div className="error">Failed to load patient data</div>;

  return (
    <div className="patient-profile">
      <div className="profile-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h1>{analytics.patient?.name}</h1>
      </div>

      {/* Patient Overview Card */}
      <div className="overview-card">
        <div className="overview-item">
          <span className="label">Age</span>
          <span className="value">{analytics.patient?.age} years</span>
        </div>
        <div className="overview-item">
          <span className="label">Problem</span>
          <span className="value">{analytics.patient?.condition}</span>
        </div>
        <div className="overview-item">
          <span className="label">Blood Group</span>
          <span className="value badge">{analytics.patient?.bloodGroup}</span>
        </div>
        <div className="overview-item">
          <span className="label">Active Medicines</span>
          <span className="value">{analytics.activeMedicines}</span>
        </div>
      </div>

      {/* Allergies */}
      {analytics.patient?.allergies?.length > 0 && (
        <div className="allergies-section">
          <h3>⚠️ Allergies</h3>
          <div className="allergy-list">
            {analytics.patient.allergies.map((allergy, idx) => (
              <span key={idx} className="allergy-badge">{allergy}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          💊 Medications
        </button>
        <button
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📝 Health Logs
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Compliance Summary */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-value">{analytics.complianceSummary?.complianceRate || 0}%</div>
                <div className="summary-label">Compliance Rate</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{analytics.complianceSummary?.taken || 0}</div>
                <div className="summary-label">Doses Taken</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{analytics.complianceSummary?.missed || 0}</div>
                <div className="summary-label">Doses Missed</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{analytics.complianceSummary?.totalDoses || 0}</div>
                <div className="summary-label">Total Scheduled</div>
              </div>
            </div>

            {/* Compliance Progress Bar */}
            <div className="progress-section">
              <h3>Compliance Progress</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${analytics.complianceSummary?.complianceRate || 0}%` }}
                />
              </div>
            </div>

            {/* Compliance Chart */}
            {analytics.complianceChart?.length > 0 && (
              <div className="chart-section">
                <h3>Medication Compliance</h3>
                <div className="compliance-chart">
                  {analytics.complianceChart.map(item => (
                    <div key={item._id} className="compliance-item">
                      <span className={`status-label ${item._id}`}>{item._id}</span>
                      <span className="count">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Adherence */}
            {analytics.weeklyAdherence?.length > 0 && (
              <div className="chart-section">
                <h3>Weekly Medicine Adherence</h3>
                <div className="weekly-chart">
                  {analytics.weeklyAdherence.map(week => (
                    <div key={week.week} className="week-bar">
                      <div className="bar-label">Week {week.week}</div>
                      <div className="bar-container">
                        <div className="bar-segment taken" style={{ width: `${(week.taken / week.total) * 100}%` }}>
                          {week.adherenceRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Trend */}
            {analytics.moodTrend?.length > 0 && (
              <div className="chart-section">
                <h3>Mood Trend</h3>
                <div className="mood-chart">
                  {analytics.moodTrend.map(mood => (
                    <div key={mood._id} className="mood-item">
                      <span className="mood-label">{mood._id}</span>
                      <span className="mood-count">{mood.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Most Missed Medicines */}
            {analytics.missedMedicineFrequency?.length > 0 && (
              <div className="chart-section">
                <h3>Most Commonly Missed Medicines</h3>
                <div className="missed-list">
                  {analytics.missedMedicineFrequency.map(med => (
                    <div key={med._id} className="missed-item">
                      <span className="medicine-name">{med._id}</span>
                      <span className="miss-badge">{med.missCount} missed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="medications-content">
            <h3>Active Medications</h3>
            {medications.length === 0 ? (
              <p>No medications for this patient</p>
            ) : (
              <div className="medications-list">
                {medications.map(med => (
                  <div key={med._id} className="medication-item">
                    <div className="med-header">
                      <h4>{med.medicineName}</h4>
                      <span className="dosage">{med.dosage}</span>
                    </div>
                    <div className="med-details">
                      <div>Frequency: {med.frequency}</div>
                      <div>
                        Schedule: {med.schedule.morning && '🌅 Morning'} {med.schedule.afternoon && '☀️ Afternoon'} {med.schedule.night && '🌙 Night'}
                      </div>
                      {med.notes && <div>Notes: {med.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-content">
            <h3>Recent Health Logs</h3>
            {healthLogs.length === 0 ? (
              <p>No health logs available</p>
            ) : (
              <div className="logs-list">
                {healthLogs.map(log => (
                  <div key={log._id} className="log-item">
                    <div className="log-date">{new Date(log.logDate).toLocaleDateString()}</div>
                    <div className="log-vitals">
                      {log.vitals?.sleepHours && <span>💤 Sleep: {log.vitals.sleepHours.toFixed(1)}h</span>}
                      {log.vitals?.weight && <span>⚖️ Weight: {log.vitals.weight.toFixed(1)}kg</span>}
                      {log.vitals?.mood && <span>😊 Mood: {log.vitals.mood}</span>}
                    </div>
                    {log.symptoms?.length > 0 && (
                      <div className="symptoms">
                        Symptoms: {log.symptoms.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
