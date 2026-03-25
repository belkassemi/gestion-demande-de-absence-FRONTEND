import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AdminOverview      from './AdminOverview';
import AdminUsers         from './AdminUsers';
import AdminDepartments   from './AdminDepartments';
import AdminServices      from './AdminServices';
import AdminAbsenceTypes  from './AdminAbsenceTypes';
import AdminAllRequests   from './AdminAllRequests';
import AdminAuditLogs     from './AdminAuditLogs';
import AdminCalendar      from './AdminCalendar';

export default function AdminDashboard() {
  return (
    <AppLayout title="Espace Administration">
      <Routes>
        <Route path="/"            element={<Navigate to="overview" replace />} />
        <Route path="overview"     element={<AdminOverview />} />
        <Route path="users"        element={<AdminUsers />} />
        <Route path="departments"  element={<AdminDepartments />} />
        <Route path="services"     element={<AdminServices />} />
        <Route path="types"        element={<AdminAbsenceTypes />} />
        <Route path="requests"     element={<AdminAllRequests />} />
        <Route path="audit"        element={<AdminAuditLogs />} />
        <Route path="calendar"     element={<AdminCalendar />} />
        <Route path="*"            element={<Navigate to="overview" replace />} />
      </Routes>
    </AppLayout>
  );
}
