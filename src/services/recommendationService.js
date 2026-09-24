/**
 * Sehat_Sathi - Recommendation Service
 * 
 * Implements transparent, non-diagnostic multi-factor criteria matching.
 * 
 * SCORING BREAKDOWN (Max 100 Points):
 * - Specialty match: up to 30 points
 * - Required facilities: up to 25 points
 * - Budget compatibility: up to 20 points
 * - Distance score: up to 15 points
 * - Emergency requirement: up to 5 points
 * - Data quality / verification: up to 5 points
 * 
 * CORE PRINCIPLE: RELEVANCE BEFORE DISTANCE
 * A hospital 4 km away with requested specialty and facility will score
 * significantly higher than a nearby hospital (1.5 km) without the required care.
 * 
 * TRANSPARENCY NOTICE:
 * The score strictly quantifies alignment with user-specified preferences.
 * It does NOT measure clinical quality, medical superiority, or cure rates.
 */

import { calculateHaversineDistance } from './locationService.js';
import { normalizeCondition } from './aiService.js';
import { matchCondition, matchProcedure } from '../data/conditionCatalogue.js';
import { resolveNationalCategory } from '../data/nationalHospitalReferences.js';

// Common synonyms and condition-to-specialty mappings
const CONDITION_SPECIALTY_MAP = {
  kidney: ['nephrology', 'urology', 'dialysis'],
  renal: ['nephrology', 'dialysis'],
  heart: ['cardiology', 'cardiac surgery'],
  cardiac: ['cardiology', 'cardiac surgery'],
  cardiovascular: ['cardiology', 'cardiac surgery'],
  angioplasty: ['cardiology', 'cardiac surgery'],
  bypass: ['cardiac surgery', 'cardiology'],
  cancer: ['oncology', 'surgical oncology', 'radiation oncology'],
  tumor: ['oncology', 'surgical oncology'],
  chemotherapy: ['oncology'],
  brain: ['neurology', 'neurosurgery'],
  neuro: ['neurology', 'neurosurgery'],
  stroke: ['neurology', 'critical care', 'emergency & trauma'],
  bone: ['orthopedics', 'joint replacement'],
  fracture: ['orthopedics', 'emergency & trauma'],
  joint: ['orthopedics', 'joint replacement'],
  knee: ['orthopedics', 'joint replacement'],
  child: ['pediatrics', 'pediatric intensive care'],
  baby: ['pediatrics', 'neonatal intensive care'],
  pediatric: ['pediatrics'],
  maternity: ['obstetrics & gynecology', 'obstetrics_gynecology'],
  delivery: ['obstetrics & gynecology', 'obstetrics_gynecology'],
  pregnancy: ['obstetrics & gynecology', 'obstetrics_gynecology'],
  liver: ['gastroenterology', 'hepatology', 'liver transplant'],
  stomach: ['gastroenterology'],
  digestive: ['gastroenterology'],
  eye: ['ophthalmology'],
  ent: ['ent', 'ear, nose & throat'],
  lung: ['pulmonology', 'respiratory medicine'],
  chest: ['pulmonology'],
  trauma: ['emergency & trauma', 'critical care'],
  emergency: ['emergency & trauma', 'critical care']
};

/**
 * Check whether a hospital matches a requested condition or specialty.
 * 
 * @param {Object} hospital 
 * @param {string} condition 
 * @returns {boolean}
 */
