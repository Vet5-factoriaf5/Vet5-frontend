// src/components/ProtectedRoute.jsx (ENHANCED)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Enhanced Protected Route Component
 * Handles authentication and role-based access with better error handling
 * 
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Child components to render
 * @param {string} props.requiredRole - Required role to access the route
 * @param {string} props.redirectPath - Path to redirect if unauthorized
 * 
 * @author Your Name
 * @version 1.1
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectPath = '/login' 
}) => {
  const { user, isAdmin, isUser } = useAuth();

  // Safety check - ensure auth context is available
  if (!user) {
    console.warn('No user found in auth context, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    let hasRequiredRole = false;
    
    try {
      hasRequiredRole = 
        (requiredRole === 'ADMIN' && isAdmin()) ||
        (requiredRole === 'USER' && isUser());
    } catch (error) {
      console.error('Error checking user role:', error);
      return <Navigate to="/login" replace />;
    }

    if (!hasRequiredRole) {
      console.warn(`User ${user.username} lacks required role: ${requiredRole}`);
      
      // Redirect based on user's actual role
      const fallbackPath = isAdmin() ? '/admin/dashboard' : '/user/dashboard';
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;