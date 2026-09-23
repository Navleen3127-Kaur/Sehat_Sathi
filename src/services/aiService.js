/**
 * Sehat_Sathi - Multilingual AI Natural-Language Query Parsing Service
 * 
 * Supports Natural Speech & Text in:
 * - English
 * - Hindi (हिन्दी)
 * - Punjabi (ਪੰਜਾਬੀ)
 * - Hinglish
 * 
 * CORE PRINCIPLE:
 * Strictly extracts ONLY explicitly mentioned or clearly implied requirements.
 * Maps multilingual terms to the unified internal canonical schema.
 * DOES NOT invent facilities, budgets, or locations if not present in the user query.
 */

const delay = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));

import { 
  matchCondition, 
  matchProcedure, 
  matchFacilities, 
  CONDITION_CATALOGUE, 
  PROCEDURE_CATALOGUE, 
  FACILITY_CATALOGUE 
} from '../data/conditionCatalogue.js';

// Digit normalizer for Devanagari and Gurmukhi numbers
const normalizeScriptDigits = (str = '') => {
  const devanagariMap = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  const gurmukhiMap = { '੦': '0', '੧': '1', '੨': '2', '੩': '3', '੪': '4', '੫': '5', '੬': '6', '੭': '7', '੮': '8', '੯': '9' };
  
  return str
    .replace(/[०-९]/g, (d) => devanagariMap[d] || d)
    .replace(/[੦-੯]/g, (d) => gurmukhiMap[d] || d);
};

/**
 * Robust Multilingual Indian & Hinglish Budget Parser.
 * Returns numeric budgetMax in INR or null if no budget was specified.
 * 
 * @param {string} query 
 * @returns {number|null}
 */
export function parseBudget(query) {
  if (!query || typeof query !== 'string') return null;
  const normalized = normalizeScriptDigits(query);
  const clean = normalized.toLowerCase();

  // Word-to-number phrase mappings (English, Hindi, Punjabi, Hinglish)
  const lakhWords = [
    { words: ['ek', 'one', '1', 'एक', 'ਇੱਕ', 'ਇਕ'], val: 1 },
    { words: ['dedh', 'derh', 'डेढ़', 'ਡੇਢ', '1.5'], val: 1.5 },
    { words: ['do', 'two', '2', 'दो', 'ਦੋ'], val: 2 },
    { words: ['dhai', 'adhai', 'ढाई', 'ਢਾਈ', '2.5'], val: 2.5 },
    { words: ['teen', 'three', '3', 'तीन', 'ਤਿੰਨ'], val: 3 },
    { words: ['chaar', 'char', 'four', '4', 'चार', 'ਚਾਰ'], val: 4 },
    { words: ['paanch', 'panch', 'five', '5', 'पांच', 'ਪੰਜ'], val: 5 },
    { words: ['chheh', 'chhe', 'six', '6', 'छह', 'ਛੇ'], val: 6 },
    { words: ['saat', 'seven', '7', 'सात', 'ਸੱਤ'], val: 7 },
    { words: ['aath', 'eight', '8', 'आठ', 'ਅੱਠ'], val: 8 },
    { words: ['nau', 'nine', '9', 'नौ', 'ਨੌਂ'], val: 9 },
    { words: ['dus', 'das', 'ten', '10', 'दस', 'ਦਸ'], val: 10 }
  ];

  // 1. Check explicit lakh word patterns: (prefix)? (word) lakh (suffix)?
  for (const item of lakhWords) {
    for (const w of item.words) {
      const pattern = new RegExp('(?:^|[\\s₹,.]|rs\\.?)' + w + '\\s*(?:lakh|lakhs|lac|lacs|लाख|ਲੱਖ)', 'i');
      if (pattern.test(clean)) {
        return Math.round(item.val * 100000);
      }
    }
  }

  // 2. Generic numeric Lakh regex: (e.g. 1.2 lakh, 4.5 lakh)
  const numLakhMatch = clean.match(/(?:(?:under|below|within|upto|up to|less than|budget of|अंदर|तक|ਤੱਕ|ਘੱਟ|कम)\s*)?(?:₹|rs\.?|inr)?\s*([0-9.]+)\s*(?:lakh|lakhs|lac|lacs|लाख|ਲੱਖ|l\\b)/i);
  if (numLakhMatch && numLakhMatch[1]) {
    const val = parseFloat(numLakhMatch[1]);
    if (!isNaN(val) && val > 0) {
      return Math.round(val * 100000);
    }
  }

  // 3. Thousand / 'k' regex: (e.g. 50k, 50 thousand, 80 hazar)
  const thousandMatch = clean.match(/(?:(?:under|below|within|upto|up to|less than|budget of|अंदर|तक|ਤੱਕ)\s*)?(?:₹|rs\.?|inr)?\s*([0-9.]+)\s*(?:k\\b|हजार|ਹਜ਼ਾਰ|thousand|hazar)/i);
  if (thousandMatch && thousandMatch[1]) {
    const val = parseFloat(thousandMatch[1]);
    if (!isNaN(val) && val > 0) {
      return Math.round(val * 1000);
    }
  }

  // 4. Raw numeric values with budget context or currency sign:
  // e.g. "below ₹200000", "under 200000", "₹2,00,000", "200000 ke andar"
  const rawBudgetMatch = clean.match(/(?:(?:under|below|within|upto|up to|less than|budget of|अंदर|तक|ਤੱਕ|कम|ਘੱਟ)\s*(?:₹|rs\.?|inr)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{4,7})|(?:₹|rs\.?|inr)\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{4,7})|([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{4,7})\s*(?:ke andar|tak|se kam|se niche|रुपये|ਰੁਪਏ|rupees|inr))/i);
  if (rawBudgetMatch) {
    const numStr = rawBudgetMatch[1] || rawBudgetMatch[2] || rawBudgetMatch[3];
    if (numStr) {
      const val = parseInt(numStr.replace(/,/g, ''), 10);
      if (!isNaN(val) && val >= 1000) {
        return val;
      }
    }
  }

  // 5. Standalone 5-7 digit numeric value representing budget (e.g. "100000", "50000")
  const standaloneMatch = clean.match(/\b([1-9][0-9]{4,6})\b/);
  if (standaloneMatch && standaloneMatch[1]) {
    const val = parseInt(standaloneMatch[1], 10);
    // Ignore pincodes (e.g. 160022)
    if (!isNaN(val) && val >= 10000 && val <= 10000000 && val !== 160022 && val !== 160009 && val !== 160014) {
      return val;
    }
  }

  return null;
}

