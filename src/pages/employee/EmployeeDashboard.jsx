import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import EmployeeOverview from './EmployeeOverview';
import EmployeeRequests from './EmployeeRequests';
import EmployeeRequestForm from './EmployeeRequestForm';

export default function EmployeeDashboard() {
  return (
    <AppLayout title="Espace Employé">
      <Routes>
        <Route path="/" element={<EmployeeOverview />} />
        <Route path="requests" element={<EmployeeRequests />} />
        <Route path="new" element={<EmployeeRequestForm />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AppLayout>
  );
}
