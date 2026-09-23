import React from 'react';
import { Link } from 'react-router-dom';
import { Cross, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-card space-y-5">
        <img
          src="/logo.jpg"
          alt="Sehat_Sathi Logo"
          className="w-16 h-16 object-contain rounded-2xl mx-auto shadow-sm p-1 border border-slate-100"
        />
        
        <div className="space-y-1">
          <span className="text-4xl font-extrabold text-slate-900 block">404</span>
          <h2 className="text-lg font-bold text-slate-900">Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The page or hospital resource you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/hospitals"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Hospitals</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
