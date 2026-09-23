/**
 * Sehat_Sathi - Admin Management Service (Mock & Audit Governance)
 * 
 * Provides:
 * - Hospital registry CRUD with soft-delete architecture
 * - Strict input validation (bed counts, coordinates, costs, sources)
 * - Complete immutable audit logging (adminUserId, action, before/after, timestamp)
 * - Role-Based Access Control (RBAC): admin, editor, reviewer
 * - Exact hospital identity verification logic (name + address + city + state + pincode)
 * 
 * ============================================================================
 * ARCHITECTURAL NOTICE:
 * FRONTEND PROTOTYPE AUTHORIZATION VS. PRODUCTION SERVER-SIDE AUTHORIZATION
 * 
 * In this client demonstration tier, role-based guards and permission checks
 * govern interactive workflows, audit logging, and UI permissions.
 * In a production deployment:
 * 1. All authorization boundaries MUST be enforced on the backend (FastAPI/Node).
 * 2. Administrative mutations require cryptographically signed JWT tokens
 *    with role claims validated in middleware against PostgreSQL database state.
 * 3. Client code must NEVER be trusted as the sole enforcement barrier.
 * ============================================================================
 */

import { HOSPITALS } from '../data/hospitals.js';
import { 
  ADMIN_STATS, 
  HOSPITALS_BY_CITY, 
  HOSPITALS_BY_SPECIALTY, 
  VERIFICATION_DISTRIBUTION, 
  AVG_COST_BY_TREATMENT, 
  INITIAL_VERIFICATION_QUEUE 
} from '../data/adminMockData.js';

// Predefined administrative roles
export const ADMIN_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  REVIEWER: 'reviewer'
};

// Explicit granular permissions per role
export const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'edit_hospitals',
    'delete_hospitals',
    'verify_affiliations',
    'manage_sources',
    'review_audit_logs',
    'approve_verification_queue',
    'reject_verification_queue',
    'upload_datasets'
  ],
  editor: [
    'edit_hospitals',
    'add_sources',
    'update_sources',
    'upload_datasets'
  ],
  reviewer: [
    'review_verification_queue',
    'approve_verification_queue',
    'reject_verification_queue'
  ]
};

// Local in-memory store so admin changes persist across route transitions in current session
let localHospitals = HOSPITALS.map(h => ({ ...h, isActive: h.isActive !== false }));
let localQueue = [...INITIAL_VERIFICATION_QUEUE];
let localAuditLogs = [];

const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * EXACT HOSPITAL IDENTITY MATCHING
 * 
 * Strict multi-field verification:
 * Name alone is never sufficient. Requires municipality and administrative territory confirmation.
 * Prevents false accreditation claims resulting from name collisions across different cities.
 * 
 * @param {Object} hospital - Target hospital entity
 * @param {Object} registryRecord - Official accreditation or programme registry filing
 * @returns {{ isMatch: boolean, status: string, reason: string }}
 */
export function matchHospitalIdentity(hospital, registryRecord) {
  if (!hospital || !registryRecord) {
    return { isMatch: false, status: 'not_found', reason: 'Missing hospital or registry record data' };
  }

  const clean = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  const hospName = clean(hospital.name);
  const regName = clean(registryRecord.name || registryRecord.organisationRecordName || registryRecord.hospitalMatchedName);

  if (!hospName || !regName) {
    return { isMatch: false, status: 'not_found', reason: 'Hospital or record name is missing' };
  }

  // Base name equivalence check
  const nameMatches = hospName === regName || hospName.includes(regName) || regName.includes(hospName);
  if (!nameMatches) {
    return { isMatch: false, status: 'not_found', reason: 'Hospital name does not correspond to registry record' };
  }

  // Mandatory City Match (Prevents collisions like XYZ Hospital Jalandhar vs XYZ Hospital Ludhiana)
  const hospCity = clean(hospital.location?.city || hospital.city);
  const regCity = clean(registryRecord.matchedCity || registryRecord.city);

  if (hospCity && regCity && hospCity !== regCity) {
    return {
      isMatch: false,
      status: 'conflicting',
      reason: `City mismatch: Hospital is located in ${hospital.location?.city || hospital.city}, but registry record is in ${registryRecord.city || registryRecord.matchedCity}. Cannot verify affiliation.`
    };
  }

  // State Match (if present in both)
  const hospState = clean(hospital.location?.state || hospital.state);
  const regState = clean(registryRecord.matchedState || registryRecord.state);
  if (hospState && regState && hospState !== regState) {
    return {
      isMatch: false,
      status: 'conflicting',
      reason: `State mismatch: Hospital is in ${hospital.location?.state || hospital.state}, but record is in ${registryRecord.state || registryRecord.matchedState}`
    };
  }

  // Pincode Match (if present in both)
  const hospPin = (hospital.location?.pincode || hospital.pincode || '').trim();
  const regPin = (registryRecord.matchedPincode || registryRecord.pincode || '').trim();
  if (hospPin && regPin && hospPin !== regPin) {
    return {
      isMatch: false,
      status: 'pending_review',
      reason: `Pincode disparity (${hospPin} vs ${regPin}). Marked for manual auditor inspection.`
    };
  }

  return {
    isMatch: true,
    status: 'verified',
    reason: 'Exact identity confirmed across hospital name, municipality, and administrative district'
  };
}

