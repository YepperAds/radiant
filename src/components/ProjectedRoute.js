import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  if (!isAdmin) {
    // Redirect to login page if not admin, save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;