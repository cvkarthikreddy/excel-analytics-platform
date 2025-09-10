import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // Check if user is logged in and is an admin
  // If so, render the child component (Outlet)
  // Otherwise, redirect them to the home page
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;