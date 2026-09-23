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
  AlertCircle 
} from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';
import { DistanceBadge } from '../common/DistanceBadge';
import { CostRange } from '../common/CostRange';
import { FacilityBadge } from '../common/FacilityBadge';
import { WhyThisResult } from './WhyThisResult';
import { DirectionsModal } from '../common/DirectionsModal';
import { useComparison } from '../../context/ComparisonContext';
import { getConditionPerformanceData } from '../../services/recommendationService';

export const HospitalCard = ({ hospital, conditionContext }) => {
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

  // Find relevant cost range based on condition if available, else primary
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
                <VerificationBadge status={hospital.verification.status} size="sm" />
                {hospital.matchTier && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                    hospital.matchScore >= 80 ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {hospital.matchTier}
                  </span>
                )}
                {hospital.evidenceTier && hospital.evidenceTier !== hospital.matchTier && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border bg-blue-50 text-blue-800 border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    {hospital.evidenceTier}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{hospital.location.address}, {hospital.location.city}</span>
                </span>
                <DistanceBadge distance={hospital.distance} size="xs" />
                <span className="text-slate-400">·</span>
                <span className="font-medium text-slate-700">{hospital.type}</span>
              </div>
            </div>

            {/* Rating Pill */}
            <div className="flex flex-col items-end shrink-0">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                <Star className="w-3 h-3 fill-teal-600 text-teal-600" />
                <span>{hospital.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {hospital.reviewCount} reviews
              </span>
            </div>
          </div>

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
                {hospital.accreditation.join(', ')}
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
          {conditionContext && (
            <div className="my-3 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Relevant {perfData?.conditionLabel || 'Care'} Information</span>
                </div>
                {perfData?.metrics?.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]" title={perfData.metrics[0].source}>
                    Source: {perfData.metrics[0].source.split('&')[0]} ({perfData.metrics[0].periodEnd ? perfData.metrics[0].periodEnd.slice(0, 4) : '2025'})
                  </span>
                )}
              </div>

              {perfData && perfData.metrics?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {perfData.metrics.map((metric, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block truncate" title={metric.definition || metric.label}>
                        {metric.label || metric.metricName}
                      </span>
                      <span className="font-bold text-slate-800 text-sm block">
                        {metric.value != null 
                          ? (metric.numerator != null && metric.denominator != null && metric.unit === '%'
                              ? `${metric.value}% (${metric.numerator} of ${metric.denominator} defined cases)`
                              : `${metric.value.toLocaleString('en-IN')} ${metric.unit || ''}`)
                          : 'Data not available'}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Period: {metric.periodStart && metric.periodEnd ? `${metric.periodStart.slice(0, 4)}–${metric.periodEnd.slice(0, 4)}` : 'Annual'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2 px-3 text-center text-xs text-slate-500 bg-white/70 rounded-lg border border-dashed border-slate-200">
                  <p className="font-medium text-slate-700">
                    {(conditionContext.charAt(0).toUpperCase() + conditionContext.slice(1))}-specific performance data not publicly available
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Hospital matches your clinical requirements. Missing public records does not indicate clinical deficiency.
                  </p>
                </div>
              )}
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
              <CostRange label={costData?.label} />
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Cost Transparency</span>
              <span className="text-xs font-medium text-slate-600">
                {costData?.label ? (hospital.dataSource || 'Hospital Published Tariffs') : 'Tariff Unpublished'}
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
