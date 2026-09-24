import { calculateDistance } from '../services/locationService.js';

/**
 * SINGLE SOURCE OF TRUTH — user → hospital distance resolution.
 *
 * Used identically by HospitalCard (result cards) and ComparisonTable (compare
 * view) so the two views can NEVER disagree for the same hospital + user
 * location.
 *
 * Resolution priority:
 *   1. hospital.distance — already resolved by the discovery layer
 *      (hospitalDiscoveryService) from the same user location the search used.
 *   2. Recomputed with the SAME shared Haversine helper the discovery layer
 *      uses (calculateDistance from locationService) from the hospital's
 *      dataset coordinates (hospitals.js / nationalHospitalReferences.js) and
 *      the current user location. This covers raw dataset objects added to
 *      Compare that never passed through discovery (no duplicates of the
 *      geospatial math anywhere).
 *   3. null — genuinely unresolvable (no distance, no valid coordinates),
 *      rendered by the shared formatter as
 *      "Distance unavailable — location permission required".
 *
 * @param {Object} hospital - Full hospital object (dataset or discovery-resolved)
 * @param {Object|null} [userLocation] - { latitude, longitude } from LocationContext
 * @returns {number|null} Distance in km (1 decimal precision via Haversine helper) or null
 */
export const resolveHospitalDistance = (hospital, userLocation = null) => {
  if (!hospital) return null;

  // 1. Discovery layer already resolved this distance for the current user location
  if (hospital.distance != null && Number.isFinite(Number(hospital.distance))) {
    return Number(hospital.distance);
  }

  const uLat = Number(userLocation?.latitude);
  const uLng = Number(userLocation?.longitude);
  const hasUserCoords = Number.isFinite(uLat) && Number.isFinite(uLng);

  // 2. Same shared geospatial helper used by hospitalDiscoveryService
  const hLat = Number(hospital.location?.latitude);
  const hLng = Number(hospital.location?.longitude);
  if (hasUserCoords && Number.isFinite(hLat) && Number.isFinite(hLng)) {
    const calculated = calculateDistance(uLat, uLng, hLat, hLng);
    if (calculated !== null) {
      return calculated;
    }
  }

  // 3. Genuinely unavailable — no fabricated values
  return null;
};

/**
 * SINGLE SOURCE OF TRUTH — distance display formatting.
 * Exactly the HospitalCard convention:
 *   < 10 km  → one decimal ("8.3 km from your current location")
 *   >= 10 km → rounded ("244 km from your current location")
 *   null     → "Distance unavailable — location permission required"
 *
 * @param {number|null} distance - Distance in km
 * @returns {string} Formatted display string
 */
export const formatDistanceFromUser = (distance) => {
  const value = Number(distance);
  if (distance == null || !Number.isFinite(value)) {
    return 'Distance unavailable — location permission required';
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} km from your current location`;
};

/**
 * Resolve a hospital's location label from the existing dataset fields.
 * Never invents an address — only uses stored location data.
 *
 * @param {Object} hospital - Full hospital object
 * @returns {string} "Address, City" / "City" or '' when no location data exists
 */
export const formatHospitalLocationLabel = (hospital) => {
  if (!hospital) return '';
  const address = hospital.location?.address || '';
  const city = hospital.location?.city || hospital.city || '';
  return [address, city].filter(Boolean)
    .filter((part, idx, arr) => arr.indexOf(part) === idx)
    .join(', ');
};
