import React from 'react';
import { ShieldCheck, Bell, User, Clock } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminHeader = ({ title, subtitle }) => {
  const { adminUser } = useAdminAuth();

  const initials = adminUser?.name 
    ? adminUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Audit Cycle: Q3 2026</span>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-slate-800 block">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {adminUser?.department || 'Regional Healthcare Directorate'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
