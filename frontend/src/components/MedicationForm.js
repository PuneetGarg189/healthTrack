import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/MedicationForm.css';

export const MedicationForm = ({ patientId, onMedicationAdded }) => {
  const { addMedication, loading } = useContext(DataContext);
  const [formData, setFormData] = useState({
    patientId,
    medicineName: '',
    dosage: '',
    frequency: 'Once Daily',
    schedule: {
      morning: false,
      afternoon: false,
      night: false
    },
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    sideEffects: []
  });

  const [sideEffectInput, setSideEffectInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (period) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [period]: !prev.schedule[period]
      }
    }));
  };

  const addSideEffect = () => {
    if (sideEffectInput.trim()) {
      setFormData(prev => ({
        ...prev,
        sideEffects: [...prev.sideEffects, sideEffectInput]
      }));
      setSideEffectInput('');
    }
  };

  const removeSideEffect = (index) => {
    setFormData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedication(formData);
      setFormData({
        patientId,
        medicineName: '',
        dosage: '',
        frequency: 'Once Daily',
        schedule: { morning: false, afternoon: false, night: false },
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
        sideEffects: []
      });
      onMedicationAdded?.();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  return (
    <div className="medication-form">
      <h2>Add New Medication</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicine Name *</label>
          <input
            type="text"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Dosage *</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder="e.g., 500mg, 2 tablets"
              required
            />
          </div>
          <div className="form-group">
            <label>Frequency *</label>
            <select name="frequency" value={formData.frequency} onChange={handleInputChange}>
              <option>Once Daily</option>
              <option>Twice Daily</option>
              <option>Thrice Daily</option>
              <option>As Needed</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Schedule</label>
          <div className="schedule-options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.schedule.morning}
                onChange={() => handleScheduleChange('morning')}
              />
              🌅 Morning
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.schedule.afternoon}
                onChange={() => handleScheduleChange('afternoon')}
              />
              ☀️ Afternoon
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.schedule.night}
                onChange={() => handleScheduleChange('night')}
              />
              🌙 Night
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="e.g., Take with food, avoid dairy"
          />
        </div>

        <div className="form-group">
          <label>Side Effects</label>
          <div className="dynamic-list">
            <div className="input-with-btn">
              <input
                type="text"
                value={sideEffectInput}
                onChange={(e) => setSideEffectInput(e.target.value)}
                placeholder="Add side effect"
                onKeyPress={(e) => e.key === 'Enter' && addSideEffect()}
              />
              <button type="button" onClick={addSideEffect}>Add</button>
            </div>
            <div className="tags">
              {formData.sideEffects.map((effect, idx) => (
                <span key={idx} className="tag">
                  {effect}
                  <button type="button" onClick={() => removeSideEffect(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medication'}
        </button>
      </form>
    </div>
  );
};