/**
 * Normalizes query text to standardized medical condition taxonomy.
 * 
 * @param {string} queryText 
 * @returns {{ condition: string, conditionLabel: string, specialty: string, costKey: string|null }}
 */
export function normalizeCondition(queryText = '') {
  if (!queryText || typeof queryText !== 'string') {
    return { condition: '', conditionLabel: '', specialty: 'all', costKey: null };
  }

  const normalized = normalizeScriptDigits(queryText);
  const lower = normalized.toLowerCase();

  // 1. Heart / Cardiovascular
  if (
    lower.includes("heart") || lower.includes("cardio") || lower.includes("cardiac") ||
    lower.includes("angioplasty") || lower.includes("stent") || lower.includes("bypass") ||
    lower.includes("chest pain") || lower.includes("ecg") || lower.includes("cardiologist") ||
    lower.includes("heart attack") || lower.includes("दिल") || lower.includes("हृदय") || lower.includes("हार्ट") ||
    lower.includes("ਦਿਲ") || lower.includes("ਹਿਰਦਾ") || lower.includes("ਹਾਰਟ") ||
    /\bdil\b/.test(lower) || /\bhriday\b/.test(lower)
  ) {
    return {
      condition: 'heart',
      conditionLabel: 'Cardiovascular / Heart Care',
      specialty: 'cardiology',
      costKey: 'cardiacCare'
    };
  }

  // 2. Kidney / Renal
  const withoutRenalDialysis = lower.replace(/\brenal\s+dialysis\b/gi, ' ');
  if (
    lower.includes("kidney") || withoutRenalDialysis.includes("renal") || lower.includes("stone") ||
    lower.includes("nephro") || lower.includes("creatinine") ||
    lower.includes("गुर्दा") || lower.includes("गुर्दे") || lower.includes("किडनी") || lower.includes("पथरी") ||
    lower.includes("ਗੁਰਦਾ") || lower.includes("ਗੁਰਦੇ") || lower.includes("ਕਿਡਨੀ") || lower.includes("ਪੱਥਰੀ") ||
    /\bgurda\b/.test(lower) || /\bgurde\b/.test(lower) || /\bpathri\b/.test(lower)
  ) {
    return {
      condition: 'kidney',
      conditionLabel: 'Nephrology & Kidney Care',
      specialty: 'nephrology',
      costKey: 'kidneyTreatment'
    };
  }

  // 3. Cancer / Oncology
  if (
    lower.includes("cancer") || lower.includes("chemo") || lower.includes("chemotherapy") ||
    lower.includes("oncology") || lower.includes("tumor") || lower.includes("radiation") || lower.includes("biopsy") ||
    lower.includes("कैंसर") || lower.includes("कीमो") || lower.includes("ट्यूमर") || lower.includes("कर्क रोग") ||
    lower.includes("ਕੈਂਸਰ") || lower.includes("ਕੀਮੋ") || lower.includes("ਟਿਊਮਰ")
  ) {
    return {
      condition: 'cancer',
      conditionLabel: 'Oncology & Cancer Care',
      specialty: 'oncology',
      costKey: 'cancerCare'
    };
  }

  // 4. Orthopedics / Bone & Joint
  if (
    lower.includes("ortho") || lower.includes("bone") || lower.includes("knee") || lower.includes("joint") ||
    lower.includes("spine") || lower.includes("fracture") || lower.includes("hip replacement") || lower.includes("ligament") ||
    lower.includes("हड्डी") || lower.includes("हड्डियों") || lower.includes("घुटना") || lower.includes("घुटने") || lower.includes("जोड़") || lower.includes("कमर") ||
    lower.includes("ਹੱਡੀ") || lower.includes("ਹੱਡੀਆਂ") || lower.includes("ਗੋਡਾ") || lower.includes("ਗੋਡੇ") || lower.includes("ਜੋੜ") ||
    /\bhaddi\b/.test(lower) || /\bghutna\b/.test(lower) || /\bgoda\b/.test(lower) || /\bjod\b/.test(lower)
  ) {
    return {
      condition: 'orthopedics',
      conditionLabel: 'Orthopedics & Joint Care',
      specialty: 'orthopedics',
      costKey: 'orthopedicCare'
    };
  }

  // 5. Maternity / Obstetrics
  if (
    lower.includes("maternity") || lower.includes("pregnancy") || lower.includes("delivery") ||
    lower.includes("c-section") || lower.includes("cesarean") || lower.includes("obstetric") || lower.includes("gynec") ||
    lower.includes("डिलीवरी") || lower.includes("गर्भावस्था") || lower.includes("प्रसव") || lower.includes("जच्चा बच्चा") ||
    lower.includes("ਡਿਲੀਵਰੀ") || lower.includes("ਗਰਭਵਤੀ") || lower.includes("ਜੱਚਾ ਬੱਚਾ")
  ) {
    return {
      condition: 'maternity',
      conditionLabel: 'Obstetrics & Maternity Care',
      specialty: 'obstetrics_gynecology',
      costKey: 'maternityCare'
    };
  }

  // 6. Emergency & Trauma
  if (
    lower.includes("emergency") || lower.includes("trauma") || lower.includes("accident") ||
    lower.includes("urgent") || lower.includes("आपातकालीन") || lower.includes("इमरजेंसी") || lower.includes("ਐਮਰਜੈਂਸੀ")
  ) {
    return {
      condition: 'emergency',
      conditionLabel: 'Emergency & Trauma Care',
      specialty: 'all',
      costKey: 'emergencyTrauma'
    };
  }

  // 7. Neurology / Brain
  if (
    lower.includes("neuro") || lower.includes("brain") || lower.includes("stroke") || lower.includes("neurologist") || lower.includes("headache") ||
    lower.includes("दिमाग") || lower.includes("मस्तिष्क") || lower.includes("न्यूरो") || lower.includes("स्ट्रोक") || lower.includes("दौरा") ||
    lower.includes("ਦਿਮਾਗ") || lower.includes("ਨਿਊਰੋ") || lower.includes("ਸਟ੍ਰੋਕ") || lower.includes("ਦੌਰਾ") ||
    /\bdimag\b/.test(lower)
  ) {
    return {
      condition: 'neurology',
      conditionLabel: 'Neurology & Neuro Surgery',
      specialty: 'neurology',
      costKey: null
    };
  }

  // 8. Pediatrics / Children
  if (
    lower.includes("child") || lower.includes("pediatric") || lower.includes("baby") || lower.includes("neonatal") ||
    lower.includes("infant") || lower.includes("बच्चा") || lower.includes("बच्चों") || lower.includes("ਬੱਚਾ") || lower.includes("ਬੱਚਿਆਂ")
  ) {
    return {
      condition: 'pediatrics',
      conditionLabel: 'Pediatrics & Neonatology',
      specialty: 'pediatrics',
      costKey: null
    };
  }

  // 9. Pulmonology / Respiratory
  if (
    lower.includes("lung") || lower.includes("pulmono") || lower.includes("chest") || lower.includes("asthma") ||
    lower.includes("respiratory") || lower.includes("breath") || lower.includes("फेफड़े") || lower.includes("ਦਮਾ") || lower.includes("ਸਾਹ")
  ) {
    return {
      condition: 'pulmonology',
      conditionLabel: 'Pulmonology & Respiratory',
      specialty: 'pulmonology',
      costKey: null
    };
  }

  // 10. Gastroenterology
  if (
    lower.includes("gastro") || lower.includes("liver") || lower.includes("stomach") || lower.includes("digest") ||
    lower.includes("endoscopy") || lower.includes("hepat") || lower.includes("पेट") || lower.includes("लिवर") || lower.includes("ਜਿਗਰ")
  ) {
    return {
      condition: 'gastroenterology',
      conditionLabel: 'Gastroenterology & Hepatology',
      specialty: 'gastroenterology',
      costKey: null
    };
  }

  // 11. Ophthalmology / Eye Care
  if (
    lower.includes("eye") || lower.includes("cataract") || lower.includes("ophthalmo") || lower.includes("vision") ||
    lower.includes("आंख") || lower.includes("आँख") || lower.includes("मोतियाबिंद") || lower.includes("ਅੱਖ")
  ) {
    return {
      condition: 'ophthalmology',
      conditionLabel: 'Ophthalmology & Eye Care',
      specialty: 'ophthalmology',
      costKey: null
    };
  }

  // 12. ENT / Ear Nose Throat
  if (
    lower.includes("ent") || lower.includes("ear") || lower.includes("nose") || lower.includes("throat") ||
    lower.includes("कान") || lower.includes("नाक") || lower.includes("गला") || lower.includes("ਕੰਨ") || lower.includes("ਨੱਕ")
  ) {
    return {
      condition: 'ent',
      conditionLabel: 'ENT & Head Neck Care',
      specialty: 'ent',
      costKey: null
    };
  }

  // 13. Dental Care
  if (
    lower.includes("dental") || lower.includes("dentist") || lower.includes("teeth") || lower.includes("tooth") ||
    lower.includes("दांत") || lower.includes("ਦੰਦ")
  ) {
    return {
      condition: 'dental',
      conditionLabel: 'Dental Care',
      specialty: 'dental',
      costKey: null
    };
  }

  // 14. Dermatology / Skin Care
  if (
    lower.includes("derma") || lower.includes("skin") || lower.includes("त्वचा") || lower.includes("ਚਮੜੀ")
  ) {
    return {
      condition: 'dermatology',
      conditionLabel: 'Dermatology & Skin Care',
      category: 'Dermatology',
      specialty: 'dermatology',
      relatedSpecialties: ['Dermatology'],
      costKey: null
    };
  }

  // 15. Check centralized condition catalogue for expanded taxonomy conditions (e.g. alzheimers, parkinsons, stroke, diabetes, etc.)
  const matchedCond = matchCondition(lower);
  if (matchedCond) {
    const primarySpec = matchedCond.relatedSpecialties && matchedCond.relatedSpecialties.length > 0
      ? matchedCond.relatedSpecialties[0].toLowerCase().replace(/[^a-z0-9_]/g, '_')
      : 'all';
    return {
      condition: matchedCond.id,
      conditionLabel: matchedCond.name,
      category: matchedCond.category,
      specialty: primarySpec,
      relatedSpecialties: matchedCond.relatedSpecialties || [],
      costKey: matchedCond.costKey || null,
      isBroad: !!matchedCond.isBroad
    };
  }

  // 16. Check centralized procedure catalogue (e.g. kidney_transplant, liver_transplant, etc.)
  const matchedProc = matchProcedure(lower);
  if (matchedProc && matchedProc.id !== 'dialysis_procedure') {
    const primarySpec = matchedProc.relatedSpecialties && matchedProc.relatedSpecialties.length > 0
      ? matchedProc.relatedSpecialties[0].toLowerCase().replace(/[^a-z0-9_]/g, '_')
      : 'all';
    return {
      condition: matchedProc.relatedCondition || matchedProc.id,
      conditionLabel: matchedProc.name,
      category: matchedProc.category,
      specialty: primarySpec,
      relatedSpecialties: matchedProc.relatedSpecialties || [],
      costKey: matchedProc.costKey || null,
      procedure: matchedProc.id
    };
  }

  // Check if query only contains generic healthcare terms, facilities, locations, budgets, or stop words
  const nonConditionTokens = [
    'hospital', 'hospitals', 'clinic', 'clinics', 'centre', 'center', 'care', 'doctor', 'doctors', 'specialist', 'treatment',
    'nursing', 'home', 'facility', 'facilities', 'services', 'unit', 'wing', 'department',
    'for', 'with', 'and', 'or', 'a', 'an', 'the', 'in', 'at', 'of', 'to', 'from', 'near', 'me', 'nearby', 'my', 'location',
    'find', 'show', 'search', 'need', 'want', 'looking', 'give', 'get', 'best', 'top', 'good', 'affordable', 'low', 'cost',
    'chahiye', 'chahida', 'mere', 'ko', 'mujhe', 'mainu', 'karo', 'de', 'da', 'di', 'hai', 'h', 'ka', 'ki', 'ke', 'andar', 'se', 'tak', 'kam', 'niche', 'paas', 'nere', 'wala', 'wali', 'wale',
    'ek', 'do', 'teen', 'char', 'chaar', 'panch', 'paanch', 'chhe', 'chheh', 'saat', 'aath', 'nau', 'das', 'dus', 'dedh', 'dhai', 'adhai',
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'dialysis', 'hemodialysis', 'haemodialysis', 'icu', 'mri', 'ct', 'ct_scan', 'ct scan', 'blood_bank', 'blood bank', 'ot', 'modular_ot', 'operation_theatre', 'operation theatre', 'nicu', 'cath_lab', 'cath lab', 'ambulance',
    'डायलिसिस', 'ਡਾਇਲਿਸਿਸ', 'ਡਾਇਲਸਿਸ', 'आईसीयू', 'ਆਈਸੀਯੂ', 'एमआरआई', 'ਐਮਆਰਆਈ', 'सीटी स्कैन', 'ਸੀਟੀ ਸਕੈਨ', 'ब्लਡ ਬੈਂਕ', 'ਬਲੱਡ ਬੈਂਕ',
    'under', 'below', 'within', 'upto', 'up to', 'less', 'than', 'budget', 'rs', 'rupees', 'inr', 'lakh', 'lakhs', 'lac', 'lacs', 'k', 'thousand', 'hazar',
    'लाख', 'ਲੱਖ', 'अंदर', 'ਅੰਦਰ', 'तक', 'ਤੱਕ', 'कम', 'ਘੱਟ', 'रुपये', 'ਰੁਪਏ', 'हजार', 'ਹਜ਼ਾਰ',
    'मुझे', 'ਮੈਨੂੰ', 'चाहिए', 'ਚਾਹੀਦਾ', 'ਹੈ', 'है', 'के', 'ਦੇ', 'का', 'की', 'ਦਾ', 'ਦੀ', 'ਵਾਲਾ', 'ਵਾਲੀ', 'ਵਾਲੇ', 'वाला', 'वाली', 'वाले',
    'अस्पताल', 'हस्पताल', 'हॉस्पिटल', 'ਹਸਪਤਾਲ', 'ਇੱਕ', 'ਇਕ', 'ਦੋ', 'ਤਿੰਨ', 'ਚਾਰ', 'ਪੰਜ',
    'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'chandigarh', 'mohali', 'panchkula', 'zirakpur', 'ludhiana', 'jalandhar', 'hoshiarpur', 'patiala', 'ambala', 'delhi', 'ncr', 'gurugram', 'gurgaon', 'noida',
    'चंडीगढ़', 'ਚੰਡੀਗੜ੍ਹ', 'मोहाली', 'ਮੋਹਾਲੀ', 'पंचकूला', 'ਪੰਚਕੂਲਾ', 'जीरकपुर', 'ਜ਼ੀਰਕਪੁਰ', 'लुधियाना', 'ਲੁਧਿਆਣਾ', 'जालंधर', 'ਜਲੰਧਰ', 'होशियारपुर', 'ਹੁਸ਼ਿਆਰਪੁਰ', 'ਹੁਸ਼ਿਆਰਪੁਰ', 'पटियाला', 'ਪਟਿਆਲਾ', 'अंबाला', 'ਅੰਬਾਲਾ', 'दिल्ली', 'ਦਿੱਲੀ'
  ];

  let stripped = lower
    .replace(/\brenal\s+dialysis\b/gi, 'dialysis')
    .replace(/\bdialysis\s+(?:unit|centre|center)\b/gi, 'dialysis')
    .replace(/\bblood\s+bank\b/gi, 'blood_bank')
    .replace(/\bct\s+scan\b/gi, 'ct_scan')
    .replace(/\boperation\s+theatre\b/gi, 'operation_theatre')
    .replace(/\bmodular\s+ot\b/gi, 'operation_theatre')
    .replace(/\bcath\s+lab\b/gi, 'cath_lab')
    .replace(/[0-9,]+/g, ' ')
    .replace(/[^\w\s\u0900-\u097F\u0A00-\u0A7F]/g, ' ');

  const remainingTokens = stripped.split(/\s+/).filter(w => w && !nonConditionTokens.includes(w));

  if (remainingTokens.length === 0) {
    return {
      condition: '',
      conditionLabel: '',
      specialty: 'all',
      costKey: null
    };
  }

  const customCondition = remainingTokens.join(' ');
  return {
    condition: customCondition,
    conditionLabel: customCondition.charAt(0).toUpperCase() + customCondition.slice(1),
    specialty: 'all',
    costKey: null
  };
}

