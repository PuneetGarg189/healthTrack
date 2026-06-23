import React, { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, logout } = useContext(AuthContext);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const getHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const authorizedFetch = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  }, [getHeaders, logout]);

  // DASHBOARD OPERATIONS
  const fetchGlobalDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/dashboard`);
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
  }, [API_BASE_URL, authorizedFetch]);

  const fetchPatientAnalytics = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/dashboard/patient/${patientId}`);
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
  }, [API_BASE_URL, authorizedFetch]);

  // PATIENT OPERATIONS
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/patients`);
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
  }, [API_BASE_URL, authorizedFetch]);

  const addPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
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
  }, [API_BASE_URL, authorizedFetch, patients, fetchGlobalDashboard]);

  const updatePatient = useCallback(async (patientId, patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'PUT',
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
  }, [API_BASE_URL, authorizedFetch, patients, fetchGlobalDashboard]);

  const deletePatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'DELETE',
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
  }, [API_BASE_URL, authorizedFetch, patients, fetchGlobalDashboard]);

  const searchPatients = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/patients/search/${name}`);
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
  }, [API_BASE_URL, authorizedFetch]);

  // MEDICATION OPERATIONS
  const fetchMedicationsForPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/medications/${patientId}`);
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
  }, [API_BASE_URL, authorizedFetch]);

  const addMedication = useCallback(async (medicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/medications`, {
        method: 'POST',
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
  }, [API_BASE_URL, authorizedFetch, medications, fetchGlobalDashboard]);

  const updateMedication = useCallback(async (medicationId, medicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/medications/${medicationId}`, {
        method: 'PUT',
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
  }, [API_BASE_URL, authorizedFetch, medications, fetchGlobalDashboard]);

  // HEALTH LOG OPERATIONS
  const fetchHealthLogs = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/logs/${patientId}`);
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
  }, [API_BASE_URL, authorizedFetch]);

  const addHealthLog = useCallback(async (logData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
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
  }, [API_BASE_URL, authorizedFetch, healthLogs, fetchGlobalDashboard]);

  // COMPLIANCE OPERATIONS
  const logCompliance = useCallback(async (complianceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorizedFetch(`${API_BASE_URL}/compliance`, {
        method: 'POST',
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
  }, [API_BASE_URL, authorizedFetch, fetchGlobalDashboard]);

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
