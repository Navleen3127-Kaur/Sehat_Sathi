/**
 * Sehat_Sathi - Simulated / Prototype Patient Outcome Dataset
 * 
 * STRICT TRANSPARENCY & DATA INTEGRITY NOTICE:
 * This is PROTOTYPE MOCK DATA for user experience and product demonstration only.
 * These figures are NOT actual hospital clinical outcomes, NOT real patient success
 * rates, and NOT verified hospital performance statistics.
 * 
 * ZERO MEDICAL OR CURE CLAIMS:
 * - Never claims actual patients were cured or recovered.
 * - Always represented as a simulated hypothetical cohort of 1,000 patients.
 * 
 * 100% DETERMINISTIC STATIC DATA:
 * - Every single value below is EXPLICITLY authored in this file.
 * - Zero runtime generation of percentages or patient counts.
 * - The same Hospital + Condition + Procedure ALWAYS returns exactly the same value
 *   (stable across refresh, repeat search, sorting, detail pages, and app restarts).
 * - Unsupported Hospital + Condition combinations honestly return null
 *   (never fabricated at runtime).
 * - Outcome values are INFORMATIONAL ONLY and are never used for ranking.
 */

export const SIMULATED_OUTCOME_DISCLAIMER = "Illustrative figures for demonstration only; not actual hospital or patient outcomes.";

// Fixed standardized cohort size for every simulated outcome entry
export const SIMULATED_OUTCOME_COHORT_SIZE = 1000;

/** Condition labels for canonical outcome keys */
const CONDITION_LABELS = {
  general: 'Overall Inpatient Care (Prototype)',
  neurology: 'Neurology & Clinical Neurosciences',
  brain_surgery: 'Brain Surgery & Neurosurgery',
  craniotomy: 'Craniotomy Procedure',
  kidney: 'Kidney Care & Nephrology',
  kidney_transplant: 'Kidney Transplant Procedure',
  heart: 'Cardiovascular Care',
  angioplasty: 'Angioplasty Procedure',
  bypass_surgery: 'Coronary Bypass Graft (CABG)',
  cancer: 'Oncology & Cancer Care',
  chemotherapy: 'Chemotherapy Cycle Care',
  orthopedics: 'Orthopedics & Joint Care',
  knee_replacement: 'Knee Replacement Procedure',
  eye: 'Ophthalmology & Eye Care',
  cataract_surgery: 'Cataract Surgery',
  dental: 'Dental Care & Oral Health',
  alzheimers: "Alzheimer's & Dementia Care"
};

/**
 * Universal condition key normalizer for simulated outcome lookup.
 * 
 * Rules:
 * 1. Specific surgical procedure overrides general condition when present.
 * 2. "Neurology" resolves to 'neurology' (clinical condition).
 * 3. "Brain Surgery" or "Craniotomy" resolves to 'brain_surgery' or 'craniotomy' (procedures).
 * 4. "Alzheimer's / Dementia / Parkinson's" resolves to 'alzheimers' (distinct from neurology & brain surgery).
 * 
 * @param {string} [condition=''] - Clinical condition string
 * @param {string} [procedure=''] - Surgical procedure string
 * @param {string} [query=''] - Search query text
 * @returns {string|null} Canonical outcome key
 */
