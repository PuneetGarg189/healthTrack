import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/PatientList.css';

// Helper to generate initials from patient name
const getInitials = (name) => {
  if (!name) return 'P';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper for patient avatar gradient colors based on name string
const getAvatarGradient = (name) => {
  const gradients = [
    'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #6366f1, #4f46e5)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #14b8a6, #0f766e)'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export const PatientList = ({ onPatientSelect, onEditClick, onAddClick }) => {
  const { patients, fetchPatients, deletePatient, searchPatients, loading } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
    if (window.confirm('Are you sure you want to remove this patient profile?')) {
      await deletePatient(patientId);
    }
  };

  return (
    <div className="patient-list-container">
      <div className="list-header">
        <div>
          <h1 className="list-title">Clinical Patient Directory</h1>
          <p className="list-subtitle">Manage registered patients, health profiles & prescription records</p>
        </div>
        <button className="btn-add-patient" onClick={onAddClick}>
          <span>➕</span> Add New Patient
        </button>
      </div>

      <div className="search-bar-wrapper">
        <div className="search-input-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search patients by name, condition, or blood group..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => { setSearchTerm(''); fetchPatients(); }}>✕</button>
          )}
        </div>
        <div className="patient-count-badge">
          {patients.length} Patient{patients.length !== 1 ? 's' : ''} Registered
        </div>
      </div>

      {loading && <div className="loading">Loading clinical patient profiles...</div>}

      {!loading && patients.length === 0 ? (
        <div className="empty-patient-state">
          <span className="empty-icon">🏥</span>
          <h3>No Patients Found</h3>
          <p>No active patient records match your search criteria.</p>
          <button className="btn-add-patient" onClick={onAddClick}>Add Patient</button>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map(patient => {
            const initials = getInitials(patient.fullName);
            const avatarBg = getAvatarGradient(patient.fullName);
            const allergies = patient.healthProfile?.allergies || [];

            return (
              <div
                key={patient._id}
                className="patient-card"
                onClick={() => onPatientSelect(patient._id)}
              >
                <div className="patient-card-header">
                  <div className="patient-avatar-circle" style={{ background: avatarBg }}>
                    {initials}
                  </div>
                  <div className="patient-identity">
                    <h3 className="patient-name">{patient.fullName}</h3>
                    <span className="patient-condition-tag" title="Click edit to update disease/condition">
                      🩺 {patient.condition || 'General Care'}
                    </span>
                  </div>

                  <div className="card-action-btns">
                    <button
                      className="btn-edit-patient"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick?.(patient);
                      }}
                      title="Edit Patient Details / Medical Condition"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete-patient"
                      onClick={(e) => handleDelete(patient._id, e)}
                      title="Delete Patient Record"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="patient-vitals-grid">
                  <div className="vital-item">
                    <span className="vital-label">Age & Gender</span>
                    <span className="vital-val">{patient.age} yrs • {patient.gender}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Blood Group</span>
                    <span className="blood-group-badge">🩸 {patient.healthProfile?.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Contact</span>
                    <span className="vital-val">📞 {patient.contact}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Emergency</span>
                    <span className="vital-val">{patient.emergencyContact?.name ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation || 'Contact'})` : 'None'}</span>
                  </div>
                </div>

                {allergies.length > 0 ? (
                  <div className="allergies-box">
                    <span className="allergies-title">⚠️ Known Allergies:</span>
                    <div className="allergy-pills">
                      {allergies.map((allergy, idx) => (
                        <span key={idx} className="allergy-pill">{allergy}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-allergies-box">
                    <span>✓ No Known Allergies</span>
                  </div>
                )}

                <button className="btn-view-profile" onClick={() => onPatientSelect(patient._id)}>
                  View Clinical Profile <span className="arrow-icon">→</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
