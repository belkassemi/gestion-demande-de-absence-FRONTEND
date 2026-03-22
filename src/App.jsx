import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';

// Pages
import LoginPage          from './pages/LoginPage';
import EmployeeDashboard  from './pages/employee/EmployeeDashboard';
import ChefDashboard      from './pages/chef/ChefDashboard';
import DirecteurDashboard from './pages/directeur/DirecteurDashboard';
import AdminDashboard     from './pages/admin/AdminDashboard';
import Home               from './pages/Home';
import AboutPage          from './pages/AboutPage';
import ContactPage        from './pages/ContactPage';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

const ROLE_HOME = {
  employee:    '/employee/requests',
  chef_service: '/chef-service',
  directeur:   '/directeur',
  admin:       '/admin',
};

function PublicLanding() {
  const user = useSelector(selectCurrentUser);
  if (user) return <Navigate to={ROLE_HOME[user.role] || '/employee'} replace />;
  return <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<PublicLanding />} />
        <Route path="/login"    element={<PublicLanding />} />
        <Route path="/old-login" element={<LoginPage />} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/contact"  element={<ContactPage />} />

        <Route path="/employee/*" element={
          <ProtectedRoute allowedRoles={['employee', 'chef_service', 'directeur']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/chef-service/*" element={
          <ProtectedRoute allowedRoles={['chef_service']}>
            <ChefDashboard />
          </ProtectedRoute>
        } />

        <Route path="/directeur/*" element={
          <ProtectedRoute allowedRoles={['directeur']}>
            <DirecteurDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
