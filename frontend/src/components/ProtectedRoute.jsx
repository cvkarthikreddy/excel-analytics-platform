import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" replace />;
  }

  // If the route is admin-only and the user is not an admin, redirect
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/dashboard" replace />; // Or a dedicated "Not Authorized" page
  }

  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;
