import React, { useState, useEffect } from 'react';
import { Sparkles, Edit2, Search, Check, RefreshCw, MapPin, IndianRupee, Activity, SlidersHorizontal } from 'lucide-react';

export const UnderstoodRequestCard = ({ parsedQuery, onApplySearch, onUpdateParsed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCondition, setEditedCondition] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedBudget, setEditedBudget] = useState('');
  const [editedFacility, setEditedFacility] = useState('');

  useEffect(() => {
    if (parsedQuery) {
      setEditedCondition(parsedQuery.conditionLabel || parsedQuery.condition || '');
      setEditedLocation(parsedQuery.location || '');
      setEditedBudget(parsedQuery.budgetMax || '');
      setEditedFacility(parsedQuery.facilities?.[0] || '');
    }
  }, [parsedQuery]);

  if (!parsedQuery) return null;

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdateParsed) {
      const facilitiesList = editedFacility ? [editedFacility] : [];
      const facilityLabelsList = editedFacility 
        ? [editedFacility === 'dialysis' ? 'Dialysis Unit' : editedFacility === 'icu' ? 'ICU' : editedFacility.replace('_', ' ').toUpperCase()]
        : [];

      onUpdateParsed({
        ...parsedQuery,
        condition: editedCondition,
        conditionLabel: editedCondition,
        location: editedLocation,
        budgetMax: editedBudget ? Number(editedBudget) : null,
        budgetLabel: editedBudget ? `Up to ₹${Number(editedBudget).toLocaleString('en-IN')}` : 'Any Budget',
        facilities: facilitiesList,
        facilityLabels: facilityLabelsList
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-navy-950 text-white rounded-2xl p-5 sm:p-6 shadow-elevated border border-teal-800/60 my-4 animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-teal-800/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300">
            <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span>We understood your request</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 font-semibold uppercase">
                AI Intent Applied
              </span>
            </h3>
            <p className="text-xs text-teal-200/70 mt-0.5">
              Filters automatically populated below &bull; Results updated for your requirements
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800/40 hover:bg-teal-800/70 text-teal-200 text-xs font-medium border border-teal-700/60 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Search'}</span>
        </button>
      </div>

      {/* Extracted Parameters Grid */}
      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4 text-xs">
          {/* Condition */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-teal-300 font-semibold block uppercase tracking-wider mb-1">
              Condition / Need
            </span>
            <span className="font-bold text-white text-sm block">
              {parsedQuery.condition ? (parsedQuery.conditionLabel || parsedQuery.condition) : 'No specific condition'}
            </span>
          </div>

          {/* Location */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-teal-300 font-semibold block uppercase tracking-wider mb-1">
              Location
            </span>
            <span className="font-bold text-white text-sm block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{parsedQuery.location ? parsedQuery.location : 'Near My Location'}</span>
            </span>
          </div>

          {/* Budget */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-teal-300 font-semibold block uppercase tracking-wider mb-1">
              Budget Ceiling
            </span>
            <span className="font-bold text-white text-sm block flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                {parsedQuery.budgetMax 
                  ? `Up to ₹${parsedQuery.budgetMax.toLocaleString('en-IN')}` 
                  : 'Any Budget'}
              </span>
            </span>
          </div>

          {/* Facility */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-teal-300 font-semibold block uppercase tracking-wider mb-1">
              Required Facility
            </span>
            <span className="font-bold text-white text-sm block flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>
                {parsedQuery.facilityLabels?.length > 0 
                  ? parsedQuery.facilityLabels.join(', ') 
                  : 'None specified'}
              </span>
            </span>
          </div>

          {/* Priority */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-teal-300 font-semibold block uppercase tracking-wider mb-1">
              Priority Intent
            </span>
            <span className="font-bold text-white text-sm block">
              {parsedQuery.priority?.join(' · ') || 'Criteria Alignment'}
            </span>
          </div>
        </div>
      ) : (
        /* Edit Mode Inputs */
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 py-4 text-xs">
          <div>
            <label className="text-[11px] text-teal-200 block mb-1">Condition / Need</label>
            <input
              type="text"
              value={editedCondition}
              onChange={(e) => setEditedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-teal-600 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-teal-200 block mb-1">Location</label>
            <input
              type="text"
              value={editedLocation}
              placeholder="e.g. Chandigarh or leave blank for Near Me"
              onChange={(e) => setEditedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-teal-600 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-teal-200 block mb-1">Max Budget (₹)</label>
            <input
              type="number"
              value={editedBudget}
              placeholder="Leave blank for any"
              onChange={(e) => setEditedBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-teal-600 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-teal-200 block mb-1">Required Facility</label>
            <select
              value={editedFacility}
              onChange={(e) => setEditedFacility(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-teal-600 text-white text-xs focus:outline-none"
            >
              <option value="">None specified</option>
              <option value="dialysis">Dialysis Unit</option>
              <option value="icu">ICU</option>
              <option value="mri">MRI</option>
              <option value="ct_scan">CT Scan</option>
              <option value="blood_bank">Blood Bank</option>
              <option value="emergency">24x7 Emergency</option>
            </select>
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-teal-800/70">
        <p className="text-[11px] text-teal-300/80">
          Search filters below are automatically synchronized with these requirements.
        </p>

        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
