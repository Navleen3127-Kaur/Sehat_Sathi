import React from 'react';
import { Link } from 'react-router-dom';
import { Cross, ShieldAlert, Heart, ExternalLink, Phone, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Urgent Emergency Callout Ribbon */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-200">
                Experiencing a medical emergency?
              </h4>
              <p className="text-xs text-rose-300/80 mt-0.5 max-w-2xl">
                Do not wait for online searches. If someone has acute chest pain, severe trauma, stroke symptoms, or breathing distress, contact national emergency services immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>National Ambulance (108)</span>
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
            >
              <span>Emergency (112)</span>
            </a>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Sehat_Sathi Logo"
                className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 shadow-sm"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Sehat_Sathi
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Trusted Healthcare Companion. Empowering patients with transparent, condition-based, budget-aware hospital discovery and side-by-side comparisons.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-teal-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Hospital Audit Standards</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-slate-400 hover:text-white transition-colors">
                  Find Hospitals
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-white transition-colors">
                  Hospital Comparison
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-rose-400 hover:text-rose-300 transition-colors">
                  Emergency 24x7 Triage
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About & Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialties */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Key Care Areas
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/hospitals?condition=kidney" className="text-slate-400 hover:text-white transition-colors">
                  Kidney Treatment & Dialysis
                </Link>
              </li>
              <li>
                <Link to="/hospitals?condition=cardiac" className="text-slate-400 hover:text-white transition-colors">
                  Cardiology & Heart Care
                </Link>
              </li>
              <li>
                <Link to="/hospitals?condition=cancer" className="text-slate-400 hover:text-white transition-colors">
                  Oncology (Cancer Care)
                </Link>
              </li>
              <li>
                <Link to="/hospitals?condition=orthopedic" className="text-slate-400 hover:text-white transition-colors">
                  Orthopedics & Joint Replacement
                </Link>
              </li>
              <li>
                <Link to="/hospitals?condition=maternity" className="text-slate-400 hover:text-white transition-colors">
                  Maternity & Obstetric Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Admin & Governance */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Data & Admin
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Admin Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/hospitals" className="text-slate-400 hover:text-white transition-colors">
                  Hospital Directory Registry
                </Link>
              </li>
              <li>
                <Link to="/admin/hospitals/add" className="text-slate-400 hover:text-white transition-colors">
                  Submit New Hospital
                </Link>
              </li>
              <li>
                <Link to="/admin/upload" className="text-slate-400 hover:text-white transition-colors">
                  Upload CSV Hospital Dataset
                </Link>
              </li>
              <li>
                <Link to="/admin/verification" className="text-slate-400 hover:text-white transition-colors">
                  Audit & Verification Queue
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Responsible Healthcare Disclaimer */}
        <div className="py-6 border-b border-slate-800 text-slate-400 text-[11px] leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Healthcare UX & Transparency Charter:</span>
          </div>
          <p>
            Sehat_Sathi is an independent medical discovery service. Hospital profiles, facility matrices, and estimated costs are compiled from regulatory filings, direct audits, and published hospital tariffs. Estimated treatment ranges are indicative and subject to individual patient complexity, chosen procedure variations, and specific doctor fees. Sehat_Sathi does not offer medical advice, diagnostics, or outcome guarantees.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Sehat_Sathi. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-teal-400">🟢 Verified Data Available</span>
            <span className="text-amber-400">🟡 Estimated Costs Indicated</span>
            <span className="text-slate-400">⚪ Unavailable Fields Flagged</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
