import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  UploadCloud, 
  ShieldCheck, 
  Settings, 
  ArrowLeft,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminSidebar = () => {
  const { adminUser, logout } = useAdminAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
    { name: 'Add Hospital', path: '/admin/hospitals/add', icon: PlusCircle },
    { name: 'Upload Dataset', path: '/admin/upload', icon: UploadCloud },
    { name: 'Verification Queue', path: '/admin/verification', icon: ShieldCheck }
  ];

  const handleLogout = () => {
    logout();
    addToast('Admin session terminated successfully.', 'info');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-navy-950 text-slate-300 min-h-screen p-5 flex flex-col justify-between border-r border-navy-900 shrink-0">
      <div className="space-y-6">
        
        {/* Admin Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <img
            src="/logo.jpg"
            alt="Sehat_Sathi Logo"
            className="w-8 h-8 object-contain rounded-lg bg-white p-0.5 shadow-sm"
          />
          <div>
            <span className="font-bold text-base text-white tracking-tight block">
              Sehat_Sathi
            </span>
            <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
              Admin & Audit Console
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5 pt-2">
          {adminLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-700/80 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User Session & Logout */}
      <div className="pt-6 border-t border-navy-800 space-y-3">
        {adminUser && (
          <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                {adminUser.name || 'Admin'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-900/60 text-teal-300 font-mono font-bold uppercase">
                {adminUser.role}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {adminUser.email || 'Auditor Session'}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Admin Session</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Sehat_Sathi</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
