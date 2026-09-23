import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  PhoneCall, 
  Navigation, 
  Plus, 
  Check, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Bed, 
  Activity, 
  Clock, 
  FileText, 
  ArrowLeft,
  Share2,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Users
} from 'lucide-react';
import { hospitalService } from '../services/hospitalService';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { DistanceBadge } from '../components/common/DistanceBadge';
import { HospitalStats } from '../components/hospital/HospitalStats';
import { FacilityGrid } from '../components/hospital/FacilityGrid';
import { CostEstimator } from '../components/hospital/CostEstimator';
import { SpecialistDoctors } from '../components/hospital/SpecialistDoctors';
import { DirectionsModal } from '../components/common/DirectionsModal';
import { useComparison } from '../context/ComparisonContext';
import { useToast } from '../context/ToastContext';
import { getSimulatedOutcome } from '../data/simulatedOutcomeData';

export const HospitalDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { isInCompare, addToCompare, removeFromCompare } = useComparison();
  const { addToast } = useToast();

  const conditionQuery = searchParams.get('condition') || searchParams.get('q') || hospital?.category || (hospital?.specialties?.[0]) || '';
  const simOutcome = hospital ? getSimulatedOutcome(hospital.id, conditionQuery) : null;

  useEffect(() => {
    setIsLoading(true);
    hospitalService.getHospitalById(id)
      .then(data => {
        setHospital(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4 mx-auto"></div>
        <div className="h-48 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Hospital record not found</h2>
        <p className="text-sm text-slate-500">The requested facility ID does not exist in our dataset.</p>
        <Link to="/hospitals" className="inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isCompared = isInCompare(hospital.id);

  const toggleCompare = () => {
    if (isCompared) {
      removeFromCompare(hospital.id);
    } else {
      addToCompare(hospital);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Hospital profile link copied to clipboard', 'success');
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Statistics' },
    { id: 'doctors', label: 'Specialist Doctors' },
    { id: 'specialties', label: 'Specialties' },
    { id: 'facilities', label: 'Facilities Matrix' },
    { id: 'costs', label: 'Estimated Treatment Costs' },
    { id: 'verification', label: 'Audit & Verification' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Back button */}
      <div>
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search Results</span>
        </Link>
      </div>

      {/* TOP PROFILE HEADER SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {hospital.name}
                </h1>
                <VerificationBadge status={hospital.verification?.status || 'verified'} size="md" />
                {hospital.isNationalReference && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
                    ⭐ National Reference #{hospital.referenceRank || hospital.nationalRefRank} · {hospital.category}
                  </span>
                )}
              </div>

              {hospital.fullName && hospital.fullName !== hospital.name && (
                <p className="text-sm font-semibold text-teal-800">
                  {hospital.fullName}
                </p>
              )}
            </div>

            <p className="text-sm text-slate-600 font-medium">
              {hospital.tagline}
            </p>

            {/* Address & distance */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{hospital.location.address}, {hospital.location.city} ({hospital.location.pincode})</span>
              </span>
              <DistanceBadge distance={hospital.distance} city={hospital.location.city} />
            </div>

            {/* Phone */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>OPD/Reception: {hospital.phone}</span>
              </span>
              {hospital.emergencyPhone && (
                <span className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>24x7 Emergency: {hospital.emergencyPhone}</span>
                </span>
              )}
            </div>
          </div>

          {/* Rating & Actions Column */}
          <div className="flex flex-col sm:items-end justify-between gap-4">
            
            <div className="flex items-center sm:flex-col sm:items-end gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-sm font-bold">
                <Star className="w-4 h-4 fill-teal-600 text-teal-600" />
                <span>{hospital.rating.toFixed(1)} / 5.0</span>
              </div>
              <span className="text-xs text-slate-400">
                {hospital.reviewCount} verified patient feedback
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              
              {/* Call CTA */}
              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hospital</span>
              </a>

              {/* Get Directions */}
              <button
                type="button"
                onClick={() => setDirectionsOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-600" />
                <span>Get Directions</span>
              </button>

              {/* Add to Compare */}
              <button
                type="button"
                onClick={toggleCompare}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isCompared
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isCompared ? 'Comparing' : 'Add to Compare'}</span>
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Share link"
                aria-label="Share hospital link"
              >
                <Share2 className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Overview text */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Hospital Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {hospital.overview}
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Hospital Statistics & Infrastructure
            </h3>
            <HospitalStats hospital={hospital} />
          </div>

          {/* Condition-Specific Evidence & Outcome Registry Metrics */}
          {hospital.conditionPerformance && hospital.conditionPerformance.some(m => m && m.value != null) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Condition-Specific Clinical Registry & Performance Data
                    </h3>
                    <p className="text-xs text-slate-500">
                      Authoritative, source-verified clinical quality metrics from institutional reports and official registries
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                  Verified Registry Evidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.conditionPerformance.filter(m => m && m.value != null).map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800 text-sm">{metric.label || metric.metricName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        metric.verificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {metric.verificationStatus === 'verified' ? 'Verified Source' : 'Unverified / Public'}
                      </span>
                    </div>

                    <div className="py-1">
                      <span className="text-xl font-bold text-slate-900 block">
                        {metric.numerator != null && metric.denominator != null && metric.unit === '%'
                          ? `${metric.value}% (${metric.numerator} of ${metric.denominator} defined cases)`
                          : `${metric.value.toLocaleString('en-IN')} ${metric.unit || ''}`}
                      </span>
                      <p className="text-xs text-slate-600 mt-1">
                        {metric.definition}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                      {metric.population && (
                        <div>
                          <span className="font-semibold text-slate-700">Patient Cohort:</span> {metric.population}
                        </div>
                      )}
                      {metric.period && (
                        <div>
                          <span className="font-semibold text-slate-700">Reporting Period:</span> {metric.period}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-700">Audit Source:</span> {metric.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Outcome Data Section (Illustrative Cohort Model) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-700" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Outcome Data
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient cohort models for selected healthcare conditions and procedures
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold self-start sm:self-auto">
                Prototype Dataset
              </span>
            </div>

            {/* Page-Level Outcome Dataset Disclosure */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Outcome Data Disclosure
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Outcome figures shown are based on the prototype dataset used by Sehat_Sathi. Figures are illustrative demonstrations based on a standardized cohort of 1,000 patients and do not represent verified hospital clinical statistics.
                </p>
              </div>
            </div>

            {/* Metric display */}
            {simOutcome ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">
                    Modeled Condition / Procedure
                  </span>
                  <span className="text-base font-bold text-slate-900 block">
                    {simOutcome.conditionLabel}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                    Outcome Rate
                  </span>
                  <span className="text-2xl font-bold text-teal-700 block">
                    {simOutcome.simulatedOutcomeRate}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Patient Cohort
                  </span>
                  <span className="text-base font-bold text-slate-900 block">
                    {simOutcome.simulatedFavorableOutcomes.toLocaleString('en-IN')} / {simOutcome.cohortSize.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Outcome data is not available for this facility or condition.</span>
                <span className="font-semibold text-slate-400">Data not available</span>
              </div>
            )}
          </div>

          {/* Specialist Doctors Roster (Overview Section) */}
          <div className="space-y-3">
            <SpecialistDoctors hospital={hospital} />
          </div>

        </div>
      )}

      {/* Specialist Doctors Dedicated Tab */}
      {activeTab === 'doctors' && (
        <div className="animate-fade-in">
          <SpecialistDoctors hospital={hospital} />
        </div>
      )}

      {/* 2. Specialties Tab */}
      {activeTab === 'specialties' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Clinical Specialties & Departments
            </h3>
            <span className="text-xs text-slate-400">
              {hospital.specialties.length} active departments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {hospital.specialties.map((spec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-xs font-semibold text-slate-800">{spec}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2 italic">
            * Specialty offerings verified from the hospital's clinical licensing registry.
          </p>
        </div>
      )}

      {/* 3. Facilities Matrix Tab */}
      {activeTab === 'facilities' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Facilities & Equipment Availability
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed status of critical care equipment, diagnostics, and emergency support.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-700">🟢 Available</span>
                <span className="flex items-center gap-1 text-amber-700">🟡 Limited</span>
                <span className="flex items-center gap-1 text-slate-400">⚪ Unavailable</span>
              </div>
            </div>

            <FacilityGrid
              facilityStatuses={hospital.facilityStatuses}
              activeFacilities={hospital.facilities}
            />
          </div>
        </div>
      )}

      {/* 4. Treatment Costs Tab */}
      {activeTab === 'costs' && (
        <div className="animate-fade-in">
          <CostEstimator
            estimatedCosts={hospital.estimatedCosts}
            hospitalName={hospital.name}
          />
        </div>
      )}

      {/* 5. Audit & Verification Tab */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Transparency & Verification Audit Record
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sehat_Sathi maintains transparent audit trails for all medical facility parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Verification Status
              </span>
              <div className="pt-1">
                <VerificationBadge status={hospital.verification.status} size="md" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Last Audit Timestamp
              </span>
              <span className="font-bold text-slate-900 text-sm block">
                {hospital.verification.lastUpdated}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block uppercase">
                Data Source / Agency
              </span>
              <span className="font-bold text-slate-900 text-xs block">
                {hospital.verification.source}
              </span>
            </div>
          </div>

          {/* Verified Fields List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Independently Audited Fields:
            </span>
            <div className="flex flex-wrap gap-2">
              {hospital.verification.verifiedFields?.map(field => (
                <span
                  key={field}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{field.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Responsible Healthcare UX Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Audit Methodology Note:</span>
            </div>
            <p>
              Data points marked 🟢 Verified have been confirmed against state regulatory filings and on-site audit disclosures. Cost ranges marked 🟡 Estimated are derived from public tariff schedules and may vary. Fields marked ⚪ Unavailable indicate items currently under verification or withheld by the institution.
            </p>
          </div>
        </div>
      )}

      {/* Directions Modal */}
      <DirectionsModal
        isOpen={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        hospital={hospital}
      />

    </div>
  );
};
