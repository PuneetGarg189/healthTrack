import React, { useState, useContext } from 'react';
import { Sidebar } from '../components/Sidebar';
import { GlobalDashboard } from '../components/GlobalDashboard';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <GlobalDashboard />
      </main>
    </div>
  );
};
