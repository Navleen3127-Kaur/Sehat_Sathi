/**
 * Sehat_Sathi - Conditions & Treatment Categories Mock Dataset
 * Maps condition search keywords to medical specialties, required facilities, and cost ranges.
 * Non-diagnostic and educational.
 */

export const TREATMENTS = [
  {
    id: "kidney_treatment",
    name: "Kidney-related Care & Dialysis",
    keywords: ["kidney", "renal", "dialysis", "nephrology", "kidney stones", "creatinine"],
    specialtyId: "nephrology",
    recommendedFacilities: ["dialysis", "icu", "blood_bank"],
    estimatedCostRange: {
      min: 45000,
      max: 180000,
      currency: "INR",
      label: "₹45,000 – ₹1,80,000"
    },
    description: "Care pathways for renal conditions, hemodialysis management, and urinary interventions."
  },
  {
    id: "cardiac_care",
    name: "Cardiovascular Care & Angioplasty",
    keywords: ["heart", "cardio", "cardiology", "angioplasty", "bypass", "stent", "chest pain"],
    specialtyId: "cardiology",
    recommendedFacilities: ["cath_lab", "icu", "operation_theatre", "emergency"],
    estimatedCostRange: {
      min: 120000,
      max: 350000,
      currency: "INR",
      label: "₹1,20,000 – ₹3,50,000"
    },
    description: "Evaluations for heart conditions, diagnostic angiographies, stent procedures, and coronary care."
  },
  {
    id: "cancer_care",
    name: "Oncology & Chemotherapy",
    keywords: ["cancer", "oncology", "chemo", "tumor", "radiation", "biopsy"],
    specialtyId: "oncology",
    recommendedFacilities: ["operation_theatre", "icu", "mri", "ct_scan", "pharmacy"],
    estimatedCostRange: {
      min: 150000,
      max: 500000,
      currency: "INR",
      label: "₹1,50,000 – ₹5,00,000"
    },
    description: "Comprehensive medical, surgical, and therapeutic cancer care infrastructure."
  },
  {
    id: "orthopedic_care",
    name: "Orthopedic Surgery & Joint Replacement",
    keywords: ["bone", "joint", "ortho", "knee replacement", "hip replacement", "fracture", "spine"],
    specialtyId: "orthopedics",
    recommendedFacilities: ["operation_theatre", "mri", "icu"],
    estimatedCostRange: {
      min: 80000,
      max: 220000,
      currency: "INR",
      label: "₹80,000 – ₹2,20,000"
    },
    description: "Orthopedic trauma interventions, arthroscopic surgeries, and total joint replacements."
  },
  {
    id: "maternity_care",
    name: "Maternity Care & Delivery",
    keywords: ["maternity", "pregnancy", "delivery", "gynecology", "c-section", "obstetrics"],
    specialtyId: "maternity",
    recommendedFacilities: ["operation_theatre", "nicu", "blood_bank", "emergency"],
    estimatedCostRange: {
      min: 35000,
      max: 95000,
      currency: "INR",
      label: "₹35,000 – ₹95,000"
    },
    description: "Antenatal, delivery (normal & cesarean), and post-partum neonatal support suites."
  },
  {
    id: "emergency_trauma",
    name: "Emergency & Acute Critical Care",
    keywords: ["emergency", "trauma", "accident", "critical", "icu", "urgent"],
    specialtyId: "pulmonology",
    recommendedFacilities: ["emergency", "icu", "operation_theatre", "blood_bank", "ambulance"],
    estimatedCostRange: {
      min: 25000,
      max: 150000,
      currency: "INR",
      label: "₹25,000 – ₹1,50,000"
    },
    description: "Immediate triage, stabilization, acute resuscitation, and multi-specialty trauma handling."
  }
];

export const getTreatmentByKeyword = (query) => {
  if (!query) return null;
  const lower = query.toLowerCase();
  return TREATMENTS.find(t => t.keywords.some(k => lower.includes(k))) || null;
};
