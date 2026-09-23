/**
 * Sehat_Sathi - Centralized Medical Condition & Procedure Catalogue
 * 
 * Defines structured taxonomy across 18 clinical categories:
 * 1. Cardiovascular
 * 2. Neurology
 * 3. Oncology
 * 4. Kidney / Urology
 * 5. Transplant
 * 6. Liver / Gastroenterology
 * 7. Respiratory
 * 8. Orthopedics
 * 9. Endocrinology
 * 10. Pediatrics
 * 11. Women's Health
 * 12. Eye
 * 13. ENT
 * 14. Dermatology
 * 15. Mental Health
 * 16. Infectious Disease
 * 17. Emergency / Critical Care
 * 18. General / Multispecialty
 * 
 * CORE PRINCIPLE:
 * Strict distinction between Condition ≠ Facility ≠ Procedure.
 * Preserves ambiguity instead of making unsupported clinical assumptions.
 */

export const CLINICAL_CATEGORIES = [
  "Cardiovascular",
  "Neurology",
  "Oncology",
  "Kidney / Urology",
  "Transplant",
  "Liver / Gastroenterology",
  "Respiratory",
  "Orthopedics",
  "Endocrinology",
  "Pediatrics",
  "Women's Health",
  "Eye",
  "ENT",
  "Dermatology",
  "Mental Health",
  "Infectious Disease",
  "Emergency / Critical Care",
  "General / Multispecialty"
];

