import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DataContext } from '../context/DataContext';
import '../styles/MedicineScheduleOverview.css';

export const MedicineScheduleOverview = () => {
  const navigate = useNavigate();
  const { patients, fetchPatients } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicationsByPatient, setMedicationsByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://health-track-tlss.vercel.app/api';

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
  }, [patients, API_BASE_URL]);

  const filteredPatients = patients.filter(p =>
    p.isActive && p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientMedicines = (patientId) => {
    return (medicationsByPatient[patientId] || []).filter(m => m.isActive);
  };

  const getScheduleDisplay = (medicine) => {
    const times = [];
    if (medicine.schedule?.morning) times.push('Morning (8 AM)');
    if (medicine.schedule?.afternoon) times.push('Afternoon (2 PM)');
    if (medicine.schedule?.night) times.push('Night (8 PM)');
    return times;
  };

  const handlePatientClick = (patientId) => {
    navigate(`/schedule/${patientId}`);
  };

  return (
    <div className="medicine-schedule-page">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Medicine Schedule Overview</h1>
          <p>View and manage medicine schedules for all patients</p>
        </div>

        <div className="schedule-search">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && (
          <div className="no-patients">
            <p>Loading schedules...</p>
          </div>
        )}

        {error && (
          <div className="no-patients">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredPatients.length > 0 ? (
          <div className="patients-schedules">
            {filteredPatients.map(patient => {
              const patientMeds = getPatientMedicines(patient._id);
              return (
                <div key={patient._id} className="patient-schedule-card">
                  <div className="card-header">
                    <h3>{patient.fullName}</h3>
                    <span className="medicine-count">
                      {patientMeds.length} medicines
                    </span>
                  </div>

                  <div className="patient-info">
                    <div className="info-item">
                      <span className="label">Age:</span>
                      <span className="value">{patient.age} years</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Condition:</span>
                      <span className="value">{patient.condition}</span>
                    </div>
                  </div>

                  {patientMeds.length > 0 ? (
                    <div className="medicines-preview">
                      <h4>Active Medicines</h4>
                      <div className="medicines-list-preview">
                        {patientMeds.slice(0, 3).map(med => (
                          <div key={med._id} className="medicine-preview-item">
                            <div className="med-info">
                              <div className="med-name">{med.medicineName}</div>
                              <div className="med-dosage">{med.dosage}</div>
                            </div>
                            <div className="schedule-times">
                              {getScheduleDisplay(med).map((time, idx) => (
                                <span key={idx} className="time-badge">
                                  {time.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        {patientMeds.length > 3 && (
                          <div className="more-medicines">
                            +{patientMeds.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="no-medicines">
                      No medicines assigned
                    </div>
                  )}

                  <button
                    className="view-details-btn"
                    onClick={() => handlePatientClick(patient._id)}
                  >
                    View Full Schedule →
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-patients">
            <p>No patients found</p>
          </div>
        )}
      </main>
    </div>
  );
};
