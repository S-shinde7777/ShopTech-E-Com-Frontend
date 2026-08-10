import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session & JWT on load
    const initAuth = async () => {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
        // Optionally verify token with backend
        try {
          const freshUser = await authService.verifyToken();
          if (freshUser) {
            setUser(freshUser);
          } else {
            setUser(null);
            setToken(null);
          }
        } catch (e) {
          // If server is offline, keep cached session
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const session = await authService.login(email, password);
      setUser(session.user);
      setToken(session.token);
      return session.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
