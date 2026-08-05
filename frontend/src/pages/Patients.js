import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PatientList } from '../components/PatientList';
import { PatientProfile } from '../components/PatientProfile';
import { PatientForm } from '../components/PatientForm';
import '../styles/Patients.css';

export const Patients = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveView('profile');
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setActiveView('form');
  };

  const handleBack = () => {
    setActiveView('list');
    setSelectedPatientId(null);
    setEditingPatient(null);
  };

  const handleFormDone = () => {
    setActiveView('list');
    setEditingPatient(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {activeView === 'list' && (
          <PatientList
            onPatientSelect={handlePatientSelect}
            onEditClick={handleEditPatient}
            onAddClick={() => {
              setEditingPatient(null);
              setActiveView('form');
            }}
          />
        )}
        {activeView === 'form' && (
          <PatientForm
            existingPatient={editingPatient}
            onPatientAdded={handleFormDone}
          />
        )}
        {activeView === 'profile' && (
          <PatientProfile
            patientId={selectedPatientId}
            onBack={handleBack}
            onEdit={handleEditPatient}
          />
        )}
      </main>
    </div>
  );
};
