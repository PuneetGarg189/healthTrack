import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/HealthLogForm.css';

export const HealthLogForm = ({ patientId, onLogAdded }) => {
  const { addHealthLog, loading } = useContext(DataContext);
  const [formData, setFormData] = useState({
    patientId,
    logDate: new Date().toISOString().split('T')[0],
    vitals: {
      sleepHours: '',
      weight: '',
      bloodPressure: { systolic: '', diastolic: '' },
      mood: 'Neutral'
    },
    symptoms: [],
    notes: [],
    temperature: ''
  });

  const [symptomInput, setSymptomInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleVitalsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [field]: value
      }
    }));
  };

  const handleBPChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        bloodPressure: {
          ...prev.vitals.bloodPressure,
          [type]: value
        }
      }
    }));
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptomInput]
      }));
      setSymptomInput('');
    }
  };

  const removeSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const addNote = () => {
    if (noteInput.trim()) {
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, noteInput]
      }));
      setNoteInput('');
    }
  };

  const removeNote = (index) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addHealthLog(formData);
      setFormData({
        patientId,
        logDate: new Date().toISOString().split('T')[0],
        vitals: {
          sleepHours: '',
          weight: '',
          bloodPressure: { systolic: '', diastolic: '' },
          mood: 'Neutral'
        },
        symptoms: [],
        notes: [],
        temperature: ''
      });
      onLogAdded?.();
    } catch (error) {
      console.error('Error adding health log:', error);
    }
  };

  return (
    <div className="health-log-form">
      <h2>Add Health Log</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="logDate"
            value={formData.logDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>Vitals</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.vitals.sleepHours}
                onChange={(e) => handleVitalsChange('sleepHours', e.target.value)}
                placeholder="e.g., 7.5"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.vitals.weight}
                onChange={(e) => handleVitalsChange('weight', e.target.value)}
                placeholder="e.g., 75"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Pressure (Systolic)</label>
              <input
                type="number"
                min="0"
                value={formData.vitals.bloodPressure.systolic}
                onChange={(e) => handleBPChange('systolic', e.target.value)}
                placeholder="e.g., 120"
              />
            </div>
            <div className="form-group">
              <label>Blood Pressure (Diastolic)</label>
              <input
                type="number"
                min="0"
                value={formData.vitals.bloodPressure.diastolic}
                onChange={(e) => handleBPChange('diastolic', e.target.value)}
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                min="90"
                max="110"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                placeholder="e.g., 98.6"
              />
            </div>
            <div className="form-group">
              <label>Mood</label>
              <select value={formData.vitals.mood} onChange={(e) => handleVitalsChange('mood', e.target.value)}>
                <option>Very Happy</option>
                <option>Happy</option>
                <option>Neutral</option>
                <option>Sad</option>
                <option>Very Sad</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Symptoms</label>
          <div className="dynamic-list">
            <div className="input-with-btn">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Add symptom"
                onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
              />
              <button type="button" onClick={addSymptom}>Add</button>
            </div>
            <div className="tags">
              {formData.symptoms.map((symptom, idx) => (
                <span key={idx} className="tag">
                  {symptom}
                  <button type="button" onClick={() => removeSymptom(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <div className="dynamic-list">
            <div className="input-with-btn">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add note"
              />
              <button type="button" onClick={addNote}>Add</button>
            </div>
            <div className="notes-list">
              {formData.notes.map((note, idx) => (
                <div key={idx} className="note-item">
                  <span>{note}</span>
                  <button type="button" onClick={() => removeNote(idx)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Add Health Log'}
        </button>
      </form>
    </div>
  );
};