export function normalizeSimConditionKey(condition = '', procedure = '', query = '') {
  const cleanCond = String(condition || '').toLowerCase().trim();
  const cleanProc = String(procedure || '').toLowerCase().trim();
  const cleanQuery = String(query || '').toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. SPECIFIC SURGICAL PROCEDURES (Priority: Procedure overrides condition)
  // -------------------------------------------------------------
  if (cleanProc) {
    if (cleanProc.includes('craniotomy')) return 'craniotomy';
    if (
      cleanProc.includes('brain') || 
      cleanProc.includes('neurosurgery') || 
      cleanProc === 'brain_surgery' || 
      cleanProc.includes('neuro surgery') || 
      cleanProc.includes('brain surgery')
    ) {
      return 'brain_surgery';
    }
    if (cleanProc.includes('transplant')) return 'kidney_transplant';
    if (cleanProc.includes('angioplasty')) return 'angioplasty';
    if (cleanProc.includes('bypass') || cleanProc.includes('cabg')) return 'bypass_surgery';
    if (cleanProc.includes('cataract')) return 'cataract_surgery';
    if (cleanProc.includes('knee') || cleanProc.includes('replacement')) return 'knee_replacement';
  }

  // Check if query or condition explicitly mentions a surgical procedure
  if (cleanQuery.includes('craniotomy') || cleanCond.includes('craniotomy')) {
    return 'craniotomy';
  }
  if (
    cleanQuery.includes('brain surgery') || cleanCond.includes('brain surgery') ||
    cleanQuery.includes('brain operation') || cleanCond.includes('brain operation') ||
    cleanQuery.includes('neurosurgery') || cleanCond.includes('neurosurgery') ||
    cleanQuery.includes('neuro surgery') || cleanCond.includes('neuro surgery') ||
    cleanQuery.includes('brain tumor') || cleanCond.includes('brain tumor') ||
    cleanQuery.includes('brain tumour') || cleanCond.includes('brain tumour') ||
    cleanCond === 'brain_surgery'
  ) {
    return 'brain_surgery';
  }
  if (
    cleanQuery.includes('kidney transplant') || cleanCond.includes('kidney transplant') ||
    cleanQuery.includes('renal transplant') || cleanCond.includes('renal transplant') ||
    cleanCond === 'kidney_transplant' ||
    ((cleanQuery.includes('transplant') || cleanCond.includes('transplant')) && 
     (cleanQuery.includes('kidney') || cleanCond.includes('kidney') || cleanCond.includes('renal')))
  ) {
    return 'kidney_transplant';
  }
  if (cleanQuery.includes('angioplasty') || cleanCond.includes('angioplasty')) {
    return 'angioplasty';
  }
  if (
    cleanQuery.includes('bypass') || cleanCond.includes('bypass') || 
    cleanQuery.includes('cabg') || cleanCond.includes('cabg') || 
    cleanCond === 'bypass_surgery'
  ) {
    return 'bypass_surgery';
  }
  if (
    cleanQuery.includes('cataract') || cleanCond.includes('cataract') || 
    cleanCond === 'cataract_surgery'
  ) {
    return 'cataract_surgery';
  }
  if (
    cleanQuery.includes('knee replacement') || cleanCond.includes('knee replacement') || 
    cleanCond === 'knee_replacement'
  ) {
    return 'knee_replacement';
  }

  // -------------------------------------------------------------
  // 2. CLINICAL MEDICAL CONDITIONS (Distinct from surgical procedures)
  // -------------------------------------------------------------
  // Alzheimer's / Dementia / Parkinson's / Neurodegenerative (distinct key,
  // must be checked BEFORE the generic "neuro" catch below)
  if (
    cleanCond.includes('alzheimer') || cleanCond.includes('dementia') ||
    cleanCond.includes('parkinson') || cleanCond.includes('neurodegener') ||
    cleanCond === 'alzheimers' ||
    cleanQuery.includes('alzheimer') || cleanQuery.includes('dementia') ||
    cleanQuery.includes('parkinson') || cleanQuery.includes('memory loss')
  ) {
    return 'alzheimers';
  }

  // Neurology & Neurosciences (Clinical condition, NOT brain surgery)
  if (
    cleanCond === 'neurology' || cleanCond.includes('neurolog') || cleanCond.includes('neuro') ||
    cleanQuery.includes('neurology') || cleanQuery.includes('neurologist') || cleanQuery.includes('neurological')
  ) {
    return 'neurology';
  }

  // Kidney & Nephrology
  if (
    cleanCond.includes('kidney') || cleanCond.includes('renal') || cleanCond.includes('dialysis') || cleanCond.includes('nephrol') ||
    cleanQuery.includes('kidney') || cleanQuery.includes('renal') || cleanQuery.includes('dialysis') || cleanQuery.includes('nephrol') ||
    cleanQuery.includes('गुर्दा') || cleanQuery.includes('ਕਿਡਨੀ')
  ) {
    return 'kidney';
  }

  // Heart & Cardiology
  if (
    cleanCond.includes('heart') || cleanCond.includes('cardio') || cleanCond.includes('cardiac') ||
    cleanQuery.includes('heart') || cleanQuery.includes('cardio') || cleanQuery.includes('cardiac') ||
    cleanQuery.includes('दिल') || cleanQuery.includes('ਦਿਲ')
  ) {
    return 'heart';
  }

  // Cancer & Oncology
  if (
    cleanCond.includes('cancer') || cleanCond.includes('oncol') || cleanCond.includes('tumor') || cleanCond.includes('tumour') ||
    cleanQuery.includes('cancer') || cleanQuery.includes('oncol') ||
    cleanQuery.includes('कैंसर') || cleanQuery.includes('ਕੈਂਸਰ')
  ) {
    return 'cancer';
  }

  // Orthopedics & Joints
  if (
    cleanCond.includes('ortho') || cleanCond.includes('bone') || cleanCond.includes('joint') ||
    cleanQuery.includes('ortho') || cleanQuery.includes('bone') || cleanQuery.includes('joint') ||
    cleanQuery.includes('हड्डी') || cleanQuery.includes('ਹੱਡੀ')
  ) {
    return 'orthopedics';
  }

  // Eye & Ophthalmology
  if (
    cleanCond.includes('eye') || cleanCond.includes('ophthal') || cleanCond.includes('vision') ||
    cleanQuery.includes('eye') || cleanQuery.includes('ophthal') ||
    cleanQuery.includes('आँख') || cleanQuery.includes('ਅੱਖ')
  ) {
    return 'eye';
  }

  // Dental Care
  if (
    cleanCond.includes('dent') || cleanCond.includes('oral') ||
    cleanQuery.includes('dent') || cleanQuery.includes('teeth') || cleanQuery.includes('oral') ||
    cleanQuery.includes('दांत') || cleanQuery.includes('ਦੰਦ')
  ) {
    return 'dental';
  }

  // Brain / head terms without surgical keywords resolve to neurology
  if (
    cleanCond.includes('brain') || cleanQuery.includes('brain') || 
    cleanQuery.includes('dimag') || cleanQuery.includes('दिमाग') || cleanQuery.includes('ਦਿਮਾਗ')
  ) {
    return 'neurology';
  }

  return cleanCond || null;
}

/**
 * EXPLICIT STATIC RATE TABLES (Mock / Prototype values)
 * 
 * Each institution defines its own explicit simulated outcome rate (percent) for
 * every canonical condition/procedure key. favorableCount is ALWAYS rate * 10
 * against the fixed cohort of 1,000, so:
 *   favorableCount / 1000 * 100 === rate  (never an inconsistent combination)
 * 
 * Procedure-specific keys (craniotomy, kidney_transplant, angioplasty,
 * bypass_surgery, cataract_surgery, knee_replacement) are explicitly defined per
 * institution and deliberately DIFFER from their broad condition value, so that
 * e.g. "Kidney care" vs "Kidney transplant" never silently share one number.
 */

// Rates for AIIMS — New Delhi (also used by AIIMS RP Centre eye entry, overridden below where noted)
const RATES_AIIMS = {
  general: 88,
  neurology: 88,
  brain_surgery: 84,
  craniotomy: 83,
  kidney: 87,
  kidney_transplant: 89,
  heart: 91,
  angioplasty: 92,
  bypass_surgery: 90,
  cancer: 78,
  orthopedics: 88,
  knee_replacement: 89,
  eye: 94,
  cataract_surgery: 96,
  dental: 90,
  alzheimers: 80
};

