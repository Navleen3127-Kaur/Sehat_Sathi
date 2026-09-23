/**
 * Sehat_Sathi - Search & Recommendation Engine Service
 * 
 * Provides transparent, non-diagnostic matching logic, progressive radius expansion,
 * and generates user-friendly explainability factors ("Why am I seeing this hospital?").
 * 
 * CORE ARCHITECTURE:
 * - Delegates to hospitalDiscoveryService for dynamic geospatial discovery and progressive radius expansion.
 * - Delegates to recommendationService for multi-factor criteria scoring (Specialty 30, Facilities 25,
 *   Budget 20, Distance 15, Emergency 5, Verification 5 = 100 max).
 * - Enforces relevance before distance: hospitals matching needed medical conditions rank higher.
 */

import { hospitalDiscoveryService } from './hospitalDiscoveryService.js';
import { locationService, resolveLocation } from './locationService.js';

export const searchService = {
  /**
   * Search hospitals with multi-factor matching, progressive expansion, and 3-section categorization.
   */
  async searchHospitals(params = {}) {
    const {
      query = '',
      condition = '',
      location = '',
      radius = 'auto',
      budget = null,
      specialty = 'all',
      facilities = [],
      emergencyOnly = false,
      accreditation = 'all',
      minBeds = 0,
      sort = 'recommended',
      latitude = null,
      longitude = null
    } = params;

    // Resolve coordinates: if explicit city is provided, anchor to that city; otherwise use user GPS
    let userLat = latitude;
    let userLng = longitude;
    let userCity = location;

    const isNearMe = !location || location.trim() === '' || location.toLowerCase() === 'near_me' || location.toLowerCase().includes('near my location') || location.toLowerCase().includes('current');
    if (!isNearMe) {
      const resolved = resolveLocation(location);
      if (resolved) {
        userLat = resolved.latitude;
        userLng = resolved.longitude;
        userCity = resolved.city;
      }
    } else {
      userCity = '';
    }

    const discoveryResult = await hospitalDiscoveryService.findNearbyHospitals({
      latitude: userLat,
      longitude: userLng,
      radiusKm: radius === 'auto' ? 'auto' : (Number(radius) || 'auto'),
      city: userCity,
      requirements: {
        condition: condition || '',
        specialty,
        facilities,
        budget,
        emergencyOnly,
        radiusMode: radius === 'auto' ? 'auto' : 'manual'
      }
    });

    let { 
      nearYou = [], 
      moreNearby = [], 
      nearbyAreas = [], 
      upTo50km = [], 
      costUnavailable = [], 
      bestMatches = [], 
      expandedArea = [], 
      otherNearby = [] 
    } = discoveryResult.sections;

    // Secondary filters: Accreditation & Min Beds
    const applySecondaryFilters = (list) => {
      let filtered = [...list];
      if (accreditation && accreditation !== 'all') {
        filtered = filtered.filter(h => 
          (h.accreditation || []).some(acc => acc.toLowerCase().includes(accreditation.toLowerCase()))
        );
      }
      if (minBeds && Number(minBeds) > 0) {
        filtered = filtered.filter(h => (h.beds || 0) >= Number(minBeds));
      }
      return filtered;
    };

    nearYou = applySecondaryFilters(nearYou);
    moreNearby = applySecondaryFilters(moreNearby);
    nearbyAreas = applySecondaryFilters(nearbyAreas);
    upTo50km = applySecondaryFilters(upTo50km);
    costUnavailable = applySecondaryFilters(costUnavailable);
    bestMatches = applySecondaryFilters(bestMatches);
    expandedArea = applySecondaryFilters(expandedArea);
    otherNearby = applySecondaryFilters(otherNearby);

    // Apply secondary sort if user explicitly selected nearest or lowest_cost
    const applySort = (list) => {
      if (sort === 'nearest') {
        return [...list].sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }
      if (sort === 'lowest_cost') {
        return [...list].sort((a, b) => {
          const aMin = Math.min(...Object.values(a.estimatedCosts || {}).map(c => c.min || 999999));
          const bMin = Math.min(...Object.values(b.estimatedCosts || {}).map(c => c.min || 999999));
          return aMin - bMin;
        });
      }
      if (sort === 'highest_rating') {
        return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      // 'recommended' retains multi-factor ranking
      return list;
    };

    nearYou = applySort(nearYou);
    moreNearby = applySort(moreNearby);
    nearbyAreas = applySort(nearbyAreas);
    upTo50km = applySort(upTo50km);
    bestMatches = applySort(bestMatches);
    expandedArea = applySort(expandedArea);

    const allOrderedResults = discoveryResult.results;

    return {
      results: allOrderedResults,
      sections: {
        nearYou,
        moreNearby,
        nearbyAreas,
        upTo50km,
        costUnavailable,
        bestMatches,
        expandedArea,
        otherNearby
      },
      costUnavailableCount: costUnavailable.length,
      totalCount: allOrderedResults.length,
      initialRadius: discoveryResult.initialRadius,
      activeRadius: discoveryResult.activeRadius,
      activeRadiusKm: discoveryResult.activeRadius,
      wasExpanded: discoveryResult.wasExpanded,
      expansionMessage: discoveryResult.expansionMessage,
      isOutsideCoverage: discoveryResult.isOutsideCoverage,
      coveredCities: discoveryResult.coveredCities,
      minHospitalDistance: discoveryResult.minHospitalDistance,
      appliedFilters: params
    };
  }
};
