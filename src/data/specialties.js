/**
 * Sehat_Sathi - Medical Specialties Mock Dataset
 * Used for specialty filtering, tags, and AI query keyword matching.
 */

export const SPECIALTIES = [
  {
    id: "nephrology",
    name: "Nephrology & Urology",
    shortName: "Nephrology",
    category: "Kidney & Urinary",
    description: "Kidney-related care, dialysis management, kidney stones, and urinary tract treatments.",
    commonConditions: ["Kidney stones", "Chronic Kidney Disease", "Dialysis", "Renal Failure", "Urinary infections"],
    icon: "Activity"
  },
  {
    id: "cardiology",
    name: "Cardiology & Cardiac Surgery",
    shortName: "Cardiology",
    category: "Heart & Vascular",
    description: "Heart care, angioplasty, pacemaker implantation, bypass surgery, and cardiovascular health.",
    commonConditions: ["Chest pain", "Heart attack", "Arrhythmia", "Hypertension", "Coronary artery disease"],
    icon: "Heart"
  },
  {
    id: "oncology",
    name: "Oncology (Cancer Care)",
    shortName: "Oncology",
    category: "Cancer & Tumors",
    description: "Medical, surgical, and radiation oncology treatments and chemotherapy facilities.",
    commonConditions: ["Breast cancer", "Lung cancer", "Oral cancer", "Leukemia", "Lymphoma"],
    icon: "ShieldAlert"
  },
  {
    id: "orthopedics",
    name: "Orthopedics & Joint Care",
    shortName: "Orthopedics",
    category: "Bones & Joints",
    description: "Bone trauma, knee and hip replacements, arthroscopy, and spine disorder treatments.",
    commonConditions: ["Knee osteoarthritis", "Fractures", "Spine disc slip", "Ligament tear", "Joint replacement"],
    icon: "Bone"
  },
  {
    id: "neurology",
    name: "Neurology & Neurosurgery",
    shortName: "Neurology",
    category: "Brain & Nerves",
    description: "Brain stroke management, epilepsy, Parkinson's, nerve disorders, and neurosurgical procedures.",
    commonConditions: ["Stroke", "Brain hemorrhage", "Migraine", "Epilepsy", "Head trauma"],
    icon: "Brain"
  },
  {
    id: "gastroenterology",
    name: "Gastroenterology & Hepatology",
    shortName: "Gastroenterology",
    category: "Digestive & Liver",
    description: "Digestive system ailments, endoscopy, colonoscopy, liver cirrhosis, and GI surgery.",
    commonConditions: ["Liver disease", "Acid reflux", "Gallstones", "Jaundice", "Pancreatitis"],
    icon: "Stethoscope"
  },
  {
    id: "maternity",
    name: "Obstetrics & Gynecology",
    shortName: "Maternity",
    category: "Women & Child",
    description: "Maternity care, high-risk pregnancy, normal/C-section delivery, and women's health.",
    commonConditions: ["Pregnancy", "C-section delivery", "PCOS / PCOD", "High-risk pregnancy", "Fertility care"],
    icon: "Baby"
  },
  {
    id: "pediatrics",
    name: "Pediatrics & Neonatology",
    shortName: "Pediatrics",
    category: "Child Health",
    description: "Infant and child care, NICU critical care, pediatric surgery, and child vaccinations.",
    commonConditions: ["Neonatal jaundice", "Pediatric infections", "Premature birth care", "Asthma in children"],
    icon: "UserCheck"
  },
  {
    id: "pulmonology",
    name: "Pulmonology & Respiratory",
    shortName: "Pulmonology",
    category: "Lungs & Breathing",
    description: "Asthma, COPD, lung infections, sleep apnea, and critical respiratory support.",
    commonConditions: ["Severe Asthma", "COPD", "Pneumonia", "Tuberculosis", "Bronchitis"],
    icon: "Wind"
  }
];

export const getSpecialtyById = (id) => SPECIALTIES.find(s => s.id === id);
export const getSpecialtyByName = (name) => SPECIALTIES.find(s => s.shortName.toLowerCase() === name.toLowerCase() || s.name.toLowerCase() === name.toLowerCase());