const RATES_NIMHANS = {
  general: 89,
  neurology: 89,
  // brain_surgery 84: NIMHANS is reference rank #2 for Brain Surgery — mock outcome
  // must be <= AIIMS (84, rank #1) to keep the rate non-increasing along the ranks.
  brain_surgery: 84,
  craniotomy: 85,
  kidney: 85,
  kidney_transplant: 87,
  heart: 88,
  angioplasty: 89,
  bypass_surgery: 88,
  cancer: 80,
  orthopedics: 84,
  knee_replacement: 85,
  eye: 90,
  cataract_surgery: 92,
  dental: 86,
  alzheimers: 93
};

const RATES_MEDANTA = {
  general: 90,
  neurology: 87,
  // brain_surgery 81: Medanta is reference rank #4 for Brain Surgery — mock outcome
  // must be <= PGIMER (82, rank #3) to keep the rate non-increasing along the ranks.
  brain_surgery: 81,
  craniotomy: 84,
  kidney: 86,
  kidney_transplant: 88,
  heart: 93,
  angioplasty: 94,
  bypass_surgery: 91,
  // cancer 75: Medanta is reference rank #4 for Cancer — mock outcome must be <=
  // Apollo (76, rank #3) to keep the rate non-increasing along the ranks.
  cancer: 75,
  // orthopedics 88: Medanta is reference rank #2 for Orthopedics — mock outcome
  // must be <= AIIMS (88, rank #1); equal values are allowed.
  orthopedics: 88,
  knee_replacement: 89,
  eye: 91,
  cataract_surgery: 93,
  dental: 88,
  alzheimers: 82
};

const RATES_PGIMER = {
  general: 86,
  neurology: 85,
  brain_surgery: 82,
  craniotomy: 81,
  kidney: 86,
  kidney_transplant: 88,
  heart: 87,
  angioplasty: 88,
  bypass_surgery: 86,
  cancer: 79,
  orthopedics: 87,
  knee_replacement: 88,
  eye: 89,
  cataract_surgery: 91,
  dental: 91,
  // alzheimers 79: PGIMER is reference rank #3 for Alzheimer's — mock outcome must
  // be <= AIIMS (80, rank #2) to keep the rate non-increasing along the ranks.
  alzheimers: 79
};

const RATES_CMC = {
  general: 86,
  neurology: 86,
  // brain_surgery 80: CMC is reference rank #5 for Brain Surgery — mock outcome must
  // be <= Medanta (81, rank #4) to keep the rate non-increasing along the ranks.
  brain_surgery: 80,
  craniotomy: 82,
  kidney: 85,
  kidney_transplant: 87,
  heart: 89,
  angioplasty: 90,
  bypass_surgery: 89,
  // cancer 74: CMC is reference rank #5 for Cancer — mock outcome must be <=
  // Medanta (75, rank #4) to keep the rate non-increasing along the ranks.
  cancer: 74,
  orthopedics: 85,
  knee_replacement: 86,
  eye: 90,
  cataract_surgery: 92,
  dental: 87,
  // alzheimers 78: CMC is reference rank #4 for Alzheimer's — mock outcome must be
  // <= PGIMER (79, rank #3) to keep the rate non-increasing along the ranks.
  alzheimers: 78
};

const RATES_TATA = {
  general: 82,
  neurology: 78,
  brain_surgery: 76,
  craniotomy: 77,
  kidney: 80,
  kidney_transplant: 82,
  heart: 84,
  angioplasty: 85,
  bypass_surgery: 84,
  cancer: 81,
  orthopedics: 81,
  knee_replacement: 82,
  eye: 88,
  cataract_surgery: 90,
  dental: 85,
  alzheimers: 77
};

const RATES_APOLLO = {
  general: 88,
  neurology: 85,
  brain_surgery: 83,
  craniotomy: 84,
  // kidney 83: Apollo is reference rank #5 for Kidney — mock outcome must be <=
  // SGPGIMS (84, rank #4) to keep the rate non-increasing along the ranks.
  kidney: 83,
  kidney_transplant: 89,
  heart: 90,
  angioplasty: 91,
  bypass_surgery: 89,
  // cancer 76: Apollo is reference rank #3 for Cancer — mock outcome must be <=
  // AIIMS (78, rank #2) to keep the rate non-increasing along the ranks.
  cancer: 76,
  orthopedics: 87,
  knee_replacement: 88,
  eye: 92,
  cataract_surgery: 93,
  dental: 89,
  alzheimers: 81
};

const RATES_NARAYANA_CARDIAC = {
  general: 90,
  neurology: 82,
  brain_surgery: 80,
  craniotomy: 81,
  kidney: 83,
  kidney_transplant: 85,
  // heart 88: Narayana is reference rank #4 for Heart — mock outcome must be <=
  // Apollo (90, rank #3) so the displayed list never shows a lower rate above a
  // higher one.
  heart: 88,
  angioplasty: 93,
  bypass_surgery: 92,
  cancer: 79,
  orthopedics: 82,
  knee_replacement: 83,
  eye: 85,
  cataract_surgery: 88,
  dental: 84,
  alzheimers: 78
};

const RATES_FORTIS_ESCORTS = {
  general: 89,
  neurology: 81,
  brain_surgery: 79,
  craniotomy: 80,
  kidney: 82,
  kidney_transplant: 84,
  // heart 87: Fortis Escorts is reference rank #5 for Heart — mock outcome must
  // be <= Narayana (88, rank #4) to keep the rate non-increasing along the ranks.
  heart: 87,
  angioplasty: 93,
  bypass_surgery: 91,
  cancer: 78,
  orthopedics: 81,
  knee_replacement: 82,
  eye: 84,
  cataract_surgery: 87,
  dental: 83,
  alzheimers: 77
};

