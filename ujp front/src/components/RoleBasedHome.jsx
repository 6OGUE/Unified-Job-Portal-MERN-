// src/components/RoleBasedHome.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RoleBasedHome() {
  const { role } = useContext(AuthContext);

  if (role === 'employee') return <Navigate to="/employee-dashboard" />;
  if (role === 'employer') return <Navigate to="/employer-dashboard" />;
  return <Navigate to="/" />;
}

export default RoleBasedHome;
