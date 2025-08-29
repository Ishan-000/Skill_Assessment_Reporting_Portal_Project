import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // If it's an admin-only route and user is not an admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the child route
  return <Outlet />;
};

export default ProtectedRoute;