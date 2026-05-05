import React, { useState, useContext } from 'react';
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

  React.useEffect(() => {
    fetchPatients();
  }, []);

  React.useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0]._id);
    }
  }, [patients]);

  React.useEffect(() => {
    if (selectedPatientId) {
      fetchMedicationsForPatient(selectedPatientId);
    }
  }, [selectedPatientId]);

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
      setComplianceMessage(`Recorded: ${medication.medicineName} marked ${status}.`);
      window.setTimeout(() => setComplianceMessage(''), 2500);
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
            <h1>💊 Medication Management</h1>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
              disabled={!selectedPatientId}
            >
              {showForm ? '✕ Cancel' : '➕ Add Medication'}
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
              <MedicationForm
                patientId={selectedPatientId}
                existingMedication={editingMedication}
                onMedicationSaved={handleFormSaved}
              />
            </div>
          )}

          <div className="medications-list-section">
            <h2>Active Medications</h2>
            {complianceMessage && (
              <div className="compliance-message" role="status">
                {complianceMessage}
              </div>
            )}
            {loading ? (
              <div className="loading">Loading medications...</div>
            ) : medications.length === 0 ? (
              <div className="empty-state">No medications found for selected patient</div>
            ) : (
              <div className="medications-grid">
                {medications.map(med => (
                  <div key={med._id} className="medication-card">
                    <div className="medication-card-header">
                      <h3>{med.medicineName}</h3>
                      <button
                        className="btn-outline"
                        type="button"
                        onClick={() => handleEdit(med)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="med-details">
                      <p><strong>Dosage:</strong> {med.dosage}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p>
                        <strong>Schedule:</strong> {' '}
                        {med.schedule.morning && '🌅'} {med.schedule.afternoon && '☀️'} {med.schedule.night && '🌙'}
                      </p>
                      {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                    </div>
                    <div className="medication-actions">
                      <button
                        className="btn-success"
                        type="button"
                        onClick={() => handleCompliance(med, 'Taken')}
                        disabled={loading}
                      >
                        Mark Taken
                      </button>
                      <button
                        className="btn-danger"
                        type="button"
                        onClick={() => handleCompliance(med, 'Missed')}
                        disabled={loading}
                      >
                        Mark Missed
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
