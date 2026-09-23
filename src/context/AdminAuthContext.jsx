import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, ADMIN_ROLES, ROLE_PERMISSIONS } from '../services/adminService';

export { ADMIN_ROLES, ROLE_PERMISSIONS };

const AdminAuthContext = createContext(null);

const SESSION_STORAGE_KEY = 'sehat_sathi_admin_session';

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to restore admin session:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ username, password, role = 'admin' }) => {
    setIsLoading(true);
    try {
      const session = await adminService.authenticateAdmin({ username, password, role });
      setUser(session.user);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session.user));
      setIsLoading(false);
      return { success: true, user: session.user };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear admin session:', e);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // admin has all permissions
    return user.role === requiredRole;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // admin has all permissions
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    return rolePerms.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminUser: user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
