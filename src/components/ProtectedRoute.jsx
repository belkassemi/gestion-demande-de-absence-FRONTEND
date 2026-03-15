import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

export default function ProtectedRoute({ allowedRoles, children }) {
  const user = useSelector(selectCurrentUser);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own home
    const home = { employee: '/employee', chef: '/chef', rh: '/rh', directeur: '/directeur', admin: '/admin' };
    return <Navigate to={home[user.role] || '/login'} replace />;
  }

  return children;
}
