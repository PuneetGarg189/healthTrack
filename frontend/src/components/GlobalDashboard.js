import React, { useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/GlobalDashboard.css';

export const GlobalDashboard = () => {
  const { dashboardData, fetchGlobalDashboard, loading } = useContext(DataContext);

  useEffect(() => {
    fetchGlobalDashboard();
  }, [fetchGlobalDashboard]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  if (!dashboardData) return <div className="error">No data available</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Global Health Analytics Dashboard</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{dashboardData.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardData.totalMedications}</div>
          <div className="stat-label">Active Medications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardData.overallCompliance?.complianceRate || 0}%</div>
          <div className="stat-label">Overall Compliance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardData.overallCompliance?.takenCount || 0}</div>
          <div className="stat-label">Total Doses Taken</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Compliance Pie Chart */}
        <div className="chart-card">
          <h2>Medicine Taken vs Missed</h2>
          {dashboardData.complianceChart && dashboardData.complianceChart.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.complianceChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#ef4444"
                    dataKey="count"
                    nameKey="status"
                  >
                    <Cell fill="#16a34a" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} doses`}
                    labelFormatter={(label) => `Status: ${label}`}
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Legend 
                    formatter={(value, entry) => entry.payload.status}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Medicine Details Table */}
              <div className="medicine-details-table">
                <h3>Medicine Details by Status</h3>
                <div className="medicines-list">
                  {dashboardData.medicinesSummary && dashboardData.medicinesSummary.length > 0 ? (
                    dashboardData.medicinesSummary.map(med => (
                      <div key={med._id} className="medicine-detail-row">
                        <div className="med-info">
                          <div className="med-name">{med.medicineName}</div>
                          <div className="med-dosage">Dosage: {med.dosage}</div>
                        </div>
                        <div className="med-frequency">
                          <span className="frequency-label">Schedule: {med.frequency}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No medicine details available</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>

        {/* Most Missed Medicines Bar Chart */}
        <div className="chart-card">
          <h2>Most Missed Medicines by Patients</h2>
          {dashboardData.mostMissedMedicines && dashboardData.mostMissedMedicines.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.mostMissedMedicines} margin={{ bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="medicineName" 
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    style={{ fontSize: '12px' }} 
                    label={{ value: 'Miss Rate (%)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    formatter={(value) => `${value}% missed`}
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(239, 68, 68, 0.08)' }}
                  />
                  <Bar dataKey="missRate" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Detailed Miss Info */}
              <div className="medicine-details-table">
                <h3>Medicine Miss Details</h3>
                <div className="medicines-list">
                  {dashboardData.mostMissedMedicines.map(med => (
                    <div key={med.medicineName} className="medicine-detail-row">
                      <div className="med-info">
                        <div className="med-name">{med.medicineName}</div>
                        <div className="med-dosage">Dosage: {med.dosage || 'N/A'}</div>
                      </div>
                      <div className="med-frequency">
                        <span className="frequency-label">{med.frequency || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p>No missed medicines data available. All medicines are on track! 🎉</p>
          )}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="recent-logs">
        <h2>Recent Health Logs</h2>
        <div className="logs-table">
          {dashboardData.recentLogs && dashboardData.recentLogs.length > 0 ? (
            dashboardData.recentLogs.map(log => (
              <div key={log._id} className="log-row">
                <div className="log-patient">{log.patient?.fullName}</div>
                <div className="log-date">{new Date(log.logDate).toLocaleDateString()}</div>
                <div className="log-vitals">
                  {log.vitals?.sleepHours && <span>💤 {log.vitals.sleepHours.toFixed(1)}h</span>}
                  {log.vitals?.weight && <span>⚖️ {log.vitals.weight.toFixed(1)}kg</span>}
                  {log.vitals?.mood && <span>😊 {log.vitals.mood}</span>}
                </div>
              </div>
            ))
          ) : (
            <p>No logs available</p>
          )}
        </div>
      </div>
    </div>
  );
};
