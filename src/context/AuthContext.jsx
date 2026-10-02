import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('bms_auth');
      return stored ? JSON.parse(stored) : { user: null, token: null, role: null, name: null, ngoId: null };
    } catch {
      return { user: null, token: null, role: null, name: null, ngoId: null };
    }
  });

  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const stored = localStorage.getItem('bms_saved_posts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bms_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('bms_saved_posts', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  const loginUser = async ({ email, password }) => {
    const data = await apiLogin(email, password);
    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }
    const authState = {
      user: { email, name: data.name },
      token: data.token || 'auth-token',
      role: data.role,
      name: data.name,
      ngoId: data.ngoId || data.id || null,
    };
    setAuth(authState);
    return data;
  };

  const logout = () => {
    setAuth({ user: null, token: null, role: null, name: null, ngoId: null });
  };

  const toggleSavePost = (id) => {
    setSavedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isPostSaved = (id) => savedPostIds.includes(id);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login: loginUser,
        logout,
        savedPostIds,
        toggleSavePost,
        isPostSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
