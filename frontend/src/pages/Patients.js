import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PatientList } from '../components/PatientList';
import { PatientProfile } from '../components/PatientProfile';
import { PatientForm } from '../components/PatientForm';
import '../styles/Patients.css';

export const Patients = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveView('profile');
  };

  const handleBack = () => {
    setActiveView('list');
    setSelectedPatientId(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {activeView === 'list' && (
          <PatientList
            onPatientSelect={handlePatientSelect}
            onAddClick={() => setActiveView('form')}
          />
        )}
        {activeView === 'form' && (
          <PatientForm onPatientAdded={() => setActiveView('list')} />
        )}
        {activeView === 'profile' && (
          <PatientProfile patientId={selectedPatientId} onBack={handleBack} />
        )}
      </main>
    </div>
  );
};
