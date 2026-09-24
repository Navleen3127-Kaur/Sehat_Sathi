/**
 * Sehat_Sathi - Emergency Service
 * 
 * Encapsulates:
 * 1. Emergency hospital data retrieval (offline-first via offlineService).
 * 2. GPS-based distance calculation using existing calculateDistance.
 * 3. Sorting by:
 *    - Emergency capability
 *    - Distance ASC (when GPS is available)
 *    - Availability of emergency facilities (ICU, ambulance, trauma, blood bank)
 * 
 * IMPORTANT:
 * - Does NOT use national reference ranking.
 * - Does NOT fabricate GPS coordinates or distance when GPS is unavailable.
 * - When GPS is unavailable, hospitals remain listed sorted by emergency facilities/data availability.
 */

import { offlineService } from './offlineService.js';
import { calculateDistance } from './locationService.js';

export const emergencyService = {
  /**
   * Calculate facility completeness score for tie-breaking/sorting.
   * @param {Object} h 
   * @returns {number}
   */
  calculateFacilityScore(h) {
    let score = 0;
    const caps = h.emergencyCapabilities || {};
    if (caps.emergencyCare || h.emergency || h.emergency24x7) score += 10;
    if (caps.icu || h.icu) score += 5;
    if (caps.ambulance || h.ambulance) score += 4;
    if (caps.trauma || h.trauma) score += 3;
    if (caps.bloodBank) score += 2;
    if (caps.icuBedsCount > 0) score += Math.min(caps.icuBedsCount, 10);
    return score;
  },

  /**
   * Sort emergency hospitals strictly according to Emergency Mode requirements:
   * 1. Emergency capability (primary)
   * 2. Distance ASC (when valid distance is available)
   * 3. Availability of important emergency facilities/data
   */
  sortEmergencyHospitals(hospitals, hasGps = false) {
    return [...hospitals].sort((a, b) => {
      // 1. Emergency capability
      const aEmerg = (a.emergencyCapabilities?.emergencyCare || a.emergency || a.emergency24x7) ? 1 : 0;
      const bEmerg = (b.emergencyCapabilities?.emergencyCare || b.emergency || b.emergency24x7) ? 1 : 0;
      if (aEmerg !== bEmerg) {
        return bEmerg - aEmerg;
      }

      // 2. Distance ASC (when valid GPS distance exists)
      const aHasDist = a.distance != null && Number.isFinite(Number(a.distance));
      const bHasDist = b.distance != null && Number.isFinite(Number(b.distance));

      if (aHasDist && bHasDist) {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
      } else if (aHasDist && !bHasDist) {
        return -1;
      } else if (!aHasDist && bHasDist) {
        return 1;
      }

      // 3. Availability of important emergency facilities/data
      const aScore = emergencyService.calculateFacilityScore(a);
      const bScore = emergencyService.calculateFacilityScore(b);
      if (aScore !== bScore) {
        return bScore - aScore;
      }

      // Fallback deterministic by name
      return (a.name || '').localeCompare(b.name || '');
    });
  },

  /**
   * Retrieve emergency hospitals with optional user GPS coordinates.
   * If coords are provided, computes live Haversine distance.
   * If coords are null, distance remains null (never faked).
   * 
   * @param {number|null} latitude 
   * @param {number|null} longitude 
   * @param {number|null} [radiusKm=null] - optional filter radius in km
   * @returns {Promise<{ hospitals: Array, lastSync: string, isFromCache: boolean, hasGps: boolean }>}
   */
  async getNearbyEmergencyHospitals(latitude = null, longitude = null, radiusKm = null) {
    const { hospitals: baseHospitals, lastSync, isFromCache } = await offlineService.getEmergencyHospitals();

    const hasGps = latitude != null && longitude != null &&
      Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));

    // Process each hospital
    const processed = baseHospitals.map(h => {
      let distance = null;

      if (hasGps) {
        const hLat = h.location?.latitude;
        const hLng = h.location?.longitude;
        if (hLat != null && hLng != null && Number.isFinite(Number(hLat)) && Number.isFinite(Number(hLng))) {
          distance = calculateDistance(latitude, longitude, hLat, hLng);
        }
      }

      return {
        ...h,
        distance // null if no valid GPS or missing hospital coords
      };
    });

    // Optional radius filter only applies if GPS is active and radiusKm is specified
    let filtered = processed;
    if (hasGps && radiusKm && Number(radiusKm) > 0) {
      filtered = processed.filter(h => h.distance != null && h.distance <= Number(radiusKm));
      // If none within radius, do not wipe out all hospitals, keep nearest or let UI handle
    }

    // Sort
    const sorted = emergencyService.sortEmergencyHospitals(filtered, hasGps);

    return {
      hospitals: sorted,
      lastSync,
      isFromCache,
      hasGps
    };
  }
};
