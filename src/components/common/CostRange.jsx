import React from 'react';
import { IndianRupee } from 'lucide-react';

export const CostRange = ({ min, max, label, compact = false }) => {
  // If label is explicitly empty/missing, or equals/contains ₹0 without positive values
  const isInvalidLabel = !label || label.trim() === '' || label === '₹0' || label === '₹0 – ₹0';
  const hasNoNumericCost = (!min || min <= 0) && (!max || max <= 0);

  if (isInvalidLabel && hasNoNumericCost) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 font-medium italic">
          Estimated cost: Data not available
        </span>
      </div>
    );
  }

  if (label && !isInvalidLabel) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-slate-900 font-semibold">
          <IndianRupee className="w-4 h-4 text-brand-600 inline -mr-0.5" />
          <span>{label.replace('₹', '')}</span>
        </div>
        {!compact && (
          <span className="text-[11px] text-amber-700 font-medium">Estimated range</span>
        )}
      </div>
    );
  }

  const formattedMin = min ? `₹${min.toLocaleString('en-IN')}` : '';
  const formattedMax = max ? `₹${max.toLocaleString('en-IN')}` : '';

  if (!formattedMin && !formattedMax) {
    return (
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 font-medium italic">
          Estimated cost: Data not available
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-slate-900 font-semibold text-sm">
        {formattedMin} {formattedMax ? `– ${formattedMax}` : ''}
      </div>
      {!compact && (
        <span className="text-[11px] text-amber-700 font-medium">Estimated range</span>
      )}
    </div>
  );
};
