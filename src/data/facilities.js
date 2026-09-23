/**
 * Sehat_Sathi - Facilities Master Mock Dataset
 * Contains facility definitions, icons, categories, and descriptions.
 */

export const FACILITIES = [
  {
    id: "icu",
    name: "ICU (Intensive Care Unit)",
    shortName: "ICU",
    category: "Critical Care",
    icon: "ActivitySquare",
    description: "Equipped with advanced multi-parameter monitors, ventilators, and 24/7 intensivist coverage."
  },
  {
    id: "emergency",
    name: "24x7 Emergency & Trauma",
    shortName: "Emergency",
    category: "Critical Care",
    icon: "AlertCircle",
    description: "Round-the-clock emergency triage, resuscitation bays, and on-duty emergency physicians."
  },
  {
    id: "dialysis",
    name: "Dialysis Unit",
    shortName: "Dialysis",
    category: "Specialized Care",
    icon: "Repeat",
    description: "Hemodialysis stations, peritoneal dialysis support, and dedicated renal nurses."
  },
  {
    id: "mri",
    name: "MRI Imaging (1.5T / 3T)",
    shortName: "MRI",
    category: "Diagnostics",
    icon: "Scan",
    description: "High-resolution magnetic resonance imaging for neuro, spine, cardiac, and musculoskeletal scans."
  },
  {
    id: "ct_scan",
    name: "CT Scan (Multi-slice)",
    shortName: "CT Scan",
    category: "Diagnostics",
    icon: "Layers",
    description: "64 to 128 slice rapid CT imaging for rapid trauma, chest, and angiographic scans."
  },
  {
    id: "blood_bank",
    name: "Licensed Blood Bank & Component Separation",
    shortName: "Blood Bank",
    category: "Support Services",
    icon: "Droplet",
    description: "24/7 availability of packed red cells, platelets, fresh frozen plasma, and cryoprecipitate."
  },
  {
    id: "operation_theatre",
    name: "Modular Operation Theatres (OT)",
    shortName: "Modular OT",
    category: "Surgical",
    icon: "Scissors",
    description: "Laminar airflow, HEPA filtration, and advanced laparoscopic/robotic surgical towers."
  },
  {
    id: "pharmacy",
    name: "24x7 In-house Pharmacy",
    shortName: "Pharmacy",
    category: "Support Services",
    icon: "Pill",
    description: "Round-the-clock dispensing of emergency, critical, and outpatient medications."
  },
  {
    id: "ambulance",
    name: "Advanced Life Support (ALS) Ambulance",
    shortName: "Ambulance",
    category: "Transport",
    icon: "Truck",
    description: "Equipped with transport ventilator, defibrillator, oxygen pipeline, and paramedic crew."
  },
  {
    id: "nicu",
    name: "NICU (Neonatal Intensive Care)",
    shortName: "NICU",
    category: "Critical Care",
    icon: "Baby",
    description: "Level III neonatal intensive care with incubators, phototherapy, and neonatal ventilators."
  },
  {
    id: "cath_lab",
    name: "Digital Cardiac Cath Lab",
    shortName: "Cath Lab",
    category: "Cardiology",
    icon: "Zap",
    description: "Flat-panel digital catheterization laboratory for primary PCI, angiograms, and stenting."
  }
];

export const getFacilityById = (id) => FACILITIES.find(f => f.id === id);
