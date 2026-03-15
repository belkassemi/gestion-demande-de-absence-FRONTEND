import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import ChefPending from './ChefPending';
import ChefCalendar from './ChefCalendar';
import ChefHistory from './ChefHistory';

export default function ChefDashboard() {
  return (
    <AppLayout title="Espace Chef de Division">
      <Routes>
        <Route path="/" element={<ChefPending />} />
        <Route path="calendar" element={<ChefCalendar />} />
        <Route path="history" element={<ChefHistory />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppLayout>
  );
}
