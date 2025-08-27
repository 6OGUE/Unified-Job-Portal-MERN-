// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        setToken(storedToken);

        const response = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (!response.ok) {
          console.error("Failed to fetch profile, logging out.");
          logout();
          return;
        }

        const userData = await response.json();
        setUser(userData);
        setRole(userData.role);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userData.role);
      } catch (err) {
        console.error("AuthContext fetch error:", err);
        logout();
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  const login = (newToken, userData) => {
    if (!newToken || !userData) return;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);

    setToken(newToken);
    setUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, user, login, logout, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
