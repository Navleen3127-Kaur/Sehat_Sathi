/**
 * Sehat_Sathi - Hospital Service
 * 
 * Clean abstraction layer designed to match future FastAPI endpoints:
 *   GET  /api/hospitals
 *   GET  /api/hospitals/:id
 *   GET  /api/specialties
 *   GET  /api/facilities
 *   POST /api/compare
 */

import { HOSPITALS } from '../data/hospitals.js';
import { SPECIALTIES } from '../data/specialties.js';
import { FACILITIES } from '../data/facilities.js';
import { getNationalReferenceHospitalById } from '../data/nationalHospitalReferences.js';

// Simulated network latency (fast for great UX, but tests async contracts)
const delay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

export const hospitalService = {
  /**
   * Fetch all hospitals with optional filtering and sorting.
   * Future: GET /api/hospitals?condition=...&location=...
   */
  async getAllHospitals(filters = {}, sort = 'recommended') {
    await delay();
    let results = [...HOSPITALS];

    // Filter by Condition / Treatment Keyword
    if (filters.condition && filters.condition.trim() !== '') {
      const condLower = filters.condition.toLowerCase();
      results = results.filter(h => {
        const specMatch = h.specialties.some(s => s.toLowerCase().includes(condLower));
        const costMatch = Object.keys(h.estimatedCosts).some(k => k.toLowerCase().includes(condLower));
        return specMatch || costMatch;
      });
    }

    // Filter by City / Location
    if (filters.location && filters.location !== 'all' && filters.location.trim() !== '') {
      const locLower = filters.location.toLowerCase();
      results = results.filter(h => 
        h.location.city.toLowerCase().includes(locLower) ||
        h.location.address.toLowerCase().includes(locLower)
      );
    }

    // Filter by Radius / Distance (km)
    if (filters.radius && filters.radius > 0) {
      results = results.filter(h => h.distance <= filters.radius);
    }

    // Filter by Budget (INR Max)
    if (filters.budget && filters.budget > 0) {
      results = results.filter(h => {
        // Check if ANY of the treatment minimums fall under the budget limit
        const minCosts = Object.values(h.estimatedCosts).map(c => c.min);
        return Math.min(...minCosts) <= filters.budget;
      });
    }

    // Filter by Specialty
    if (filters.specialty && filters.specialty !== 'all') {
      const specLower = filters.specialty.toLowerCase();
      results = results.filter(h => 
        h.specialties.some(s => s.toLowerCase().includes(specLower))
      );
    }

    // Filter by Emergency 24x7
    if (filters.emergencyOnly) {
      results = results.filter(h => h.emergency24x7 === true);
    }

    // Filter by Required Facilities (array of facility ids)
    if (filters.facilities && filters.facilities.length > 0) {
      results = results.filter(h => 
        filters.facilities.every(facId => h.facilities.includes(facId))
      );
    }

    // Filter by Accreditation
    if (filters.accreditation && filters.accreditation !== 'all') {
      results = results.filter(h => 
        h.accreditation.some(acc => acc.toLowerCase().includes(filters.accreditation.toLowerCase()))
      );
    }

    // Filter by Minimum Beds
    if (filters.minBeds && filters.minBeds > 0) {
      results = results.filter(h => h.beds >= filters.minBeds);
    }

    // Apply Sorting
    switch (sort) {
      case 'nearest':
        results.sort((a, b) => a.distance - b.distance);
        break;
      case 'lowest_cost':
        results.sort((a, b) => {
          const aMin = Math.min(...Object.values(a.estimatedCosts).map(c => c.min));
          const bMin = Math.min(...Object.values(b.estimatedCosts).map(c => c.min));
          return aMin - bMin;
        });
        break;
      case 'highest_rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // Multi-criteria match score: Verified (+20), Distance (<5km +15), Rating (+10), Beds (+5)
        results.sort((a, b) => {
          const scoreA = (a.verification.status === 'verified' ? 25 : 10) +
                         (a.distance <= 5 ? 20 : a.distance <= 10 ? 10 : 0) +
                         (a.rating * 5) +
                         (a.beds >= 200 ? 10 : 5);
          const scoreB = (b.verification.status === 'verified' ? 25 : 10) +
                         (b.distance <= 5 ? 20 : b.distance <= 10 ? 10 : 0) +
                         (b.rating * 5) +
                         (b.beds >= 200 ? 10 : 5);
          return scoreB - scoreA;
        });
        break;
    }

    return results;
  },

  /**
   * Fetch single hospital by ID.
   * Future: GET /api/hospitals/:id
   */
  async getHospitalById(id) {
    await delay();
    let hospital = HOSPITALS.find(h => String(h.id) === String(id));
    if (!hospital) {
      hospital = getNationalReferenceHospitalById(id);
    }
    if (!hospital) {
      throw new Error(`Hospital with ID ${id} not found.`);
    }
    return hospital;
  },

  /**
   * Fetch featured hospitals for home page showcase.
   */
  async getFeaturedHospitals(limit = 4) {
    await delay();
    // Return high-rated, verified hospitals across different cities
    return HOSPITALS.filter(h => h.verification.status === 'verified')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  /**
   * Fetch emergency-ready hospitals sorted by distance.
   */
  async getEmergencyHospitals(radius = 50) {
    await delay();
    return HOSPITALS
      .filter(h => h.emergency24x7 && h.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  },

  /**
   * Compare multiple hospitals side-by-side.
   * Future: POST /api/compare with { hospitalIds: [...] }
   */
  async getHospitalsForComparison(ids = []) {
    await delay();
    const result = [];
    for (const id of ids) {
      let h = HOSPITALS.find(item => String(item.id) === String(id));
      if (!h) {
        h = getNationalReferenceHospitalById(id);
      }
      if (h) result.push(h);
    }
    return result;
  },

  /**
   * Fetch all specialties master.
   * Future: GET /api/specialties
   */
  async getAllSpecialties() {
    await delay();
    return SPECIALTIES;
  },

  /**
   * Fetch all facilities master.
   * Future: GET /api/facilities
   */
  async getAllFacilities() {
    await delay();
    return FACILITIES;
  }
};

export const getHospitalById = async (id) => hospitalService.getHospitalById(id);