const RATES_SGPGIMS = {
  general: 85,
  neurology: 84,
  brain_surgery: 81,
  craniotomy: 80,
  // kidney 84: SGPGIMS is reference rank #4 for Kidney — mock outcome must be <=
  // CMC (85, rank #3) to keep the rate non-increasing along the ranks.
  kidney: 84,
  kidney_transplant: 90,
  heart: 84,
  angioplasty: 85,
  bypass_surgery: 83,
  cancer: 77,
  orthopedics: 83,
  knee_replacement: 84,
  eye: 85,
  cataract_surgery: 87,
  dental: 86,
  // alzheimers 77: SGPGIMS is reference rank #5 for Alzheimer's — mock outcome
  // must be <= CMC (78, rank #4) to keep the rate non-increasing along the ranks.
  alzheimers: 77
};

const RATES_LVPEI = {
  general: 93,
  neurology: 76,
  brain_surgery: 75,
  craniotomy: 75,
  kidney: 77,
  kidney_transplant: 78,
  heart: 79,
  angioplasty: 80,
  bypass_surgery: 79,
  cancer: 78,
  orthopedics: 78,
  knee_replacement: 79,
  eye: 97,
  cataract_surgery: 98,
  dental: 80,
  alzheimers: 75
};

const RATES_ARAVIND = {
  general: 92,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 76,
  kidney: 76,
  kidney_transplant: 77,
  heart: 78,
  angioplasty: 79,
  bypass_surgery: 78,
  cancer: 77,
  orthopedics: 77,
  knee_replacement: 78,
  eye: 96,
  cataract_surgery: 97,
  dental: 79,
  alzheimers: 75
};

const RATES_SANKARA = {
  general: 91,
  neurology: 76,
  brain_surgery: 75,
  craniotomy: 76,
  kidney: 77,
  kidney_transplant: 78,
  heart: 80,
  angioplasty: 81,
  bypass_surgery: 80,
  cancer: 79,
  orthopedics: 78,
  knee_replacement: 79,
  eye: 95,
  cataract_surgery: 96,
  dental: 81,
  alzheimers: 76
};

const RATES_AIIMS_EYE = {
  ...RATES_AIIMS,
  general: 92,
  eye: 95,
  cataract_surgery: 97
};

const RATES_NARAYANA_NETHRALAYA = {
  general: 91,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 76,
  kidney: 77,
  kidney_transplant: 78,
  heart: 80,
  angioplasty: 81,
  bypass_surgery: 80,
  cancer: 78,
  orthopedics: 78,
  knee_replacement: 79,
  eye: 94,
  cataract_surgery: 95,
  dental: 81,
  alzheimers: 75
};

const RATES_KOKILABEN = {
  general: 88,
  neurology: 83,
  brain_surgery: 81,
  craniotomy: 82,
  kidney: 84,
  kidney_transplant: 86,
  heart: 89,
  angioplasty: 90,
  bypass_surgery: 88,
  cancer: 82,
  // orthopedics 86: Kokilaben is reference rank #4 for Orthopedics — mock outcome
  // must be <= Apollo (87, rank #3) to keep the rate non-increasing along the ranks.
  orthopedics: 86,
  knee_replacement: 92,
  eye: 87,
  cataract_surgery: 89,
  dental: 85,
  alzheimers: 80
};

const RATES_MANIPAL_ORTHO = {
  general: 87,
  neurology: 82,
  brain_surgery: 80,
  craniotomy: 81,
  kidney: 83,
  kidney_transplant: 85,
  heart: 87,
  angioplasty: 88,
  bypass_surgery: 86,
  cancer: 80,
  // orthopedics 85: Manipal is reference rank #5 for Orthopedics — mock outcome
  // must be <= Kokilaben (86, rank #4) to keep the rate non-increasing along the ranks.
  orthopedics: 85,
  knee_replacement: 91,
  eye: 85,
  cataract_surgery: 88,
  dental: 84,
  alzheimers: 79
};

const RATES_MAIDS = {
  general: 90,
  neurology: 76,
  brain_surgery: 75,
  craniotomy: 75,
  kidney: 77,
  kidney_transplant: 78,
  heart: 79,
  angioplasty: 80,
  bypass_surgery: 79,
  cancer: 78,
  orthopedics: 78,
  knee_replacement: 79,
  eye: 84,
  cataract_surgery: 86,
  dental: 95,
  alzheimers: 75
};

const RATES_MCODS_MANIPAL = {
  general: 89,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 76,
  kidney: 76,
  kidney_transplant: 77,
  heart: 78,
  angioplasty: 79,
  bypass_surgery: 78,
  cancer: 77,
  orthopedics: 77,
  knee_replacement: 78,
  eye: 83,
  cataract_surgery: 85,
  dental: 93,
  alzheimers: 75
};

const RATES_SAVEETHA = {
  general: 89,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 76,
  kidney: 76,
  kidney_transplant: 77,
  heart: 78,
  angioplasty: 79,
  bypass_surgery: 78,
  cancer: 78,
  orthopedics: 77,
  knee_replacement: 78,
  eye: 83,
  cataract_surgery: 85,
  dental: 92,
  alzheimers: 75
};

const RATES_R_AHMED = {
  general: 88,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 75,
  kidney: 76,
  kidney_transplant: 77,
  heart: 78,
  angioplasty: 79,
  bypass_surgery: 78,
  cancer: 77,
  orthopedics: 76,
  knee_replacement: 77,
  eye: 82,
  cataract_surgery: 84,
  dental: 91,
  alzheimers: 75
};

const RATES_GDC_MUMBAI = {
  general: 87,
  neurology: 75,
  brain_surgery: 75,
  craniotomy: 75,
  kidney: 76,
  kidney_transplant: 77,
  heart: 77,
  angioplasty: 78,
  bypass_surgery: 77,
  cancer: 76,
  orthopedics: 76,
  knee_replacement: 77,
  eye: 82,
  cataract_surgery: 84,
  dental: 90,
  alzheimers: 75
};

