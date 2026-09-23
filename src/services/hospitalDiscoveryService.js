/**
 * Sehat_Sathi - Hospital Discovery Service
 * 
 * Provider abstraction layer for geolocation-based hospital discovery.
 * Decouples the UI from the underlying data source or map engine, allowing
 * seamless future transition to FastAPI endpoints, PostgreSQL/PostGIS,
 * and external Map providers.
 * 
 * CORE FEATURES:
 * 1. Dynamic Haversine distance resolution from live coordinates.
 * 2. Progressive radius expansion (5 km -> 10 km -> 25 km -> 50 km).
 * 3. Suitability enforcement: primary results strictly satisfy user requirements.
 * 4. Separate section for other nearby hospitals that do not meet all requirements.
 */

import { HOSPITALS } from '../data/hospitals.js';
import { calculateHaversineDistance, calculateDistance, resolveLocation } from './locationService.js';
import { recommendationService, matchesCondition, matchesBudget, hasKnownRelevantCost } from './recommendationService.js';
import { 
  resolveNationalCategory, 
  getNationalReferenceHospitals, 
  NATIONAL_HOSPITAL_REFERENCES 
} from '../data/nationalHospitalReferences.js';

// Progressive radius ladder in kilometers
export const RADIUS_STEPS = [5, 10, 25, 50];

// Configurable minimum suitable results threshold before expanding radius
export let MIN_SUITABLE_RESULTS = 5;

export function setMinSuitableResults(val) {
  if (typeof val === 'number' && val > 0) {
    MIN_SUITABLE_RESULTS = val;
  }
}

// Simulated network delay to ensure async contract compliance
const delay = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check whether a hospital strictly satisfies the user's explicit requirements.
 * 
 * @param {Object} hospital 
 * @param {Object} requirements 
 * @returns {boolean}
 */
export function isHospitalSuitable(hospital, requirements = {}) {
  const { condition, specialty, facilities = [], budget, emergencyOnly = false } = requirements;

  // 1. Condition & Specialty Match
  const targetCondition = condition || (specialty && specialty !== 'all' ? specialty : '');
  if (targetCondition && targetCondition.trim() !== '') {
    if (!matchesCondition(hospital, targetCondition)) {
      return false;
    }
  }

  // 2. Required Facilities (Strictly all requested facilities must be present)
  if (facilities && facilities.length > 0) {
    const hospFacilities = hospital.facilities || [];
    const hasAll = facilities.every(f => hospFacilities.includes(f));
    if (!hasAll) return false;
  }

  // 3. Budget Compatibility (Strictly no tolerance multiplier)
  if (budget && Number(budget) > 0) {
    if (!matchesBudget(hospital, Number(budget), targetCondition, facilities)) {
      return false;
    }
  }

  // 4. Emergency Requirement
  if (emergencyOnly && !hospital.emergency24x7) {
    return false;
  }

  return true;
}

/**
 * Perform progressive radius search across hospitals.
 * Ladder: 5 km -> 10 km -> 25 km -> 50 km.
 * 
 * @param {Array} hospitals - List of hospitals with distances calculated
 * @param {Object} requirements - Search requirements
 * @param {number|string} [initialRadius=5] - Preferred initial radius
 * @returns {{ matchingHospitals: Array, otherNearbyHospitals: Array, activeRadius: number, wasExpanded: boolean, expansionMessage: string }}
 */
