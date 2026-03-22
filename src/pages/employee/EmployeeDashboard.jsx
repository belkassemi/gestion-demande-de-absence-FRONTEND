import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import EmployeeRequests from './EmployeeRequests';
import EmployeeRequestForm from './EmployeeRequestForm';

export default function EmployeeDashboard() {
  return (
    <AppLayout title="Espace Employé">
      <Routes>
        <Route path="/" element={<Navigate to="requests" replace />} />
        <Route path="requests" element={<EmployeeRequests />} />
        <Route path="new" element={<EmployeeRequestForm />} />
        <Route path="*" element={<Navigate to="requests" replace />} />
      </Routes>
    </AppLayout>
  );
}
