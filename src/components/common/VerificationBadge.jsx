import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

/**
 * Renders consistent verification status badges:
 *   🟢 Verified
 *   🟡 Estimated
 *   ⚪ Unavailable / Pending
 */
export const VerificationBadge = ({ status = 'verified', size = 'md', showLabel = true }) => {
  const normStatus = (status || '').toLowerCase();

  if (normStatus === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
        title="Verified Data: Sourced from official registry or hospital audit"
      >
        <CheckCircle2 className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600`} />
        {showLabel && <span>Verified Data</span>}
      </span>
    );
  }

  if (normStatus === 'sample_data' || normStatus === 'sample') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
        title="Sample Data: Demonstration record for system simulation"
      >
        <HelpCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-500`} />
        {showLabel && <span>Sample Data</span>}
      </span>
    );
  }

  if (normStatus === 'estimated' || normStatus === 'partial' || normStatus === 'partially_verified') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
        title="Estimated: Sourced from partial public tariffs"
      >
        <AlertCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-600`} />
        {showLabel && <span>Estimated</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
      title="Unverified: Underlying data pending independent audit"
    >
      <HelpCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-500`} />
      {showLabel && <span>Unverified</span>}
    </span>
  );
};
