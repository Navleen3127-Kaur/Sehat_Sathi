import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  IndianRupee, 
  Activity, 
  ShieldCheck, 
  Bed, 
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SPECIALTIES } from '../../data/specialties';
import { FACILITIES } from '../../data/facilities';
import { CITIES } from '../../context/LocationContext';

export const FilterSidebar = ({ 
  filters = {}, 
  onFilterChange, 
  onResetFilters, 
  onApplyFilters,
  totalResultsCount,
  activeAutoRadius = 5,
  isRadiusAuto = true,
  aiAppliedFields = {}
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Synchronize internal state whenever incoming filters prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleTextChange = (field, val) => {
    const updated = { ...localFilters, [field]: val };
    setLocalFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleFacilityToggle = (facId) => {
    const currentFacilities = localFilters.facilities || [];
    const updatedFacilities = currentFacilities.includes(facId)
      ? currentFacilities.filter(id => id !== facId)
      : [...currentFacilities, facId];
    
    const updated = { ...localFilters, facilities: updatedFacilities };
    setLocalFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleRadiusSelect = (radiusVal) => {
    const updated = { ...localFilters, radius: radiusVal };
    setLocalFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleReset = () => {
    const defaultFilters = {
      condition: '',
      location: '',
      radius: 'auto',
      budget: '',
      specialty: 'all',
      emergencyOnly: false,
      facilities: [],
      accreditation: 'all',
      minBeds: 0
    };
    setLocalFilters(defaultFilters);
    if (onResetFilters) onResetFilters(defaultFilters);
  };

  const baseBudgetOptions = [
    { label: "Any Budget", value: "" },
    { label: "Up to ₹50,000", value: 50000 },
    { label: "Up to ₹1,00,000", value: 100000 },
    { label: "Up to ₹2,00,000", value: 200000 },
    { label: "Up to ₹3,50,000", value: 350000 },
    { label: "Up to ₹5,00,000", value: 500000 }
  ];

  // Dynamic budget list accommodating custom query values
  const currentBudgetNum = localFilters.budget ? Number(localFilters.budget) : '';
  const budgetOptions = [...baseBudgetOptions];
  if (currentBudgetNum && !baseBudgetOptions.some(b => b.value === currentBudgetNum)) {
    budgetOptions.splice(1, 0, {
      label: `Up to ₹${currentBudgetNum.toLocaleString('en-IN')}`,
      value: currentBudgetNum
    });
  }

  const bedOptions = [
    { label: "Any Capacity", value: 0 },
    { label: "100+ Beds", value: 100 },
    { label: "200+ Beds", value: 200 },
    { label: "300+ Beds", value: 300 }
  ];

  const currentRadiusIsAuto = isRadiusAuto || localFilters.radius === 'auto' || localFilters.radius === '' || localFilters.radius == null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Search Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Condition / Medical Need Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            Medical Condition / Need
          </label>
          {aiAppliedFields.condition && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>From search</span>
            </span>
          )}
        </div>
        <input
          type="text"
          value={localFilters.condition || ''}
          onChange={(e) => handleTextChange('condition', e.target.value)}
          placeholder="No specific condition (e.g. Heart, Dialysis, Knee...)"
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* 2. City / Location */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <span>Location</span>
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
          </label>
          {aiAppliedFields.location && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>From search</span>
            </span>
          )}
        </div>
        <select
          value={localFilters.location || ''}
          onChange={(e) => handleTextChange('location', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
        >
          <option value="">📍 Near My Location (GPS / Nearest)</option>
          {CITIES.map(c => {
            const cityName = c.city || c.name;
            return (
              <option key={cityName} value={cityName}>
                {cityName} ({c.state})
              </option>
            );
          })}
        </select>
      </div>

      {/* 3. Distance Radius */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            Distance Radius
          </label>
          {currentRadiusIsAuto && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <span>Auto ({activeAutoRadius} km)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleRadiusSelect('auto')}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
              currentRadiusIsAuto
                ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Auto
          </button>
          {[5, 10].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => handleRadiusSelect(r)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                !currentRadiusIsAuto && Number(localFilters.radius) === r
                  ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {[25, 50].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => handleRadiusSelect(r)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                !currentRadiusIsAuto && Number(localFilters.radius) === r
                  ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Within {r} km
            </button>
          ))}
        </div>
      </div>

      {/* 4. Estimated Budget Range */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <span>Treatment Budget</span>
            <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
          </label>
          {aiAppliedFields.budget && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>From search</span>
            </span>
          )}
        </div>
        <select
          value={localFilters.budget || ''}
          onChange={(e) => handleTextChange('budget', e.target.value ? Number(e.target.value) : '')}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
        >
          {budgetOptions.map(b => (
            <option key={b.label} value={b.value}>{b.label}</option>
          ))}
        </select>
        <span className="text-[10px] text-slate-400 block">
          * Non-diagnostic procedure baseline estimate
        </span>
      </div>

      {/* 5. Medical Specialty */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Medical Specialty
        </label>
        <select
          value={localFilters.specialty || 'all'}
          onChange={(e) => handleTextChange('specialty', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
        >
          <option value="all">All Specialties</option>
          {SPECIALTIES.map(s => (
            <option key={s.id} value={s.shortName}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* 6. Emergency 24x7 Switch */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 block">
                24x7 Emergency Only
              </span>
              {aiAppliedFields.emergency && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  From search
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              Show round-the-clock acute care units
            </span>
          </div>
          <input
            type="checkbox"
            checked={!!localFilters.emergencyOnly}
            onChange={(e) => handleTextChange('emergencyOnly', e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
          />
        </label>
      </div>

      {/* 7. Required Facilities (Checkboxes) */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 block">
            Required Facilities
          </label>
          {aiAppliedFields.facilities && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-2.5 h-2.5" />
              <span>From search</span>
            </span>
          )}
        </div>

        {(!localFilters.facilities || localFilters.facilities.length === 0) && (
          <p className="text-[11px] text-slate-400 italic">
            None specified (All available facilities considered)
          </p>
        )}

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {FACILITIES.map(fac => {
            const isChecked = (localFilters.facilities || []).includes(fac.id);
            return (
              <label
                key={fac.id}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>{fac.name}</span>
                  {aiAppliedFields.facilities && isChecked && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      From search
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleFacilityToggle(fac.id)}
                  className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 8. Accreditation */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700">
          Hospital Accreditation
        </label>
        <select
          value={localFilters.accreditation || 'all'}
          onChange={(e) => handleTextChange('accreditation', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
        >
          <option value="all">Any Accreditation</option>
          <option value="NABH">NABH Accredited</option>
          <option value="JCI">JCI (International)</option>
          <option value="NABL">NABL Diagnostic Labs</option>
          <option value="State Health Verified">State Health Dept Verified</option>
        </select>
      </div>

      {/* 9. Minimum Bed Count */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Minimum Bed Capacity
        </label>
        <select
          value={localFilters.minBeds || 0}
          onChange={(e) => handleTextChange('minBeds', Number(e.target.value))}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
        >
          {bedOptions.map(b => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>

    </div>
  );
};
