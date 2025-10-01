// src/App.jsx (FIXED VERSION)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomeTest from './pages/homeTest/HomeTest';
import LoginPage from './pages/LoginPageTest';
import RegisterPage from './pages/RegisterPageTest';
import AdminDashboard from './components/dashboards/AdminDashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main Application Component with Role-Based Routing
 * Fixed router structure to prevent nested routers
 * 
 * @author gml
 * @version 2.1
 */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeTest />} />
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate 
              to={user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} 
              replace 
            />
          ) : (
            <LoginPage />
          )
        } 
      />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Protected User Routes */}
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute requiredRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;