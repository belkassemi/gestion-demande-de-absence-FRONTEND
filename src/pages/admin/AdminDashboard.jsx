import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AdminUsers from './AdminUsers';
// AdminTypes not implemented in this scope but would follow same pattern

export default function AdminDashboard() {
  return (
    <AppLayout title="Espace Administration">
      <Routes>
        <Route path="/" element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminUsers />} />
        {/* <Route path="types" element={<AdminTypes />} /> */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppLayout>
  );
}