// -------------------------------------------------------------
// EXPLICIT STATIC RATE TABLE — Local / regional hospitals (dataset 1..29)
// Every value is hand-authored; no runtime generation of any figure.
// -------------------------------------------------------------
const RATES_LOCAL = {
  1:  { general: 84, neurology: 82, brain_surgery: 81, craniotomy: 80, kidney: 83, kidney_transplant: 84, heart: 88, angioplasty: 89, bypass_surgery: 87, cancer: 75, orthopedics: 86, knee_replacement: 87, eye: 85, cataract_surgery: 88, dental: 83, alzheimers: 78 },
  2:  { general: 86, neurology: 83, brain_surgery: 82, craniotomy: 81, kidney: 85, kidney_transplant: 86, heart: 89, angioplasty: 90, bypass_surgery: 88, cancer: 80, orthopedics: 85, knee_replacement: 86, eye: 86, cataract_surgery: 89, dental: 84, alzheimers: 79 },
  3:  { general: 84, neurology: 84, brain_surgery: 83, craniotomy: 82, kidney: 82, kidney_transplant: 84, heart: 86, angioplasty: 87, bypass_surgery: 85, cancer: 79, orthopedics: 86, knee_replacement: 87, eye: 84, cataract_surgery: 87, dental: 82, alzheimers: 81 },
  4:  { general: 85, neurology: 85, brain_surgery: 84, craniotomy: 83, kidney: 83, kidney_transplant: 85, heart: 87, angioplasty: 88, bypass_surgery: 86, cancer: 80, orthopedics: 85, knee_replacement: 86, eye: 85, cataract_surgery: 88, dental: 83, alzheimers: 82 },
  5:  { general: 89, neurology: 84, brain_surgery: 82, craniotomy: 81, kidney: 88, kidney_transplant: 89, heart: 90, angioplasty: 91, bypass_surgery: 89, cancer: 78, orthopedics: 85, knee_replacement: 86, eye: 84, cataract_surgery: 87, dental: 82, alzheimers: 77 },
  6:  { general: 81, neurology: 78, brain_surgery: 77, craniotomy: 76, kidney: 79, kidney_transplant: 80, heart: 82, angioplasty: 83, bypass_surgery: 81, cancer: 85, orthopedics: 79, knee_replacement: 80, eye: 80, cataract_surgery: 83, dental: 78, alzheimers: 76 },
  7:  { general: 87, neurology: 83, brain_surgery: 82, craniotomy: 81, kidney: 85, kidney_transplant: 86, heart: 90, angioplasty: 91, bypass_surgery: 89, cancer: 81, orthopedics: 88, knee_replacement: 89, eye: 85, cataract_surgery: 88, dental: 84, alzheimers: 79 },
  8:  { general: 86, neurology: 82, brain_surgery: 81, craniotomy: 80, kidney: 86, kidney_transplant: 87, heart: 88, angioplasty: 89, bypass_surgery: 87, cancer: 80, orthopedics: 86, knee_replacement: 87, eye: 85, cataract_surgery: 88, dental: 83, alzheimers: 78 },
  9:  { general: 82, neurology: 79, brain_surgery: 77, craniotomy: 76, kidney: 81, kidney_transplant: 82, heart: 83, angioplasty: 84, bypass_surgery: 82, cancer: 77, orthopedics: 80, knee_replacement: 81, eye: 81, cataract_surgery: 84, dental: 79, alzheimers: 76 },
  10: { general: 88, neurology: 84, brain_surgery: 83, craniotomy: 82, kidney: 86, kidney_transplant: 88, heart: 90, angioplasty: 91, bypass_surgery: 89, cancer: 82, orthopedics: 87, knee_replacement: 88, eye: 86, cataract_surgery: 89, dental: 85, alzheimers: 80 },
  12: { general: 83, neurology: 81, brain_surgery: 79, craniotomy: 78, kidney: 82, kidney_transplant: 83, heart: 84, angioplasty: 85, bypass_surgery: 83, cancer: 78, orthopedics: 84, knee_replacement: 85, eye: 82, cataract_surgery: 85, dental: 80, alzheimers: 77 },
  14: { general: 89, neurology: 87, brain_surgery: 85, craniotomy: 84, kidney: 88, kidney_transplant: 90, heart: 89, angioplasty: 90, bypass_surgery: 88, cancer: 83, orthopedics: 87, knee_replacement: 88, eye: 86, cataract_surgery: 89, dental: 85, alzheimers: 84 },
  15: { general: 87, neurology: 83, brain_surgery: 82, craniotomy: 81, kidney: 85, kidney_transplant: 87, heart: 89, angioplasty: 90, bypass_surgery: 88, cancer: 81, orthopedics: 88, knee_replacement: 89, eye: 85, cataract_surgery: 88, dental: 84, alzheimers: 79 },
  16: { general: 88, neurology: 84, brain_surgery: 83, craniotomy: 82, kidney: 86, kidney_transplant: 88, heart: 90, angioplasty: 91, bypass_surgery: 89, cancer: 82, orthopedics: 87, knee_replacement: 88, eye: 86, cataract_surgery: 89, dental: 85, alzheimers: 80 },
  17: { general: 84, neurology: 85, brain_surgery: 82, craniotomy: 81, kidney: 83, kidney_transplant: 84, heart: 85, angioplasty: 86, bypass_surgery: 84, cancer: 79, orthopedics: 85, knee_replacement: 86, eye: 83, cataract_surgery: 86, dental: 81, alzheimers: 82 },
  18: { general: 85, neurology: 81, brain_surgery: 80, craniotomy: 79, kidney: 83, kidney_transplant: 84, heart: 87, angioplasty: 88, bypass_surgery: 86, cancer: 79, orthopedics: 86, knee_replacement: 87, eye: 83, cataract_surgery: 86, dental: 81, alzheimers: 78 },
  19: { general: 85, neurology: 80, brain_surgery: 79, craniotomy: 78, kidney: 87, kidney_transplant: 88, heart: 84, angioplasty: 85, bypass_surgery: 83, cancer: 77, orthopedics: 80, knee_replacement: 81, eye: 80, cataract_surgery: 83, dental: 79, alzheimers: 76 },
  20: { general: 88, neurology: 81, brain_surgery: 80, craniotomy: 79, kidney: 83, kidney_transplant: 85, heart: 92, angioplasty: 93, bypass_surgery: 91, cancer: 79, orthopedics: 84, knee_replacement: 85, eye: 84, cataract_surgery: 87, dental: 82, alzheimers: 77 },
  21: { general: 86, neurology: 79, brain_surgery: 78, craniotomy: 77, kidney: 89, kidney_transplant: 91, heart: 84, angioplasty: 85, bypass_surgery: 83, cancer: 77, orthopedics: 80, knee_replacement: 81, eye: 80, cataract_surgery: 83, dental: 79, alzheimers: 76 },
  22: { general: 87, neurology: 84, brain_surgery: 82, craniotomy: 81, kidney: 85, kidney_transplant: 87, heart: 89, angioplasty: 90, bypass_surgery: 88, cancer: 81, orthopedics: 87, knee_replacement: 88, eye: 85, cataract_surgery: 88, dental: 84, alzheimers: 80 },
  23: { general: 82, neurology: 79, brain_surgery: 77, craniotomy: 76, kidney: 81, kidney_transplant: 82, heart: 84, angioplasty: 85, bypass_surgery: 83, cancer: 77, orthopedics: 81, knee_replacement: 82, eye: 80, cataract_surgery: 83, dental: 79, alzheimers: 75 },
  24: { general: 80, neurology: 77, brain_surgery: 76, craniotomy: 75, kidney: 82, kidney_transplant: 83, heart: 79, angioplasty: 80, bypass_surgery: 78, cancer: 75, orthopedics: 78, knee_replacement: 79, eye: 77, cataract_surgery: 81, dental: 76, alzheimers: 75 },
  25: { general: 84, neurology: 81, brain_surgery: 80, craniotomy: 79, kidney: 83, kidney_transplant: 84, heart: 86, angioplasty: 87, bypass_surgery: 85, cancer: 79, orthopedics: 85, knee_replacement: 86, eye: 82, cataract_surgery: 85, dental: 81, alzheimers: 78 },
  26: { general: 81, neurology: 78, brain_surgery: 76, craniotomy: 75, kidney: 80, kidney_transplant: 81, heart: 82, angioplasty: 83, bypass_surgery: 81, cancer: 76, orthopedics: 82, knee_replacement: 83, eye: 79, cataract_surgery: 82, dental: 78, alzheimers: 75 },
  27: { general: 79, neurology: 76, brain_surgery: 75, craniotomy: 75, kidney: 78, kidney_transplant: 79, heart: 80, angioplasty: 81, bypass_surgery: 79, cancer: 75, orthopedics: 79, knee_replacement: 80, eye: 77, cataract_surgery: 80, dental: 77, alzheimers: 75 },
  28: { general: 78, neurology: 75, brain_surgery: 75, craniotomy: 75, kidney: 77, kidney_transplant: 78, heart: 79, angioplasty: 80, bypass_surgery: 78, cancer: 75, orthopedics: 78, knee_replacement: 79, eye: 76, cataract_surgery: 79, dental: 76, alzheimers: 75 },
  29: { general: 77, neurology: 75, brain_surgery: 75, craniotomy: 75, kidney: 76, kidney_transplant: 77, heart: 78, angioplasty: 79, bypass_surgery: 77, cancer: 75, orthopedics: 77, knee_replacement: 78, eye: 76, cataract_surgery: 79, dental: 76, alzheimers: 75 }
};

