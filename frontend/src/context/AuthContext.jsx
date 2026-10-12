import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          setUser((prev) => ({ ...prev, ...profile }));
        } catch (e) {
          console.error('Session expired or invalid token:', e);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (credentials, maybePassword) => {
    let payload = credentials;
    if (typeof credentials === 'string') {
      payload = { email: credentials, password: maybePassword };
    }
    const data = await authService.login(payload);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isCustomer = user?.role === 'CUSTOMER' || user?.role === 'STUDENT' || user?.role === 'FACULTY';
  const isCanteenAdmin = user?.role === 'CANTEEN_ADMIN' || user?.role === 'STAFF';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const isStudent = user?.role === 'STUDENT';
  const isFaculty = user?.role === 'FACULTY';
  const isStaff = isCanteenAdmin;
  const isAdmin = isSuperAdmin;
  const isStaffOrAdmin = isCanteenAdmin || isSuperAdmin;
  const canAddProducts = isCanteenAdmin || isSuperAdmin;

  const switchDemoRole = async (roleName) => {
    let email = 'customer@canteen.com';
    if (roleName === 'CANTEEN_ADMIN') email = 'canteen@canteen.com';
    else if (roleName === 'SUPER_ADMIN') email = 'superadmin@canteen.com';
    return await login({ email, password: 'password123' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isAuthenticated: !!user,
        isCustomer,
        isCanteenAdmin,
        isSuperAdmin,
        canAddProducts,
        isStudent,
        isFaculty,
        isStaff,
        isAdmin,
        isStaffOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
