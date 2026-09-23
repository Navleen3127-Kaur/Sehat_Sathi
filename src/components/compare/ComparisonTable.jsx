import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Check, 
  Minus, 
  ExternalLink, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Bed, 
  Activity, 
  Phone,
  Info
} from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';
import { CostRange } from '../common/CostRange';
import { getConditionPerformanceData, resolveHospitalBudget } from '../../services/recommendationService';
import { getSimulatedOutcome } from '../../data/simulatedOutcomeData';

// Helper for status badge rendering
const AffiliationStatusBadge = ({ affiliation }) => {
  const status = affiliation?.status || 'not_found';
  
  const statusConfig = {
    verified: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      label: 'Verified Partner'
    },
    unverified: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      label: 'Unverified Claim'
    },
    not_found: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      label: 'Not Listed / Not Found'
    },
    expired: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      label: 'Accreditation Expired'
    },
    conflicting: {
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      label: 'Conflicting Information'
    },
    pending_review: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      label: 'Verification in Progress'
    }
  };

  const config = statusConfig[status] || statusConfig.not_found;

  return (
    <div className="space-y-1">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg}`}>
        {config.label}
      </span>
      {affiliation?.source && (
        <div className="text-[10px] text-slate-500 italic leading-tight">
          Source: {affiliation.source}
        </div>
      )}
      {affiliation?.validThrough && (
        <div className="text-[10px] text-slate-400">
          Validity: {affiliation.validThrough}
        </div>
      )}
      {affiliation?.notes && (
        <div className="text-[10px] text-amber-700">
          Note: {affiliation.notes}
        </div>
      )}
    </div>
  );
};

export const ComparisonTable = ({ hospitals = [], onRemoveHospital, conditionContext = '' }) => {
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-soft">
        <p className="text-slate-500 text-sm">No hospitals selected for comparison.</p>
        <Link
          to="/hospitals"
          className="inline-block mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
        >
          Browse Hospitals to Compare
        </Link>
      </div>
    );
  }

  // Get specific affiliation helper
  const getAffiliation = (hospital, orgName) => {
    const found = (hospital.organisationAffiliations || []).find(
      a => a.organisation?.toUpperCase() === orgName.toUpperCase()
    );
    if (found) return found;
    return { organisation: orgName, status: 'not_found', source: 'Not listed in registry' };
  };

  // Get estimated procedure cost helper (strict null check, never ₹0)
  const getCostData = (hospital) => {
    if (!hospital.estimatedCosts) return null;
    const costs = hospital.estimatedCosts;
    if (conditionContext === 'kidney' && costs.kidneyTreatment) return costs.kidneyTreatment;
    if (conditionContext === 'heart' && (costs.angioplasty || costs.cardiacCare)) {
      return costs.angioplasty || costs.cardiacCare;
    }
    return Object.values(costs)[0] || null;
  };

  // Build rows dynamically
  const rows = [
    {
      id: 'matchScore',
      label: 'Requirement Match Score',
      render: (h) => {
        const score = h.matchScore !== undefined 
          ? h.matchScore 
          : (h.suitabilityScore !== undefined ? h.suitabilityScore : 80);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">{score}/100</span>
              <span className="text-[10px] text-slate-500 font-medium">criteria alignment</span>
            </div>
            <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-teal-600 h-full rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      id: 'distance',
      label: 'Distance from Current Location',
      render: (h) => (
        <span className="font-semibold text-slate-900 block">
          {h.distance != null && Number.isFinite(Number(h.distance))
            ? `${Number(h.distance) < 10 ? Number(h.distance).toFixed(1) : Math.round(Number(h.distance))} km from your current location`
            : 'Distance unavailable — location permission required'}
          <span className="text-[11px] text-slate-500 block font-normal">
            {h.location?.city || h.city} ({h.location?.address || h.state})
          </span>
        </span>
      )
    },
    {
      id: 'cost',
      label: 'Estimated Treatment Budget',
      render: (h) => {
        const budget = resolveHospitalBudget(h, { condition: conditionContext });
        if (!budget || !budget.isAvailable || !budget.label) {
          return <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
        return (
          <div className="space-y-0.5">
            <CostRange label={budget.label} />
            {budget.isProcedureSpecific && (
              <span className="block text-[10px] text-teal-700 font-semibold uppercase tracking-wider">
                {budget.procedureName || 'Procedure-specific'}
              </span>
            )}
          </div>
        );
      }
    },
    {
      id: 'simulatedOutcome',
      label: 'Outcome Rate & Patient Cohort',
      render: (h) => {
        const sim = getSimulatedOutcome(h.id, conditionContext || h.category || h.specialties?.[0]);
        if (!sim) {
          return <span className="text-slate-400 italic text-[11px]">Not available</span>;
        }
        return (
          <div className="space-y-0.5">
            <div className="font-bold text-teal-700 text-xs">
              Outcome Rate: {sim.simulatedOutcomeRate}%
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              Patient Cohort: {sim.simulatedFavorableOutcomes.toLocaleString('en-IN')} / {sim.cohortSize.toLocaleString('en-IN')}
            </div>
          </div>
        );
      }
    },
    {
      id: 'emergency',
      label: '24x7 Emergency & Trauma',
      render: (h) => h.emergency24x7 ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
          <Check className="w-3.5 h-3.5" /> 24x7 Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
          <Minus className="w-3.5 h-3.5" /> Daytime Only
        </span>
      )
    },
    {
      id: 'dialysis',
      label: 'Dialysis Facility',
      render: (h) => (h.facilities || []).includes('dialysis') ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <Check className="w-4 h-4 text-emerald-600" /> Available ({h.facilityStatuses?.dialysis || 'active'})
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-400">
          <Minus className="w-4 h-4" /> Unavailable
        </span>
      )
    },
    {
      id: 'icu',
      label: 'ICU Critical Care Unit',
      render: (h) => (h.facilities || []).includes('icu') ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <Check className="w-4 h-4 text-emerald-600" /> Available ({h.icuBeds || 0} Beds)
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-400">
          <Minus className="w-4 h-4" /> Unavailable
        </span>
      )
    },
    {
      id: 'blood_bank',
      label: 'Blood Bank Facility',
      render: (h) => (h.facilities || []).includes('blood_bank') ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
          <Check className="w-4 h-4 text-emerald-600" /> 24/7 Licensed
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-400">
          <Minus className="w-4 h-4" /> Unavailable
        </span>
      )
    },
    {
      id: 'diagnostics',
      label: 'Advanced Imaging (MRI & CT)',
      render: (h) => {
        const hasMri = (h.facilities || []).includes('mri');
        const hasCt = (h.facilities || []).includes('ct_scan');
        return (
          <div className="space-y-0.5 text-[11px]">
            <div className={hasMri ? "text-emerald-700 font-medium" : "text-slate-400"}>
              • MRI: {hasMri ? 'On-site' : 'None / External'}
            </div>
            <div className={hasCt ? "text-emerald-700 font-medium" : "text-slate-400"}>
              • CT Scan: {hasCt ? 'Multi-slice On-site' : 'None'}
            </div>
          </div>
        );
      }
    }
  ];

  // Condition-Specific Clinical Performance Section (Isolated per requirement)
  if (conditionContext === 'kidney') {
    rows.push(
      {
        id: 'perf_kidney_beds',
        label: 'Kidney Care: Nephrology Inpatient Beds',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'kidney');
          const metric = perf?.metrics?.find(m => m.id === 'nephrology_beds');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-bold text-slate-900">{metric.value} Beds</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      },
      {
        id: 'perf_kidney_dialysis_vol',
        label: 'Kidney Care: Annual Dialysis Procedures',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'kidney');
          const metric = perf?.metrics?.find(m => m.id === 'dialysis_annual');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-semibold text-slate-900">{metric.value.toLocaleString('en-IN')} sessions/year</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      },
      {
        id: 'perf_kidney_staff',
        label: 'Kidney Care: Dedicated Nephrologists',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'kidney');
          const metric = perf?.metrics?.find(m => m.id === 'nephrologists_count');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-semibold text-slate-800">{metric.value} Staff Specialists</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      },
      {
        id: 'perf_kidney_kt',
        label: 'Kidney Care: KT Ratio Reported',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'kidney');
          const metric = perf?.metrics?.find(m => m.id === 'kt_ratio');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-medium text-slate-800">{metric.value}</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      }
    );
  } else if (conditionContext === 'heart' || conditionContext === 'cardiac') {
    rows.push(
      {
        id: 'perf_heart_cath',
        label: 'Cardiac Care: Dedicated Cath Labs',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'heart');
          const metric = perf?.metrics?.find(m => m.id === 'cath_labs');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-bold text-slate-900">{metric.value} Operational Labs</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      },
      {
        id: 'perf_heart_ccu',
        label: 'Cardiac Care: CCU Dedicated Beds',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'heart');
          const metric = perf?.metrics?.find(m => m.id === 'ccu_beds');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-bold text-slate-900">{metric.value} CCU Beds</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      },
      {
        id: 'perf_heart_angio',
        label: 'Cardiac Care: Annual Angioplasties',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'heart');
          const metric = perf?.metrics?.find(m => m.id === 'annual_angioplasties');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-semibold text-slate-900">{metric.value.toLocaleString('en-IN')} procedures</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      }
    );
  } else if (conditionContext === 'cancer' || conditionContext === 'oncology') {
    rows.push(
      {
        id: 'perf_cancer_chemo',
        label: 'Cancer Care: Daycare Chemo Beds',
        render: (h) => {
          const perf = getConditionPerformanceData(h, 'cancer');
          const metric = perf?.metrics?.find(m => m.id === 'chemo_beds');
          return metric && metric.value !== null && metric.value !== undefined
            ? <span className="font-bold text-slate-900">{metric.value} Beds</span>
            : <span className="text-slate-400 italic text-[11px]">Data not available</span>;
        }
      }
    );
  }

  // Statutory Affiliations & Independent Accreditations
  rows.push(
    {
      id: 'aff_nabh',
      label: 'Accreditation: NABH (Hospital)',
      render: (h) => <AffiliationStatusBadge affiliation={getAffiliation(h, 'NABH')} />
    },
    {
      id: 'aff_pmndp',
      label: 'Statutory Scheme: PMNDP Dialysis',
      render: (h) => <AffiliationStatusBadge affiliation={getAffiliation(h, 'PMNDP')} />
    },
    {
      id: 'aff_nabl',
      label: 'Laboratory Accreditation: NABL',
      render: (h) => <AffiliationStatusBadge affiliation={getAffiliation(h, 'NABL')} />
    },
    {
      id: 'beds_total',
      label: 'Total Bed Capacity',
      render: (h) => <span className="font-bold text-slate-900">{h.beds} Beds</span>
    },
    {
      id: 'contact_row',
      label: 'Direct Contact & Directions',
      render: (h) => (
        <div className="space-y-1.5 text-xs">
          <a
            href={`tel:${h.phone}`}
            className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:text-teal-900"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{h.phone}</span>
          </a>
          <div className="text-[11px] text-slate-500">
            Emergency: <span className="font-semibold text-rose-700">{h.emergencyPhone || h.phone}</span>
          </div>
        </div>
      )
    }
  );

  return (
    <div className="space-y-4">
      
      {/* Top Banner Notice (Zero superlatives, factual transparency) */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <span>
            <strong>Neutral Side-by-Side Comparison:</strong> Attributes are presented factually with zero outcome claims ("Winner", "Success Rates"). Data gaps display "Data not available".
          </span>
        </div>
        <span className="text-xs text-teal-300 font-semibold whitespace-nowrap ml-2">
          Comparing {hospitals.length} of 4 max
        </span>
      </div>

      {/* Comparison Table Container with Mobile Horizontal Scroll */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          
          {/* Header Row: Hospital Cards */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="py-4 px-4 font-bold text-slate-500 w-1/4 sticky left-0 bg-slate-50/95 z-10 border-r border-slate-200">
                Criteria / Metric
              </th>

              {hospitals.map(hospital => (
                <th key={hospital.id} className="py-4 px-4 w-1/4 align-top">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={`/hospitals/${hospital.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-brand-700 transition-colors"
                      >
                        {hospital.name}
                      </Link>
                      {onRemoveHospital && (
                        <button
                          type="button"
                          onClick={() => onRemoveHospital(hospital.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from comparison"
                          aria-label={`Remove ${hospital.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-normal">
                      {hospital.type} · {hospital.location.city}
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <Link
                        to={`/hospitals/${hospital.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-600 text-white font-semibold text-[11px] hover:bg-brand-700 transition-colors shadow-xs"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Data Rows */}
          <tbody className="divide-y divide-slate-100">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-700 sticky left-0 bg-white/95 z-10 border-r border-slate-200">
                  {row.label}
                </td>
                {hospitals.map(hospital => (
                  <td key={hospital.id} className="py-3.5 px-4 align-middle">
                    {row.render(hospital)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};
