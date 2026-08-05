import React, { useState, useContext, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DataContext } from '../context/DataContext';
import { MedicationForm } from '../components/MedicationForm';
import '../styles/Medications.css';

export const Medications = () => {
  const {
    patients,
    fetchPatients,
    fetchMedicationsForPatient,
    medications,
    logCompliance,
    loading
  } = useContext(DataContext);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [complianceMessage, setComplianceMessage] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0]._id);
    }
  }, [patients, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) {
      fetchMedicationsForPatient(selectedPatientId);
    }
  }, [selectedPatientId, fetchMedicationsForPatient]);

  const getTimeTaken = () => new Date().toISOString().slice(11, 16);

  const handleCompliance = async (medication, status) => {
    if (!selectedPatientId) return;
    try {
      await logCompliance({
        patientId: selectedPatientId,
        medicationId: medication._id,
        medicineName: medication.medicineName,
        status,
        logDate: new Date(),
        timeTaken: getTimeTaken()
      });
      setComplianceMessage(`✓ Recorded: ${medication.medicineName} marked as ${status.toUpperCase()}`);
      window.setTimeout(() => setComplianceMessage(''), 3000);
    } catch (error) {
      console.error('Error logging compliance:', error);
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setEditingMedication(null);
    if (selectedPatientId) {
      fetchMedicationsForPatient(selectedPatientId);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="medications-container">
          <div className="medications-header">
            <div>
              <h1 className="page-title">Prescription & Medication Tracker</h1>
              <p className="page-subtitle">Log daily adherence, manage active prescriptions, and update dosage schedules</p>
            </div>
            <button
              className="btn-add-med"
              onClick={() => setShowForm(!showForm)}
              disabled={!selectedPatientId}
            >
              {showForm ? '✕ Close Form' : '➕ Add New Medication'}
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
              <MedicationForm
                patientId={selectedPatientId}
                existingMedication={editingMedication}
                onMedicationSaved={handleFormSaved}
              />
            </div>
          )}

          <div className="medications-list-section">
            <div className="section-header">
              <h2>Active Medications List</h2>
              <span className="med-count-badge">
                {medications.length} Prescription{medications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {complianceMessage && (
              <div className="compliance-message-banner" role="status">
                {complianceMessage}
              </div>
            )}

            {loading ? (
              <div className="loading">Loading active prescriptions...</div>
            ) : medications.length === 0 ? (
              <div className="empty-med-state">
                <span className="empty-icon">💊</span>
                <h3>No Active Medications</h3>
                <p>No prescriptions have been registered for this patient yet.</p>
              </div>
            ) : (
              <div className="medications-grid">
                {medications.map(med => (
                  <div key={med._id} className="medication-card">
                    <div className="med-card-header">
                      <div className="med-title-group">
                        <span className="med-icon-badge">💊</span>
                        <h3 className="med-name">{med.medicineName}</h3>
                      </div>
                      <button
                        className="btn-edit-med"
                        type="button"
                        onClick={() => handleEdit(med)}
                      >
                        ✏️ Edit
                      </button>
                    </div>

                    <div className="med-details-box">
                      <div className="med-detail-row">
                        <span className="detail-label">Dosage</span>
                        <span className="detail-value">{med.dosage}</span>
                      </div>
                      <div className="med-detail-row">
                        <span className="detail-label">Frequency</span>
                        <span className="detail-value frequency-tag">{med.frequency}</span>
                      </div>
                      <div className="med-detail-row">
                        <span className="detail-label">Schedule</span>
                        <div className="schedule-pills">
                          {med.schedule?.morning && <span className="schedule-pill morning">🌅 Morning</span>}
                          {med.schedule?.afternoon && <span className="schedule-pill afternoon">☀️ Afternoon</span>}
                          {med.schedule?.night && <span className="schedule-pill night">🌙 Night</span>}
                          {!med.schedule?.morning && !med.schedule?.afternoon && !med.schedule?.night && (
                            <span className="schedule-pill">Daily</span>
                          )}
                        </div>
                      </div>

                      {med.notes && (
                        <div className="med-notes-row">
                          <span className="detail-label">Notes</span>
                          <p className="notes-text">📝 {med.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="medication-action-buttons">
                      <button
                        className="btn-mark-taken"
                        type="button"
                        onClick={() => handleCompliance(med, 'Taken')}
                        disabled={loading}
                      >
                        ✓ Mark Taken
                      </button>
                      <button
                        className="btn-mark-partial"
                        type="button"
                        onClick={() => handleCompliance(med, 'Partial')}
                        disabled={loading}
                      >
                        ⚠️ Mark Partial
                      </button>
                      <button
                        className="btn-mark-missed"
                        type="button"
                        onClick={() => handleCompliance(med, 'Missed')}
                        disabled={loading}
                      >
                        ✕ Mark Missed
                      </button>
                    </div>
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
