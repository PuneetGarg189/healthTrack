import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import '../styles/MedicineSchedule.css';

const MedicineSchedule = () => {
  const { patientId } = useParams();
  const { patients, fetchPatients, fetchMedicationsForPatient } = useContext(DataContext);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [complianceHistory, setComplianceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [patientMeds, setPatientMeds] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const loadMedications = async () => {
      setDataLoading(true);
      try {
        const medsData = await fetchMedicationsForPatient(patientId);
        setPatientMeds(medsData?.data || []);
      } catch (error) {
        setPatientMeds([]);
      } finally {
        setDataLoading(false);
      }
    };

    if (patientId) {
      loadMedications();
    }
  }, [patientId, fetchMedicationsForPatient]);

  const patient = patients.find(p => p._id === patientId);

  useEffect(() => {
    if (selectedMedicine) {
      // Simulate fetching compliance history for selected medicine
      const history = [
        { date: new Date(Date.now() - 86400000), status: 'Taken', time: '08:00 AM' },
        { date: new Date(Date.now() - 172800000), status: 'Taken', time: '08:15 AM' },
        { date: new Date(Date.now() - 259200000), status: 'Missed', time: '-' },
        { date: new Date(Date.now() - 345600000), status: 'Taken', time: '08:00 AM' },
        { date: new Date(Date.now() - 432000000), status: 'Partial', time: '02:30 PM' },
      ];
      setComplianceHistory(history);
      setLoading(false);
    }
  }, [selectedMedicine]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Taken':
        return '#4CAF50';
      case 'Missed':
        return '#f44336';
      case 'Partial':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  const getScheduleDisplay = (medicine) => {
    const times = [];
    if (medicine.schedule?.morning) times.push('Morning (8 AM)');
    if (medicine.schedule?.afternoon) times.push('Afternoon (2 PM)');
    if (medicine.schedule?.night) times.push('Night (8 PM)');
    return times.length > 0 ? times : ['No schedule set'];
  };

  return (
    <div className="medicine-schedule-container">
      <div className="schedule-header">
        <h2>Medicine Schedule & Compliance</h2>
        {patient && <p className="patient-name">Patient: {patient.fullName}</p>}
      </div>

      <div className="schedule-content">
        <div className="medicines-list">
          <h3>Active Medicines</h3>
          <div className="medicines-grid">
            {dataLoading ? (
              <p className="no-data">Loading medicines...</p>
            ) : patientMeds.length > 0 ? (
              patientMeds.map((med) => (
                <div
                  key={med._id}
                  className={`medicine-card ${selectedMedicine?._id === med._id ? 'active' : ''}`}
                  onClick={() => setSelectedMedicine(med)}
                >
                  <div className="med-name">{med.medicineName}</div>
                  <div className="med-dosage">{med.dosage}</div>
                  <div className="med-frequency">{med.frequency}</div>
                  <div className="schedule-show">
                    {getScheduleDisplay(med).length > 0 && (
                      <span className="schedule-badge">
                        {getScheduleDisplay(med).length} times/day
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No medicines added for this patient</p>
            )}
          </div>
        </div>

        {selectedMedicine && (
          <div className="schedule-detail">
            <div className="medicine-detail-header">
              <h3>{selectedMedicine.medicineName}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setSelectedMedicine(null);
                  setComplianceHistory([]);
                }}
              >
                ✕
              </button>
            </div>

            <div className="medicine-info-grid">
              <div className="info-item">
                <label>Dosage</label>
                <span>{selectedMedicine.dosage}</span>
              </div>
              <div className="info-item">
                <label>Frequency</label>
                <span>{selectedMedicine.frequency}</span>
              </div>
              <div className="info-item">
                <label>Start Date</label>
                <span>{new Date(selectedMedicine.startDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>End Date</label>
                <span>{selectedMedicine.endDate ? new Date(selectedMedicine.endDate).toLocaleDateString() : 'Ongoing'}</span>
              </div>
            </div>

            <div className="schedule-times">
              <h4>Daily Schedule</h4>
              <div className="times-grid">
                {selectedMedicine.schedule?.morning && (
                  <div className="time-slot morning">
                    <div className="time">8:00 AM</div>
                    <div className="period">Morning</div>
                  </div>
                )}
                {selectedMedicine.schedule?.afternoon && (
                  <div className="time-slot afternoon">
                    <div className="time">2:00 PM</div>
                    <div className="period">Afternoon</div>
                  </div>
                )}
                {selectedMedicine.schedule?.night && (
                  <div className="time-slot night">
                    <div className="time">8:00 PM</div>
                    <div className="period">Night</div>
                  </div>
                )}
              </div>
            </div>

            {selectedMedicine.sideEffects && selectedMedicine.sideEffects.length > 0 && (
              <div className="side-effects">
                <h4>Known Side Effects</h4>
                <div className="effects-list">
                  {selectedMedicine.sideEffects.map((effect, idx) => (
                    <span key={idx} className="effect-tag">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="compliance-section">
              <h4>Compliance History (Last 5 Logs)</h4>
              <div className="history-table">
                <div className="table-header">
                  <div className="col">Date</div>
                  <div className="col">Status</div>
                  <div className="col">Time Taken</div>
                </div>
                {!loading && complianceHistory.length > 0 ? (
                  complianceHistory.map((record, idx) => (
                    <div key={idx} className="table-row">
                      <div className="col">
                        {record.date.toLocaleDateString()}
                      </div>
                      <div className="col">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(record.status) }}
                        >
                          {record.status}
                        </span>
                      </div>
                      <div className="col">{record.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-history">No compliance records yet</div>
                )}
              </div>
            </div>

            <div className="compliance-stats">
              <div className="stat-card">
                <div className="stat-label">This Week</div>
                <div className="stat-value">6/7</div>
                <div className="stat-percentage">85%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">This Month</div>
                <div className="stat-value">24/30</div>
                <div className="stat-percentage">80%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Overall</div>
                <div className="stat-value">156/180</div>
                <div className="stat-percentage">87%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSchedule;