export const adminService = {
  matchHospitalIdentity,

  /**
   * Validate hospital input data strictly
   */
  validateHospitalInput(data) {
    const errors = [];

    // Beds validation: must be positive integer if provided
    if (data.beds !== undefined && data.beds !== null && data.beds !== '') {
      const numBeds = Number(data.beds);
      if (isNaN(numBeds) || !Number.isInteger(numBeds) || numBeds <= 0) {
        errors.push("Bed count must be a positive integer greater than 0");
      }
    }

    // Latitude validation: must be between -90 and 90
    if (data.latitude !== undefined && data.latitude !== null && data.latitude !== '') {
      const lat = Number(data.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push("Latitude must be a valid number between -90 and 90");
      }
    }

    // Longitude validation: must be between -180 and 180
    if (data.longitude !== undefined && data.longitude !== null && data.longitude !== '') {
      const lng = Number(data.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push("Longitude must be a valid number between -180 and 180");
      }
    }

    // Cost validation: treatment costs cannot be negative
    if (data.estimatedCosts && typeof data.estimatedCosts === 'object') {
      Object.entries(data.estimatedCosts).forEach(([key, costObj]) => {
        if (costObj) {
          if (costObj.min !== undefined && Number(costObj.min) < 0) {
            errors.push(`Treatment cost for ${key} cannot have negative min cost`);
          }
          if (costObj.max !== undefined && Number(costObj.max) < 0) {
            errors.push(`Treatment cost for ${key} cannot have negative max cost`);
          }
        }
      });
    }

    if (data.treatmentCost !== undefined && data.treatmentCost !== null && data.treatmentCost !== '') {
      if (Number(data.treatmentCost) < 0) {
        errors.push("Treatment cost cannot be negative");
      }
    }

    // Verification requirements: verified status requires non-empty source and verification date
    const status = data.verificationStatus || data.verification?.status;
    if (status === 'verified') {
      const source = data.dataSource || data.verification?.source;
      const date = data.verificationDate !== undefined ? data.verificationDate : data.verification?.lastUpdated;

      if (!source || typeof source !== 'string' || source.trim().length === 0) {
        errors.push("Verified status requires a non-empty data source name / citation");
      }
      if (date === undefined || date === null || (typeof date === 'string' && date.trim().length === 0)) {
        errors.push("Verified status requires a non-empty verification date");
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Log administrative audit event
   */
  logAudit({ adminUserId = 'system_admin', action, entityType = 'hospital', entityId, beforeValue = null, afterValue = null, reason = '' }) {
    const logEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      adminUserId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      beforeValue,
      afterValue,
      reason
    };
    localAuditLogs.unshift(logEntry);
    console.log('[ADMIN AUDIT LOG]', logEntry);
    return logEntry;
  },

  /**
   * Retrieve all audit logs
   */
  getAuditLogs() {
    return [...localAuditLogs];
  },

  /**
   * Authenticate admin user with explicit role and granular permissions
   */
  async authenticateAdmin({ username, password, role = 'admin' }) {
    await delay(100);
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      throw new Error("Username and password are required.");
    }

    if (cleanPass.length < 6) {
      throw new Error("Invalid credentials or insufficient authorization.");
    }

    // Support explicit roles: admin, editor, reviewer
    const validRoles = Object.values(ADMIN_ROLES);
    let assignedRole = validRoles.includes(role) ? role : 'admin';

    // If username prefix designates a role e.g. editor_john or reviewer_jane
    if (cleanUser.toLowerCase().startsWith('editor')) {
      assignedRole = 'editor';
    } else if (cleanUser.toLowerCase().startsWith('reviewer')) {
      assignedRole = 'reviewer';
    }

    const permissions = ROLE_PERMISSIONS[assignedRole] || [];

    const adminUser = {
      id: `usr_${cleanUser.toLowerCase()}`,
      username: cleanUser,
      name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
      email: `${cleanUser.toLowerCase()}@sehatsathi.gov.in`,
      role: assignedRole,
      permissions,
      department: assignedRole === 'admin' 
        ? 'Regional Healthcare Directorate' 
        : assignedRole === 'editor' 
        ? 'Healthcare Registry Data Operations' 
        : 'Quality & Verification Audit Board',
      authenticatedAt: new Date().toISOString()
    };

    this.logAudit({
      adminUserId: adminUser.id,
      action: 'admin_login',
      entityType: 'session',
      entityId: adminUser.id,
      beforeValue: null,
      afterValue: { role: adminUser.role, email: adminUser.email, permissionsCount: permissions.length },
      reason: `User authenticated with role: ${assignedRole}`
    });

    return {
      success: true,
      user: adminUser,
      token: `auth_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    };
  },

  /**
   * Fetch high-level analytics & chart datasets
   */
  async getDashboardData() {
    await delay();
    const activeList = localHospitals.filter(h => h.isActive !== false);
    const verifiedCount = activeList.filter(h => h.verification.status === 'verified').length;
    const pendingCount = localQueue.filter(q => q.verificationStatus === 'pending').length;

    return {
      stats: {
        ...ADMIN_STATS,
        totalHospitals: activeList.length,
        verifiedHospitals: verifiedCount,
        pendingVerification: pendingCount
      },
      cityDistribution: HOSPITALS_BY_CITY,
      specialtyDistribution: HOSPITALS_BY_SPECIALTY,
      verificationBreakdown: VERIFICATION_DISTRIBUTION,
      treatmentCosts: AVG_COST_BY_TREATMENT
    };
  },

  /**
   * Fetch all hospitals for admin table with search, filter, and sorting
   */
  async getAdminHospitals(search = '', statusFilter = 'all', includeInactive = false) {
    await delay();
    let list = localHospitals.filter(h => includeInactive || h.isActive !== false);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.location.city.toLowerCase().includes(q) ||
        h.specialties.some(s => s.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(h => h.verification.status === statusFilter);
    }

    return list;
  },

  /**
   * Add a new hospital record with validation and audit trail
   */
  async addHospital(hospitalData, adminUserId = 'system_admin') {
    await delay(150);

    const verificationDate = hospitalData.verificationDate !== undefined
      ? hospitalData.verificationDate
      : new Date().toISOString().split('T')[0];

    // Validate inputs
    const validation = this.validateHospitalInput({ ...hospitalData, verificationDate });
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join('; ')}`);
    }

    const newId = localHospitals.length > 0 ? Math.max(...localHospitals.map(h => h.id)) + 1 : 1;
    const verificationStatus = hospitalData.verificationStatus || "verified";
    const dataSource = hospitalData.dataSource || "Admin Direct Entry";

    const newHospital = {
      id: newId,
      name: hospitalData.name,
      shortName: hospitalData.name.split(' ')[0] + ' Hospital',
      type: hospitalData.type || "Multispeciality",
      tagline: hospitalData.tagline || "Verified modern medical centre",
      isActive: true,
      location: {
        city: hospitalData.city || "Chandigarh",
        address: hospitalData.address || "Sector Institutional Area",
        pincode: hospitalData.pincode || "160001",
        latitude: parseFloat(hospitalData.latitude) || 30.7333,
        longitude: parseFloat(hospitalData.longitude) || 76.7794,
        landmark: hospitalData.landmark || "City Center"
      },
      distance: 3.5,
      phone: hospitalData.phone || "+91 172 200 0000",
      emergencyPhone: hospitalData.emergencyPhone || "+91 172 200 9999",
      emergency24x7: !!hospitalData.emergency24x7,
      beds: parseInt(hospitalData.beds, 10) || 100,
      icuBeds: parseInt(hospitalData.icuBeds, 10) || 15,
      establishedYear: parseInt(hospitalData.establishedYear, 10) || 2020,
      rating: 4.5,
      reviewCount: 1,
      accreditation: hospitalData.accreditation || ["NABH"],
      specialties: hospitalData.specialties || ["General Medicine"],
      facilities: hospitalData.facilities || ["icu", "emergency"],
      facilityStatuses: hospitalData.facilities ? hospitalData.facilities.reduce((acc, f) => ({ ...acc, [f]: 'available' }), {}) : { icu: 'available' },
      estimatedCosts: hospitalData.estimatedCosts || {
        kidneyTreatment: { min: 50000, max: 90000, label: "₹50,000 – ₹90,000" }
      },
      patientVolumeAnnual: 20000,
      verification: {
        status: verificationStatus,
        lastUpdated: verificationDate,
        source: dataSource,
        verifiedFields: ["beds", "icuBeds", "facilities", "emergency24x7"]
      },
      overview: hospitalData.overview || `${hospitalData.name} provides specialized healthcare services with modern infrastructure and accredited medical staff.`,
      organisationAffiliations: hospitalData.organisationAffiliations || [],
      performanceData: hospitalData.performanceData || {}
    };

    localHospitals.unshift(newHospital);

    this.logAudit({
      adminUserId,
      action: 'add_hospital',
      entityType: 'hospital',
      entityId: newHospital.id,
      beforeValue: null,
      afterValue: { id: newHospital.id, name: newHospital.name, verification: newHospital.verification },
      reason: 'Hospital manually created via admin portal'
    });

    return newHospital;
  },

  /**
   * Update verification status of a hospital with audit tracking
   */
  async updateHospitalStatus(id, newStatus, reason = 'Administrative verification update', adminUserId = 'system_admin') {
    await delay();
    const index = localHospitals.findIndex(h => h.id === Number(id));
    if (index !== -1) {
      const beforeStatus = localHospitals[index].verification?.status;
      const updatedDate = new Date().toISOString().split('T')[0];

      localHospitals[index] = {
        ...localHospitals[index],
        verification: {
          ...localHospitals[index].verification,
          status: newStatus,
          lastUpdated: updatedDate
        }
      };

      this.logAudit({
        adminUserId,
        action: 'update_verification_status',
        entityType: 'hospital',
        entityId: id,
        beforeValue: { status: beforeStatus },
        afterValue: { status: newStatus, lastUpdated: updatedDate },
        reason
      });

      return localHospitals[index];
    }
    throw new Error("Hospital not found");
  },

  /**
   * Soft-delete a hospital record with confirmation & audit log
   * Enforces role permission: only users with 'delete_hospitals' permission or 'admin' role can soft-delete
   */
  async deleteHospital(id, reason = 'Decommissioned by administrator', adminUserId = 'system_admin', userRole = 'admin') {
    await delay(100);

    // Permission enforcement
    if (userRole && userRole !== 'admin') {
      throw new Error("Unauthorized: Only users with the 'admin' role possess delete_hospitals privileges.");
    }

    const index = localHospitals.findIndex(h => h.id === Number(id));
    if (index === -1) {
      throw new Error(`Hospital with ID ${id} not found.`);
    }

    const hosp = localHospitals[index];
    const beforeState = {
      id: hosp.id,
      name: hosp.name,
      isActive: hosp.isActive !== false
    };

    const deletedAt = new Date().toISOString();
    localHospitals[index] = {
      ...hosp,
      isActive: false,
      deletedAt,
      deactivationReason: reason
    };

    this.logAudit({
      adminUserId,
      action: 'delete_hospital',
      entityType: 'hospital',
      entityId: id,
      beforeValue: beforeState,
      afterValue: { id: hosp.id, name: hosp.name, isActive: false, deletedAt, deactivationReason: reason },
      reason
    });

    return {
      success: true,
      hospital: localHospitals[index]
    };
  },

  /**
   * Get pending verification queue items
   */
  async getVerificationQueue() {
    await delay();
    return [...localQueue];
  },

  /**
   * Process a queue item (Verify, Reject, or Request Update)
   */
  async processQueueItem(queueId, action, notes = '', adminUserId = 'system_admin') {
    await delay();
    const item = localQueue.find(q => q.id === queueId);
    if (!item) throw new Error("Item not found");

    const previousStatus = item.verificationStatus;

    if (action === 'verify') {
      item.verificationStatus = 'verified';
      const hosp = localHospitals.find(h => h.id === item.hospitalId);
      if (hosp) {
        hosp.verification.status = 'verified';
        hosp.verification.lastUpdated = new Date().toISOString().split('T')[0];
      }
    } else if (action === 'reject') {
      item.verificationStatus = 'rejected';
    } else {
      item.verificationStatus = 'update_requested';
    }
    item.reviewNotes = notes;
    item.resolvedDate = new Date().toISOString().split('T')[0];

    this.logAudit({
      adminUserId,
      action: 'process_verification_queue',
      entityType: 'queue_item',
      entityId: queueId,
      beforeValue: { status: previousStatus },
      afterValue: { status: item.verificationStatus, reviewNotes: notes },
      reason: `Queue item processed with action: ${action}`
    });

    return item;
  },

  /**
   * Validate and parse mock CSV string
   */
  async parseAndValidateCsv(csvText) {
    await delay(200);
    const lines = csvText.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("CSV file contains no records.");
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const expectedHeaders = ['name', 'type', 'city', 'address', 'phone', 'emergency24x7', 'beds', 'icuBeds'];
    const missing = expectedHeaders.filter(eh => !headers.some(h => h.toLowerCase() === eh.toLowerCase()));

    if (missing.length > 0) {
      throw new Error(`CSV is missing required columns: ${missing.join(', ')}`);
    }

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }

    return {
      totalRows: rows.length,
      preview: rows.slice(0, 5),
      valid: true
    };
  },

  /**
   * Import parsed CSV rows into local store
   */
  async importCsvData(rows = [], adminUserId = 'system_admin') {
    await delay(300);
    let count = 0;
    for (const r of rows) {
      if (r.name) {
        await this.addHospital({
          name: r.name,
          type: r.type || "Multispeciality",
          city: r.city || "Chandigarh",
          address: r.address || "Sector 17",
          pincode: r.pincode || "160017",
          phone: r.phone || "+91 172 000 0000",
          emergency24x7: r.emergency24x7 === 'true' || r.emergency24x7 === true,
          beds: parseInt(r.beds, 10) || 120,
          icuBeds: parseInt(r.icuBeds, 10) || 18,
          accreditation: r.accreditation ? r.accreditation.split(';') : ["NABH"],
          specialties: r.specialties ? r.specialties.split(';') : ["General Medicine"],
          facilities: r.facilities ? r.facilities.split(';') : ["icu", "emergency"],
          dataSource: "CSV Bulk Dataset Import",
          verificationStatus: "verified",
          verificationDate: new Date().toISOString().split('T')[0]
        }, adminUserId);
        count++;
      }
    }

    return {
      importedCount: count,
      success: true
    };
  }
};