const LOCAL_HOSPITAL_NAMES = {
  1: 'CityCare Multispeciality Hospital',
  2: 'Apollo Medical Centre',
  3: 'LifeLine Institute of Medical Sciences',
  4: 'NorthCare Hospital',
  5: 'Apex Heart & Kidney Institute',
  6: 'Shivalik Cancer & General Hospital',
  7: 'Fortis Premier Hospital',
  8: 'Alchemist Multi-Care Hospital',
  9: 'Civil Care Hospital & Maternity Wing',
  10: 'Indus Super Speciality Hospital',
  12: 'Dharamsheela Institute of Medical Sciences',
  14: 'Christian Medical College & Hospital (CMCH)',
  15: 'Fortis Hospital Ludhiana',
  16: 'SPS Hospitals (Satguru Partap Singh)',
  17: 'Punjab Institute of Medical Sciences (PIMS)',
  18: 'Capitol Hospital',
  19: 'Patel Hospital',
  20: 'Tagore Hospital & Heart Care Centre',
  21: 'India Kidney Hospital & Dialysis Centre',
  22: 'Shrimann Super Specialty Hospital',
  23: 'Johal Multispeciality Hospital',
  24: 'Civil Hospital Hoshiarpur',
  25: 'IVY Hospital Hoshiarpur (Livasa Hospital)',
  26: 'Bharaj Lifecare Hospital and Trauma Centre',
  27: 'Shivam Hospital',
  28: 'Narad Hospital',
  29: 'St. Joseph Hospital'
};

/**
 * Pure deterministic assembler: converts an explicit static rate table into the
 * structured outcome entries consumed by the UI. favorableCount is ALWAYS
 * rate * 10 against the fixed 1,000 cohort, guaranteeing:
 *   simulatedFavorableOutcomes / cohortSize * 100 === simulatedOutcomeRate
 * No value is generated at runtime — rates come exclusively from the static
 * tables above.
 */