export function progressiveRadiusSearch(hospitals, requirements = {}, initialRadius = 5) {
  const isAuto = !requirements.radius || requirements.radius === 'auto' || requirements.radiusMode === 'auto' || initialRadius === 'auto';
  let activeRadius = isAuto ? 5 : Number(requirements.radius || initialRadius);
  let wasExpanded = false;

  // Evaluate suitability for every hospital
  const suitableHospitals = hospitals.filter(h => isHospitalSuitable(h, requirements));

  const at5 = suitableHospitals.filter(h => (h.distance != null ? h.distance : 999) <= 5);
  const at10 = suitableHospitals.filter(h => (h.distance != null ? h.distance : 999) <= 10);
  const at25 = suitableHospitals.filter(h => (h.distance != null ? h.distance : 999) <= 25);
  const at50 = suitableHospitals.filter(h => (h.distance != null ? h.distance : 999) <= 50);

  console.log('[RADIUS 5 KM]', at5.length);
  console.log('[RADIUS 10 KM]', at10.length);
  console.log('[RADIUS 25 KM]', at25.length);
  console.log('[RADIUS 50 KM]', at50.length);

  if (isAuto) {
    // 1. Check 5 km
    if (at5.length >= MIN_SUITABLE_RESULTS) {
      activeRadius = 5;
    } else if (at10.length >= MIN_SUITABLE_RESULTS) {
      activeRadius = 10;
      wasExpanded = true;
    } else if (at25.length >= MIN_SUITABLE_RESULTS) {
      activeRadius = 25;
      wasExpanded = true;
    } else {
      activeRadius = 50;
      wasExpanded = true;
    }
  }

  // Primary matches: strictly suitable hospitals within the active radius
  const matchingHospitals = suitableHospitals.filter(h => (h.distance != null ? h.distance : 999) <= activeRadius);

  // Other nearby hospitals: hospitals within active radius that do NOT match all selected requirements
  const otherNearbyHospitals = hospitals.filter(h =>
    (h.distance != null ? h.distance : 999) <= activeRadius && !isHospitalSuitable(h, requirements)
  );

  // Cost unavailable: hospitals that match medical condition and facilities, but have unrecorded cost data
  let costUnavailableHospitals = [];
  if (requirements.budget && Number(requirements.budget) > 0) {
    const targetCondition = requirements.condition || (requirements.specialty && requirements.specialty !== 'all' ? requirements.specialty : '');
    costUnavailableHospitals = hospitals.filter(h => {
      const d = h.distance != null ? h.distance : 999;
      if (d > activeRadius) return false;
      if (targetCondition && !matchesCondition(h, targetCondition)) return false;
      if (requirements.facilities && requirements.facilities.length > 0) {
        const hFacs = h.facilities || [];
        if (!requirements.facilities.every(f => hFacs.includes(f))) return false;
      }
      if (requirements.emergencyOnly && !h.emergency24x7) return false;
      return !hasKnownRelevantCost(h, targetCondition, requirements.facilities);
    });
    console.log('[COST UNAVAILABLE]', costUnavailableHospitals.length);
  }

  let expansionMessage = '';
  if (wasExpanded && matchingHospitals.length > 0) {
    expansionMessage = `Search expanded to ${activeRadius} km to find suitable hospitals matching your criteria.`;
  } else {
    expansionMessage = `Showing suitable hospitals within ${activeRadius} km of your location.`;
  }

  return {
    matchingHospitals,
    costUnavailableHospitals,
    otherNearbyHospitals,
    activeRadius,
    wasExpanded,
    expansionMessage
  };
}

