import React, { useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/GlobalDashboard.css';

const STATUS_COLORS = {
  Taken: '#10b981',
  Missed: '#f43f5e',
  Partial: '#f59e0b'
};

export const GlobalDashboard = () => {
  const { dashboardData, fetchGlobalDashboard, loading } = useContext(DataContext);

  useEffect(() => {
    fetchGlobalDashboard();
  }, [fetchGlobalDashboard]);

  if (loading) return <div className="loading">Loading health dashboard...</div>;
  if (!dashboardData) return <div className="error">No analytics data available</div>;

  const rawRate = dashboardData.overallCompliance?.complianceRate || 0;
  const complianceRate = Math.round(rawRate);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Clinical Health Analytics Dashboard</h1>
      </div>

      {/* Hero Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-patients">
          <div className="stat-icon-box">👥</div>
          <div className="stat-content">
            <span className="stat-number">{dashboardData.totalPatients}</span>
            <span className="stat-title">Total Patients</span>
          </div>
        </div>

        <div className="stat-card stat-card-meds">
          <div className="stat-icon-box">💊</div>
          <div className="stat-content">
            <span className="stat-number">{dashboardData.totalMedications}</span>
            <span className="stat-title">Active Medications</span>
          </div>
        </div>

        <div className="stat-card stat-card-compliance">
          <div className="stat-icon-box">📈</div>
          <div className="stat-content">
            <span className="stat-number">{complianceRate}%</span>
            <span className="stat-title">Overall Compliance</span>
          </div>
        </div>

        <div className="stat-card stat-card-doses">
          <div className="stat-icon-box">✅</div>
          <div className="stat-content">
            <span className="stat-number">{dashboardData.overallCompliance?.takenCount || 0}</span>
            <span className="stat-title">Total Doses Taken</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="charts-section">
        {/* Compliance Donut Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Overall Adherence Breakdown</h2>
          </div>

          {dashboardData.complianceChart && dashboardData.complianceChart.length > 0 ? (
            <div className="donut-chart-wrapper">
              <div className="donut-center-info">
                <span className="donut-center-value">{complianceRate}%</span>
                <span className="donut-center-label">Adherence</span>
              </div>
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie
                    data={dashboardData.complianceChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {dashboardData.complianceChart.map((entry, index) => {
                      const statusName = entry.status || entry._id;
                      const fillColor = STATUS_COLORS[statusName] || (index === 0 ? '#10b981' : '#f43f5e');
                      return <Cell key={`cell-${index}`} fill={fillColor} stroke="#ffffff" strokeWidth={2} />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} doses`, name]}
                    contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data-text">No compliance data logged yet</p>
          )}

          {/* Active Prescriptions Breakdown */}
          <div className="medicine-details-table">
            <h3>Scheduled Prescriptions Summary</h3>
            <div className="medicines-list">
              {dashboardData.medicinesSummary && dashboardData.medicinesSummary.length > 0 ? (
                dashboardData.medicinesSummary.map(med => (
                  <div key={med._id || med.medicineName} className="medicine-detail-row">
                    <div className="med-info">
                      <span className="med-mini-badge">💊</span>
                      <div>
                        <div className="med-name">{med.medicineName}</div>
                        <div className="med-dosage">Dosage: {med.dosage}</div>
                      </div>
                    </div>
                    <div className="med-frequency">
                      <span className="frequency-label">{med.frequency}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-text">No prescription details available</p>
              )}
            </div>
          </div>
        </div>

        {/* Grouped Bar Chart: Taken vs Missed per Medication */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Prescription Performance (Taken vs Missed)</h2>
          </div>

          {dashboardData.medicinesSummary && dashboardData.medicinesSummary.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={dashboardData.medicinesSummary} margin={{ bottom: 35, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="medicineName" 
                    style={{ fontSize: '11px', fontWeight: 600, fill: '#475569' }}
                  />
                  <YAxis 
                    style={{ fontSize: '11px', fontWeight: 600, fill: '#475569' }} 
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(value) => <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>{value}</span>}
                  />
                  <Bar dataKey="takenCount" name="Taken Doses" fill="#10b981" radius={[4, 4, 0, 0]} barSize={22} />
                  <Bar dataKey="missedCount" name="Missed Doses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>

              <div className="medicine-details-table">
                <h3>Detailed Performance Per Medicine</h3>
                <div className="medicines-list">
                  {dashboardData.medicinesSummary.map(med => {
                    const rate = Math.round(med.complianceRate || 0);
                    let badgeClass = "compliance-badge-high";
                    if (rate < 40) badgeClass = "compliance-badge-low";
                    else if (rate < 60) badgeClass = "compliance-badge-mid";

                    return (
                      <div key={med.medicineName} className="medicine-detail-row">
                        <div className="med-info">
                          <span className="med-mini-badge">💊</span>
                          <div>
                            <div className="med-name">{med.medicineName}</div>
                            <div className="med-dosage">
                              Taken: {med.takenCount || 0} • Missed: {med.missedCount || 0} (Total: {med.totalCount || 0})
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className={`compliance-rate-pill ${badgeClass}`}>
                            {rate}% Compliance
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="no-data-text">No prescription performance data available</p>
          )}
        </div>
      </div>

      {/* Recent Logs Section */}
      <div className="recent-logs-section">
        <h2>Recent Patient Health Logs</h2>
        <div className="logs-list">
          {dashboardData.recentLogs && dashboardData.recentLogs.length > 0 ? (
            dashboardData.recentLogs.map(log => {
              const name = log.patient?.fullName || 'Anonymous Patient';
              const initials = name.trim().split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
              const gradients = [
                'linear-gradient(135deg, #0ea5e9, #0284c7)',
                'linear-gradient(135deg, #10b981, #059669)',
                'linear-gradient(135deg, #6366f1, #4f46e5)',
                'linear-gradient(135deg, #f59e0b, #d97706)',
                'linear-gradient(135deg, #ec4899, #db2777)',
                'linear-gradient(135deg, #14b8a6, #0f766e)'
              ];
              let hash = 0;
              for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
              const avatarBg = gradients[Math.abs(hash) % gradients.length];

              return (
                <div key={log._id} className="log-row-card">
                  <div className="log-patient-info">
                    <div className="log-avatar-circle" style={{ background: avatarBg }}>
                      {initials}
                    </div>
                    <div>
                      <div className="log-patient-name">{name}</div>
                      <div className="log-date">{new Date(log.logDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="log-vitals-pills">
                    {log.vitals?.sleepHours && (
                      <span className="vital-tag vital-sleep">
                        💤 {log.vitals.sleepHours.toFixed(1)}h sleep
                      </span>
                    )}
                    {log.vitals?.weight && (
                      <span className="vital-tag vital-weight">
                        ⚖️ {log.vitals.weight.toFixed(1)} kg
                      </span>
                    )}
                    {log.vitals?.mood && (
                      <span className={`vital-tag vital-mood mood-${(log.vitals.mood || '').toLowerCase()}`}>
                        {log.vitals.mood === 'Happy' ? '😊' : log.vitals.mood === 'Sad' ? '😔' : '😐'} {log.vitals.mood}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-data-text">No recent health logs recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};
