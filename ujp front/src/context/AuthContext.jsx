import React, { createContext, useState, useEffect } from 'react';

// Create context object
export const AuthContext = createContext();

// Provider component that wraps your app
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // On mount, read role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, []);

  // Call this on successful login
  const login = (newRole) => {
    localStorage.setItem('role', newRole);
    setRole(newRole);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