export const CONDITION_CATALOGUE = [
  // ==========================================
  // 1. CARDIOVASCULAR
  // ==========================================
  {
    id: "heart_disease",
    name: "Heart Disease & Cardiology",
    category: "Cardiovascular",
    type: "condition",
    isBroad: true,
    aliases: [
      "heart disease", "cardiovascular", "cardiac", "heart problem", "heart ka doctor", "dil ka hospital",
      "dil ki bimari", "heart care", "दिल", "हृदय", "हार्ट", "ਦਿਲ", "ਹਿਰਦਾ", "ਹਾਰਟ", "dil"
    ],
    relatedSpecialties: ["Cardiology", "Cardiovascular Surgery", "Cardiac Surgery"],
    relatedFacilities: ["icu", "cath_lab", "emergency"],
    relatedProcedures: ["angioplasty", "bypass_surgery"],
    costKey: "cardiacCare"
  },
  {
    id: "coronary_artery_disease",
    name: "Coronary Artery Disease (CAD)",
    category: "Cardiovascular",
    type: "condition",
    aliases: [
      "coronary artery disease", "cad", "artery blockage", "blockage in heart", "heart blockage",
      "धमनी की बीमारी", "ਧਮਣੀ ਰੋਗ"
    ],
    relatedSpecialties: ["Cardiology", "Cardiovascular Surgery"],
    relatedFacilities: ["cath_lab", "icu"],
    relatedProcedures: ["angioplasty", "bypass_surgery"],
    costKey: "cardiacCare"
  },
  {
    id: "heart_attack",
    name: "Heart Attack / Myocardial Infarction",
    category: "Cardiovascular",
    type: "condition",
    aliases: [
      "heart attack", "myocardial infarction", "acute coronary syndrome", "stemi",
      "हार्ट अटैक", "दिल का दौरा", "ਹਾਰਟ ਅਟੈਕ", "ਦਿਲ ਦਾ ਦੌਰਾ"
    ],
    relatedSpecialties: ["Cardiology", "Emergency & Trauma", "Critical Care"],
    relatedFacilities: ["cath_lab", "icu", "emergency"],
    relatedProcedures: ["angioplasty"],
    costKey: "cardiacCare"
  },
  {
    id: "heart_failure",
    name: "Heart Failure",
    category: "Cardiovascular",
    type: "condition",
    aliases: ["heart failure", "congestive heart failure", "chf", "heart kamjor", "हृदय विफलता", "ਦਿਲ ਦਾ ਫੇਲ੍ਹ ਹੋਣਾ"],
    relatedSpecialties: ["Cardiology", "Critical Care"],
    relatedFacilities: ["icu", "emergency"],
    relatedProcedures: ["heart_transplant"],
    costKey: "cardiacCare"
  },
  {
    id: "arrhythmia",
    name: "Cardiac Arrhythmia",
    category: "Cardiovascular",
    type: "condition",
    aliases: ["arrhythmia", "irregular heartbeat", "palpitations", "tachycardia", "bradycardia", "दिल की धड़कन"],
    relatedSpecialties: ["Cardiology", "Cardiac Electrophysiology"],
    relatedFacilities: ["cath_lab", "icu"],
    relatedProcedures: ["pacemaker_implantation"],
    costKey: "cardiacCare"
  },
  {
    id: "valvular_heart_disease",
    name: "Valvular Heart Disease",
    category: "Cardiovascular",
    type: "condition",
    aliases: ["valve disease", "heart valve", "aortic stenosis", "mitral valve", "valve replacement", "हार्ट वाल्व"],
    relatedSpecialties: ["Cardiology", "Cardiovascular Surgery"],
    relatedFacilities: ["cath_lab", "operation_theatre"],
    relatedProcedures: ["valve_replacement"],
    costKey: "cardiacCare"
  },
  {
    id: "congenital_heart_disease",
    name: "Congenital Heart Disease",
    category: "Cardiovascular",
    type: "condition",
    aliases: ["congenital heart", "hole in heart", "pediatric cardiac", "जन्मजात हृदय रोग", "ਦਿਲ ਵਿੱਚ ਛੇਕ"],
    relatedSpecialties: ["Pediatric Cardiology", "Cardiovascular Surgery", "Pediatrics"],
    relatedFacilities: ["nicu", "icu", "operation_theatre"],
    relatedProcedures: [],
    costKey: "cardiacCare"
  },

  // ==========================================
  // 2. NEUROLOGY
  // ==========================================
  {
    id: "neurological_disorders",
    name: "Neurological & Brain Disorders (General)",
    category: "Neurology",
    type: "condition",
    isBroad: true, // Preserves ambiguity for "brain ka treatment"
    aliases: [
      "brain treatment", "brain ka treatment", "brain hospital", "neurology", "neuro problem",
      "brain doctor", "dimag ka hospital", "dimag ki bimari", "दिमाग का इलाज", "ਨਿਊਰੋ", "ਦਿਮਾਗ"
    ],
    relatedSpecialties: ["Neurology", "Neurosurgery"],
    relatedFacilities: ["mri", "ct_scan", "icu"],
    relatedProcedures: [],
    costKey: null
  },
  {
    id: "alzheimers",
    name: "Alzheimer's Disease & Dementia",
    category: "Neurology",
    type: "condition",
    aliases: [
      "alzheimer", "alzheimer's", "alzheimers", "alzheimer ka hospital", "alzheimer disease",
      "dementia", "memory loss", "bhoolne ki bimari", "अल्जाइमर", "ਅਲਜ਼ਾਈਮਰ", "ਯਾਦਦਾਸ਼ਤ ਦੀ ਕਮਜ਼ੋਰੀ"
    ],
    relatedSpecialties: ["Neurology", "Geriatric Medicine", "Psychiatry"],
    relatedFacilities: ["mri", "ct_scan"],
    relatedProcedures: [],
    costKey: null
  },
  {
    id: "parkinsons",
    name: "Parkinson's Disease",
    category: "Neurology",
    type: "condition",
    aliases: ["parkinson", "parkinson's", "parkinsons", "tremors", "हाथ कांपना", "ਪਾਰਕਿੰਸਨ"],
    relatedSpecialties: ["Neurology", "Neurosurgery"],
    relatedFacilities: ["mri"],
    relatedProcedures: ["deep_brain_stimulation"],
    costKey: null
  },
  {
    id: "stroke",
    name: "Stroke & Cerebrovascular Attack",
    category: "Neurology",
    type: "condition",
    aliases: ["stroke", "brain stroke", "paralysis", "lakwa", "falij", "स्ट्रोक", "लकवा", "ਪਾਸਾ ਮਾਰਿਆ", "ਲਕਵਾ"],
    relatedSpecialties: ["Neurology", "Critical Care", "Emergency & Trauma", "Neurosurgery"],
    relatedFacilities: ["ct_scan", "mri", "icu", "emergency"],
    relatedProcedures: [],
    costKey: null
  },
  {
    id: "epilepsy",
    name: "Epilepsy & Seizure Disorders",
    category: "Neurology",
    type: "condition",
    aliases: ["epilepsy", "seizures", "fits", "mirgi", "daure", "दौरा", "ਮਿਰਗੀ", "ਦੌਰੇ"],
    relatedSpecialties: ["Neurology", "Pediatrics"],
    relatedFacilities: ["mri", "eeg"],
    relatedProcedures: [],
    costKey: null
  },
  {
    id: "multiple_sclerosis",
    name: "Multiple Sclerosis (MS)",
    category: "Neurology",
    type: "condition",
    aliases: ["multiple sclerosis", "ms", "मल्टीपल स्केलेरोसिस"],
    relatedSpecialties: ["Neurology"],
    relatedFacilities: ["mri"],
    relatedProcedures: [],
    costKey: null
  },
  {
    id: "brain_tumor",
    name: "Brain Tumor & Neuro-Oncology",
    category: "Neurology",
    type: "condition",
    aliases: ["brain tumor", "brain cancer", "neuro tumor", "दिमाग का ट्यूमर", "ਦਿਮਾਗ ਦੀ ਗੰਢ"],
    relatedSpecialties: ["Neurosurgery", "Neurology", "Oncology (Cancer Care)"],
    relatedFacilities: ["mri", "ct_scan", "operation_theatre", "icu"],
    relatedProcedures: ["craniotomy", "radiation_therapy"],
    costKey: null
  },

  // ==========================================
  // 3. ONCOLOGY / CANCER
  // ==========================================
  {
    id: "cancer",
    name: "Cancer & Oncology (General)",
    category: "Oncology",
    type: "condition",
    isBroad: true,
    aliases: [
      "cancer", "cancer hospital", "oncology", "chemo", "chemotherapy", "tumor",
      "कर्क रोग", "कैंसर", "ਕੈਂਸਰ", "ਕੈਂਸਰ ਹਸਪਤਾਲ"
    ],
    relatedSpecialties: ["Oncology (Cancer Care)", "Surgical Oncology", "Medical Oncology", "Radiation Oncology"],
    relatedFacilities: ["mri", "ct_scan", "operation_theatre", "pharmacy"],
    relatedProcedures: ["chemotherapy", "radiation_therapy"],
    costKey: "cancerCare"
  },
  {
    id: "breast_cancer",
    name: "Breast Cancer",
    category: "Oncology",
    type: "condition",
    aliases: ["breast cancer", "mammography", "stan cancer", "ब्रेस्ट कैंसर", "ਛਾਤੀ ਦਾ ਕੈਂਸਰ"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Surgical Oncology", "Obstetrics & Gynecology"],
    relatedFacilities: ["mri", "operation_theatre"],
    relatedProcedures: ["mastectomy", "chemotherapy", "radiation_therapy"],
    costKey: "cancerCare"
  },
  {
    id: "lung_cancer",
    name: "Lung Cancer",
    category: "Oncology",
    type: "condition",
    aliases: ["lung cancer", "pulmonary tumor", "फेफड़ों का कैंसर", "ਫੇਫੜਿਆਂ ਦਾ ਕੈਂਸਰ"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Pulmonology & Respiratory", "Surgical Oncology"],
    relatedFacilities: ["ct_scan", "bronchoscopy"],
    relatedProcedures: ["chemotherapy", "radiation_therapy"],
    costKey: "cancerCare"
  },
  {
    id: "blood_cancer",
    name: "Blood Cancer / Leukemia & Lymphoma",
    category: "Oncology",
    type: "condition",
    aliases: [
      "blood cancer", "leukemia", "lymphoma", "multiple myeloma", "bone marrow cancer",
      "ब्लड कैंसर", "ਲਿਊਕੀਮੀਆ", "ਬਲੱਡ ਕੈਂਸਰ"
    ],
    relatedSpecialties: ["Oncology (Cancer Care)", "Hematology", "Medical Oncology"],
    relatedFacilities: ["blood_bank", "icu"],
    relatedProcedures: ["bone_marrow_transplant", "chemotherapy"],
    costKey: "cancerCare"
  },
  {
    id: "colorectal_cancer",
    name: "Colorectal Cancer",
    category: "Oncology",
    type: "condition",
    aliases: ["colorectal cancer", "colon cancer", "rectal cancer", "bowel cancer", "आंतों का कैंसर"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Gastroenterology & Hepatology", "Surgical Oncology"],
    relatedFacilities: ["colonoscopy", "operation_theatre"],
    relatedProcedures: ["chemotherapy", "radiation_therapy"],
    costKey: "cancerCare"
  },
  {
    id: "prostate_cancer",
    name: "Prostate Cancer",
    category: "Oncology",
    type: "condition",
    aliases: ["prostate cancer", "prostate enlargement", "प्रोस्टेट कैंसर"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Nephrology & Urology", "Surgical Oncology"],
    relatedFacilities: ["mri", "operation_theatre"],
    relatedProcedures: ["prostatectomy", "radiation_therapy"],
    costKey: "cancerCare"
  },
  {
    id: "cervical_cancer",
    name: "Cervical & Gynecologic Cancer",
    category: "Oncology",
    type: "condition",
    aliases: ["cervical cancer", "uterine cancer", "ovarian cancer", "बच्चेदानी का कैंसर", "ਬੱਚੇਦਾਨੀ ਦਾ ਕੈਂਸਰ"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Obstetrics & Gynecology", "Surgical Oncology"],
    relatedFacilities: ["operation_theatre"],
    relatedProcedures: ["chemotherapy", "radiation_therapy"],
    costKey: "cancerCare"
  },

  // ==========================================
  // 4. KIDNEY / UROLOGY
  // ==========================================
  {
    id: "kidney_disease",
    name: "Kidney Disease & Renal Disorders",
    category: "Kidney / Urology",
    type: "condition",
    aliases: [
      "kidney disease", "kidney problem", "renal disease", "kidney failure", "creatinine", "ckd",
      "chronic kidney disease", "mere ko kidney ki problem hai", "kidney ka hospital chahiye",
      "gurde ka ilaj", "gurdon ki bimari", "गुर्दे की बीमारी", "गुर्दा", "किडनी", "ਕਿਡਨੀ ਦੀ ਬਿਮਾਰੀ", "ਗੁਰਦਾ", "ਗੁਰਦੇ"
    ],
    relatedSpecialties: ["Nephrology & Urology", "Nephrology", "Urology"],
    relatedFacilities: ["dialysis"],
    relatedProcedures: ["dialysis", "kidney_transplant"],
    costKey: "kidneyTreatment"
  },
  {
    id: "kidney_stones",
    name: "Kidney Stones & Lithotripsy",
    category: "Kidney / Urology",
    type: "condition",
    aliases: ["kidney stone", "renal stone", "pathri", "urinary stone", "पथरी", "ਗੁਰਦੇ ਦੀ ਪੱਥਰੀ"],
    relatedSpecialties: ["Nephrology & Urology", "Urology"],
    relatedFacilities: ["operation_theatre", "ct_scan"],
    relatedProcedures: ["lithotripsy"],
    costKey: "kidneyTreatment"
  },
  {
    id: "urological_disorders",
    name: "Urological & Bladder Disorders",
    category: "Kidney / Urology",
    type: "condition",
    aliases: ["urology", "bladder", "urinary problem", "prostate problem", "पेशाब की समस्या"],
    relatedSpecialties: ["Nephrology & Urology", "Urology"],
    relatedFacilities: ["operation_theatre"],
    relatedProcedures: [],
    costKey: "kidneyTreatment"
  },

  // ==========================================
  // 5. TRANSPLANT (Conditions requiring transplant / organ replacement)
  // ==========================================
  {
    id: "organ_transplant",
    name: "Organ Transplant Care",
    category: "Transplant",
    type: "condition",
    isBroad: true,
    aliases: ["transplant", "organ transplant", "transplant hospital", "अंग प्रत्यारोपण"],
    relatedSpecialties: ["Organ Transplant", "Transplant Surgery", "Nephrology & Urology", "Gastroenterology & Hepatology"],
    relatedFacilities: ["icu", "operation_theatre", "blood_bank"],
    relatedProcedures: ["kidney_transplant", "liver_transplant", "heart_transplant"],
    costKey: null
  },

  // ==========================================
  // 6. LIVER / GASTROENTEROLOGY
  // ==========================================
  {
    id: "liver_disease",
    name: "Liver Disease, Hepatitis & Cirrhosis",
    category: "Liver / Gastroenterology",
    type: "condition",
    aliases: [
      "liver disease", "liver failure", "cirrhosis", "hepatitis", "jaundice", "fatty liver",
      "liver ka ilaj", "peeliya", "यकृत", "लिवर की बीमारी", "ਪੀਲੀਆ", "ਲਿਵਰ"
    ],
    relatedSpecialties: ["Gastroenterology & Hepatology", "General Surgery & Laparoscopy"],
    relatedFacilities: ["icu", "blood_bank", "operation_theatre"],
    relatedProcedures: ["liver_transplant", "endoscopy"],
    costKey: null
  },
  {
    id: "gastrointestinal_disorders",
    name: "Gastrointestinal & Digestive Disorders",
    category: "Liver / Gastroenterology",
    type: "condition",
    aliases: [
      "gastro", "stomach", "digestive", "gastritis", "ulcer", "ibs", "colon",
      "pet ki bimari", "stomach pain", "पेट का रोग", "ਪੇਟ ਦੀ ਬਿਮਾਰੀ"
    ],
    relatedSpecialties: ["Gastroenterology & Hepatology", "General Surgery & Laparoscopy"],
    relatedFacilities: ["endoscopy", "colonoscopy"],
    relatedProcedures: ["endoscopy", "laparoscopy"],
    costKey: null
  },

  // ==========================================
  // 7. RESPIRATORY
  // ==========================================
  {
    id: "pulmonary_disease",
    name: "Pulmonary & Respiratory Disease",
    category: "Respiratory",
    type: "condition",
    aliases: [
      "lung disease", "pulmonary", "respiratory", "asthma", "copd", "breathlessness",
      "pulmonary fibrosis", "bronchitis", "saans ki takleef", "दमा", "सांस की बीमारी", "ਸਾਹ ਦੀ ਤਕਲੀਫ", "ਦਮਾ"
    ],
    relatedSpecialties: ["Pulmonology & Respiratory", "Critical Care"],
    relatedFacilities: ["icu", "ventilator", "ct_scan"],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 8. ORTHOPEDICS
  // ==========================================
  {
    id: "orthopedic_disorders",
    name: "Orthopedics, Bone & Joint Disorders",
    category: "Orthopedics",
    type: "condition",
    isBroad: true,
    aliases: [
      "orthopedics", "bone", "joint", "fracture", "arthritis", "spine", "knee", "hip",
      "haddi", "jod", "ghutna", "kamar dard", "हड्डी", "जोड़", "घुटना", "ਹੱਡੀ", "ਜੋੜ", "ਗੋਡਾ"
    ],
    relatedSpecialties: ["Orthopedics & Joint Care"],
    relatedFacilities: ["operation_theatre", "mri", "ct_scan"],
    relatedProcedures: ["knee_replacement", "hip_replacement", "joint_replacement"],
    costKey: "orthopedicCare"
  },
  {
    id: "joint_replacement_condition",
    name: "Severe Joint Arthritis / Replacement Need",
    category: "Orthopedics",
    type: "condition",
    aliases: ["knee replacement", "hip replacement", "joint replacement", "ghutna badalna", "ਗੋਡੇ ਬਦਲਣੇ"],
    relatedSpecialties: ["Orthopedics & Joint Care"],
    relatedFacilities: ["operation_theatre"],
    relatedProcedures: ["knee_replacement", "hip_replacement", "joint_replacement"],
    costKey: "orthopedicCare"
  },
  {
    id: "spine_disorders",
    name: "Spine Disorders & Slip Disc",
    category: "Orthopedics",
    type: "condition",
    aliases: ["spine", "slip disc", "back pain", "sciatica", "reerh ki haddi", "ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ"],
    relatedSpecialties: ["Orthopedics & Joint Care", "Neurology & Neurosurgery"],
    relatedFacilities: ["mri", "operation_theatre"],
    relatedProcedures: ["spine_surgery"],
    costKey: "orthopedicCare"
  },

  // ==========================================
  // 9. ENDOCRINOLOGY
  // ==========================================
  {
    id: "diabetes_endocrine",
    name: "Diabetes & Endocrine Disorders",
    category: "Endocrinology",
    type: "condition",
    aliases: ["diabetes", "sugar", "diabetic", "thyroid", "endocrine", "मधुमेह", "शुगर", "ਥਾਇਰਾਇਡ"],
    relatedSpecialties: ["General Medicine", "Endocrinology"],
    relatedFacilities: ["pharmacy"],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 10. PEDIATRICS
  // ==========================================
  {
    id: "pediatric_conditions",
    name: "Pediatric & Child Care",
    category: "Pediatrics",
    type: "condition",
    aliases: ["pediatric", "child", "children", "baby", "infant", "neonatal", "bachha", "ਬੱਚਿਆਂ ਦਾ ਹਸਪਤਾਲ", "ਬਾਲ ਰੋਗ"],
    relatedSpecialties: ["Pediatrics & Neonatology"],
    relatedFacilities: ["nicu", "icu"],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 11. WOMEN'S HEALTH
  // ==========================================
  {
    id: "maternity_pregnancy",
    name: "Pregnancy, Maternity & Gynecology",
    category: "Women's Health",
    type: "condition",
    aliases: [
      "maternity", "pregnancy", "delivery", "gynec", "obstetric", "c-section", "high risk pregnancy",
      "delivery hospital", "garbhvastha", "प्रसव", "डिलीवरी", "ਜੱਚਾ ਬੱਚਾ", "ਗਰਭਵਤੀ"
    ],
    relatedSpecialties: ["Obstetrics & Gynecology", "Gynecology & Obstetrics"],
    relatedFacilities: ["operation_theatre", "nicu"],
    relatedProcedures: ["cesarean_section", "normal_delivery"],
    costKey: "maternityCare"
  },

  // ==========================================
  // 12. EYE / OPHTHALMOLOGY
  // ==========================================
  {
    id: "ophthalmic_disorders",
    name: "Eye Care & Ophthalmology",
    category: "Eye",
    type: "condition",
    aliases: ["eye", "cataract", "glaucoma", "retina", "cornea", "motiyabind", "aankhon ka hospital", "मोतियाबिंद", "ਅੱਖਾਂ"],
    relatedSpecialties: ["Ophthalmology"],
    relatedFacilities: ["operation_theatre"],
    relatedProcedures: ["cataract_surgery"],
    costKey: null
  },

  // ==========================================
  // 13. ENT
  // ==========================================
  {
    id: "ent_disorders",
    name: "ENT (Ear, Nose & Throat)",
    category: "ENT",
    type: "condition",
    aliases: ["ent", "ear", "nose", "throat", "hearing", "sinus", "kaan naak gala", "ਕੰਨ ਨੱਕ ਗਲਾ"],
    relatedSpecialties: ["ENT", "Ear, Nose & Throat"],
    relatedFacilities: ["operation_theatre"],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 14. DERMATOLOGY
  // ==========================================
  {
    id: "dermatology_skin",
    name: "Dermatology & Skin Disorders",
    category: "Dermatology",
    type: "condition",
    aliases: ["skin", "dermatology", "skin allergy", "skin cancer", "chamdi ke rog", "ਚਮੜੀ ਰੋਗ"],
    relatedSpecialties: ["Dermatology"],
    relatedFacilities: [],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 15. MENTAL HEALTH
  // ==========================================
  {
    id: "mental_health",
    name: "Mental Health & Psychiatry",
    category: "Mental Health",
    type: "condition",
    aliases: ["mental health", "depression", "anxiety", "psychiatry", "psychiatric", "stress", "mansik rog", "ਮਾਨਸਿਕ ਸਿਹਤ"],
    relatedSpecialties: ["Psychiatry", "Behavioral Sciences"],
    relatedFacilities: [],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 16. INFECTIOUS DISEASE
  // ==========================================
  {
    id: "infectious_disease",
    name: "Infectious Disease (TB, Dengue, Infections)",
    category: "Infectious Disease",
    type: "condition",
    aliases: ["infection", "tuberculosis", "tb", "dengue", "malaria", "typhoid", "viral fever", "संक्रमण", "ਬੁਖਾਰ"],
    relatedSpecialties: ["General Medicine", "Infectious Diseases"],
    relatedFacilities: ["blood_bank", "icu"],
    relatedProcedures: [],
    costKey: null
  },

  // ==========================================
  // 17. EMERGENCY / CRITICAL CARE
  // ==========================================
  {
    id: "emergency_trauma",
    name: "Emergency, Acute Trauma & Critical Care",
    category: "Emergency / Critical Care",
    type: "condition",
    aliases: [
      "emergency", "trauma", "accident", "critical care", "icu care", "urgent care",
      "emergency hospital", "आपातकालीन", "इमरजेंसी", "ਐਮਰਜੈਂਸੀ", "ਹਾਦਸਾ"
    ],
    relatedSpecialties: ["Emergency & Trauma", "Critical Care", "General Surgery & Laparoscopy"],
    relatedFacilities: ["emergency", "icu", "ambulance", "blood_bank", "operation_theatre"],
    relatedProcedures: [],
    costKey: "emergencyTrauma"
  },

  // ==========================================
  // 18. GENERAL / MULTISPECIALTY
  // ==========================================
  {
    id: "general_medicine",
    name: "General Medicine & Multispecialty Care",
    category: "General / Multispecialty",
    type: "condition",
    isBroad: true,
    aliases: [
      "general medicine", "internal medicine", "general physician", "physician checkup", "routine checkup",
      "general checkup", "general illness", "general doctor"
    ],
    relatedSpecialties: ["General Medicine", "General Surgery & Laparoscopy"],
    relatedFacilities: ["pharmacy", "ambulance"],
    relatedProcedures: [],
    costKey: null
  }
];

// ==========================================
// STRUCTURED PROCEDURES CATALOGUE
// ==========================================
export const PROCEDURE_CATALOGUE = [
  {
    id: "kidney_transplant",
    name: "Kidney Transplant",
    category: "Transplant",
    relatedCondition: "kidney_disease",
    aliases: [
      "kidney transplant", "renal transplant", "kidney badli", "गुर्दा प्रत्यारोपण",
      "ਕਿਡਨੀ ਟਰਾਂਸਪਲਾਂਟ", "kidney transplant chahiye", "kidney transplant hospital"
    ],
    relatedSpecialties: ["Nephrology & Urology", "Nephrology", "Organ Transplant", "Transplant Surgery"],
    relatedFacilities: ["icu", "operation_theatre"],
    costKey: "kidneyTreatment"
  },
  {
    id: "liver_transplant",
    name: "Liver Transplant",
    category: "Transplant",
    relatedCondition: "liver_disease",
    aliases: [
      "liver transplant", "hepatic transplant", "liver badli", "लिवर ट्रांसप्लांट",
      "ਲਿਵਰ ਟਰਾਂਸਪਲਾਂਟ", "liver transplant chahiye", "liver transplant hospital"
    ],
    relatedSpecialties: ["Gastroenterology & Hepatology", "Organ Transplant", "Transplant Surgery"],
    relatedFacilities: ["icu", "operation_theatre", "blood_bank"],
    costKey: null
  },
  {
    id: "heart_transplant",
    name: "Heart Transplant",
    category: "Transplant",
    relatedCondition: "heart_failure",
    aliases: [
      "heart transplant", "cardiac transplant", "हृदय प्रत्यारोपण", "ਦਿਲ ਟਰਾਂਸਪਲਾਂਟ",
      "heart transplant hospital"
    ],
    relatedSpecialties: ["Cardiology & Cardiac Surgery", "Cardiovascular Surgery", "Organ Transplant"],
    relatedFacilities: ["icu", "operation_theatre", "cath_lab"],
    costKey: "cardiacCare"
  },
  {
    id: "lung_transplant",
    name: "Lung Transplant",
    category: "Transplant",
    relatedCondition: "pulmonary_disease",
    aliases: ["lung transplant", "pulmonary transplant", "फेफड़े का प्रत्यारोपण"],
    relatedSpecialties: ["Pulmonology & Respiratory", "Organ Transplant", "Cardiovascular Surgery"],
    relatedFacilities: ["icu", "operation_theatre"],
    costKey: null
  },
  {
    id: "bone_marrow_transplant",
    name: "Bone Marrow / Stem Cell Transplant",
    category: "Transplant",
    relatedCondition: "blood_cancer",
    aliases: ["bone marrow transplant", "bmt", "stem cell transplant", "बोन मैरो ट्रांसप्लांट"],
    relatedSpecialties: ["Oncology (Cancer Care)", "Hematology"],
    relatedFacilities: ["blood_bank", "icu"],
    costKey: "cancerCare"
  },
  {
    id: "knee_replacement",
    name: "Knee Replacement Surgery",
    category: "Orthopedics",
    relatedCondition: "orthopedic_disorders",
    aliases: ["knee replacement", "total knee replacement", "tkr", "घुटने का ऑपरेशन", "ਗੋਡਾ ਬਦਲਣਾ"],
    relatedSpecialties: ["Orthopedics & Joint Care"],
    relatedFacilities: ["operation_theatre"],
    costKey: "orthopedicCare"
  },
  {
    id: "hip_replacement",
    name: "Hip Replacement Surgery",
    category: "Orthopedics",
    relatedCondition: "orthopedic_disorders",
    aliases: ["hip replacement", "total hip replacement", "thr", "कूल्हे का ऑपरेशन"],
    relatedSpecialties: ["Orthopedics & Joint Care"],
    relatedFacilities: ["operation_theatre"],
    costKey: "orthopedicCare"
  },
  {
    id: "angioplasty",
    name: "Coronary Angioplasty & Stenting",
    category: "Cardiovascular",
    relatedCondition: "coronary_artery_disease",
    aliases: ["angioplasty", "stent", "heart stent", "ptca", "एंजियोप्लास्टी"],
    relatedSpecialties: ["Cardiology & Cardiac Surgery", "Cardiology"],
    relatedFacilities: ["cath_lab", "icu"],
    costKey: "cardiacCare"
  },
  {
    id: "bypass_surgery",
    name: "Coronary Artery Bypass Graft (CABG)",
    category: "Cardiovascular",
    relatedCondition: "coronary_artery_disease",
    aliases: ["bypass", "cabg", "heart bypass", "बाईपास सर्जरी"],
    relatedSpecialties: ["Cardiology & Cardiac Surgery", "Cardiovascular Surgery"],
    relatedFacilities: ["operation_theatre", "icu"],
    costKey: "cardiacCare"
  },
  {
    id: "dialysis_procedure",
    name: "Hemodialysis Session",
    category: "Kidney / Urology",
    relatedCondition: "kidney_disease",
    aliases: ["dialysis session", "hemodialysis", "haemodialysis"],
    relatedSpecialties: ["Nephrology & Urology", "Nephrology"],
    relatedFacilities: ["dialysis"],
    costKey: "kidneyTreatment"
  }
];

// ==========================================
// STRUCTURED FACILITIES CATALOGUE
// ==========================================
export const FACILITY_CATALOGUE = [
  {
    id: "dialysis",
    name: "Dialysis Unit",
    aliases: ["dialysis", "hemodialysis", "haemodialysis", "डायलिसिस", "ਡਾਇਲਿਸਿਸ", "ਡਾਇਲਸਿਸ"]
  },
  {
    id: "icu",
    name: "Intensive Care Unit (ICU)",
    aliases: ["icu", "intensive care", "critical care unit", "आईसीयू", "ਆਈਸੀਯੂ"]
  },
  {
    id: "emergency",
    name: "24x7 Emergency & Trauma",
    aliases: ["emergency", "trauma", "24x7 emergency", "casualty", "आपातकालीन", "ਇਮਰਜੈਂਸੀ", "ਐਮਰਜੈਂਸੀ"]
  },
  {
    id: "mri",
    name: "MRI Diagnostic Scanner",
    aliases: ["mri", "magnetic resonance imaging", "एमआरआई", "ਐਮਆਰਆਈ"]
  },
  {
    id: "ct_scan",
    name: "CT Scan Diagnostic Imaging",
    aliases: ["ct scan", "ct-scan", "cat scan", "सीटी स्कैन", "ਸੀਟੀ ਸਕੈਨ"]
  },
  {
    id: "blood_bank",
    name: "Certified Blood Bank",
    aliases: ["blood bank", "blood-bank", "ब्लड बैंक", "ਬਲੱਡ ਬੈਂਕ"]
  },
  {
    id: "operation_theatre",
    name: "Modular Operation Theatre",
    aliases: ["operation theatre", "modular ot", "ot", "ऑपरेशन थिएटर", "ਆਪ੍ਰੇਸ਼ਨ ਥੀਏਟਰ"]
  },
  {
    id: "cath_lab",
    name: "Cardiac Catheterization Lab",
    aliases: ["cath lab", "cathlab", "cardiac cath lab", "कैथ लैब", "ਕੈਥ ਲੈਬ"]
  },
  {
    id: "nicu",
    name: "Neonatal ICU",
    aliases: ["nicu", "neonatal icu", "baby icu", "एनआईसीयू", "ਐਨਆਈਸੀਯੂ"]
  },
  {
    id: "ambulance",
    name: "Advanced Life Support Ambulance",
    aliases: ["ambulance", "als ambulance", "एम्बुलेंस", "ਐਂਬੂਲੈਂਸ"]
  },
  {
    id: "ventilator",
    name: "Mechanical Ventilator",
    aliases: ["ventilator", "mechanical ventilation", "वेंटिलेटर", "ਵੈਂਟੀਲੇਟਰ"]
  }
];

/**
 * Match a text string to a procedure in the catalogue.
 * Returns procedure object or null.
 */
export function matchProcedure(queryText = '') {
  if (!queryText) return null;
  const clean = queryText.toLowerCase().trim();

  for (const proc of PROCEDURE_CATALOGUE) {
    for (const alias of proc.aliases) {
      const aliasClean = alias.toLowerCase();
      // Whole word / phrase match
      const regex = new RegExp(`(^|\\b)${escapeRegex(aliasClean)}(\\b|$)`, 'i');
      if (regex.test(clean)) {
        return proc;
      }
    }
  }
  return null;
}

/**
 * Match a text string to a facility in the catalogue.
 * Returns array of matched facility IDs.
 */
export function matchFacilities(queryText = '') {
  if (!queryText) return [];
  const clean = queryText.toLowerCase().trim();
  const matched = [];

  for (const fac of FACILITY_CATALOGUE) {
    for (const alias of fac.aliases) {
      const aliasClean = alias.toLowerCase();
      const regex = new RegExp(`(^|\\b)${escapeRegex(aliasClean)}(\\b|$)`, 'i');
      if (regex.test(clean)) {
        matched.push(fac.id);
        break; // Match facility once
      }
    }
  }
  return matched;
}

/**
 * Match a text string to a medical condition in the catalogue.
 * Preserves broad conditions when input is ambiguous (e.g. "brain ka treatment").
 * Excludes matches if text is strictly asking for a facility alone (e.g. "dialysis").
 */
export function matchCondition(queryText = '') {
  if (!queryText) return null;
  const clean = queryText.toLowerCase().trim();

  // Strip standalone facility mentions when checking condition
  // E.g., "dialysis hospital" -> if text without dialysis has no disease term, return null!
  const hasDialysisOnly = /^(?:dialysis|hemodialysis|haemodialysis|डायलिसिस|ਡਾਇਲਿਸਿਸ)(?:\s+(?:hospital|centre|center|unit|clinic|near\s+me|under|below|\d+|lakh|rupees|inr|के|का|ਦੀ|ਦਾ))*$/i.test(clean);
  if (hasDialysisOnly) {
    return null; // Condition is NULL for "dialysis hospital"
  }

  // Exact/Specific condition search first (avoid matching broad condition if specific exists)
  // Sort conditions: specific first, broad last
  const sortedCatalogue = [...CONDITION_CATALOGUE].sort((a, b) => {
    if (a.isBroad && !b.isBroad) return 1;
    if (!a.isBroad && b.isBroad) return -1;
    return 0;
  });

  for (const cond of sortedCatalogue) {
    for (const alias of cond.aliases) {
      const aliasClean = alias.toLowerCase();
      const regex = new RegExp(`(^|\\b)${escapeRegex(aliasClean)}(\\b|$)`, 'i');
      if (regex.test(clean)) {
        return cond;
      }
    }
  }

  return null;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