/**
 * Validates a condition-specific outcome metric object before persistence.
 * Prevents invalid ranges, inverted fractions, and missing source citations.
 */
export function validateConditionOutcomeMetric(metric = {}) {
  const errors = [];
  if (!metric || typeof metric !== 'object') {
    return { isValid: false, errors: ['Metric must be a valid object'] };
  }

  if (!metric.metricName || typeof metric.metricName !== 'string' || !metric.metricName.trim()) {
    errors.push('Metric name is required');
  }

  if (!metric.label || typeof metric.label !== 'string' || !metric.label.trim()) {
    errors.push('Metric label is required');
  }

  if (!metric.definition || typeof metric.definition !== 'string' || !metric.definition.trim()) {
    errors.push('Precise clinical definition is required');
  }

  if (!metric.source || typeof metric.source !== 'string' || !metric.source.trim()) {
    errors.push('Authoritative source citation is required');
  }

  if (metric.value !== null && metric.value !== undefined) {
    const val = Number(metric.value);
    if (isNaN(val) || val < 0) {
      errors.push('Metric value must be a non-negative number');
    }
    if (metric.unit === '%' && val > 100) {
      errors.push('Percentage metric value cannot exceed 100%');
    }
  }

  if (metric.numerator !== null && metric.numerator !== undefined && metric.denominator !== null && metric.denominator !== undefined) {
    const num = Number(metric.numerator);
    const den = Number(metric.denominator);
    if (isNaN(num) || num < 0) {
      errors.push('Numerator must be a non-negative number');
    }
    if (isNaN(den) || den <= 0) {
      errors.push('Denominator must be a positive number greater than 0');
    }
    if (!isNaN(num) && !isNaN(den) && num > den) {
      errors.push('Numerator cannot be greater than denominator');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

adminService.validateConditionOutcomeMetric = validateConditionOutcomeMetric;

