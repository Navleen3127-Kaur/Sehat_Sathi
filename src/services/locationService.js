/**
 * Sehat_Sathi - Location Service
 * 
 * Provides:
 * 1. Haversine distance formula calculation between coordinates.
 * 2. Browser Geolocation API wrapper with robust error classification.
 * 3. Reverse geocoding provider abstraction (decoupled for future backend/maps swap).
 * 
 * PRIVACY:
 * Does not transmit coordinates to external services.
 * Does not expose raw latitude/longitude in the UI.
 */

// Known regional anchor locations for spatial fallback
const REGIONAL_CITY_ANCHORS = [
  { city: "Chandigarh", state: "UT", country: "India", lat: 30.7333, lng: 76.7794 },
  { city: "Mohali", state: "Punjab", country: "India", lat: 30.7046, lng: 76.7179 },
  { city: "Panchkula", state: "Haryana", country: "India", lat: 30.6942, lng: 76.8606 },
  { city: "Zirakpur", state: "Punjab", country: "India", lat: 30.6425, lng: 76.8173 },
  { city: "Ludhiana", state: "Punjab", country: "India", lat: 30.9010, lng: 75.8573 },
  { city: "Jalandhar", state: "Punjab", country: "India", lat: 31.3260, lng: 75.5762 },
  { city: "Hoshiarpur", state: "Punjab", country: "India", lat: 31.5273, lng: 75.9150 },
  { city: "Patiala", state: "Punjab", country: "India", lat: 30.3398, lng: 76.3869 },
  { city: "Ambala", state: "Haryana", country: "India", lat: 30.3782, lng: 76.7767 },
  { city: "Delhi NCR", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 }
];

/**
 * Standard Haversine distance calculation
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers rounded to 1 decimal place
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

  const p1 = Number(lat1);
  const l1 = Number(lon1);
  const p2 = Number(lat2);
  const l2 = Number(lon2);

  if (!Number.isFinite(p1) || !Number.isFinite(l1) || !Number.isFinite(p2) || !Number.isFinite(l2)) {
    return null;
  }

  // Quick check for identical coordinates
  if (p1 === p2 && l1 === l2) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(p2 - p1);
  const dLon = toRad(l2 - l1);
  const rLat1 = toRad(p1);
  const rLat2 = toRad(p2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

export const calculateDistance = calculateHaversineDistance;

export const resolveLocation = (locationName = '') => {
  if (!locationName || typeof locationName !== 'string') return null;
  const lower = locationName.trim().toLowerCase();
  const match = REGIONAL_CITY_ANCHORS.find(c =>
    c.city.toLowerCase() === lower || lower.includes(c.city.toLowerCase()) || c.city.toLowerCase().includes(lower)
  );
  if (match) {
    return {
      city: match.city,
      state: match.state,
      latitude: match.lat,
      longitude: match.lng
    };
  }
  return null;
};

export const locationService = {
  /**
   * Request device/browser coordinates via Geolocation API.
   * Resolves with { latitude, longitude, accuracy }.
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        reject(new Error("GEOLOCATION_UNSUPPORTED"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy)
          });
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              reject(new Error("PERMISSION_DENIED"));
              break;
            case err.POSITION_UNAVAILABLE:
              reject(new Error("POSITION_UNAVAILABLE"));
              break;
            case err.TIMEOUT:
              reject(new Error("TIMEOUT"));
              break;
            default:
              reject(new Error("UNKNOWN_LOCATION_ERROR"));
              break;
          }
        },
        options
      );
    });
  },

  /**
   * Check permission status if navigator.permissions is available
   */
  async getLocationPermissionStatus() {
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        return status.state; // 'prompt' | 'granted' | 'denied'
      } catch {
        return 'unknown';
      }
    }
    return 'unknown';
  },

  /**
   * Reverse geocode coordinates to City & State.
   * Uses spatial proximity to regional hubs as a dependable, offline-ready abstraction.
   */
  async reverseGeocode(latitude, longitude) {
    if (latitude == null || longitude == null) {
      return { city: "Chandigarh", state: "UT", country: "India" };
    }

    // Find closest anchor city
    let closestCity = REGIONAL_CITY_ANCHORS[0];
    let minDistance = Infinity;

    for (const anchor of REGIONAL_CITY_ANCHORS) {
      const dist = calculateHaversineDistance(latitude, longitude, anchor.lat, anchor.lng);
      if (dist !== null && dist < minDistance) {
        minDistance = dist;
        closestCity = anchor;
      }
    }

    return {
      city: closestCity.city,
      state: closestCity.state,
      country: closestCity.country,
      approxDistanceToCenterKm: minDistance
    };
  },

  calculateDistance: calculateHaversineDistance,

  getRegionalCities() {
    return REGIONAL_CITY_ANCHORS;
  }
};
