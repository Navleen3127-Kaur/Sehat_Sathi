/**
 * Sehat_Sathi - Emergency Hospital Dataset Normalizer
 * 
 * Derives the local emergency hospital dataset from HOSPITALS.
 * Ensures consistent emergency capability fields, valid coordinates, and phone numbers.
 * DISCLAIMER: This is a prototype/mock dataset at the project level, not live availability.
 */

import { HOSPITALS } from './hospitals.js';

export const EMERGENCY_DATASET_VERSION = '1.0.0';

/**
 * Normalizes hospital records for emergency mode.
 * Reuses existing fields: emergency24x7, facilities, facilityStatuses, icuBeds, beds, phone, emergencyPhone.
 * Adds prototype mock emergency capability fields if missing.
 */
export function getEmergencyHospitalDataset() {
  return HOSPITALS
    .filter(h => {
      // Must be emergency capable: emergency24x7 === true OR facilities include 'emergency'
      const hasEmergency = h.emergency24x7 === true ||
        (Array.isArray(h.facilities) && h.facilities.includes('emergency')) ||
        h.facilityStatuses?.emergency === 'available';
      return hasEmergency;
    })
    .map(h => {
      const facilities = Array.isArray(h.facilities) ? h.facilities : [];
      const facilityStatuses = h.facilityStatuses || {};

      const emergencyAvailable = h.emergency24x7 === true ||
        facilities.includes('emergency') ||
        facilityStatuses.emergency === 'available';

      const ambulanceAvailable = facilities.includes('ambulance') ||
        facilityStatuses.ambulance === 'available';

      const icuAvailable = (h.icuBeds != null && h.icuBeds > 0) ||
        facilities.includes('icu') ||
        facilityStatuses.icu === 'available';

      const traumaAvailable = facilities.includes('trauma') ||
        facilityStatuses.trauma === 'available' ||
        facilities.includes('ct_scan') ||
        (Array.isArray(h.specialties) && h.specialties.some(s => /trauma/i.test(s)));

      const bloodBankAvailable = facilities.includes('blood_bank') ||
        facilityStatuses.blood_bank === 'available';

      // Pick best contact phone: emergencyPhone preferred, otherwise general phone
      const directPhone = h.emergencyPhone || h.phone || null;

      return {
        id: h.id,
        name: h.name,
        shortName: h.shortName || h.name,
        type: h.type || 'Hospital',
        phone: directPhone,
        emergencyPhone: h.emergencyPhone || null,
        generalPhone: h.phone || null,
        location: {
          address: h.location?.address || '',
          city: h.location?.city || h.city || '',
          latitude: h.location?.latitude ?? null,
          longitude: h.location?.longitude ?? null,
          landmark: h.location?.landmark || ''
        },
        emergencyCapabilities: {
          emergencyCare: emergencyAvailable,
          ambulance: ambulanceAvailable,
          icu: icuAvailable,
          trauma: traumaAvailable,
          bloodBank: bloodBankAvailable,
          icuBedsCount: h.icuBeds || null,
          totalBedsCount: h.beds || null
        },
        // Direct boolean flags for fast query matching
        emergency: emergencyAvailable,
        emergencyServices: emergencyAvailable,
        emergencyDepartment: emergencyAvailable,
        ambulance: ambulanceAvailable,
        icu: icuAvailable,
        trauma: traumaAvailable,
        emergency24x7: emergencyAvailable,
        verification: h.verification || { status: h.verificationStatus || 'sample_data' },
        accreditation: h.accreditation || []
      };
    });
}
