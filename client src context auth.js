import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password
      });
      const data = response.data;
      setAuthTokens(data);
      setUser(jwt_decode(data.token));
      localStorage.setItem('authTokens', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        name,
        email,
        password
      });
      const data = response.data;
      setAuthTokens(data);
      setUser(jwt_decode(data.token));
      localStorage.setItem('authTokens', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/v1/users/update',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.token}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response.data };
    }
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    registerUser,
    logoutUser,
    updateUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.token));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;