export const hospitalDiscoveryService = {
  calculateDistance,
  progressiveRadiusSearch,
  isHospitalSuitable,

  /**
   * Discover and recommend hospitals based on user location and requirements.
   * 
   * @param {Object} options
   * @param {number|null} options.latitude - User latitude
   * @param {number|null} options.longitude - User longitude
   * @param {number|string} [options.radiusKm='auto'] - Initial preferred radius in km
   * @param {Object} [options.requirements={}] - Medical requirements (condition, specialty, facilities, budget, emergencyOnly)
   * @param {string} [options.city] - Current detected or selected city name
   */
  async findNearbyHospitals({
    latitude = null,
    longitude = null,
    radiusKm = 'auto',
    requirements = {},
    city = ''
  } = {}) {
    await delay();

    // 1. Calculate dynamic distances for all hospitals
    const uLat = Number(latitude);
    const uLng = Number(longitude);
    const hasValidUserCoords = Number.isFinite(uLat) && Number.isFinite(uLng);

    const hospitalsWithDistances = HOSPITALS.map(h => {
      let dist = h.distance;
      const hLat = Number(h.location?.latitude);
      const hLng = Number(h.location?.longitude);

      if (hasValidUserCoords && Number.isFinite(hLat) && Number.isFinite(hLng)) {
        const calculated = calculateDistance(uLat, uLng, hLat, hLng);
        if (calculated !== null) {
          dist = calculated;
        }
      } else if (city && typeof city === 'string' && city.toLowerCase() !== 'near my location' && h.location?.city) {
        // Fallback city matching heuristic ONLY if GPS unavailable and city is a real named city
        if (h.location.city.toLowerCase() !== city.toLowerCase()) {
          dist = Math.max(dist, 35);
        }
      }
      return { ...h, distance: dist };
    });

    // Controlled Development Logs (Section 17 & 21)
    console.log('[HOSPITAL DATA COUNT]', HOSPITALS.length);
    console.log('[CONDITION MATCH]', requirements.condition ? HOSPITALS.filter(h => matchesCondition(h, requirements.condition)).length : HOSPITALS.length);
    console.log('[PROCEDURE MATCH]', requirements.procedure ? HOSPITALS.filter(h => matchesCondition(h, requirements.procedure)).length : 'N/A');
    console.log('[FACILITY MATCH]', requirements.facilities && requirements.facilities.length > 0 ? HOSPITALS.filter(h => requirements.facilities.every(f => (h.facilities || []).includes(f))).length : HOSPITALS.length);
    console.log('[DIALYSIS MATCH COUNT]', HOSPITALS.filter(h => (h.facilities || []).includes('dialysis')).length);
    console.log('[BUDGET MATCH COUNT]', requirements.budget ? HOSPITALS.filter(h => matchesBudget(h, requirements.budget, requirements.condition, requirements.facilities)).length : HOSPITALS.length);
    console.log('[COORDINATE VALID COUNT]', HOSPITALS.filter(h => Number.isFinite(Number(h.location?.latitude)) && Number.isFinite(Number(h.location?.longitude))).length);
    console.log('[ORGANISATION VERIFICATION]', HOSPITALS.filter(h => (h.organisationAffiliations || []).some(a => a.status === 'verified')).length);
    console.log('[HOSPITAL DISTANCES]', hospitalsWithDistances.map(h => ({ name: h.name, distance: h.distance, city: h.location?.city })));

    // 2. Score and rank all hospitals using multi-factor criteria engine
    console.log('[DISCOVERY REQUIREMENTS]', {
      condition: requirements.condition || null,
      procedure: requirements.procedure || null,
      budgetMax: requirements.budget ? Number(requirements.budget) : null,
      requiredFacilities: requirements.facilities || []
    });

    const rankedHospitals = recommendationService.rankHospitals(
      hospitalsWithDistances,
      requirements,
      hasValidUserCoords ? uLat : null,
      hasValidUserCoords ? uLng : null
    );

    // Section 21: Count suitable hospitals within progressive distance thresholds
    const suitableAll = rankedHospitals.filter(h => isHospitalSuitable(h, requirements));
    console.log('[WITHIN 5 KM]', suitableAll.filter(h => (h.distance != null ? h.distance : 999) <= 5).length);
    console.log('[WITHIN 10 KM]', suitableAll.filter(h => (h.distance != null ? h.distance : 999) <= 10).length);
    console.log('[WITHIN 25 KM]', suitableAll.filter(h => (h.distance != null ? h.distance : 999) <= 25).length);
    console.log('[WITHIN 50 KM]', suitableAll.filter(h => (h.distance != null ? h.distance : 999) <= 50).length);

    // 3. Progressive auto-radius search
    const {
      matchingHospitals,
      costUnavailableHospitals = [],
      otherNearbyHospitals,
      activeRadius,
      wasExpanded,
      expansionMessage
    } = progressiveRadiusSearch(rankedHospitals, requirements, radiusKm);

    console.log('[FINAL RESULTS]', matchingHospitals.map(h => ({
      name: h.name,
      distance: h.distance,
      matchScore: h.matchScore,
      evidenceTier: h.evidenceTier || null
    })));

    // 4. Geographic Coverage Detection (Section 6 & 18)
    const minHospitalDistance = hospitalsWithDistances.length > 0
      ? Math.min(...hospitalsWithDistances.map(h => (h.distance != null ? h.distance : 999)))
      : 999;
    const isOutsideCoverage = hasValidUserCoords && minHospitalDistance > 50;
    const coveredCities = [...new Set(HOSPITALS.map(h => h.location?.city).filter(Boolean))];

    let finalExpansionNotice = expansionMessage;
    if (isOutsideCoverage && matchingHospitals.length === 0) {
      finalExpansionNotice = `Your current location is outside the area covered by the current hospital dataset (nearest hospital is ~${Math.round(minHospitalDistance)} km away).`;
    }

    // 5. Section Partitioning: 4 progressive distance buckets + costUnavailable
    const nearYou = matchingHospitals.filter(h => (h.distance != null ? h.distance : 999) <= 5);
    const moreNearby = matchingHospitals.filter(h => {
      const d = h.distance != null ? h.distance : 999;
      return d > 5 && d <= 10;
    });
    const nearbyAreas = matchingHospitals.filter(h => {
      const d = h.distance != null ? h.distance : 999;
      return d > 10 && d <= 25;
    });
    const upTo50km = matchingHospitals.filter(h => {
      const d = h.distance != null ? h.distance : 999;
      return d > 25 && d <= 50;
    });

    // Backward compatibility tiering
    let bestMatches = [];
    if (hasValidUserCoords) {
      if (nearYou.length > 0) {
        bestMatches = nearYou;
      } else if (moreNearby.length > 0) {
        bestMatches = moreNearby.slice(0, 3);
      } else if (nearbyAreas.length > 0) {
        bestMatches = nearbyAreas.slice(0, 3);
      } else {
        bestMatches = upTo50km.slice(0, 3);
      }
    } else {
      bestMatches = matchingHospitals.filter(h => h.matchScore >= 70);
      if (bestMatches.length === 0 && matchingHospitals.length > 0) {
        bestMatches = matchingHospitals.slice(0, 3);
      }
    }
    const expandedArea = nearbyAreas.length > 0 ? nearbyAreas : upTo50km;

    // Other nearby hospitals that do NOT meet all requirements are kept in a separate section
    const otherNearby = otherNearbyHospitals.slice(0, 3);

    // Check if this search matches one of the 8 curated national reference categories
    const nationalCatKey = resolveNationalCategory(
      requirements.condition,
      requirements.procedure,
      requirements.query || requirements.rawQuery
    );
    const localCoveredCities = ['hoshiarpur', 'jalandhar', 'ludhiana', 'mohali', 'panchkula'];
    const isExplicitLocalCity = city && localCoveredCities.some(lc => city.toLowerCase().includes(lc));
    const hasLocalBudgetConstraint = requirements.budget && Number(requirements.budget) > 0 && Number(requirements.budget) <= 200000;

    const isSpecializedNationalSearch = !!nationalCatKey && !hasLocalBudgetConstraint && !isExplicitLocalCity;
    let nationalMatches = [];
    let nationalCategoryData = null;

    if (isSpecializedNationalSearch) {
      nationalMatches = getNationalReferenceHospitals(
        nationalCatKey,
        hasValidUserCoords ? uLat : null,
        hasValidUserCoords ? uLng : null,
        city || null,
        requirements.budget ? Number(requirements.budget) : null
      );
      nationalCategoryData = NATIONAL_HOSPITAL_REFERENCES[nationalCatKey];
    }

    return {
      sections: {
        nationalReferenceMatches: isSpecializedNationalSearch ? nationalMatches : [],
        nearYou,
        moreNearby,
        nearbyAreas,
        upTo50km,
        costUnavailable: costUnavailableHospitals,
        bestMatches: isSpecializedNationalSearch ? nationalMatches : bestMatches,
        expandedArea,
        otherNearby
      },
      results: isSpecializedNationalSearch ? nationalMatches : matchingHospitals,
      totalCount: isSpecializedNationalSearch ? nationalMatches.length : matchingHospitals.length,
      isNationalReference: isSpecializedNationalSearch,
      nationalCategoryKey: nationalCatKey || null,
      nationalCategoryName: nationalCategoryData?.categoryName || null,
      disclaimer: nationalCategoryData?.disclaimer || null,
      initialRadius: radiusKm === 'auto' ? 5 : Number(radiusKm || 5),
      activeRadius,
      wasExpanded,
      expansionMessage: finalExpansionNotice,
      isOutsideCoverage,
      coveredCities,
      minHospitalDistance,
      userLocation: {
        latitude: hasValidUserCoords ? uLat : null,
        longitude: hasValidUserCoords ? uLng : null,
        city
      }
    };
  },

  /**
   * Get emergency hospitals sorted strictly by proximity.
   */
  async getEmergencyNearby(latitude, longitude, radiusKm = 30) {
    await delay();
    return HOSPITALS
      .filter(h => h.emergency24x7)
      .map(h => {
        let dist = h.distance;
        if (latitude != null && longitude != null && h.location?.latitude && h.location?.longitude) {
          const calc = calculateDistance(latitude, longitude, h.location.latitude, h.location.longitude);
          if (calc !== null) dist = calc;
        }
        return { ...h, distance: dist };
      })
      .filter(h => h.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
};
