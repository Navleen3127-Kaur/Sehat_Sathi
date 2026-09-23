import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Scale, Plus, Building2, Trash2, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { HOSPITALS } from '../data/hospitals';
import { getNationalReferenceHospitalById } from '../data/nationalHospitalReferences.js';

export const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { selectedHospitals, setSelectedHospitals, removeFromCompare, addToCompare, clearCompare, activeConditionContext } = useComparison();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const urlIds = searchParams.get('ids');
  const urlCondition = searchParams.get('condition') || '';
  const conditionContext = urlCondition || activeConditionContext || '';

  // Synchronize URL parameter ?ids=15,16 or ?ids=ref_brain_surgery_1,ref_brain_surgery_2 with comparison state
  useEffect(() => {
    if (urlIds) {
      const parsedIds = urlIds.split(',').map(id => id.trim()).filter(Boolean);
      if (parsedIds.length > 0) {
        const found = parsedIds
          .map(id => {
            let h = HOSPITALS.find(item => String(item.id) === String(id));
            if (!h) {
              h = getNationalReferenceHospitalById(id);
            }
            return h;
          })
          .filter(Boolean);
        if (found.length > 0) {
          setSelectedHospitals(found);
        }
      }
    }
  }, [urlIds, setSelectedHospitals]);

  // Available hospitals not currently selected
  const availableToAdd = HOSPITALS.filter(
    h => !selectedHospitals.some(sel => sel.id === h.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/hospitals"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Discovery</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-brand-600" />
            <span>Hospital Comparison Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Neutral side-by-side assessment of facilities, clinical metrics, and verified accreditations. Zero superlatives.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {selectedHospitals.length < 4 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hospital ({selectedHospitals.length}/4)</span>
            </button>
          )}

          {selectedHospitals.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {selectedHospitals.length > 0 ? (
        <ComparisonTable
          hospitals={selectedHospitals}
          onRemoveHospital={removeFromCompare}
          conditionContext={conditionContext}
        />
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No hospitals selected for comparison
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Search or select hospitals to compare facilities, clinical performance, and verified affiliations side-by-side.
          </p>
          <div className="pt-2">
            <Link
              to="/hospitals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Browse Search Results</span>
            </Link>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 max-w-md w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Select Hospital to Compare</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pick a hospital from the directory below to add to your side-by-side matrix (maximum 4).
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {availableToAdd.length > 0 ? (
                availableToAdd.map(hospital => (
                  <div
                    key={hospital.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-white flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{hospital.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {hospital.type} · {hospital.location.city} ({hospital.distance} km)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCompare(hospital);
                        if (selectedHospitals.length >= 3) {
                          setIsAddModalOpen(false);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  All available hospitals are already in your comparison list.
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