let lastIntentTimestamp = null;
let lastIntentTimestampTime = 0;

export const aiService = {
  parseBudget,
  normalizeCondition,

  /**
   * Synchronously parse a natural language healthcare query (English/Hindi/Punjabi/Hinglish) into structured canonical parameters.
   */
  parseSearchIntent(queryText = "") {
    const clean = (queryText || "").trim();
    if (!clean) {
      return null;
    }

    const now = Date.now();
    if (now - lastIntentTimestampTime >= 100 || !lastIntentTimestamp) {
      lastIntentTimestampTime = now;
      lastIntentTimestamp = new Date(now).toISOString();
    }

    const normalizedText = normalizeScriptDigits(clean);
    const lower = normalizedText.toLowerCase();

    // 1. Condition & Specialty Normalization
    const conditionInfo = normalizeCondition(clean);

    // 2. Multilingual Location Extraction - ONLY set if explicitly named in query!
    let location = null;
    let locationLabel = "Near My Location";

    if (lower.includes("chandigarh") || lower.includes("चंडीगढ़") || lower.includes("ਚੰਡੀਗੜ੍ਹ")) {
      location = "Chandigarh";
      locationLabel = "Chandigarh";
    } else if (lower.includes("mohali") || lower.includes("sas nagar") || lower.includes("मोहाली") || lower.includes("ਮੋਹਾਲੀ")) {
      location = "Mohali";
      locationLabel = "Mohali";
    } else if (lower.includes("panchkula") || lower.includes("पंचकूला") || lower.includes("ਪੰਚਕੂਲਾ")) {
      location = "Panchkula";
      locationLabel = "Panchkula";
    } else if (lower.includes("zirakpur") || lower.includes("जीरकपुर") || lower.includes("ਜ਼ੀਰਕਪੁਰ")) {
      location = "Zirakpur";
      locationLabel = "Zirakpur";
    } else if (lower.includes("ludhiana") || lower.includes("लुधियाना") || lower.includes("ਲੁਧਿਆਣਾ")) {
      location = "Ludhiana";
      locationLabel = "Ludhiana";
    } else if (lower.includes("jalandhar") || lower.includes("जालंधर") || lower.includes("ਜਲੰਧਰ")) {
      location = "Jalandhar";
      locationLabel = "Jalandhar";
    } else if (lower.includes("hoshiarpur") || lower.includes("होशियारपुर") || lower.includes("ਹੁਸ਼ਿਆਰਪੁਰ") || lower.includes("ਹੁਸ਼ਿਆਰਪੁਰ")) {
      location = "Hoshiarpur";
      locationLabel = "Hoshiarpur";
    } else if (lower.includes("patiala") || lower.includes("पटियाला") || lower.includes("ਪਟਿਆਲਾ")) {
      location = "Patiala";
      locationLabel = "Patiala";
    } else if (lower.includes("ambala") || lower.includes("अंबाला") || lower.includes("ਅੰਬਾਲਾ")) {
      location = "Ambala";
      locationLabel = "Ambala";
    } else if (lower.includes("delhi") || lower.includes("दिल्ली") || lower.includes("ਦਿੱਲੀ") || lower.includes("ncr") || lower.includes("gurugram") || lower.includes("gurgaon") || lower.includes("noida")) {
      location = "Delhi NCR";
      locationLabel = "Delhi NCR";
    }

    // 3. Multilingual Budget Extraction
    const budgetMax = parseBudget(clean);
    const budgetLabel = budgetMax ? `Up to ₹${budgetMax.toLocaleString('en-IN')}` : "Any Budget";

    // 4. Multilingual Facility Extraction - STRICTLY only extract facilities actually present!
    const facilities = [];
    const facilityLabels = [];

    if (
      lower.includes("dialysis") ||
      lower.includes("hemodialysis") ||
      lower.includes("haemodialysis") ||
      lower.includes("डायलिसिस") ||
      lower.includes("ਡਾਇਲਿਸਿਸ") ||
      lower.includes("ਡਾਇਲਸਿਸ")
    ) {
      facilities.push("dialysis");
      facilityLabels.push("Dialysis Unit");
    }
    if (lower.includes("icu") || lower.includes("आईसीयू") || lower.includes("ਆਈਸੀਯੂ") || lower.includes("intensive care")) {
      facilities.push("icu");
      facilityLabels.push("ICU");
    }
    if (lower.includes("mri") || lower.includes("एमआरआई") || lower.includes("ਐਮਆਰਆਈ")) {
      facilities.push("mri");
      facilityLabels.push("MRI Imaging");
    }
    if (lower.includes("ct scan") || lower.includes("ct-scan") || lower.includes("सीटी स्कैन") || lower.includes("ਸੀਟੀ ਸਕੈਨ") || /\bct\b/.test(lower)) {
      facilities.push("ct_scan");
      facilityLabels.push("CT Scan");
    }
    if (lower.includes("blood bank") || lower.includes("blood-bank") || lower.includes("ब्लड बैंक") || lower.includes("ਬਲੱਡ ਬੈਂਕ")) {
      facilities.push("blood_bank");
      facilityLabels.push("Blood Bank");
    }
    if (lower.includes("operation theatre") || lower.includes("modular ot") || lower.includes("ऑपरेशन थिएटर") || lower.includes("ਆਪ੍ਰੇਸ਼ਨ ਥੀਏਟਰ") || /\bot\b/.test(lower)) {
      facilities.push("operation_theatre");
      facilityLabels.push("Modular OT");
    }
    if (lower.includes("nicu") || lower.includes("neonatal icu") || lower.includes("एनआईसीयू") || lower.includes("ਐਨਆੀਸੀਯੂ")) {
      facilities.push("nicu");
      facilityLabels.push("NICU");
    }
    if (lower.includes("cath lab") || lower.includes("cathlab") || lower.includes("कैथ लैब") || lower.includes("ਕੈਥ ਲੈਬ")) {
      facilities.push("cath_lab");
      facilityLabels.push("Cath Lab");
    }
    if (lower.includes("ambulance") || lower.includes("एम्बुलेंस") || lower.includes("ਐਂਬੂਲੈਂਸ")) {
      facilities.push("ambulance");
      facilityLabels.push("Ambulance");
    }

    // 5. Emergency Requirement
    const emergencyRequired = (
      lower.includes("emergency") || lower.includes("24x7") || lower.includes("24/7") || lower.includes("trauma") || lower.includes("urgent") ||
      lower.includes("आपातकालीन") || lower.includes("इमरजेंसी") || lower.includes("दुर्घटना") || lower.includes("तुरंत") ||
      lower.includes("ਐਮਰਜੈਂਸੀ") || lower.includes("ਦੁਰਘਟਨਾ") || lower.includes("ਤੁਰੰਤ")
    );

    // 6. Priorities
    const priorities = [];
    if (budgetMax) priorities.push("Budget constraint");
    if (lower.includes("near") || lower.includes("closest") || lower.includes("close") || lower.includes("proximity") || lower.includes("पास") || lower.includes("ਨੇੜੇ") || /\bpaas\b/.test(lower)) {
      priorities.push("Proximity / Distance");
    }
    if (emergencyRequired) priorities.push("24x7 Emergency");
    if (facilities.length > 0) priorities.push("Specialized Facilities");
    // 1b. Procedure Detection (strictly distinguishes procedure from condition)
    const proc = matchProcedure(clean);
    let procedure = null;
    let procedureName = null;
    if (proc && proc.id !== 'dialysis_procedure') {
      procedure = proc.id;
      procedureName = proc.name;
    }

    const intent = {
      rawQuery: clean,
      condition: conditionInfo.condition || null,
      conditionLabel: conditionInfo.condition ? (conditionInfo.conditionLabel || conditionInfo.condition) : "No specific condition",
      conditionCategory: conditionInfo.category || null,
      relatedSpecialties: conditionInfo.relatedSpecialties || [],
      isBroadCondition: !!conditionInfo.isBroad,
      procedure: procedure,
      procedureName: procedureName,
      specialty: conditionInfo.specialty || "all",
      costKey: conditionInfo.costKey || null,
      location: location || null,
      locationLabel: locationLabel,
      locationMode: location ? "explicit" : "current",
      budgetMax: budgetMax, // numeric or null if not specified
      budgetLabel: budgetLabel,
      facilities: facilities, // strictly empty array if no facilities mentioned
      requiredFacilities: facilities,
      facilityLabels: facilityLabels,
      emergencyRequired: emergencyRequired,
      priority: priorities,
      radiusMode: "auto",
      timestamp: lastIntentTimestamp
    };

    console.log('[SEARCH INTENT]', {
      condition: intent.condition,
      procedure: intent.procedure,
      facilities: intent.facilities,
      budgetMax: intent.budgetMax,
      location: intent.location,
      locationMode: intent.locationMode
    });

    return intent;
  },

  /**
   * Parse a natural language healthcare query (returns Promise for backward compatibility).
   */
  async parseNaturalLanguageQuery(queryText = "") {
    return this.parseSearchIntent(queryText);
  },

  /**
   * Multilingual sample queries for instant 1-click user testing
   */
  getSampleQueries() {
    return [
      "Find a heart hospital under one lakh",
      "मुझे एक लाख के अंदर दिल का अस्पताल चाहिए",
      "ਮੈਨੂੰ ਇੱਕ ਲੱਖ ਦੇ ਅੰਦਰ ਦਿਲ ਦਾ ਹਸਪਤਾਲ ਚਾਹੀਦਾ ਹੈ",
      "mere ko heart hospital chahiye do lakh ke andar",
      "heart hospital with dialysis under 2 lakh",
      "heart hospital in Chandigarh under 2 lakh",
      "kidney hospital with dialysis",
      "heart hospital near me"
    ];
  }
};
