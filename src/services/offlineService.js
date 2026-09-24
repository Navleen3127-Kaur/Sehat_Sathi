/**
 * Sehat_Sathi - Offline Service
 * 
 * Manages client-side persistence of the emergency hospital dataset,
 * last-sync timestamp, network online/offline listener, and Cache Storage / localStorage.
 */

import { getEmergencyHospitalDataset, EMERGENCY_DATASET_VERSION } from '../data/emergencyHospitalData.js';

const STORAGE_KEY_EMERGENCY_DATA = 'sehat_sathi_emergency_hospitals_v1';
const STORAGE_KEY_LAST_SYNC = 'sehat_sathi_emergency_last_sync';
const STORAGE_KEY_VERSION = 'sehat_sathi_emergency_version';
const CACHE_NAME = 'sehat-sathi-emergency-cache-v1';

export const offlineService = {
  /**
   * Check if browser is currently online.
   * @returns {boolean}
   */
  isOnline() {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  },

  /**
   * Subscribe to online/offline network state changes.
   * @param {Function} callback - ({ isOnline: boolean }) => void
   * @returns {Function} unsubscribe cleanup function
   */
  subscribeNetworkStatus(callback) {
    if (typeof window === 'undefined') return () => {};

    const handleOnline = () => callback({ isOnline: true });
    const handleOffline = () => callback({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  /**
   * Returns the cached emergency hospital dataset or refreshes from local source.
   * @returns {Promise<{ hospitals: Array, lastSync: string, isFromCache: boolean }>}
   */
  async getEmergencyHospitals() {
    // 1. Try localStorage first
    try {
      if (typeof localStorage !== 'undefined') {
        const cachedRaw = localStorage.getItem(STORAGE_KEY_EMERGENCY_DATA);
        const lastSync = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return {
              hospitals: parsed,
              lastSync: lastSync || new Date().toISOString(),
              isFromCache: true
            };
          }
        }
      }
    } catch (e) {
      console.warn('[OfflineService] localStorage read error:', e);
    }

    // 2. Try Cache Storage API if available in browser
    try {
      if (typeof caches !== 'undefined') {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match('/emergency-hospitals-data.json');
        if (match) {
          const json = await match.json();
          if (json && Array.isArray(json.hospitals)) {
            return {
              hospitals: json.hospitals,
              lastSync: json.lastSync || new Date().toISOString(),
              isFromCache: true
            };
          }
        }
      }
    } catch (e) {
      console.warn('[OfflineService] Cache Storage read error:', e);
    }

    // 3. Fallback to fresh baseline dataset derivation and immediately seed cache
    const freshData = getEmergencyHospitalDataset();
    const timestamp = new Date().toISOString();
    await this.syncEmergencyHospitals(freshData, timestamp);

    return {
      hospitals: freshData,
      lastSync: timestamp,
      isFromCache: false
    };
  },

  /**
   * Cache/refresh emergency hospitals into localStorage and Cache Storage.
   * @param {Array} [data] - optional dataset, defaults to getEmergencyHospitalDataset()
   * @param {string} [timestamp] - optional ISO timestamp
   */
  async syncEmergencyHospitals(data = null, timestamp = null) {
    const dataset = data || getEmergencyHospitalDataset();
    const syncTime = timestamp || new Date().toISOString();

    // Store in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_EMERGENCY_DATA, JSON.stringify(dataset));
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, syncTime);
        localStorage.setItem(STORAGE_KEY_VERSION, EMERGENCY_DATASET_VERSION);
      }
    } catch (e) {
      console.warn('[OfflineService] localStorage write error:', e);
    }

    // Store in Cache Storage
    try {
      if (typeof caches !== 'undefined') {
        const cache = await caches.open(CACHE_NAME);
        const payload = JSON.stringify({
          version: EMERGENCY_DATASET_VERSION,
          lastSync: syncTime,
          hospitals: dataset
        });
        const response = new Response(payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put('/emergency-hospitals-data.json', response);
      }
    } catch (e) {
      console.warn('[OfflineService] Cache Storage write error:', e);
    }

    return {
      hospitals: dataset,
      lastSync: syncTime
    };
  },

  /**
   * Get formatted last sync date string
   * @param {string|null} isoString
   * @returns {string}
   */
  formatLastSync(isoString) {
    if (!isoString) return 'Not available';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  }
};
