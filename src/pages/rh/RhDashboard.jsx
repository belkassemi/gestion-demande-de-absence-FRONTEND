import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import RhPending from './RhPending';
import RhBalances from './RhBalances';
import RhReports from './RhReports';

export default function RhDashboard() {
  return (
    <AppLayout title="Espace Ressources Humaines">
      <Routes>
        <Route path="/" element={<RhPending />} />
        <Route path="balances" element={<RhBalances />} />
        <Route path="reports" element={<RhReports />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppLayout>
  );
}
