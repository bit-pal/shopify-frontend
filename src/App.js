import React from 'react';
import { useAuth } from './context/AuthContext';
import { getAllowedRoutes } from './config/routes';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
// Import your page components
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import WomensHealth from './pages/WomensHealth';
import MensHealth from './pages/MensHealth';
import MentalHealth from './pages/MentalHealth';
import VideoConsultation from './components/VideoConsultation';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, show only login and register routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Get allowed routes for the current user
  const allowedRoutes = getAllowedRoutes(user);
  console.log(allowedRoutes);
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />

      {/* Protected routes */}
      {allowedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}

      {/* Default route - redirect to appropriate page based on role */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              user.role === 'admin'
                ? '/dashboard'
                : user.role === 'doctor'
                ? '/video-consultation'
                : '/womens-health'
            }
            replace
          />
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
