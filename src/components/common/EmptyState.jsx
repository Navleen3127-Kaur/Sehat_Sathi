import React from 'react';
import { SearchX, RotateCcw, ArrowRight, IndianRupee, MapPin, Activity, Heart, SlidersHorizontal, Building2 } from 'lucide-react';

export const EmptyState = ({ 
  onReset, 
  onRelaxFilter, 
  activeFilters = {}, 
  activeRadius = 50,
  isOutsideCoverage = false,
  coveredCities = [],
  minHospitalDistance = 0,
  onSelectCity,
  onOpenPicker
}) => {
  const hasBudget = activeFilters.budget && Number(activeFilters.budget) > 0;
  const hasCondition = !!(activeFilters.condition || activeFilters.conditionLabel);
  const hasFacilities = activeFilters.facilities && activeFilters.facilities.length > 0;
  const hasSpecialty = activeFilters.specialty && activeFilters.specialty !== 'all';

  const getDynamicTitle = () => {
    if (isOutsideCoverage) {
      return "Your current location is outside the area covered by the current hospital dataset.";
    }

    const parts = [];
    if (hasFacilities) {
      parts.push(activeFilters.facilities.join(', '));
    }
    if (hasCondition && activeFilters.condition !== 'none' && activeFilters.condition !== 'all' && activeFilters.conditionLabel !== 'No specific condition') {
      parts.push(activeFilters.conditionLabel || activeFilters.condition);
    }
    const matchedCriteria = parts.join(' / ');
    const budgetStr = hasBudget ? ` under ₹${Number(activeFilters.budget).toLocaleString('en-IN')}` : '';

    if (matchedCriteria) {
      return `No hospitals matching ${matchedCriteria}${budgetStr} were found within ${activeRadius} km.`;
    }
    if (hasBudget) {
      return `No hospitals matching budget${budgetStr} were found within ${activeRadius} km.`;
    }
    return `No hospitals matching your selected requirements were found within ${activeRadius} km.`;
  };

  return (
    <div className="p-6 sm:p-10 text-center rounded-2xl bg-white border border-slate-200/90 shadow-soft max-w-xl mx-auto my-6 space-y-5 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center border border-teal-100">
        <SearchX className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {getDynamicTitle()}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {isOutsideCoverage
            ? `The nearest covered healthcare center is approximately ${Math.round(minHospitalDistance)} km away. You can explore hospitals by choosing any covered city below.`
            : "No matching hospitals were found in the current hospital dataset. Results depend on the hospitals currently available in the application's dataset."}
        </p>
      </div>

      {/* Dynamic Covered Areas when outside coverage */}
      {isOutsideCoverage && coveredCities && coveredCities.length > 0 && (
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 text-left space-y-2.5">
          <span className="text-xs font-bold text-teal-900 block uppercase tracking-wider">
            Available Hospital Coverage Regions:
          </span>
          <div className="flex flex-wrap gap-2">
            {coveredCities.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => onSelectCity && onSelectCity(c)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown of Active Criteria */}
      <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200/80 space-y-3">
        <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
          Active Search Criteria Evaluated:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Condition / Need</span>
            <span className="font-semibold text-slate-800">
              {activeFilters.conditionLabel || activeFilters.condition || 'No specific condition'}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Budget Ceiling</span>
            <span className="font-semibold text-slate-800">
              {hasBudget ? `Up to ₹${Number(activeFilters.budget).toLocaleString('en-IN')}` : 'Any Budget'}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Location / Scope</span>
            <span className="font-semibold text-slate-800">
              {activeFilters.location ? activeFilters.location : 'Near My Location'} ({activeRadius} km)
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Required Facilities</span>
            <span className="font-semibold text-slate-800">
              {hasFacilities ? activeFilters.facilities.join(', ') : 'None specified'}
            </span>
          </div>
        </div>

        {/* Dynamic, relevant suggestions */}
        <div className="pt-2 border-t border-slate-200/80">
          <span className="text-xs font-semibold text-slate-700 block mb-1.5">
            Recommended adjustments:
          </span>
          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
            {hasBudget && (
              <li>Increase or relax your treatment budget ceiling to view higher-tier hospitals</li>
            )}
            {hasFacilities && (
              <li>Remove one of your specific facility requirements</li>
            )}
            {hasSpecialty && (
              <li>Switch to &quot;All Specialties&quot; to include multispeciality health campuses</li>
            )}
            {activeRadius < 50 && (
              <li>Expand your search distance to 50 km for regional facilities</li>
            )}
            <li>Reset filters to explore all available verified facilities in your area</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isOutsideCoverage && onOpenPicker && (
          <button
            type="button"
            onClick={onOpenPicker}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Choose a covered city</span>
          </button>
        )}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
        {hasBudget && onRelaxFilter && (
          <button
            type="button"
            onClick={() => onRelaxFilter('budget', '')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <span>Remove Budget Filter</span>
          </button>
        )}
        {activeRadius < 50 && onRelaxFilter && (
          <button
            type="button"
            onClick={() => onRelaxFilter('radius', 50)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm cursor-pointer"
          >
            <span>Expand Radius to 50 km</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