function buildConditions(rateTable) {
  const conditions = {};
  Object.entries(rateTable).forEach(([key, rate]) => {
    const numericRate = Number(rate);
    const favorable = numericRate * 10; // fixed cohort of 1,000
    conditions[key] = {
      conditionLabel: CONDITION_LABELS[key] || 'Clinical Inpatient Care',
      cohortSize: SIMULATED_OUTCOME_COHORT_SIZE,
      simulatedFavorableOutcomes: favorable,
      simulatedOutcomeRate: numericRate,
      dataStatus: 'simulated'
    };
  });
  return conditions;
}

/**
 * Structured mock data mapping: hospitalId / alias -> conditions dictionary
 * Covers EVERY hospital in the application datasets:
 * - All 40 curated national reference hospitals (8 categories x 5)
 * - All 27 local hospitals (master dataset 1..29)
 * - Canonical institution aliases
 */
export const SIMULATED_OUTCOMES = {
  // ---------- AIIMS — New Delhi ----------
  'ref_kidney_1': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'ref_heart_2': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'ref_cancer_2': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'ref_brain_surgery_1': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'ref_alz_2': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'ref_ortho_1': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },
  'aiims': { hospitalName: 'AIIMS — New Delhi', conditions: buildConditions(RATES_AIIMS) },

  // ---------- NIMHANS — Bengaluru ----------
  'ref_brain_surgery_2': { hospitalName: 'NIMHANS — Bengaluru', conditions: buildConditions(RATES_NIMHANS) },
  'ref_alz_1': { hospitalName: 'NIMHANS — Bengaluru', conditions: buildConditions(RATES_NIMHANS) },
  'nimhans': { hospitalName: 'NIMHANS — Bengaluru', conditions: buildConditions(RATES_NIMHANS) },

  // ---------- Medanta — Gurugram ----------
  'ref_heart_1': { hospitalName: 'Medanta The Medicity — Gurugram', conditions: buildConditions(RATES_MEDANTA) },
  'ref_brain_surgery_4': { hospitalName: 'Medanta The Medicity — Gurugram', conditions: buildConditions(RATES_MEDANTA) },
  'ref_cancer_4': { hospitalName: 'Medanta The Medicity — Gurugram', conditions: buildConditions(RATES_MEDANTA) },
  'ref_ortho_2': { hospitalName: 'Medanta The Medicity — Gurugram', conditions: buildConditions(RATES_MEDANTA) },
  'medanta': { hospitalName: 'Medanta The Medicity — Gurugram', conditions: buildConditions(RATES_MEDANTA) },

  // ---------- PGIMER — Chandigarh ----------
  'ref_kidney_2': { hospitalName: 'PGIMER — Chandigarh', conditions: buildConditions(RATES_PGIMER) },
  'ref_brain_surgery_3': { hospitalName: 'PGIMER — Chandigarh', conditions: buildConditions(RATES_PGIMER) },
  'ref_alz_3': { hospitalName: 'PGIMER — Chandigarh', conditions: buildConditions(RATES_PGIMER) },
  'pgimer': { hospitalName: 'PGIMER — Chandigarh', conditions: buildConditions(RATES_PGIMER) },

  // ---------- CMC Vellore ----------
  'ref_kidney_3': { hospitalName: 'CMC Vellore — Vellore', conditions: buildConditions(RATES_CMC) },
  'ref_brain_surgery_5': { hospitalName: 'CMC Vellore — Vellore', conditions: buildConditions(RATES_CMC) },
  'ref_cancer_5': { hospitalName: 'CMC Vellore — Vellore', conditions: buildConditions(RATES_CMC) },
  'ref_alz_4': { hospitalName: 'CMC Vellore — Vellore', conditions: buildConditions(RATES_CMC) },
  'cmc': { hospitalName: 'CMC Vellore — Vellore', conditions: buildConditions(RATES_CMC) },

  // ---------- Tata Memorial Hospital — Mumbai ----------
  'ref_cancer_1': { hospitalName: 'Tata Memorial Hospital — Mumbai', conditions: buildConditions(RATES_TATA) },
  'tata_memorial': { hospitalName: 'Tata Memorial Hospital — Mumbai', conditions: buildConditions(RATES_TATA) },

  // ---------- Apollo Hospitals — Chennai ----------
  'ref_kidney_5': { hospitalName: 'Apollo Hospitals — Chennai', conditions: buildConditions(RATES_APOLLO) },
  'ref_heart_3': { hospitalName: 'Apollo Hospitals — Chennai', conditions: buildConditions(RATES_APOLLO) },
  'ref_cancer_3': { hospitalName: 'Apollo Cancer Centres — Chennai', conditions: buildConditions(RATES_APOLLO) },
  'ref_ortho_3': { hospitalName: 'Apollo Hospitals — Chennai', conditions: buildConditions(RATES_APOLLO) },
  'apollo': { hospitalName: 'Apollo Hospitals — Chennai', conditions: buildConditions(RATES_APOLLO) },

  // ---------- Narayana Institute of Cardiac Sciences — Bengaluru ----------
  'ref_heart_4': { hospitalName: 'Narayana Institute — Bengaluru', conditions: buildConditions(RATES_NARAYANA_CARDIAC) },
  'narayana_cardiac': { hospitalName: 'Narayana Institute — Bengaluru', conditions: buildConditions(RATES_NARAYANA_CARDIAC) },

  // ---------- Fortis Escorts — New Delhi ----------
  'ref_heart_5': { hospitalName: 'Fortis Escorts — New Delhi', conditions: buildConditions(RATES_FORTIS_ESCORTS) },
  'fortis_escorts': { hospitalName: 'Fortis Escorts — New Delhi', conditions: buildConditions(RATES_FORTIS_ESCORTS) },

  // ---------- SGPGIMS — Lucknow ----------
  'ref_kidney_4': { hospitalName: 'SGPGIMS — Lucknow', conditions: buildConditions(RATES_SGPGIMS) },
  'ref_alz_5': { hospitalName: 'SGPGIMS — Lucknow', conditions: buildConditions(RATES_SGPGIMS) },
  'sgpgims': { hospitalName: 'SGPGIMS — Lucknow', conditions: buildConditions(RATES_SGPGIMS) },

  // ---------- Eye / Ophthalmology ----------
  'ref_eye_1': { hospitalName: 'LV Prasad Eye Institute — Hyderabad', conditions: buildConditions(RATES_LVPEI) },
  'lvpei': { hospitalName: 'LV Prasad Eye Institute — Hyderabad', conditions: buildConditions(RATES_LVPEI) },
  'ref_eye_2': { hospitalName: 'Aravind Eye Hospital — Madurai', conditions: buildConditions(RATES_ARAVIND) },
  'aravind': { hospitalName: 'Aravind Eye Hospital — Madurai', conditions: buildConditions(RATES_ARAVIND) },
  'ref_eye_3': { hospitalName: 'Sankara Nethralaya — Chennai', conditions: buildConditions(RATES_SANKARA) },
  'sankara': { hospitalName: 'Sankara Nethralaya — Chennai', conditions: buildConditions(RATES_SANKARA) },
  'ref_eye_4': { hospitalName: 'Dr. R.P. Centre (AIIMS) — New Delhi', conditions: buildConditions(RATES_AIIMS_EYE) },
  'ref_eye_5': { hospitalName: 'Narayana Nethralaya — Bengaluru', conditions: buildConditions(RATES_NARAYANA_NETHRALAYA) },

  // ---------- Orthopedics ----------
  'ref_ortho_4': { hospitalName: 'Kokilaben Dhirubhai Ambani Hospital — Mumbai', conditions: buildConditions(RATES_KOKILABEN) },
  'kokilaben': { hospitalName: 'Kokilaben Dhirubhai Ambani Hospital — Mumbai', conditions: buildConditions(RATES_KOKILABEN) },
  'ref_ortho_5': { hospitalName: 'Manipal Hospitals — Bengaluru', conditions: buildConditions(RATES_MANIPAL_ORTHO) },
  'manipal_ortho': { hospitalName: 'Manipal Hospitals — Bengaluru', conditions: buildConditions(RATES_MANIPAL_ORTHO) },

  // ---------- Dental ----------
  'ref_dental_1': { hospitalName: 'MAIDS — New Delhi', conditions: buildConditions(RATES_MAIDS) },
  'maids': { hospitalName: 'MAIDS — New Delhi', conditions: buildConditions(RATES_MAIDS) },
  'ref_dental_2': { hospitalName: 'Manipal College of Dental Sciences — Manipal', conditions: buildConditions(RATES_MCODS_MANIPAL) },
  'ref_dental_3': { hospitalName: 'Saveetha Dental College — Chennai', conditions: buildConditions(RATES_SAVEETHA) },
  'ref_dental_4': { hospitalName: 'Dr. R. Ahmed Dental College — Kolkata', conditions: buildConditions(RATES_R_AHMED) },
  'ref_dental_5': { hospitalName: 'Government Dental College — Mumbai', conditions: buildConditions(RATES_GDC_MUMBAI) },

  // ---------- Local / regional hospitals (master dataset) ----------
  ...Object.fromEntries(
    Object.keys(RATES_LOCAL).map(id => [
      String(id),
      { hospitalName: LOCAL_HOSPITAL_NAMES[id], conditions: buildConditions(RATES_LOCAL[id]) }
    ])
  )
};

