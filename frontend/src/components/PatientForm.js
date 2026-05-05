import React, { useEffect, useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import '../styles/PatientForm.css';

export const PatientForm = ({ onPatientAdded, existingPatient = null }) => {
  const { addPatient, updatePatient, loading } = useContext(DataContext);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    contact: '',
    address: '',
    condition: '',
    emergencyContact: {
      name: '',
      relation: 'Parent',
      phone: ''
    },
    healthProfile: {
      bloodGroup: 'O+',
      allergies: [],
      chronicConditions: []
    },
    insuranceDetails: {
      provider: '',
      policyNumber: ''
    }
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const validatePhone = (value) => /^\d{10}$/.test(value);

  useEffect(() => {
    if (existingPatient) {
      setFormData(existingPatient);
    }
  }, [existingPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        healthProfile: {
          ...prev.healthProfile,
          allergies: [...prev.healthProfile.allergies, allergyInput]
        }
      }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      healthProfile: {
        ...prev.healthProfile,
        allergies: prev.healthProfile.allergies.filter((_, i) => i !== index)
      }
    }));
  };

  const addChronicCondition = () => {
    if (conditionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        healthProfile: {
          ...prev.healthProfile,
          chronicConditions: [...prev.healthProfile.chronicConditions, conditionInput]
        }
      }));
      setConditionInput('');
    }
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      healthProfile: {
        ...prev.healthProfile,
        chronicConditions: prev.healthProfile.chronicConditions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validatePhone(formData.contact)) {
      setErrorMsg('Contact must be a valid 10-digit phone number.');
      return;
    }
    if (!validatePhone(formData.emergencyContact.phone)) {
      setErrorMsg('Emergency contact phone must be a valid 10-digit number.');
      return;
    }
    try {
      if (existingPatient?._id) {
        await updatePatient(existingPatient._id, formData);
      } else {
        await addPatient(formData);
      }
      onPatientAdded?.();
      // Reset form
      setFormData({
        fullName: '',
        age: '',
        gender: 'Male',
        contact: '',
        address: '',
        condition: '',
        emergencyContact: { name: '', relation: 'Parent', phone: '' },
        healthProfile: {
          bloodGroup: 'O+',
          allergies: [],
          chronicConditions: []
        },
        insuranceDetails: { provider: '', policyNumber: '' }
      });
    } catch (error) {
      console.error('Error saving patient:', error);
      setErrorMsg(error.message || 'Failed to save patient. Please try again.');
    }
  };

  return (
    <div className="patient-form">
      <h2>{existingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
      
      {errorMsg && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          border: '1px solid #fcc'
        }}>
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                inputMode="numeric"
                maxLength={10}
                pattern="\d{10}"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Medical Condition *</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Emergency Contact</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Relation *</label>
              <select
                value={formData.emergencyContact.relation}
                onChange={(e) => handleNestedChange('emergencyContact', 'relation', e.target.value)}
              >
                <option>Parent</option>
                <option>Spouse</option>
                <option>Sibling</option>
                <option>Child</option>
                <option>Friend</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="text"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
              placeholder="10-digit phone number"
              inputMode="numeric"
              maxLength={10}
              pattern="\d{10}"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Health Profile</h3>
          
          <div className="form-group">
            <label>Blood Group *</label>
            <select
              value={formData.healthProfile.bloodGroup}
              onChange={(e) => handleNestedChange('healthProfile', 'bloodGroup', e.target.value)}
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <div className="dynamic-list">
              <div className="input-with-btn">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Add allergy"
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                />
                <button type="button" onClick={addAllergy}>Add</button>
              </div>
              <div className="tags">
                {formData.healthProfile.allergies.map((allergy, idx) => (
                  <span key={idx} className="tag">
                    {allergy}
                    <button type="button" onClick={() => removeAllergy(idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Chronic Conditions</label>
            <div className="dynamic-list">
              <div className="input-with-btn">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  placeholder="Add condition"
                  onKeyPress={(e) => e.key === 'Enter' && addChronicCondition()}
                />
                <button type="button" onClick={addChronicCondition}>Add</button>
              </div>
              <div className="tags">
                {formData.healthProfile.chronicConditions.map((condition, idx) => (
                  <span key={idx} className="tag">
                    {condition}
                    <button type="button" onClick={() => removeCondition(idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Insurance Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Provider *</label>
              <input
                type="text"
                value={formData.insuranceDetails.provider}
                onChange={(e) => handleNestedChange('insuranceDetails', 'provider', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Policy Number *</label>
              <input
                type="text"
                value={formData.insuranceDetails.policyNumber}
                onChange={(e) => handleNestedChange('insuranceDetails', 'policyNumber', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : (existingPatient ? 'Update Patient' : 'Add Patient')}
        </button>
      </form>
    </div>
  );
};
