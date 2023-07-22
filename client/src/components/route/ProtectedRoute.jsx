import React from 'react';

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, loading, children }) => {
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
