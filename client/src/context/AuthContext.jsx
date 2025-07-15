import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user data');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function with auto-login
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Register the user
      const registrationData = await authService.register(userData);
      
      // Auto-login after successful registration
      try {
        const loginData = await authService.login({
          email: userData.email,
          password: userData.password
        });
        
        // Set user and save to localStorage
        setUser(loginData);
        localStorage.setItem('user', JSON.stringify(loginData));
        return { ...registrationData, loginSuccess: true };
      } catch (loginErr) {
        console.error("Auto-login after registration failed:", loginErr);
        // Return registration data even if auto-login fails
        return { ...registrationData, loginSuccess: false };
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Enhanced isAdmin function that properly checks for admin role
  const isAdmin = () => {
    if (!user) return false;
    // Check for either 'admin' or 'ADMIN' for case insensitivity
    return user.role === 'admin' || user.role === 'ADMIN';
  };

  // Debug user info
  useEffect(() => {
    if (user) {
      console.log("Current user:", {
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        isAdmin: isAdmin()
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

