import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (!response.ok) {
            console.error('Failed to fetch user profile, token might be invalid or expired.');
            logout();
            return;
          }

          const userData = await response.json();
          setRole(userData.role);
          localStorage.setItem('role', userData.role);
        } catch (error) {
          console.error('Error fetching user profile from AuthContext:', error);
          logout();
        } finally {
          setLoadingAuth(false);
        }
      };
      fetchUserProfile();
    } else {
      setLoadingAuth(false);
      localStorage.removeItem('role');
    }
  }, []);

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
