/**
 * Sehat_Sathi - Admin Mock Data & Initial Audit Queue
 */

export const ADMIN_STATS = {
  totalHospitals: 12,
  verifiedHospitals: 9,
  pendingVerification: 2,
  flaggedForReview: 1,
  recentlyUpdatedCount: 5,
  avgEstimatedCostGeneral: 62500,
  citiesCovered: ["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar"],
  dataAccuracyRate: "98.4%"
};

export const HOSPITALS_BY_CITY = [
  { city: "Chandigarh", count: 5, verified: 4 },
  { city: "Mohali", count: 4, verified: 3 },
  { city: "Panchkula", count: 3, verified: 2 }
];

export const HOSPITALS_BY_SPECIALTY = [
  { specialty: "Nephrology & Urology", count: 11 },
  { specialty: "Cardiology", count: 9 },
  { specialty: "Orthopedics", count: 8 },
  { specialty: "Oncology", count: 5 },
  { specialty: "Maternity", count: 5 },
  { specialty: "Neurology", count: 6 },
  { specialty: "Pulmonology", count: 7 }
];

export const VERIFICATION_DISTRIBUTION = [
  { status: "Verified", count: 9, color: "#16a34a" },
  { status: "Estimated / Partial", count: 2, color: "#ca8a04" },
  { status: "Pending Audit", count: 1, color: "#64748b" }
];

export const AVG_COST_BY_TREATMENT = [
  { treatment: "Kidney Dialysis / Care", avgCost: 55000 },
  { treatment: "Cardiac Interventions", avgCost: 155000 },
  { treatment: "Orthopedic / Joint", avgCost: 92000 },
  { treatment: "Cancer Chemotherapy", avgCost: 185000 },
  { treatment: "Maternity Delivery", avgCost: 42000 }
];

export const INITIAL_VERIFICATION_QUEUE = [
  {
    id: "vq-101",
    hospitalId: 12,
    hospitalName: "Dharamsheela Institute of Medical Sciences",
    city: "Chandigarh",
    submittedBy: "Hospital Admin (Dr. V. Sharma)",
    submissionDate: "2026-09-15",
    type: "New Facility Claim",
    submittedData: {
      dialysisBeds: 12,
      icuBeds: 18,
      emergencyStatus: "Daytime 8am-8pm (Requesting upgrade to 24x7)"
    },
    currentData: {
      dialysisBeds: 8,
      icuBeds: 14,
      emergencyStatus: "Limited / Day hours"
    },
    proofDocument: "NABH_Self_Audit_Form_2026.pdf",
    verificationStatus: "pending",
    source: "Hospital Self-submission",
    notes: "Awaiting local civil health officer verification stamp."
  },
  {
    id: "vq-102",
    hospitalId: 10,
    hospitalName: "Indus Super Speciality Hospital",
    city: "Mohali",
    submittedBy: "Public Auditor (P. Verma)",
    submissionDate: "2026-09-12",
    type: "Cost Range Update",
    submittedData: {
      kidneyTreatmentMin: 48000,
      kidneyTreatmentMax: 78000,
      dialysisSessionCost: 2200
    },
    currentData: {
      kidneyTreatmentMin: 45000,
      kidneyTreatmentMax: 75000,
      dialysisSessionCost: 2000
    },
    proofDocument: "Hospital_Tariff_Card_Rev2026.pdf",
    verificationStatus: "pending",
    source: "Published Hospital Tariff Card",
    notes: "Updated tariff card released for Q3 2026."
  },
  {
    id: "vq-103",
    hospitalId: 4,
    hospitalName: "NorthCare Hospital",
    city: "Panchkula",
    submittedBy: "Facility Lead (R. Gupta)",
    submissionDate: "2026-09-08",
    type: "New Equipment Installation",
    submittedData: {
      mri: "Upgrading to 1.5T Philips Ingenia (Operational by Nov 2026)"
    },
    currentData: {
      mri: "Limited / Offsite referral"
    },
    proofDocument: "AERB_Installation_Approval.pdf",
    verificationStatus: "in_review",
    source: "AERB Safety Clearance",
    notes: "Site inspection scheduled next week."
  }
];

export const SAMPLE_CSV_TEMPLATE = `name,type,city,address,pincode,phone,emergency24x7,beds,icuBeds,specialties,facilities,accreditation,source
Metro Health Centre,Multispeciality,Chandigarh,Sector 44,160047,+91 172 260 1234,true,140,20,"Cardiology;Nephrology","icu;dialysis;ct_scan;emergency","NABH",Hospital Direct
Aastha Medical Hospital,Super Speciality,Mohali,Phase 5,160059,+91 172 222 3456,true,210,30,"Oncology;Orthopedics","icu;mri;ct_scan;blood_bank","NABH;NABL",State Health Dept
Sanjeevani Care Trust,Charitable Trust,Panchkula,Sector 11,134109,+91 172 257 6789,true,90,12,"Maternity;Pediatrics","icu;emergency;pharmacy","State Health Verified",Public Record`;
