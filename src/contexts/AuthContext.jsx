import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/authService';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((userData) => {
      setUser(userData);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
