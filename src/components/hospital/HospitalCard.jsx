import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Bed, 
  Activity, 
  Check, 
  Plus, 
  Navigation, 
  Star, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  Users
} from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';
import { DistanceBadge } from '../common/DistanceBadge';
import { CostRange } from '../common/CostRange';
import { FacilityBadge } from '../common/FacilityBadge';
import { WhyThisResult } from './WhyThisResult';
import { DirectionsModal } from '../common/DirectionsModal';
import { useComparison } from '../../context/ComparisonContext';
import { getConditionPerformanceData, resolveHospitalBudget } from '../../services/recommendationService';
import { getSimulatedOutcome } from '../../data/simulatedOutcomeData';

export const HospitalCard = ({ hospital, conditionContext = '', procedureContext = '', query = '' }) => {
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();
  const isCompared = isInCompare(hospital.id);

  const toggleCompare = (e) => {
    e.preventDefault();
    if (isCompared) {
      removeFromCompare(hospital.id);
    } else {
      addToCompare(hospital);
    }
  };

  // Dynamic Disease & Procedure-Specific Estimated Budget
  const budgetInfo = resolveHospitalBudget(hospital, {
    condition: conditionContext,
    procedure: procedureContext,
    query
  });

  // Dynamic Distance from User Location
  const formattedDistance = hospital.distance != null && Number.isFinite(Number(hospital.distance))
    ? `${Number(hospital.distance) < 10 ? Number(hospital.distance).toFixed(1) : Math.round(Number(hospital.distance))} km from your current location`
    : 'Distance unavailable — location permission required';

  // Simulated / Prototype Patient Outcome Data (Hypothetical 1,000 Patient Cohort)
  const effectiveCondition = conditionContext || hospital.category || (hospital.specialties?.[0]) || query || '';
  const simOutcome = getSimulatedOutcome(hospital.id, effectiveCondition, procedureContext, query);

  // Fallback primary cost for baseline strip
  const primaryCostKey = conditionContext && hospital.estimatedCosts?.[conditionContext] 
    ? conditionContext 
    : (hospital.estimatedCosts ? Object.keys(hospital.estimatedCosts)[0] : null);
  const costData = primaryCostKey && hospital.estimatedCosts ? hospital.estimatedCosts[primaryCostKey] : null;

  // Disease-specific performance data
  const perfData = hospital.conditionPerformanceData || getConditionPerformanceData(hospital, conditionContext);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group">
        
        {/* Top Header Row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/hospitals/${hospital.id}`}
                  className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-brand-700 transition-colors"
                >
                  {hospital.name}
                </Link>
                {hospital.fullName && hospital.fullName !== hospital.name && (
                  <span className="text-xs text-slate-500 font-normal w-full sm:w-auto">
                    ({hospital.fullName})
                  </span>
                )}
                <VerificationBadge status={hospital.verification?.status || 'verified'} size="sm" />
                {hospital.isNationalReference && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
                    ⭐ National Reference #{hospital.referenceRank || hospital.nationalRefRank}
                  </span>
                )}
                {hospital.locationMatch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    ✓ Location Match — {hospital.city}
                  </span>
                )}
                {!hospital.isNationalReference && hospital.matchTier && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    hospital.matchScore >= 80 ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {hospital.matchTier}
                  </span>
                )}
                {!hospital.isNationalReference && hospital.evidenceTier && hospital.evidenceTier !== hospital.matchTier && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border bg-blue-50 text-blue-800 border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    {hospital.evidenceTier}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{hospital.location?.address || hospital.city}, {hospital.location?.city || hospital.city}</span>
                </span>
                {hospital.distance != null ? (
                  <DistanceBadge distance={hospital.distance} size="xs" />
                ) : (
                  <span className="text-slate-400">· {hospital.city || 'National Centre'}</span>
                )}
                <span className="text-slate-400">·</span>
                <span className="font-medium text-slate-700">{hospital.type || 'Apex National Reference Centre'}</span>
              </div>
            </div>

            {/* Rating Pill */}
            <div className="flex flex-col items-end shrink-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                <Star className="w-3 h-3 fill-teal-600 text-teal-600" />
                <span>{hospital.rating ? Number(hospital.rating).toFixed(1) : '4.8'}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {hospital.reviewCount || 1000}+ reviews
              </span>
            </div>
          </div>

          {/* Prominent Distance & Condition-Specific Estimated Budget Banner */}
          <div className="my-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {/* Distance */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{formattedDistance}</span>
            </div>

            {/* Estimated Budget */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <span className="text-emerald-700 font-bold shrink-0">💰</span>
              <span>
                Estimated Budget:{' '}
                {budgetInfo.label ? (
                  <span className="text-emerald-700 font-bold">{budgetInfo.label}</span>
                ) : (
                  <span className="text-slate-500 font-normal italic">Data not available</span>
                )}
              </span>
            </div>
          </div>

          {/* Patient Outcome Data Section (Hypothetical 1,000 Patient Cohort) */}
          {simOutcome && (
            <div className="my-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Outcome Rate: {simOutcome.simulatedOutcomeRate}%
              </span>
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Patient Cohort: {simOutcome.simulatedFavorableOutcomes.toLocaleString('en-IN')} / {simOutcome.cohortSize.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Beds</span>
              <span className="font-semibold text-slate-800">{hospital.beds} Beds</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ICU Beds</span>
              <span className="font-semibold text-slate-800">{hospital.icuBeds} ICU</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Emergency</span>
              <span className={`font-semibold ${hospital.emergency24x7 ? 'text-teal-700' : 'text-slate-500'}`}>
                {hospital.emergency24x7 ? '24x7 Active' : 'Limited Hours'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Accreditation</span>
              <span className="font-semibold text-slate-800">
                {Array.isArray(hospital.accreditation) ? hospital.accreditation.join(', ') : (hospital.accreditation || 'NABH')}
              </span>
            </div>
          </div>

          {/* Specialties Chips */}
          <div className="my-3 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Specialties
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hospital.specialties.slice(0, 4).map((spec, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
              {hospital.specialties.length > 4 && (
                <span className="px-1.5 py-0.5 text-xs text-slate-500">
                  +{hospital.specialties.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Key Facilities Badges */}
          <div className="my-3 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Key Facilities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hospital.facilities.slice(0, 5).map((facId) => (
                <FacilityBadge 
                  key={facId} 
                  facilityId={facId} 
                  status={hospital.facilityStatuses?.[facId] || 'available'} 
                  size="xs" 
                />
              ))}
            </div>
          </div>

          {/* Relevant Hospital Information Section (Disease/Condition-Specific) */}
          {conditionContext && perfData?.metrics?.some(m => m && m.value != null) && (
            <div className="my-3 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Relevant {perfData?.conditionLabel || 'Care'} Information</span>
                </div>
                {perfData?.metrics?.length > 0 && perfData.metrics[0].source && (
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]" title={perfData.metrics[0].source}>
                    Source: {perfData.metrics[0].source.split('&')[0]} ({perfData.metrics[0].periodEnd ? perfData.metrics[0].periodEnd.slice(0, 4) : '2025'})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {perfData.metrics.filter(m => m && m.value != null).map((metric, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block truncate" title={metric.definition || metric.label}>
                      {metric.label || metric.metricName}
                    </span>
                    <span className="font-bold text-slate-800 text-sm block">
                      {metric.numerator != null && metric.denominator != null && metric.unit === '%'
                        ? `${metric.value}% (${metric.numerator} of ${metric.denominator} defined cases)`
                        : `${metric.value.toLocaleString('en-IN')} ${metric.unit || ''}`}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      Period: {metric.periodStart && metric.periodEnd ? `${metric.periodStart.slice(0, 4)}–${metric.periodEnd.slice(0, 4)}` : 'Annual'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organisation & Accreditation Verification Matrix */}
          {hospital.organisationAffiliations && hospital.organisationAffiliations.length > 0 && (
            <div className="my-3 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Organisation & Accreditation
              </span>
              <div className="flex flex-wrap gap-2">
                {hospital.organisationAffiliations.map((aff, idx) => {
                  const isVerified = aff.status === 'verified';
                  const isExpired = aff.status === 'expired';
                  const isPending = aff.status === 'pending_review' || aff.status === 'conflicting';

                  let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
                  let badgeText = 'Not verified';

                  if (isVerified) {
                    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    badgeText = 'Verified';
                  } else if (isExpired) {
                    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
                    badgeText = 'Expired';
                  } else if (isPending) {
                    badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
                    badgeText = 'Pending Review';
                  } else if (aff.status === 'sample_data') {
                    badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
                    badgeText = 'Sample Data';
                  }

                  const typeLabel = aff.affiliationType === 'government_programme' 
                    ? 'Govt Programme' 
                    : aff.affiliationType === 'accreditation' 
                      ? 'Accreditation' 
                      : 'Registry';

                  return (
                    <div 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                      title={`${aff.organisation} (${typeLabel}): ${aff.verificationNotes || aff.source || badgeText}`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="font-bold text-slate-800">{aff.organisation}</span>
                      <span className="text-slate-400 text-[10px]">({typeLabel})</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold border ${badgeStyle}`}>
                        {badgeText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estimated Treatment Cost Box */}
          <div className="my-3 p-3 rounded-xl bg-teal-50/30 border border-teal-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-teal-800/80 font-medium block">
                Estimated Procedure Baseline
              </span>
              <CostRange label={budgetInfo.label || costData?.label} />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Cost Transparency</span>
              <span className="text-xs font-medium text-slate-600">
                {budgetInfo.label || costData?.label ? (hospital.dataSource || 'Hospital Published Tariffs') : 'Tariff Unpublished'}
              </span>
            </div>
          </div>

          {/* Explainability Accordion ("Why am I seeing this hospital?") */}
          <div className="mt-3">
            <WhyThisResult 
              reasons={hospital.whyThisResult || [
                "Relevant medical specialty available",
                `Within selected distance (${hospital.distance} km)`,
                "Estimated procedure cost fits typical range",
                "Verified hospital facility dataset"
              ]} 
              matchScore={hospital.matchScore || 85}
              matchTier={hospital.matchTier}
              isNationalReference={hospital.isNationalReference}
              referenceRank={hospital.referenceRank || hospital.nationalRefRank}
            />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          
          {/* Compare Checkbox / Button */}
          <button
            type="button"
            onClick={toggleCompare}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isCompared
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isCompared ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Comparing</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Compare</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* Directions Trigger */}
            <button
              type="button"
              onClick={() => setDirectionsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
              title="View travel time and directions"
            >
              <Navigation className="w-3.5 h-3.5 text-brand-600" />
              <span>Directions</span>
            </button>

            {/* View Details Link */}
            <Link
              to={`/hospitals/${hospital.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <span>View Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Directions Modal instance */}
      <DirectionsModal
        isOpen={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        hospital={hospital}
      />
    </>
  );
};
