import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on role
    if (user.role === 'patient') {
      return <Navigate to="/womens-health" replace />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/video-consultation" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // For patient role, check state restrictions
  if (user.role === 'patient' && user.state === 'California') {
    // If trying to access mental health page, redirect to womens health
    if (location.pathname === '/mental-health') {
      return <Navigate to="/womens-health" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 