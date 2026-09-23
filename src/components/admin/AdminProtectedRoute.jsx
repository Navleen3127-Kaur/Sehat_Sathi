import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldAlert } from 'lucide-react';

export const AdminProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, hasRole, hasPermission } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to admin login, capturing the intended path
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-rose-200 p-8 max-w-md w-full shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">403 — Unauthorized Role</h2>
          <p className="text-xs text-slate-500">
            Your current account role (<strong>{user?.role}</strong>) does not possess authorization to view this section (requires {requiredRole}).
          </p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-rose-200 p-8 max-w-md w-full shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">403 — Missing Permission</h2>
          <p className="text-xs text-slate-500">
            Your current account does not have the <strong>{requiredPermission}</strong> permission.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