export function matchesCondition(hospital, condition) {
  if (!condition || condition === 'all') return true;
  const norm = normalizeCondition(condition);
  const specs = (hospital.specialties || []).map(s => s.toLowerCase());

  // Check direct specialty match
  if (specs.some(s => s.includes(norm.condition) || norm.condition.includes(s) || (norm.specialty && s.includes(norm.specialty)))) {
    return true;
  }

  // Check centralized catalogue condition match (e.g. alzheimers, parkinsons, liver_failure)
  const catCond = matchCondition(condition) || matchCondition(norm.condition);
  if (catCond && Array.isArray(catCond.relatedSpecialties) && catCond.relatedSpecialties.length > 0) {
    if (catCond.relatedSpecialties.some(rs => specs.some(s => s.includes(rs.toLowerCase()) || rs.toLowerCase().includes(s)))) {
      return true;
    }
  }

  // Check normalized condition relatedSpecialties
  if (Array.isArray(norm.relatedSpecialties) && norm.relatedSpecialties.length > 0) {
    if (norm.relatedSpecialties.some(rs => specs.some(s => s.includes(rs.toLowerCase()) || rs.toLowerCase().includes(s)))) {
      return true;
    }
  }

  // Check mapped conditions
  const mapped = CONDITION_SPECIALTY_MAP[norm.condition] || [];
  if (mapped.some(m => specs.some(s => s.includes(m)))) {
    return true;
  }

  // Check procedure cost key match (e.g. cardiacCare)
  if (norm.costKey && hospital.estimatedCosts && hospital.estimatedCosts[norm.costKey]) {
    return true;
  }

  // Raw query fallback check
  const rawLower = String(condition).toLowerCase();
  for (const [key, mappedSpecs] of Object.entries(CONDITION_SPECIALTY_MAP)) {
    if (rawLower.includes(key)) {
      if (mappedSpecs.some(ms => specs.some(s => s.includes(ms)))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check whether a hospital's treatment costs are compatible with a user's stated maximum budget.
 * Strictly uses the actual hospital treatment-cost structure with NO arbitrary tolerance.
 * 
 * @param {Object} hospital 
 * @param {number|null} budgetMax 
 * @param {string} condition 
 * @returns {boolean}
 */
export function matchesBudget(hospital, budgetMax, condition = '', facilities = []) {
  if (budgetMax == null || budgetMax === '' || budgetMax <= 0) return true;
  const budgetNum = Number(budgetMax);
  if (isNaN(budgetNum) || budgetNum <= 0) return true;

  const norm = normalizeCondition(condition);

  // If specific condition was requested, compare the relevant procedure cost
  if (norm.costKey && hospital.estimatedCosts && hospital.estimatedCosts[norm.costKey]) {
    const costObj = hospital.estimatedCosts[norm.costKey];
    if (costObj && typeof costObj.min === 'number') {
      // Must be compatible: baseline procedure cost <= stated budget
      return costObj.min <= budgetNum;
    }
  }

  // If dialysis is in required facilities:
  if ((facilities || []).includes('dialysis')) {
    if (hospital.estimatedCosts) {
      if ('dialysis' in hospital.estimatedCosts) {
        if (hospital.estimatedCosts.dialysis && typeof hospital.estimatedCosts.dialysis.min === 'number') {
          return hospital.estimatedCosts.dialysis.min <= budgetNum;
        }
        // Explicitly null or unverified cost cannot claim to satisfy strict budget
        return false;
      }
      // Legacy fallback: if dialysis key is undefined, check kidneyTreatment if no conflicting condition
      if ((!condition || condition === 'all') && hospital.estimatedCosts.kidneyTreatment) {
        const kidneyCost = hospital.estimatedCosts.kidneyTreatment;
        if (kidneyCost && typeof kidneyCost.min === 'number') {
          return kidneyCost.min <= budgetNum;
        }
      }
    }
    return false;
  }

  // General check across all available estimated costs
  const allMins = Object.values(hospital.estimatedCosts || {})
    .filter(c => c && typeof c === 'object')
    .map(c => c.min)
    .filter(v => typeof v === 'number');

  if (allMins.length > 0) {
    return Math.min(...allMins) <= budgetNum;
  }

  // If cost data is entirely unavailable, do not satisfy strict budget
  return false;
}

/**
 * Check whether a hospital has recorded, valid cost data for the user's specific requirement.
 * Used to isolate hospitals with unrecorded costs into "Relevant Options — Cost Data Not Available".
 * 
 * @param {Object} hospital 
 * @param {string} condition 
 * @param {Array} facilities 
 * @returns {boolean}
 */
export function hasKnownRelevantCost(hospital, condition = '', facilities = []) {
  if (!hospital || !hospital.estimatedCosts) return false;

  const norm = normalizeCondition(condition);

  // If specific condition was requested and has a costKey
  if (norm.costKey && hospital.estimatedCosts[norm.costKey]) {
    const costObj = hospital.estimatedCosts[norm.costKey];
    return costObj && typeof costObj.min === 'number' && costObj.min > 0;
  }

  // If dialysis is in required facilities:
  if ((facilities || []).includes('dialysis')) {
    if ('dialysis' in hospital.estimatedCosts) {
      const dialCost = hospital.estimatedCosts.dialysis;
      return dialCost && typeof dialCost.min === 'number' && dialCost.min > 0;
    }
    if ((!condition || condition === 'all') && hospital.estimatedCosts.kidneyTreatment) {
      const kCost = hospital.estimatedCosts.kidneyTreatment;
      return kCost && typeof kCost.min === 'number' && kCost.min > 0;
    }
    return false;
  }

  // If condition is specified and not 'all', but hospital lacks costKey:
  if (condition && condition !== 'all') {
    return false;
  }

  // General check across all available estimated costs
  const allMins = Object.values(hospital.estimatedCosts || {})
    .filter(c => c && typeof c === 'object')
    .map(c => c.min)
    .filter(v => typeof v === 'number' && v > 0);

  return allMins.length > 0;
}

/**
 * Universal dynamic budget resolver.
 * Priority hierarchy:
 * 1. Procedure-specific cost (e.g. kidney_transplant, angioplasty, craniotomy)
 * 2. Condition-specific cost (e.g. kidneyTreatment, cardiacCare, brainSurgery)
 * 3. Fallback: null ("💰 Estimated Budget: Data not available")
 * 
 * Rules:
 * - Same hospital produces different estimated budgets for different conditions.
 * - Missing cost data honestly returns null (never ₹0, never fabricated prices).
 * - Procedure-specific cost takes precedence over broad condition cost.
 * 
 * @param {Object} hospital
 * @param {Object} [context={}]
 * @param {string} [context.condition='']
 * @param {string} [context.procedure='']
 * @param {string} [context.query='']
 * @returns {{ type: string, cost: Object|null, label: string|null, formattedDisplay: string, procedureName?: string }}
 */
export function resolveHospitalBudget(hospital, { condition = '', procedure = '', query = '' } = {}) {
  if (!hospital) {
    return { type: 'unavailable', isAvailable: false, isProcedureSpecific: false, cost: null, label: null, formattedDisplay: '💰 Estimated Budget: Data not available' };
  }

  // 1. Identify procedure
  let matchedProc = null;
  if (procedure) {
    matchedProc = matchProcedure(procedure) || { id: procedure, name: procedure };
  } else if (query) {
    matchedProc = matchProcedure(query);
  } else if (condition) {
    matchedProc = matchProcedure(condition);
  }

  // 2. Check procedure-specific cost first
  if (matchedProc) {
    const procId = matchedProc.id;
    if (hospital.procedureCosts && hospital.procedureCosts[procId]) {
      const pCost = hospital.procedureCosts[procId];
      if (pCost && pCost.label) {
        return {
          type: 'procedure',
          isAvailable: true,
          isProcedureSpecific: true,
          cost: pCost,
          label: pCost.label,
          procedureName: matchedProc.name || procId,
          formattedDisplay: `💰 Estimated Budget: ${pCost.label}`
        };
      }
    }
  }

  // 3. Resolve condition costKey
  let costKey = null;
  const nationalCat = resolveNationalCategory(condition, procedure, query);
  
  const CATEGORY_TO_COST_KEY = {
    kidney: 'kidneyTreatment',
    heart: 'cardiacCare',
    cancer: 'cancerCare',
    brain_surgery: 'brainSurgery',
    orthopedics: 'orthopedicCare',
    eye: 'eyeCare',
    dental: 'dentalCare',
    maternity: 'maternityCare',
    emergency: 'emergencyTrauma'
  };

  if (nationalCat && CATEGORY_TO_COST_KEY[nationalCat]) {
    costKey = CATEGORY_TO_COST_KEY[nationalCat];
  } else {
    const norm = normalizeCondition(condition || query);
    costKey = norm.costKey || null;
    if (!costKey && norm.condition && CATEGORY_TO_COST_KEY[norm.condition]) {
      costKey = CATEGORY_TO_COST_KEY[norm.condition];
    }
  }

  // Check hospital.estimatedCosts for costKey
  if (costKey && hospital.estimatedCosts && hospital.estimatedCosts[costKey]) {
    const cCost = hospital.estimatedCosts[costKey];
    if (cCost && cCost.label) {
      return {
        type: 'condition',
        isAvailable: true,
        isProcedureSpecific: false,
        costKey,
        cost: cCost,
        label: cCost.label,
        formattedDisplay: `💰 Estimated Budget: ${cCost.label}`
      };
    }
  }

  // Check direct condition key in estimatedCosts
  if (condition && hospital.estimatedCosts && hospital.estimatedCosts[condition]) {
    const directCost = hospital.estimatedCosts[condition];
    if (directCost && directCost.label) {
      return {
        type: 'condition',
        isAvailable: true,
        isProcedureSpecific: false,
        costKey: condition,
        cost: directCost,
        label: directCost.label,
        formattedDisplay: `💰 Estimated Budget: ${directCost.label}`
      };
    }
  }

  // If no cost data for this condition/procedure:
  return {
    type: 'unavailable',
    isAvailable: false,
    isProcedureSpecific: false,
    cost: null,
    label: null,
    formattedDisplay: '💰 Estimated Budget: Data not available'
  };
}

/**
 * Extract condition-relevant performance data from hospital record.
 * Strictly guarantees that non-relevant condition metrics (e.g. cardiac metrics for a kidney query)
 * are NEVER returned.
 */
export function getConditionPerformanceData(hospital, condition) {
  if (!hospital || !condition || condition === 'all') {
    return null;
  }
  const norm = normalizeCondition(condition);
  const condKey = norm.condition; // e.g. "kidney", "heart", "cancer", "orthopedics"

  // 1. Check conditionPerformance array (Phase 4.3 Schema)
  if (Array.isArray(hospital.conditionPerformance) && hospital.conditionPerformance.length > 0) {
    const matchingMetrics = hospital.conditionPerformance.filter(m => {
      if (!m) return false;
      const mCond = (m.conditionId || '').toLowerCase().replace(/_/g, ' ');
      const normCond = (norm.condition || '').toLowerCase().replace(/_/g, ' ');
      const normLabel = (norm.conditionLabel || '').toLowerCase();
      const rawCondition = String(condition).toLowerCase();
      return (
        mCond === normCond ||
        mCond.includes(normCond) ||
        normCond.includes(mCond) ||
        normLabel.includes(mCond) ||
        rawCondition.includes(mCond)
      );
    });

    if (matchingMetrics.length > 0) {
      return {
        conditionId: condKey,
        conditionLabel: norm.conditionLabel || condKey,
        metrics: matchingMetrics
      };
    }
  }

  // 2. Legacy fallback: hospital.performanceData object
  if (hospital.performanceData && condKey && hospital.performanceData[condKey]) {
    const data = hospital.performanceData[condKey];
    if (data && Array.isArray(data.metrics) && data.metrics.length > 0) {
      return data;
    }
  }
  return null;
}

export const recommendationService = {
  matchesCondition,
  matchesBudget,
  hasKnownRelevantCost,
  getConditionPerformanceData,

  /**
   * Evaluates criteria match and generates reasons for a single hospital.
   * 
   * @param {Object} hospital - Hospital record
   * @param {Object} requirements - User criteria
   * @param {number|null} userLat - User latitude
   * @param {number|null} userLng - User longitude
   * @returns {Object} { matchScore, matchTier, whyThisResult, distanceKm, conditionPerformanceData }
   */
  evaluateHospital(hospital, requirements = {}, userLat = null, userLng = null) {
    const {
      condition = '',
      specialty = 'all',
      facilities = [],
      budget = null,
      emergencyOnly = false
    } = requirements;

    let specialtyScore = 0;
    let facilityScore = 0;
    let budgetScore = 0;
    let distanceScore = 0;
    let emergencyScore = 0;
    let verificationScore = 0;

    const reasons = [];

    // 1. DYNAMIC DISTANCE CALCULATION
    let distanceKm = hospital.distance;
    if (userLat != null && userLng != null && hospital.location?.latitude && hospital.location?.longitude) {
      const calculated = calculateHaversineDistance(
        userLat,
        userLng,
        hospital.location.latitude,
        hospital.location.longitude
      );
      if (calculated !== null) {
        distanceKm = calculated;
      }
    }

    // 2. SPECIALTY & CONDITION MATCH (Max 30 pts)
    const targetCondition = condition || (specialty !== 'all' ? specialty : '');
    const isCondMatch = matchesCondition(hospital, targetCondition);

    if (targetCondition && targetCondition.trim() !== '') {
      if (isCondMatch) {
        specialtyScore = 30;
        const norm = normalizeCondition(targetCondition);
        reasons.push(`Specialty match: Dedicated department available for ${norm.conditionLabel || targetCondition}`);
      } else {
        specialtyScore = 0;
        reasons.push(`Does not offer specialized care for ${targetCondition}`);
      }
    } else {
      // Baseline multidisciplinary care available
      specialtyScore = 20;
      reasons.push("Multidisciplinary medical specialties available");
    }

    // 3. REQUIRED FACILITIES MATCH (Max 25 pts)
    const hospFacilities = hospital.facilities || [];
    if (facilities && facilities.length > 0) {
      const matchedFacs = facilities.filter(f => hospFacilities.includes(f));
      const matchRatio = matchedFacs.length / facilities.length;
      facilityScore = Math.round(matchRatio * 25);

      if (matchRatio === 1) {
        reasons.push(`All ${facilities.length} requested facilities available on-site`);
      } else if (matchedFacs.length > 0) {
        reasons.push(`Matches ${matchedFacs.length} of ${facilities.length} requested facilities`);
      } else {
        reasons.push("Does not list your specific requested facilities");
      }
    } else {
      // General infrastructure scoring
      const hasCriticalCare = hospFacilities.includes('icu') || hospFacilities.includes('emergency_24x7');
      const hasDiagnostics = hospFacilities.includes('mri') || hospFacilities.includes('ct_scan');
      if (hasCriticalCare && hasDiagnostics) {
        facilityScore = 20;
        reasons.push("Equipped with advanced diagnostics and critical care unit");
      } else {
        facilityScore = 15;
        reasons.push("Equipped with standard clinical care facilities");
      }
    }

    // 4. BUDGET COMPATIBILITY (Max 20 pts)
    if (budget && Number(budget) > 0) {
      const budgetNum = Number(budget);
      const norm = normalizeCondition(targetCondition);
      const specificCost = norm.costKey && hospital.estimatedCosts ? hospital.estimatedCosts[norm.costKey] : null;

      if (specificCost && typeof specificCost.min === 'number') {
        if (specificCost.min <= budgetNum) {
          budgetScore = 20;
          reasons.push(`Estimated ${norm.conditionLabel || 'procedure'} cost (from ₹${specificCost.min.toLocaleString('en-IN')}) fits within your budget (₹${budgetNum.toLocaleString('en-IN')})`);
        } else {
          budgetScore = 0;
          reasons.push(`Estimated procedure cost (from ₹${specificCost.min.toLocaleString('en-IN')}) exceeds your stated budget (₹${budgetNum.toLocaleString('en-IN')})`);
        }
      } else if ((!targetCondition || targetCondition === 'all') && (facilities || []).includes('dialysis')) {
        let dialysisCost = null;
        if (hospital.estimatedCosts) {
          if ('dialysis' in hospital.estimatedCosts && hospital.estimatedCosts.dialysis) {
            dialysisCost = hospital.estimatedCosts.dialysis;
          } else if (hospital.estimatedCosts.kidneyTreatment) {
            dialysisCost = hospital.estimatedCosts.kidneyTreatment;
          }
        }
        if (dialysisCost && typeof dialysisCost.min === 'number') {
          if (dialysisCost.min <= budgetNum) {
            budgetScore = 20;
            reasons.push(`Estimated dialysis / kidney treatment cost (from ₹${dialysisCost.min.toLocaleString('en-IN')}) fits within your budget (₹${budgetNum.toLocaleString('en-IN')})`);
          } else {
            budgetScore = 0;
            reasons.push(`Estimated dialysis / kidney treatment cost (from ₹${dialysisCost.min.toLocaleString('en-IN')}) exceeds your stated budget (₹${budgetNum.toLocaleString('en-IN')})`);
          }
        } else {
          budgetScore = 0;
          reasons.push("Cost unavailable for dialysis");
        }
      } else {
        const hospitalCostValues = Object.values(hospital.estimatedCosts || {})
          .filter(c => c && typeof c === 'object' && typeof c.min === 'number')
          .map(c => c.min);
        if (hospitalCostValues.length > 0) {
          const minHospitalCost = Math.min(...hospitalCostValues);
          if (minHospitalCost <= budgetNum) {
            budgetScore = 20;
            reasons.push(`Baseline treatment costs (from ₹${minHospitalCost.toLocaleString('en-IN')}) fit within your budget (₹${budgetNum.toLocaleString('en-IN')})`);
          } else {
            budgetScore = 0;
            reasons.push(`Estimated hospital treatment costs exceed your budget preference`);
          }
        } else {
          budgetScore = 5;
          reasons.push("Cost unavailable for this specific procedure");
        }
      }
    } else {
      budgetScore = 15;
      reasons.push("Transparent published cost estimates available");
    }

    // 5. DISTANCE SCORE (Max 15 pts)
    if (distanceKm != null) {
      if (distanceKm <= 5) {
        distanceScore = 15;
        reasons.push(`Within immediate proximity (${distanceKm} km from you)`);
      } else if (distanceKm <= 10) {
        distanceScore = 12;
        reasons.push(`Nearby location (${distanceKm} km from you)`);
      } else if (distanceKm <= 25) {
        distanceScore = 8;
        reasons.push(`Accessible distance (${distanceKm} km from you)`);
      } else if (distanceKm <= 50) {
        distanceScore = 4;
        reasons.push(`Located in wider region (${distanceKm} km away)`);
      } else {
        distanceScore = 1;
        reasons.push(`Regional center (${distanceKm} km away)`);
      }
    } else {
      distanceScore = 8;
      reasons.push("Location distance: Information unavailable");
    }

    // 6. EMERGENCY REQUIREMENT (Max 5 pts)
    if (emergencyOnly) {
      if (hospital.emergency24x7) {
        emergencyScore = 5;
        reasons.push("24x7 Emergency and acute trauma unit active");
      } else {
        emergencyScore = 0;
      }
    } else {
      if (hospital.emergency24x7) {
        emergencyScore = 5;
        reasons.push("24x7 Emergency coverage available");
      } else {
        emergencyScore = 2;
      }
    }

    // 7. VERIFIED EVIDENCE & DATA AUDIT (Max 5 pts)
    const nabhAffiliation = (hospital.organisationAffiliations || []).find(a => a.organisation === 'NABH' && a.status === 'verified');
    const pmndpAffiliation = (hospital.organisationAffiliations || []).find(a => a.organisation === 'PMNDP' && a.status === 'verified');
    const perfData = getConditionPerformanceData(hospital, targetCondition);

    if (hospital.verification?.status === 'verified' || nabhAffiliation || pmndpAffiliation) {
      verificationScore = 5;
      if (nabhAffiliation) {
        reasons.push("NABH affiliation verified against official registry");
      }
      if (pmndpAffiliation && (facilities || []).includes('dialysis')) {
        reasons.push("PMNDP government dialysis programme participation verified");
      }
      if (hospital.verification?.status === 'verified' && !nabhAffiliation) {
        reasons.push("Verified hospital record (Direct institutional audit)");
      }
    } else if (hospital.verification?.status === 'sample_data') {
      verificationScore = 3;
      reasons.push("Sample demonstration record (System benchmark)");
    } else {
      verificationScore = 2;
      reasons.push("Public record — verification audit in progress");
    }

    if (perfData && perfData.metrics?.length > 0) {
      const metricSummaries = perfData.metrics
        .filter(m => m && m.value != null)
        .map(m => `${m.label || m.metricName}: ${m.value.toLocaleString('en-IN')}`);
      if (metricSummaries.length > 0) {
        reasons.push(`Verified ${perfData.conditionLabel || 'condition'} performance data available (${metricSummaries.join(', ')})`);
      } else {
        reasons.push(`Verified ${perfData.conditionLabel || 'condition'} clinical log registered`);
      }
    }

    // TOTAL MATCH SCORE (Strictly capped between 0 and 98 to avoid claiming 100% perfection)
    const rawTotal = specialtyScore + facilityScore + budgetScore + distanceScore + emergencyScore + verificationScore;
    const matchScore = Math.min(Math.max(rawTotal, 10), 98);

    // MATCH TIER LABELING (Non-diagnostic, strictly neutral)
    let matchTier = 'Basic Option';
    if (matchScore >= 80) {
      matchTier = 'Strong Match';
    } else if (matchScore >= 60) {
      matchTier = 'Good Match';
    } else {
      matchTier = 'Alternative';
    }

    // LAYER 2: CONDITION-SPECIFIC VERIFIED EVIDENCE TIER
    // Neutral evidence classifications (Strictly NO superlatives: "Best", "Winner", "#1" banned)
    let evidenceTier = null;
    if (perfData && Array.isArray(perfData.metrics) && perfData.metrics.length > 0) {
      const hasVerifiedMetric = perfData.metrics.some(m => m && m.verificationStatus === 'verified' && m.value != null);
      if (hasVerifiedMetric) {
        evidenceTier = 'Verified Outcome Data Available';
      } else {
        evidenceTier = 'Relevant Condition-Specific Evidence';
      }
    } else if (matchScore >= 80) {
      evidenceTier = 'Strong Requirement Match';
    }

    return {
      matchScore,
      matchTier,
      evidenceTier,
      whyThisResult: reasons,
      distanceKm,
      isConditionMatch: isCondMatch,
      conditionPerformanceData: perfData,
      breakdown: {
        specialtyScore,
        facilityScore,
        budgetScore,
        distanceScore,
        emergencyScore,
        verificationScore
      }
    };
  },

  /**
   * Scores, ranks, and annotates an array of hospitals against user requirements.
   * Enforces RELEVANCE BEFORE DISTANCE.
   */
  rankHospitals(hospitals, requirements = {}, userLat = null, userLng = null) {
    if (!Array.isArray(hospitals)) return [];

    const evaluated = hospitals.map(hospital => {
      const evaluation = this.evaluateHospital(hospital, requirements, userLat, userLng);
      return {
        ...hospital,
        distance: evaluation.distanceKm,
        matchScore: evaluation.matchScore,
        matchTier: evaluation.matchTier,
        evidenceTier: evaluation.evidenceTier,
        whyThisResult: evaluation.whyThisResult,
        isConditionMatch: evaluation.isConditionMatch,
        conditionPerformanceData: evaluation.conditionPerformanceData,
        scoreBreakdown: evaluation.breakdown
      };
    });

    // Primary sort: matchScore descending.
    // Secondary sort: relevant verified performance data availability (tie-break).
    // Tertiary sort: distance ascending.
    return evaluated.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      const aHasPerf = !!a.conditionPerformanceData;
      const bHasPerf = !!b.conditionPerformanceData;
      if (bHasPerf !== aHasPerf) {
        return bHasPerf ? 1 : -1;
      }
      return (a.distance || 999) - (b.distance || 999);
    });
  }
};

/**
 * Pure, deterministic hospital sorting function.
 * Creates and returns a sorted copy of the hospitals array without mutating the input.
 * 
 * Supported sort options:
 * - 'highest_rating': Rating descending (4.9 -> 4.8 -> 4.5), tie-broken by reviewCount descending.
 * - 'nearest': Numeric distance ascending (3.2 km -> 8.5 km). Unavailable distances placed last.
 * - 'lowest_cost': Relevant disease/procedure-specific estimated budget min ascending. Unavailable costs placed last.
 * - 'recommended': Curated reference rank (1..5) for national references, or matchScore descending for local matches.
 * 
 * @param {Array<Object>} hospitals - Array of hospital objects to sort
 * @param {string} [sortOption='highest_rating'] - Selected sort key
 * @param {Object} [context={}] - Context containing { condition, procedure, query }
 * @returns {Array<Object>} Sorted copy of hospitals
 */
export function sortHospitals(hospitals, sortOption = 'highest_rating', context = {}) {
  if (!Array.isArray(hospitals)) return [];
  if (hospitals.length <= 1) return [...hospitals];

  // PROTECTED NATIONAL REFERENCE GUARD:
  // A curated National Reference result list is ALWAYS ordered referenceRank ASC,
  // regardless of the requested sort option. Rating, distance, budget, outcome rate,
  // and recommendation score must NEVER reorder a protected national reference list.
  // Normal (non-reference) hospital results are unaffected and honor the requested sort.
  const isProtectedNationalList = hospitals.every(h => h && h.isNationalReference && h.referenceRank);
  if (isProtectedNationalList) {
    return [...hospitals].sort((a, b) => a.referenceRank - b.referenceRank);
  }

  const { condition = '', procedure = '', query = '' } = context;

  // Decorate with original index to ensure 100% stable sorting on ties
  const indexed = hospitals.map((h, i) => ({ hospital: h, originalIndex: i }));

  indexed.sort((aItem, bItem) => {
    const a = aItem.hospital;
    const b = bItem.hospital;

    if (sortOption === 'highest_rating') {
      const aRating = (a.rating !== null && a.rating !== undefined && Number.isFinite(Number(a.rating)))
        ? Number(a.rating)
        : 0;
      const bRating = (b.rating !== null && b.rating !== undefined && Number.isFinite(Number(b.rating)))
        ? Number(b.rating)
        : 0;

      if (bRating !== aRating) {
        return bRating - aRating; // Highest rating first
      }

      // Tie-breaker 1: Review count descending
      const aReviews = Number(a.reviewCount) || 0;
      const bReviews = Number(b.reviewCount) || 0;
      if (bReviews !== aReviews) {
        return bReviews - aReviews;
      }

      // Tie-breaker 2: Stable original index
      return aItem.originalIndex - bItem.originalIndex;
    }

    if (sortOption === 'nearest') {
      const aHasDist = a.distance !== null && a.distance !== undefined && Number.isFinite(Number(a.distance));
      const bHasDist = b.distance !== null && b.distance !== undefined && Number.isFinite(Number(b.distance));

      // Unavailable distances placed after hospitals with known distances
      if (aHasDist && !bHasDist) return -1;
      if (!aHasDist && bHasDist) return 1;
      if (!aHasDist && !bHasDist) {
        return aItem.originalIndex - bItem.originalIndex;
      }

      const aDist = Number(a.distance);
      const bDist = Number(b.distance);
      if (aDist !== bDist) {
        return aDist - bDist; // Nearest first
      }

      // Tie-breaker: Rating descending
      const aRating = Number(a.rating) || 0;
      const bRating = Number(b.rating) || 0;
      if (bRating !== aRating) {
        return bRating - aRating;
      }

      return aItem.originalIndex - bItem.originalIndex;
    }

    if (sortOption === 'lowest_cost') {
      const budgetA = resolveHospitalBudget(a, { condition, procedure, query });
      const budgetB = resolveHospitalBudget(b, { condition, procedure, query });

      const aHasCost = !!(budgetA && budgetA.isAvailable && budgetA.cost && Number.isFinite(Number(budgetA.cost.min)));
      const bHasCost = !!(budgetB && budgetB.isAvailable && budgetB.cost && Number.isFinite(Number(budgetB.cost.min)));

      // Unavailable costs placed after hospitals with known costs (never treated as 0)
      if (aHasCost && !bHasCost) return -1;
      if (!aHasCost && bHasCost) return 1;
      if (!aHasCost && !bHasCost) {
        return aItem.originalIndex - bItem.originalIndex;
      }

      const aMin = Number(budgetA.cost.min);
      const bMin = Number(budgetB.cost.min);
      if (aMin !== bMin) {
        return aMin - bMin; // Lowest cost first
      }

      // Tie-breaker 1: Distance ascending
      const aDist = (a.distance !== null && a.distance !== undefined && Number.isFinite(Number(a.distance))) ? Number(a.distance) : 9999;
      const bDist = (b.distance !== null && b.distance !== undefined && Number.isFinite(Number(b.distance))) ? Number(b.distance) : 9999;
      if (aDist !== bDist) {
        return aDist - bDist;
      }

      return aItem.originalIndex - bItem.originalIndex;
    }

    if (sortOption === 'recommended') {
      // If national reference benchmarks are being compared
      const aRank = a.referenceRank || a.nationalRefRank;
      const bRank = b.referenceRank || b.nationalRefRank;
      if (aRank && bRank && aRank !== bRank) {
        return aRank - bRank; // Deterministic #1 to #5
      }

      // Otherwise local multi-factor match score
      const aScore = a.matchScore !== undefined ? a.matchScore : 80;
      const bScore = b.matchScore !== undefined ? b.matchScore : 80;
      if (bScore !== aScore) {
        return bScore - aScore;
      }

      const aDist = (a.distance !== null && a.distance !== undefined && Number.isFinite(Number(a.distance))) ? Number(a.distance) : 9999;
      const bDist = (b.distance !== null && b.distance !== undefined && Number.isFinite(Number(b.distance))) ? Number(b.distance) : 9999;
      if (aDist !== bDist) {
        return aDist - bDist;
      }

      return aItem.originalIndex - bItem.originalIndex;
    }

    return aItem.originalIndex - bItem.originalIndex;
  });

  return indexed.map(item => item.hospital);
}

recommendationService.sortHospitals = sortHospitals;