/**
 * Deterministic lookup for simulated patient outcome metrics.
 * 
 * Rules:
 * 1. Resolves strictly via Hospital + Current Condition/Procedure.
 * 2. Procedure-specific keys take priority over broad condition keys because
 *    normalizeSimConditionKey resolves an explicit procedure FIRST, and every
 *    hospital carries its own explicit procedure-specific entries.
 * 3. 100% deterministic — reads pre-stored static mock data only; the same
 *    Hospital + Condition + Procedure ALWAYS returns the identical object.
 * 4. Unsupported combinations honestly return null (rendered as
 *    "Outcome data: Not available" is never fabricated at runtime).
 * 5. NEVER used for ranking — informational only.
 * 
 * @param {string|number} hospitalId - Hospital identifier (e.g. "ref_brain_surgery_1", "ref_kidney_1", "aiims", 1)
 * @param {string} [condition=''] - Searched condition name / key
 * @param {string} [procedure=''] - Searched procedure name / key
 * @param {string} [query=''] - Search query text
 * @returns {Object|null} Structured simulated outcome object or null if not defined
 */
export function getSimulatedOutcome(hospitalId, condition = '', procedure = '', query = '') {
  if (hospitalId === null || hospitalId === undefined) return null;
  const strId = String(hospitalId).toLowerCase().trim();
  if (!strId) return null;

  const record = SIMULATED_OUTCOMES[strId];
  if (!record || !record.conditions) return null;

  const targetKey = normalizeSimConditionKey(condition, procedure, query) || 'general';
  const outcome = record.conditions[targetKey];
  if (!outcome) return null;

  return {
    hospitalId: strId,
    condition: targetKey,
    conditionLabel: outcome.conditionLabel,
    cohortSize: outcome.cohortSize,
    simulatedFavorableOutcomes: outcome.simulatedFavorableOutcomes,
    simulatedOutcomeRate: outcome.simulatedOutcomeRate,
    dataStatus: 'simulated',
    disclaimer: SIMULATED_OUTCOME_DISCLAIMER
  };
}
