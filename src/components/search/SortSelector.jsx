import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SortSelector = ({ 
  currentSort = 'recommended', 
  onSortChange, 
  totalCount = 0, 
  costUnavailableCount = 0,
  budgetContext = null,
  verifiedCount = 0,
  conditionContext = '',
  facilitiesContext = []
}) => {
  const options = [
    { value: 'recommended', label: 'Recommended based on selected criteria' },
    { value: 'nearest', label: 'Nearest to your location' },
    { value: 'lowest_cost', label: 'Lowest Estimated Cost' },
    { value: 'highest_rating', label: 'Highest Patient Rating' }
  ];

  // Derive contextual title
  let titlePrefix = 'Hospitals';
  const condLower = (conditionContext || '').toLowerCase();
  if (condLower.includes('kidney') || condLower.includes('renal') || condLower.includes('nephro')) {
    titlePrefix = 'Kidney Care Hospitals';
  } else if (condLower.includes('heart') || condLower.includes('cardio')) {
    titlePrefix = 'Heart Care Hospitals';
  } else if (condLower.includes('cancer') || condLower.includes('oncol')) {
    titlePrefix = 'Cancer Care Hospitals';
  } else if (condLower.includes('ortho')) {
    titlePrefix = 'Orthopedic Care Hospitals';
  } else if ((facilitiesContext || []).includes('dialysis')) {
    titlePrefix = 'Dialysis Care Hospitals';
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-soft">
      <div>
        <h2 className="text-sm font-bold text-slate-900">
          {titlePrefix} Matching Your Requirements
        </h2>
        <p className="text-xs text-slate-500">
          {budgetContext && costUnavailableCount > 0 ? (
            <span>
              Showing <span className="font-semibold text-slate-800">{totalCount}</span> confirmed budget {totalCount === 1 ? 'match' : 'matches'} + <span className="font-semibold text-amber-700">{costUnavailableCount}</span> relevant {costUnavailableCount === 1 ? 'hospital' : 'hospitals'} with unavailable cost
            </span>
          ) : (
            <span>
              Showing <span className="font-semibold text-slate-800">{totalCount}</span> matching {totalCount === 1 ? 'hospital' : 'hospitals'}
            </span>
          )}
          {verifiedCount > 0 ? (
            <span className="text-slate-500"> &bull; <span className="text-emerald-700 font-medium">{verifiedCount} verified</span></span>
          ) : null}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort by:</span>
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
