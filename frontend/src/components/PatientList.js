import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/PatientList.css';

export const PatientList = ({ onPatientSelect, onAddClick }) => {
  const { patients, fetchPatients, deletePatient, searchPatients, loading } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      await searchPatients(value);
    } else {
      await fetchPatients();
    }
  };

  const handleDelete = async (patientId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this patient?')) {
      await deletePatient(patientId);
    }
  };

  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h1>Patient Management</h1>
        <button className="btn-primary" onClick={onAddClick}>➕ Add New Patient</button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search patients by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading && <div className="loading">Loading patients...</div>}

      {patients.length === 0 ? (
        <div className="empty-state">
          <p>No patients found. Add a new patient to get started.</p>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map(patient => (
            <div
              key={patient._id}
              className="patient-card"
              onClick={() => onPatientSelect(patient._id)}
            >
              <div className="patient-header">
                <h3>{patient.fullName}</h3>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDelete(patient._id, e)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <span className="label">Age:</span>
                  <span>{patient.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="label">Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Condition:</span>
                  <span>{patient.condition}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span>{patient.contact}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Blood Group:</span>
                  <span className="badge">{patient.healthProfile.bloodGroup}</span>
                </div>
              </div>

              {patient.healthProfile.allergies.length > 0 && (
                <div className="allergies">
                  <strong>Allergies:</strong>
                  <div className="allergy-tags">
                    {patient.healthProfile.allergies.map((allergy, idx) => (
                      <span key={idx} className="allergy-tag">⚠️ {allergy}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn-view" onClick={() => onPatientSelect(patient._id)}>
                View Profile →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
