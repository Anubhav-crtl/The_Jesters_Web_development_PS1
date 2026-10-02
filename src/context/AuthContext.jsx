import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('bms_auth');
      return stored ? JSON.parse(stored) : { user: null, token: null, role: null, ngoId: null };
    } catch {
      return { user: null, token: null, role: null, ngoId: null };
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

  const login = async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    const authState = {
      user: data.user || { email },
      token: data.token,
      role: data.role,
      ngoId: data.ngoId || null,
    };
    setAuth(authState);
    return authState;
  };

  const logout = () => {
    setAuth({ user: null, token: null, role: null, ngoId: null });
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
        login,
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
