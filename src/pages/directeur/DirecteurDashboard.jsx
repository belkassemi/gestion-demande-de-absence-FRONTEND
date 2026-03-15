import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import DirecteurPending from './DirecteurPending';
import DirecteurOverview from './DirecteurOverview';
import DirecteurStats from './DirecteurStats';

export default function DirecteurDashboard() {
  return (
    <AppLayout title="Espace Direction Générale">
      <Routes>
        <Route path="/" element={<DirecteurOverview />} />
        <Route path="pending" element={<DirecteurPending />} />
        <Route path="stats" element={<DirecteurStats />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppLayout>
  );
}
