import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, ArrowRight, X } from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';

export const CompareFloatingBar = () => {
  const { selectedHospitals, count, removeFromCompare, clearCompare } = useComparison();
  const location = useLocation();

  // Don't show floating bar on the actual compare page
  if (location.pathname === '/compare' || count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl animate-slide-up">
      <div className="bg-navy-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-elevated border border-slate-700 flex items-center justify-between gap-3">
        
        {/* Left: Info & Chips */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0 hidden sm:flex">
            <Scale className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white">
                Comparing Hospitals
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-600 text-[10px] font-bold text-white">
                {count}/4
              </span>
            </div>

            {/* Hospital Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-xs sm:max-w-md">
              {selectedHospitals.map(h => (
                <span
                  key={h.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-200 border border-slate-700 whitespace-nowrap"
                >
                  <span className="truncate max-w-[100px]">{h.shortName || h.name}</span>
                  <button
                    onClick={() => removeFromCompare(h.id)}
                    className="text-slate-400 hover:text-white"
                    aria-label={`Remove ${h.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors hidden sm:block"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <span>Compare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
