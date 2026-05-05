import React, { createContext, useState, useCallback } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  // DASHBOARD OPERATIONS
  const fetchGlobalDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        return data;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchPatientAnalytics = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/patient/${patientId}`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // PATIENT OPERATIONS
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setPatients(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const addPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(patientData)
      });
      const data = await response.json();
      if (data.success) {
        setPatients([...patients, data.data]);
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, patients, fetchGlobalDashboard]);

  const updatePatient = useCallback(async (patientId, patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(patientData)
      });
      const data = await response.json();
      if (data.success) {
        setPatients(patients.map(p => p._id === patientId ? data.data : p));
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, patients, fetchGlobalDashboard]);

  const deletePatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setPatients(patients.filter(p => p._id !== patientId));
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, patients, fetchGlobalDashboard]);

  const searchPatients = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patients/search/${name}`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setPatients(data.data);
        return data;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // MEDICATION OPERATIONS
  const fetchMedicationsForPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/medications/${patientId}`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setMedications(data.data);
        return data;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const addMedication = useCallback(async (medicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/medications`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(medicationData)
      });
      const data = await response.json();
      if (data.success) {
        setMedications([...medications, data.data]);
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, medications, fetchGlobalDashboard]);

  const updateMedication = useCallback(async (medicationId, medicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/medications/${medicationId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(medicationData)
      });
      const data = await response.json();
      if (data.success) {
        setMedications(medications.map(med => med._id === medicationId ? data.data : med));
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, medications, fetchGlobalDashboard]);

  // HEALTH LOG OPERATIONS
  const fetchHealthLogs = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${patientId}`, { headers: getHeaders() });
      const data = await response.json();
      if (data.success) {
        setHealthLogs(data.data);
        return data;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const addHealthLog = useCallback(async (logData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(logData)
      });
      const data = await response.json();
      if (data.success) {
        setHealthLogs([...healthLogs, data.data]);
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, healthLogs, fetchGlobalDashboard]);

  // COMPLIANCE OPERATIONS
  const logCompliance = useCallback(async (complianceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/compliance`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(complianceData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchGlobalDashboard();
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, fetchGlobalDashboard]);

  return (
    <DataContext.Provider
      value={{
        patients,
        medications,
        healthLogs,
        dashboardData,
        loading,
        error,
        fetchPatients,
        addPatient,
        updatePatient,
        deletePatient,
        searchPatients,
        fetchMedicationsForPatient,
        addMedication,
        updateMedication,
        fetchHealthLogs,
        addHealthLog,
        logCompliance,
        fetchGlobalDashboard,
        fetchPatientAnalytics
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
