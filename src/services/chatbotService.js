/**
 * Sehat_Sathi - AI Healthcare Assistant Chatbot Service
 * 
 * CORE RESPONSIBILITIES:
 * 1. Multilingual Support & Automatic Language Detection:
 *    - Supports English ('en'), Hindi ('hi'), Punjabi ('pa'), and Hinglish ('hinglish').
 *    - Detects query language and maintains it across multi-turn context.
 *    - Generates responses strictly in the user's detected language.
 * 2. Intent Detection:
 *    - HOSPITAL_RECOMMENDATION: Finding hospitals by condition, procedure, budget, location, or facility.
 *    - HOSPITAL_INFORMATION: Specific queries about a hospital (facilities, beds, location, contact, comparison).
 *    - HEALTH_ADVICE: Educational, cautious, non-diagnostic health answers.
 *    - OUT_OF_SCOPE: Rejects queries unrelated to health, medicine, or hospitals.
 * 3. Multi-turn Conversational Context:
 *    - Maintains state across consecutive questions (e.g. "Kidney hospital" -> "Chandigarh" -> "Under 1 lakh").
 *    - Preserves language context on short follow-ups; updates on explicit language switch.
 * 4. Hospital Search & Recommendation Integration:
 *    - Reuses searchService and nationalHospitalReferences.
 *    - Preserves deterministic #1 to #5 national reference order for specialized categories.
 * 5. Safety & Non-Diagnostic Compliance:
 *    - Never diagnoses, never prescribes, never claims clinical certainty.
 *    - Includes prototype dataset notices and professional medical disclaimers in the matching language.
 */

import { searchService } from './searchService.js';
import { HOSPITALS } from '../data/hospitals.js';
import { 
  NATIONAL_HOSPITAL_REFERENCES, 
  resolveNationalCategory, 
  getNationalReferenceHospitals, 
  getNationalReferenceHospitalById 
} from '../data/nationalHospitalReferences.js';
import { parseBudget, normalizeCondition } from './aiService.js';
import { matchProcedure } from '../data/conditionCatalogue.js';

// Multilingual Disclaimers
export const MULTILINGUAL_DISCLAIMERS = {
  en: {
    MEDICAL: "Sehat_Sathi provides general health information and hospital discovery support. It does not replace professional medical advice.",
    PROTOTYPE: "For the current prototype, hospital information is based on the Sehat_Sathi dataset and may not represent real-time availability.",
    EMERGENCY: "🚨 If you or someone nearby is experiencing a life-threatening medical emergency (such as severe chest pain, sudden numbness or paralysis, difficulty breathing, or severe trauma), please immediately call 112 / 108 / 102 or proceed to the nearest emergency room."
  },
  hi: {
    MEDICAL: "सेहत_साथी सामान्य स्वास्थ्य जानकारी और अस्पताल खोजने में सहायता प्रदान करता है। यह किसी पेशेवर डॉक्टर की सलाह का विकल्प नहीं है।",
    PROTOTYPE: "प्रोटोटाइप के लिए, अस्पताल की जानकारी सेहत_साथी डेटासेट पर आधारित है और यह वास्तविक समय की उपलब्धता नहीं दर्शा सकती।",
    EMERGENCY: "🚨 आपातकालीन सूचना (Emergency Alert): यदि आपको या आपके आस-पास किसी को गंभीर आपात स्थिति (जैसे सीने में तेज़ दर्द, सांस लेने में तकलीफ़, सुन्नपन या गंभीर चोट) है, तो तुरंत 112 / 108 / 102 पर कॉल करें या नज़दीकी आपातकालीन कक्ष (Emergency Room) में जाएं।"
  },
  pa: {
    MEDICAL: "ਸਿਹਤ_ਸਾਥੀ ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ ਅਤੇ ਹਸਪਤਾਲ ਖੋਜਣ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਸੇ ਪੇਸ਼ੇਵਰ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ।",
    PROTOTYPE: "ਪ੍ਰੋਟੋਟਾਈਪ ਲਈ, ਹਸਪਤਾਲ ਦੀ ਜਾਣਕਾਰੀ ਸਿਹਤ_ਸਾਥੀ ਡਾਟਾਸੈੱਟ 'ਤੇ ਅਧਾਰਤ ਹੈ।",
    EMERGENCY: "🚨 ਐਮਰਜੈਂਸੀ ਅਲਰਟ (Emergency Alert): ਜੇਕਰ ਤੁਹਾਨੂੰ ਜਾਂ ਕਿਸੇ ਹੋਰ ਨੂੰ ਕੋਈ ਗੰਭੀਰ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਹੈ (ਜਿਵੇਂ ਕਿ ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ, ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼, ਅਚਾਨਕ ਬੇਹੋਸ਼ੀ), ਤਾਂ ਤੁਰੰਤ 112 / 108 / 102 'ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਦੀ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਜਾਓ।"
  },
  hinglish: {
    MEDICAL: "Sehat_Sathi general health information aur hospital discovery support provide karta hai. Yeh professional medical advice ka substitute nahi hai.",
    PROTOTYPE: "Current prototype ke liye, hospital information Sehat_Sathi dataset par based hai aur real-time availability represent nahi karti.",
    EMERGENCY: "🚨 EMERGENCY ALERT: Agar aap ya aapke paas koi life-threatening emergency experience kar raha hai (jaise severe chest pain, breathing difficulty, sudden numbness, ya severe trauma), toh turant 112 / 108 / 102 par call karein ya nearest emergency room jayein."
  }
};

// Default English disclaimers for backwards compatibility
export const DISCLAIMERS = MULTILINGUAL_DISCLAIMERS.en;

// Multilingual Out of Scope Responses
export const MULTILINGUAL_OUT_OF_SCOPE = {
  en: "I'm Sehat_Sathi's healthcare assistant. I can help with hospital information, hospital recommendations, or general health advice.",
  hi: "मैं सेहत_साथी (Sehat_Sathi) का स्वास्थ्य सहायक हूँ। मैं अस्पतालों की जानकारी, अस्पताल के सुझाव या सामान्य स्वास्थ्य सलाह में आपकी मदद कर सकता हूँ।",
  pa: "ਮੈਂ ਸਿਹਤ_ਸਾਥੀ (Sehat_Sathi) ਦਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਹਸਪਤਾਲ ਦੀ ਜਾਣਕਾਰੀ, ਹਸਪਤਾਲ ਦੀਆਂ ਸਿਫ਼ਾਰਸ਼ਾਂ ਜਾਂ ਆਮ ਸਿਹਤ ਸਲਾਹ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
  hinglish: "Main Sehat_Sathi ka healthcare assistant hoon. Main hospital information, hospital recommendations, ya general health advice mein aapki madad kar sakta hoon."
};

export const OUT_OF_SCOPE_RESPONSE = MULTILINGUAL_OUT_OF_SCOPE.en;

// Known cities in our Punjab / Tri-city local region
const LOCAL_CITIES = ['chandigarh', 'mohali', 'panchkula', 'ludhiana', 'jalandhar', 'hoshiarpur'];

// Major Indian cities recognized in national queries
const NATIONAL_CITIES = ['delhi', 'new delhi', 'mumbai', 'bengaluru', 'bangalore', 'chennai', 'hyderabad', 'lucknow', 'vellore', 'gurugram', 'gurgaon', 'kolkata', 'madurai', 'manipal'];

/**
 * Educational Health Knowledge Base with Multilingual Translations
 */
const HEALTH_TOPICS = [
  {
    id: 'kidney_disease',
    keywords: ['kidney disease', 'kidney failure', 'chronic kidney disease', 'ckd', 'renal disease', 'gurda rog', 'गुर्दा', 'ਗੁਰਦਾ', 'ਗੁਰਦੇ'],
    title: 'Understanding Kidney Disease',
    summary: 'Kidney disease occurs when the kidneys become damaged and cannot filter waste and excess fluid from the blood effectively.',
    details: [
      'The kidneys play a crucial role in filtering toxins, balancing body fluids, regulating blood pressure, and activating Vitamin D.',
      'Common early signs may include fatigue, swelling (edema) in the feet or ankles, changes in urine frequency, and high blood pressure. In early stages, it often develops silently.',
      'Key risk factors include diabetes, hypertension, and long-term unmonitored use of pain medications.',
      'Regular kidney function tests (Serum Creatinine, eGFR, and Urine Albumin) help doctors assess kidney health.'
    ],
    whenToSeeDoctor: 'Consult a nephrologist or physician if you notice persistent swelling in your ankles or face, blood in urine, unexplained fatigue, or if you have poorly controlled diabetes or blood pressure.',
    translations: {
      hi: {
        title: 'किडनी रोग को समझें (Understanding Kidney Disease)',
        summary: 'किडनी रोग तब होता है जब गुर्दे क्षतिग्रस्त हो जाते हैं और रक्त से अपशिष्ट और अतिरिक्त तरल पदार्थ को प्रभावी ढंग से फ़िल्टर नहीं कर पाते हैं।',
        details: [
          'गुर्दे शरीर से विषाक्त पदार्थों को निकालने, तरल पदार्थ संतुलित करने और रक्तचाप नियंत्रित करने में महत्वपूर्ण भूमिका निभाते हैं।',
          'शुरुआती लक्षणों में थकान, पैरों या टखनों में सूजन (edema), पेशाब की आवृत्ति में बदलाव और उच्च रक्तचाप शामिल हो सकते हैं।',
          'मधुमेह (डायबिटीज) और हाई ब्लड प्रेशर किडनी की बीमारी के प्रमुख जोखिम कारक हैं।',
          'नियमित किडनी फंक्शन टेस्ट (सीरम क्रिएटिनिन, eGFR और यूरिन एल्बुमिन) से स्थिति का समय पर पता चलता है।'
        ],
        whenToSeeDoctor: 'यदि चेहरे या पैरों में लगातार सूजन, पेशाब में खून, या अत्यधिक थकान महसूस हो, तो तुरंत नेफ्रोलॉजिस्ट या फिजिशियन से सलाह लें।'
      },
      pa: {
        title: 'ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ ਬਾਰੇ ਜਾਣਕਾਰੀ (Understanding Kidney Disease)',
        summary: 'ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਗੁਰਦੇ ਨੁਕਸਾਨੇ ਜਾਂਦੇ ਹਨ ਅਤੇ ਖੂਨ ਵਿੱਚੋਂ ਗੰਦਗੀ ਅਤੇ ਵਾਧੂ ਪਾਣੀ ਨੂੰ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਫਿਲਟਰ ਨਹੀਂ ਕਰ ਪਾਉਂਦੇ।',
        details: [
          'ਗੁਰਦੇ ਸਰੀਰ ਵਿੱਚੋਂ ਜ਼ਹਿਰੀਲੇ ਤੱਤਾਂ ਨੂੰ ਸਾਫ਼ ਕਰਨ, ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਕੰਟਰੋਲ ਕਰਨ ਅਤੇ ਤਰਲ ਪਦਾਰਥਾਂ ਦਾ ਸੰਤੁਲਨ ਬਣਾਈ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।',
          'ਮੁੱਢਲੇ ਲੱਛਣਾਂ ਵਿੱਚ ਪੈਰਾਂ ਜਾਂ ਗਿੱਟਿਆਂ ਵਿੱਚ ਸੋਜ, ਥਕਾਵਟ, ਪਿਸ਼ਾਬ ਦੇ ਬਾਰ-ਬਾਰ ਆਉਣ ਵਿੱਚ ਬਦਲਾਅ ਸ਼ਾਮਲ ਹੋ ਸਕਦੇ ਹਨ।',
          'ਸ਼ੂਗਰ (ਡਾਇਬੀਟੀਜ਼) ਅਤੇ ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਗੁਰਦਿਆਂ ਦੇ ਨੁਕਸਾਨ ਦੇ ਮੁੱਖ ਕਾਰਨ ਹਨ।'
        ],
        whenToSeeDoctor: 'ਜੇਕਰ ਪੈਰਾਂ ਵਿੱਚ ਲਗਾਤਾਰ ਸੋਜ ਹੋਵੇ ਜਾਂ ਪਿਸ਼ਾਬ ਵਿੱਚ ਕੋਈ ਸਮੱਸਿਆ ਆਵੇ, ਤਾਂ ਤੁਰੰਤ ਗੁਰਦੇ ਦੇ ਮਾਹਿਰ (Nephrologist) ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
      },
      hinglish: {
        title: 'Kidney Disease ke baare mein samjhein',
        summary: 'Kidney disease tab hoti hai jab kidneys damage ho jati hain aur blood se waste aur extra fluid ko effectively filter nahi kar pati.',
        details: [
          'Kidneys body se toxins filter karne, fluid balance maintain karne, aur blood pressure regulate karne mein vital role play karti hain.',
          'Early signs mein fatigue, feet/ankles mein swelling (edema), urine frequency change, aur high blood pressure include ho sakte hain.',
          'Diabetes aur hypertension kidney damage ke leading causes hain.',
          'Regular Kidney Function Tests (Serum Creatinine, eGFR) doctor ko kidney health assess karne mein madad karte hain.'
        ],
        whenToSeeDoctor: 'Agar ankles ya face par persistent swelling, urine mein blood, ya severe fatigue ho, toh turant nephrologist ya physician ko consult karein.'
      }
    }
  },
  {
    id: 'dialysis',
    keywords: ['dialysis', 'hemodialysis', 'peritoneal dialysis', 'डायलिसिस', 'ਡਾਇਲਸਿਸ', 'ਡਾਇਲਿਸਿਸ'],
    title: 'Understanding Dialysis',
    summary: 'Dialysis is a medical treatment that performs the filtering work of the kidneys when they are unable to function adequately on their own.',
    details: [
      'Hemodialysis: Blood is gently drawn from the body through an access point (fistula/catheter), filtered through an artificial kidney machine (dialyzer) to remove toxins and excess fluid, and returned cleanly to the body. This is usually done 2-3 times per week at a hospital or dialysis centre.',
      'Peritoneal Dialysis (PD): Uses the lining of your abdomen (peritoneum) and a cleansing fluid to filter waste inside the body, often performed at home.',
      'Dialysis helps manage symptoms and balance minerals like potassium and sodium, supporting patients with end-stage renal disease (ESRD).'
    ],
    whenToSeeDoctor: 'A nephrologist will determine whether dialysis is appropriate based on blood filtration tests (eGFR typically under 15 mL/min) and clinical symptoms.',
    translations: {
      hi: {
        title: 'डायलिसिस को समझें (Understanding Dialysis)',
        summary: 'डायलिसिस एक चिकित्सा उपचार (medical treatment) है जो रक्त से अपशिष्ट और अतिरिक्त तरल पदार्थ को साफ करता है जब गुर्दे ठीक से काम नहीं कर पाते हैं।',
        details: [
          'हेमोडायलिसिस (Hemodialysis): रक्त को शरीर से निकाल कर डायलाइज़र मशीन द्वारा साफ़ करके वापस भेजा जाता है। यह आमतौर पर अस्पताल या डायलिसिस सेंटर में सप्ताह में 2-3 बार किया जाता है।',
          'पेरिटोनियल डायलिसिस (PD): पेट की अंदरूनी परत (peritoneum) का उपयोग करके शरीर के अंदर ही रक्त को साफ़ किया जाता है।',
          'डायलिसिस शरीर में पोटेशियम और सोडियम जैसे खनिजों का संतुलन बनाए रखने में मदद करता है।'
        ],
        whenToSeeDoctor: 'नेफ्रोलॉजिस्ट (किडनी विशेषज्ञ) आपके ब्लड टेस्ट (eGFR) और लक्षणों के आधार पर डायलिसिस की आवश्यकता तय करते हैं।'
      },
      pa: {
        title: 'ਡਾਇਲਿਸਿਸ ਬਾਰੇ ਜਾਣਕਾਰੀ (Understanding Dialysis)',
        summary: 'ਡਾਇਲਿਸਿਸ ਇੱਕ ਇਲਾਜ ਹੈ ਜੋ ਖੂਨ ਵਿੱਚੋਂ waste ਅਤੇ ਵਾਧੂ fluid ਨੂੰ ਕੱਢਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ ਜਦੋਂ ਗੁਰਦੇ ਸਹੀ ਢੰਗ ਨਾਲ ਕੰਮ ਨਹੀਂ ਕਰਦੇ।',
        details: [
          'ਹੀਮੋਡਾਇਲਿਸਿਸ (Hemodialysis): ਖੂਨ ਨੂੰ ਇੱਕ ਆਰਟੀਫਿਸ਼ੀਅਲ ਮਸ਼ੀਨ (dialyzer) ਰਾਹੀਂ ਸਾਫ਼ ਕਰਕੇ ਵਾਪਸ ਸਰੀਰ ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਆਮ ਤੌਰ ਤੇ ਹਫ਼ਤੇ ਵਿੱਚ 2-3 ਵਾਰ ਹਸਪਤਾਲ ਜਾਂ ਸੈਂਟਰ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।',
          'ਪੈਰੀਟੋਨੀਅਲ ਡਾਇਲਿਸਿਸ (PD): ਪੇਟ ਦੀ ਅੰਦਰੂਨੀ ਪਰਤ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਰੀਰ ਦੇ ਅੰਦਰ ਹੀ ਖੂਨ ਦੀ ਸਫ਼ਾਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।'
        ],
        whenToSeeDoctor: 'ਗੁਰਦੇ ਦੇ ਮਾਹਿਰ ਡਾਕਟਰ (Nephrologist) ਟੈਸਟਾਂ ਅਤੇ ਸਿਹਤ ਦੇ ਅਧਾਰ ਤੇ ਡਾਇਲਿਸਿਸ ਦੀ ਲੋੜ ਤੈਅ ਕਰਦੇ ਹਨ।'
      },
      hinglish: {
        title: 'Understanding Dialysis',
        summary: 'Dialysis ek treatment hai jo blood se waste aur extra fluid remove karne mein help karti hai jab kidneys theek se kaam nahi kar pati.',
        details: [
          'Hemodialysis: Blood ko artificial kidney machine (dialyzer) ke zariye filter karke body mein wapas clean form mein bheja jata hai. Yeh usually week mein 2-3 times hospital mein hota hai.',
          'Peritoneal Dialysis (PD): Abdomen ki lining ko use karke body ke andar hi blood filter kiya jata hai.',
          'Dialysis potassium aur sodium jaise minerals ko balance rakhne mein help karti hai.'
        ],
        whenToSeeDoctor: 'Nephrologist blood filtration tests (eGFR under 15) aur symptoms ke basis par decide karte hain ki dialysis kab shuru karni hai.'
      }
    }
  },
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'blood sugar', 'type 2 diabetes', 'मधुमेह', 'ਸ਼ੂਗਰ'],
    title: 'Understanding Diabetes & Common Symptoms',
    summary: 'Diabetes is a metabolic condition where the body cannot properly produce or use insulin, leading to elevated blood glucose levels.',
    details: [
      'Type 1 Diabetes: The body produces little to no insulin; requires daily insulin therapy.',
      'Type 2 Diabetes: The most common type, where the body becomes resistant to insulin; managed through lifestyle, balanced diet, exercise, and oral medications.',
      'Common symptoms include frequent urination (especially at night), increased thirst, unexplained weight loss, extreme fatigue, blurry vision, and slow-healing sores or cuts.',
      'Routine diagnostic tests include Fasting Blood Sugar (FBS), Postprandial (PP), and HbA1c (which measures 3-month average sugar).'
    ],
    whenToSeeDoctor: 'Consult a physician or endocrinologist if you experience constant thirst, sudden weight changes, frequent infections, or non-healing wounds.',
    translations: {
      hi: {
        title: 'मधुमेह और सामान्य लक्षण (Understanding Diabetes)',
        summary: 'मधुमेह (डायबिटीज) एक ऐसी स्थिति है जिसमें शरीर इंसुलिन का सही उपयोग नहीं कर पाता, जिससे रक्त में ग्लूकोज (शुगर) का स्तर बढ़ जाता है।',
        details: [
          'टाइप 1 और टाइप 2 डायबिटीज दो प्रमुख प्रकार हैं। टाइप 2 सबसे आम है जिसे खान-पान और दवाओं से नियंत्रित किया जाता है।',
          'प्रमुख लक्षण: बार-बार पेशाब आना (विशेषकर रात में), ज्यादा प्यास लगना, बिना कारण वजन कम होना और घाव का देर से भरना।',
          'फास्टिंग ब्लड शुगर और HbA1c टेस्ट से 3 महीने के औसत शुगर का स्तर पता चलता है।'
        ],
        whenToSeeDoctor: 'लगातार अत्यधिक प्यास, कमजोरी या न भरने वाले घावों की स्थिति में तुरंत डॉक्टर से संपर्क करें।'
      },
      pa: {
        title: 'ਸ਼ੂਗਰ (ਡਾਇਬੀਟੀਜ਼) ਦੇ ਮੁੱਖ ਲੱਛਣ (Understanding Diabetes)',
        summary: 'ਸ਼ੂਗਰ ਇੱਕ ਅਜਿਹੀ ਬਿਮਾਰੀ ਹੈ ਜਿਸ ਵਿੱਚ ਸਰੀਰ ਇਨਸੁਲਿਨ ਦੀ ਸਹੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰ ਪਾਉਂਦਾ, ਜਿਸ ਕਾਰਨ ਖੂਨ ਵਿੱਚ ਗਲੂਕੋਜ਼ ਵੱਧ ਜਾਂਦਾ ਹੈ।',
        details: [
          'ਮੁੱਖ ਲੱਛਣ: ਵਾਰ-ਵਾਰ ਪਿਸ਼ਾਬ ਆਉਣਾ, ਬਹੁਤ ਜ਼ਿਆਦਾ ਪਿਆਸ ਲੱਗਣਾ, ਬਿਨਾਂ ਵਜ੍ਹਾ ਭਾਰ ਘਟਣਾ ਅਤੇ ਥਕਾਵਟ।',
          'HbA1c ਟੈਸਟ ਰਾਹੀਂ ਪਿਛਲੇ 3 ਮਹੀਨਿਆਂ ਦੀ ਔਸਤ ਸ਼ੂਗਰ ਦਾ ਪਤਾ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ।'
        ],
        whenToSeeDoctor: 'ਜੇਕਰ ਸ਼ੂਗਰ ਕੰਟਰੋਲ ਤੋਂ ਬਾਹਰ ਰਹੇ ਜਾਂ ਜ਼ਖਮ ਠੀਕ ਨਾ ਹੋਣ, ਤਾਂ ਤੁਰੰਤ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।'
      },
      hinglish: {
        title: 'Diabetes & Common Symptoms',
        summary: 'Diabetes ek metabolic condition hai jismein body properly insulin produce ya use nahi kar pati, jisse blood sugar level high ho jata hai.',
        details: [
          'Type 2 Diabetes sabse common hai, jise healthy lifestyle, diet, walk, aur prescribed medicines se manage kiya jata hai.',
          'Common symptoms: Frequent urination (especially at night), jyada pyas lagna, unexplained weight loss, aur slow healing cuts.',
          'HbA1c test se past 3 months ka average sugar control monitor hota hai.'
        ],
        whenToSeeDoctor: 'Frequent thirst, severe fatigue, ya non-healing wounds hone par physician ya endocrinologist ko dikhayein.'
      }
    }
  },
  {
    id: 'hypertension',
    keywords: ['hypertension', 'high blood pressure', 'bp problem', 'हाई ब्लड प्रेशर', 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ'],
    title: 'Understanding Hypertension (High Blood Pressure)',
    summary: 'Hypertension happens when the force of blood against the walls of your arteries is consistently too high (typically 130/80 mmHg or higher).',
    details: [
      'It is commonly known as the "silent condition" because it often causes no noticeable symptoms until complications arise.',
      'Long-term uncontrolled blood pressure can strain the heart, damage blood vessels in the kidneys, and increase the risk of stroke or heart attack.',
      'Key management strategies include reducing sodium (salt) intake, maintaining a healthy weight, regular aerobic exercise, stress management, and prescribed blood pressure medications.'
    ],
    whenToSeeDoctor: 'Have your blood pressure checked regularly. Seek immediate medical attention if high blood pressure is accompanied by severe headache, chest discomfort, shortness of breath, or visual disturbances.',
    translations: {
      hi: {
        title: 'हाई ब्लड प्रेशर (Hypertension) को समझें',
        summary: 'हाइपरटेंशन तब होता है जब धमनियों में रक्त का दबाव लगातार अधिक (130/80 mmHg या अधिक) बना रहता है।',
        details: [
          'इसे "साइलेंट किलर" भी कहा जाता है क्योंकि अक्सर इसके कोई स्पष्ट लक्षण नहीं दिखते।',
          'अनियंत्रित बीपी दिल, दिमाग और गुर्दों को नुकसान पहुंचा सकता है।',
          'नमक कम खाना, नियमित व्यायाम और निर्धारित दवाइयां लेना इसके नियंत्रण के मुख्य तरीके हैं।'
        ],
        whenToSeeDoctor: 'यदि बीपी के साथ तेज सिरदर्द, छाती में जकड़न या सांस फूलने की समस्या हो तो तुरंत डॉक्टर को दिखाएं।'
      },
      pa: {
        title: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ (Hypertension) ਬਾਰੇ ਜਾਣਕਾਰੀ',
        summary: 'ਹਾਈ ਬੀਪੀ ਉਦੋਂ ਹੁੰਦਾ ਹੈ ਜਦੋਂ ਨਾੜੀਆਂ ਵਿੱਚ ਖੂਨ ਦਾ ਦਬਾਅ ਲਗਾਤਾਰ ਵੱਧ ਰਹਿੰਦਾ ਹੈ।',
        details: [
          'ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਹਾਈ ਬੀਪੀ ਰਹਿਣ ਨਾਲ ਦਿਲ ਅਤੇ ਗੁਰਦਿਆਂ ਤੇ ਬੁਰਾ ਅਸਰ ਪੈਂਦਾ ਹੈ।',
          'ਲੂਣ ਘੱਟ ਕਰਨਾ, ਸੈਰ ਕਰਨਾ ਅਤੇ ਸਮੇਂ ਸਿਰ ਦਵਾਈ ਲੈਣਾ ਇਸ ਨੂੰ ਕੰਟਰੋਲ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।'
        ],
        whenToSeeDoctor: 'ਜੇਕਰ ਬੀਪੀ ਦੇ ਨਾਲ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਜਾਂ ਚੱਕਰ ਆਉਣ, ਤਾਂ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।'
      },
      hinglish: {
        title: 'Hypertension (High BP) ke baare mein samjhein',
        summary: 'Hypertension tab hota hai jab blood pressure consistently 130/80 mmHg ya usse high bana rehta hai.',
        details: [
          'Ise silent condition kaha jata hai kyunki starting mein koi visible symptoms nahi hote.',
          'Long term high BP heart aur kidneys ko damage kar sakta hai.',
          'Salt intake kam karna, daily exercise, aur prescribed medicines BP control mein help karti hain.'
        ],
        whenToSeeDoctor: 'Agar high BP ke sath severe headache, chest discomfort, ya shortness of breath ho, toh immediately doctor ko consult karein.'
      }
    }
  },
  {
    id: 'chemotherapy',
    keywords: ['chemotherapy', 'chemo', 'cancer treatment', 'कीमोथेरेपी', 'ਕੀਮੋਥੈਰੇਪੀ'],
    title: 'Understanding Chemotherapy',
    summary: 'Chemotherapy is a drug-based medical treatment used to destroy or slow the growth of rapidly dividing cancer cells.',
    details: [
      'Chemotherapy can be given intravenously (through a vein/IV) or orally (as pills/capsules), usually in structured cycles with rest periods in between.',
      'Depending on the cancer type and stage, it may be used to shrink a tumor before surgery, destroy lingering cells after surgery, or manage symptoms in advanced stages.',
      'Because it affects fast-growing cells, common temporary side effects can include fatigue, nausea, hair loss, and lowered white blood cell count (higher infection risk).',
      'Modern oncology offers effective supportive medications (anti-nausea drugs, growth factors) to significantly improve comfort during cycles.'
    ],
    whenToSeeDoctor: 'Always follow up closely with your medical oncologist. During chemotherapy, seek urgent medical help if you develop a fever (>100.4°F / 38°C), severe vomiting, or signs of an infection.',
    translations: {
      hi: {
        title: 'कीमोथेरेपी को समझें (Understanding Chemotherapy)',
        summary: 'कीमोथेरेपी एक दवा-आधारित कैंसर उपचार है जो तेजी से बढ़ने वाली कैंसर कोशिकाओं को नष्ट या धीमा करने के लिए उपयोग किया जाता है।',
        details: [
          'यह ड्रिप (IV) या गोलियों के रूप में चक्रों (cycles) में दी जाती है।',
          'सामान्य अस्थायी दुष्प्रभावों में थकान, बाल झड़ना और मतली शामिल हैं, जिन्हें सहायक दवाओं से नियंत्रित किया जाता है।',
          'यह ट्यूमर को छोटा करने या सर्जरी के बाद बची कोशिकाओं को समाप्त करने में मदद करती है।'
        ],
        whenToSeeDoctor: 'कीमोथेरेपी के दौरान तेज बुखार (>100.4°F) या संक्रमण के लक्षण दिखने पर तुरंत ऑन्कोलॉजिस्ट से संपर्क करें।'
      },
      pa: {
        title: 'ਕੀਮੋਥੈਰੇਪੀ ਬਾਰੇ ਜਾਣਕਾਰੀ (Understanding Chemotherapy)',
        summary: 'ਕੀਮੋਥੈਰੇਪੀ ਕੈਂਸਰ ਦੇ ਸੈੱਲਾਂ ਨੂੰ ਨਸ਼ਟ ਕਰਨ ਲਈ ਦਿੱਤੀ ਜਾਣ ਵਾਲੀ ਦਵਾਈਆਂ ਦਾ ਇਲਾਜ ਹੈ।',
        details: [
          'ਇਹ ਨਸ ਰਾਹੀਂ (IV) ਜਾਂ ਗੋਲੀਆਂ ਦੇ ਰੂਪ ਵਿੱਚ ਨਿਯਮਿਤ ਚੱਕਰਾਂ ਵਿੱਚ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।',
          'ਇਲਾਜ ਦੌਰਾਨ ਮਰੀਜ਼ ਨੂੰ ਥਕਾਵਟ ਜਾਂ ਉਲਟੀ ਦੀ ਸ਼ਿਕਾਇਤ ਹੋ ਸਕਦੀ ਹੈ, ਜਿਸ ਲਈ ਸਹਾਇਕ ਦਵਾਈਆਂ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।'
        ],
        whenToSeeDoctor: 'ਜੇਕਰ ਇਲਾਜ ਦੌਰਾਨ ਬੁਖਾਰ ਹੋਵੇ ਜਾਂ ਇਨਫੈਕਸ਼ਨ ਲੱਗੇ, ਤਾਂ ਬਿਨਾਂ ਦੇਰੀ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।'
      },
      hinglish: {
        title: 'Understanding Chemotherapy',
        summary: 'Chemotherapy ek drug-based cancer treatment hai jo fast-growing cancer cells ko destroy ya unki growth slow karne ke liye use hoti hai.',
        details: [
          'Chemotherapy IV drip ya oral tablets ke form mein scheduled cycles mein di jati hai.',
          'Common temporary side effects mein fatigue, nausea, aur hair loss include hote hain jise modern supportive medicines se control kiya jata hai.'
        ],
        whenToSeeDoctor: 'Chemo cycle ke dauran fever (>100.4°F) ya infection ke signs dikhein toh immediately oncologist ko inform karein.'
      }
    }
  },
  {
    id: 'heart_attack',
    keywords: ['heart attack', 'myocardial infarction', 'cardiac arrest', 'chest pain', 'हार्ट अटैक', 'दिल का दौरा', 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ'],
    title: 'Understanding Heart Attack & Emergency Symptoms',
    summary: 'A heart attack occurs when blood flow to a part of the heart muscle is suddenly blocked, usually by a blood clot in a coronary artery.',
    details: [
      '🚨 EMERGENCY ALERT: A heart attack is a critical medical emergency requiring immediate treatment to minimize heart muscle damage.',
      'Key warning signs include crushing pressure, tightness, or pain in the center of the chest; pain radiating to the left shoulder, arm, neck, jaw, or back; cold sweats; unexplained shortness of breath; and severe dizziness or nausea.',
      'Symptoms can be subtle, especially in women, elderly individuals, and people with diabetes (who may experience shortness of breath or nausea rather than severe chest pain).'
    ],
    whenToSeeDoctor: 'DO NOT WAIT. Call emergency services (112 / 108) immediately or have someone rush you to the nearest hospital equipped with 24x7 emergency and a cardiac cath lab.',
    translations: {
      hi: {
        title: 'हार्ट अटैक और आपातकालीन लक्षण (Heart Attack Signs)',
        summary: 'हार्ट अटैक तब होता है जब हृदय की मांसपेशियों में रक्त का प्रवाह अचानक अवरुद्ध हो जाता है।',
        details: [
          '🚨 आपातकालीन चेतावनी: यह एक गंभीर मेडिकल इमरजेंसी है जिसमें तुरंत इलाज की आवश्यकता होती है।',
          'प्रमुख लक्षण: सीने के बीच में तेज दबाव, दर्द जो बाएं हाथ, जबड़े या पीठ तक फैले, ठंडा पसीना, और सांस लेने में भारी तकलीफ।'
        ],
        whenToSeeDoctor: 'बिल्कुल प्रतीक्षा न करें। तुरंत 112 / 108 पर कॉल करें और नजदीकी 24x7 कार्डियक इमरजेंसी वाले अस्पताल पहुंचें।'
      },
      pa: {
        title: 'ਦਿਲ ਦਾ ਦੌਰਾ ਅਤੇ ਐਮਰਜੈਂਸੀ ਲੱਛਣ (Heart Attack Signs)',
        summary: 'ਦਿਲ ਦਾ ਦੌਰਾ ਉਦੋਂ ਪੈਂਦਾ ਹੈ ਜਦੋਂ ਦਿਲ ਦੀਆਂ ਨਾੜੀਆਂ ਵਿੱਚ ਖੂਨ ਦਾ ਵਹਾਅ ਅਚਾਨਕ ਰੁਕ ਜਾਂਦਾ ਹੈ।',
        details: [
          '🚨 ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ: ਇਹ ਇੱਕ ਗੰਭੀਰ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਹੈ ਜਿਸ ਲਈ ਤੁਰੰਤ ਹਸਪਤਾਲ ਪਹੁੰਚਣਾ ਜ਼ਰੂਰੀ ਹੈ।',
          'ਮੁੱਖ ਲੱਛਣ: ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਜਾਂ ਭਾਰਾਪਣ, ਦਰਦ ਦਾ ਖੱਬੇ ਹੱਥ ਜਾਂ ਗਰਦਨ ਵੱਲ ਫੈਲਣਾ, ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਦਿੱਕਤ।'
        ],
        whenToSeeDoctor: 'ਬਿਲਕੁਲ ਦੇਰੀ ਨਾ ਕਰੋ। ਤੁਰੰਤ ਐਂਬੂਲੈਂਸ (112 / 108) ਬੁਲਾਓ ਅਤੇ ਨੇੜਲੇ ਕਾਰਡੀਅਕ ਹਸਪਤਾਲ ਜਾਓ।'
      },
      hinglish: {
        title: 'Heart Attack & Emergency Symptoms',
        summary: 'Heart attack tab hota hai jab heart muscle tak blood flow suddenly block ho jata hai.',
        details: [
          '🚨 EMERGENCY ALERT: Heart attack ek critical medical emergency hai jisme immediate attention chahiye.',
          'Key warning signs: Chest ke center mein heavy pain ya pressure, left arm ya jaw mein radiating pain, cold sweats, aur breathing difficulty.'
        ],
        whenToSeeDoctor: 'Koshish karein ki bilkul wait na karein. Turant emergency services (112 / 108) call karein aur nearest cardiac cath-lab hospital jayein.'
      }
    }
  },
  {
    id: 'brain_surgery',
    keywords: ['brain surgery', 'neurosurgery', 'craniotomy', 'brain tumor', 'दिमाग का ऑपरेशन', 'ਦਿਮਾਗ ਦਾ ਆਪਰੇਸ਼ਨ'],
    title: 'Understanding Brain Surgery & Neurosurgery',
    summary: 'Neurosurgery is a specialized surgical discipline focused on treating conditions of the brain, spinal cord, and nervous system.',
    details: [
      'Common indications include brain tumors, aneurysms, blood clots (hematomas), hydrocephalus, severe head trauma, and certain types of epilepsy.',
      'Procedures range from open surgeries (such as craniotomy) to minimally invasive stereotactic radiosurgery (Gamma Knife / CyberKnife) and endovascular coiling.',
      'Brain surgery requires advanced tertiary hospital infrastructure, including dedicated neuro-ICU facilities, continuous neuromonitoring, and high-precision neuro-navigation systems.'
    ],
    whenToSeeDoctor: 'Consult a neurosurgeon or neurologist if you experience persistent severe headaches with vomiting, unexplained seizures, sudden vision or speech changes, or weakness on one side of the body.',
    translations: {
      hi: {
        title: 'ब्रेन सर्जरी और न्यूरोसर्जरी को समझें',
        summary: 'न्यूरोसर्जरी मस्तिष्क, रीढ़ की हड्डी और तंत्रिका तंत्र के जटिल रोगों के उपचार के लिए एक विशेष शल्य चिकित्सा है।',
        details: [
          'यह ब्रेन ट्यूमर, एन्यूरिज्म, सिर की गंभीर चोट और नसों से जुड़े रोगों के लिए की जाती है।',
          'इसके लिए उन्नत न्यूरो-आईसीयू (Neuro-ICU) और आधुनिक नेविगेशन उपकरणों वाले बड़े विशेषज्ञ अस्पतालों की आवश्यकता होती है।'
        ],
        whenToSeeDoctor: 'लगातार गंभीर सिरदर्द के साथ उल्टी, अचानक दौरे या शरीर के एक तरफ कमजोरी महसूस होने पर न्यूरोसर्जन से मिलें।'
      },
      pa: {
        title: 'ਦਿਮਾਗ ਦੀ ਸਰਜਰੀ (Brain Surgery) ਬਾਰੇ ਜਾਣਕਾਰੀ',
        summary: 'ਨਿਊਰੋਸਰਜਰੀ ਦਿਮਾਗ, ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਅਤੇ ਨਸਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਬਿਮਾਰੀਆਂ ਦੇ ਇਲਾਜ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਰਜਰੀ ਹੈ।',
        details: [
          'ਇਹ ਬ੍ਰੇਨ ਟਿਊਮਰ, ਨਸਾਂ ਵਿੱਚ ਖੂਨ ਜੰਮਣ ਜਾਂ ਸਿਰ ਦੀ ਗੰਭੀਰ ਸੱਟ ਦੇ ਇਲਾਜ ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।'
        ],
        whenToSeeDoctor: 'ਅਚਾਨਕ ਦੌਰੇ ਪੈਣ ਜਾਂ ਲਗਾਤਾਰ ਸਿਰ ਦਰਦ ਰਹਿਣ ਤੇ ਨਿਊਰੋਸਰਜਨ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
      },
      hinglish: {
        title: 'Understanding Brain Surgery & Neurosurgery',
        summary: 'Neurosurgery brain, spinal cord, aur nervous system ki conditions ko treat karne ke liye specialized surgical branch hai.',
        details: [
          'Common reasons include brain tumors, aneurysms, blood clots, aur head trauma.',
          'Brain surgery ke liye dedicated Neuro-ICU aur specialized tertiary hospital infrastructure zaroori hota hai.'
        ],
        whenToSeeDoctor: 'Severe persistent headache with vomiting, sudden seizures, ya one-sided body weakness hone par neurosurgeon ko consult karein.'
      }
    }
  },
  {
    id: 'alzheimers',
    keywords: ['alzheimer', 'dementia', 'memory loss', 'forgetfulness', 'अल्जाइमर', 'ਯਾਦਦਾਸ਼ਤ'],
    title: 'Understanding Alzheimer’s Disease & Dementia',
    summary: 'Alzheimer’s disease is a progressive neurological condition that affects memory, thinking, and daily cognitive abilities.',
    details: [
      'It is the most common form of dementia, caused by gradual buildup of abnormal protein deposits in the brain.',
      'Early symptoms include forgetting newly learned information, repeating questions, misplacing items, and difficulty completing familiar daily tasks.',
      'While there is currently no cure, comprehensive care involving cognitive therapies, supportive environments, and lifestyle interventions helps preserve independence and quality of life.'
    ],
    whenToSeeDoctor: 'Consult a neurologist or geriatrician if memory lapses begin interfering with everyday life, work, navigation, or decision-making.',
    translations: {
      hi: {
        title: 'अल्जाइमर और डिमेंशिया को समझें',
        summary: 'अल्जाइमर एक न्यूरोलॉजिकल स्थिति है जो धीरे-धीरे याददाश्त, सोच और दैनिक निर्णय लेने की क्षमता को प्रभावित करती है।',
        details: [
          'शुरुआती लक्षणों में हाल ही में सीखी गई बातें भूलना, बार-बार एक ही सवाल दोहराना और परिचित रास्तों में खो जाना शामिल हैं।',
          'सहायक देखभाल और संज्ञानात्मक उपचारों से रोगी के जीवन की गुणवत्ता बेहतर बनाई जा सकती है।'
        ],
        whenToSeeDoctor: 'यदि भूलने की आदत रोजमर्रा के जीवन में बाधा बनने लगे, तो न्यूरोलॉजिस्ट से परामर्श लें।'
      },
      pa: {
        title: 'ਅਲਜ਼ਾਈਮਰ ਅਤੇ ਯਾਦਦਾਸ਼ਤ ਦੀ ਕਮਜ਼ੋਰੀ ਬਾਰੇ ਜਾਣਕਾਰੀ',
        summary: 'ਅਲਜ਼ਾਈਮਰ ਦਿਮਾਗ ਦੀ ਬਿਮਾਰੀ ਹੈ ਜੋ ਯਾਦਦਾਸ਼ਤ ਅਤੇ ਸੋਚਣ-ਸਮਝਣ ਦੀ ਸ਼ਕਤੀ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ।',
        details: [
          'ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਮਰੀਜ਼ ਰੋਜ਼ਾਨਾ ਦੀਆਂ ਗੱਲਾਂ ਭੁੱਲਣ ਲੱਗਦਾ ਹੈ ਅਤੇ ਚੀਜ਼ਾਂ ਰੱਖ ਕੇ ਭੁੱਲ ਜਾਂਦਾ ਹੈ।'
        ],
        whenToSeeDoctor: 'ਜੇਕਰ ਯਾਦਦਾਸ਼ਤ ਸੰਬੰਧੀ ਦਿੱਕਤਾਂ ਵਧ ਰਹੀਆਂ ਹੋਣ, ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ।'
      },
      hinglish: {
        title: 'Alzheimer’s & Memory Loss ke baare mein samjhein',
        summary: 'Alzheimer’s disease ek progressive neurological condition hai jo memory, thinking ability, aur daily activities ko affect karti hai.',
        details: [
          'Early symptoms: Recent events bhool jana, bar-bar same question poochna, aur familiar tasks mein difficulty hona.',
          'Supportive environment aur cognitive therapies se patient ki quality of life improve hoti hai.'
        ],
        whenToSeeDoctor: 'Agar memory loss everyday life ya decision making mein interfere karne lage, toh neurologist ko consult karein.'
      }
    }
  },
  {
    id: 'doctor_consult',
    keywords: ['when to see a doctor', 'see a doctor', 'consult doctor', 'doctor kab dikhaye', 'ਡਾਕਟਰ ਨੂੰ ਕਦੋਂ ਦਿਖਾਉਣਾ'],
    title: 'When to Consult a Doctor',
    summary: 'Knowing when to seek prompt medical attention helps prevent complications and ensures early diagnosis.',
    details: [
      'Seek Immediate Emergency Care for: Chest pain or pressure, sudden numbness or speech difficulty, severe breathing distress, uncontrolled bleeding, high fever with stiff neck, or head trauma with loss of consciousness.',
      'Schedule a Timely Doctor Visit for: Unexplained weight loss, persistent fever lasting over 3 days, new or changing moles, chronic pain, unusual fatigue, or blood in stool or urine.',
      'Routine Health Screenings: Annual blood pressure, sugar, cholesterol, and age-appropriate cancer screenings are recommended even when feeling healthy.'
    ],
    whenToSeeDoctor: 'When in doubt about a symptom, always consult a qualified medical professional rather than waiting.',
    translations: {
      hi: {
        title: 'डॉक्टर से परामर्श कब लें (When to Consult a Doctor)',
        summary: 'लक्षणों को समय पर पहचान कर डॉक्टर से मिलना स्वास्थ्य जटिलताओं से बचाता है।',
        details: [
          'तुरंत आपातकालीन सहायता लें: सीने में तेज दर्द, सांस लेने में तकलीफ, सुन्नपन, अत्यधिक रक्तस्राव या बेहोशी की स्थिति में।',
          'समय पर डॉक्टर को दिखाएं: 3 दिन से अधिक लगातार बुखार, बिना कारण वजन घटना, या लंबे समय से बना हुआ दर्द।'
        ],
        whenToSeeDoctor: 'किसी भी लक्षण पर संदेह होने पर इंतजार करने के बजाय डॉक्टर से परामर्श लें।'
      },
      pa: {
        title: 'ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਕਦੋਂ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ',
        summary: 'ਸਮੇਂ ਸਿਰ ਡਾਕਟਰੀ ਸਲਾਹ ਲੈਣ ਨਾਲ ਵੱਡੀਆਂ ਮੁਸ਼ਕਲਾਂ ਤੋਂ ਬਚਿਆ ਜਾ ਸਕਦਾ ਹੈ।',
        details: [
          'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ: ਛਾਤੀ ਵਿੱਚ ਦਰਦ, ਸਾਹ ਦੀ ਦਿੱਕਤ, ਬੇਹੋਸ਼ੀ ਜਾਂ ਤੇਜ਼ ਖੂਨ ਵਹਿਣ ਦੀ ਸੂਰਤ ਵਿੱਚ।',
          'ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ: ਲਗਾਤਾਰ ਬੁਖਾਰ, ਅਣਜਾਣ ਕਾਰਨਾਂ ਕਰਕੇ ਭਾਰ ਘਟਣਾ ਜਾਂ ਪੁਰਾਣਾ ਦਰਦ।'
        ],
        whenToSeeDoctor: 'ਸ਼ੱਕ ਹੋਣ ਤੇ ਹਮੇਸ਼ਾ ਮਾਹਿਰ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।'
      },
      hinglish: {
        title: 'Doctor ko kab consult karein',
        summary: 'Timely medical consultation complications ko prevent karti hai aur early diagnosis ensure karti hai.',
        details: [
          'Immediate Emergency Care: Chest pain, severe breathing issue, sudden numbness, uncontrolled bleeding, ya loss of consciousness.',
          'Schedule Doctor Visit: 3 din se jyada continuous fever, unexplained weight loss, ya chronic unexplained pain.'
        ],
        whenToSeeDoctor: 'Jab bhi symptom par doubt ho, self-medicate karne ke bajaye qualified doctor se consult karein.'
      }
    }
  }
];

// Multilingual Mild Health Disclaimer
export const MILD_HEALTH_DISCLAIMER = {
  en: "This is general health information, not a diagnosis or personalized prescription.",
  hi: "यह केवल सामान्य स्वास्थ्य जानकारी है, कोई चिकित्सीय निदान या व्यक्तिगत नुस्खा नहीं।",
  pa: "ਇਹ ਸਿਰਫ਼ ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ ਹੈ, ਕੋਈ ਡਾਕਟਰੀ ਨਿਦਾਨ ਜਾਂ ਨੁਸਖ਼ਾ ਨਹੀਂ।",
  hinglish: "Yeh general health information hai, koi medical diagnosis ya personalized prescription nahi."
};

/**
 * Common Mild Symptoms Knowledge Base with Multilingual Translations
 * Provides safe non-drug self-care first, cautious generic OTC info with contraindications,
 * clear red-flag symptoms, when to consult a doctor, and brief contextual clarifying questions.
 */
export const MILD_SYMPTOMS = [
  {
    id: 'headache',
    keywords: [
      'headache', 'head ache', 'head throbbing', 'tension headache', 'mild headache',
      'sir dard', 'sar dard', 'sir me dard', 'sir mein dard', 'sar me dard', 'sar mein dard',
      'halka sir dard', 'halka sar dard', 'sir dukh', 'sar dukh', 'sir dard ki dava', 'sir dard ki dawa',
      'headache medicine', 'pain in head', 'सिर दर्द', 'सर दर्द', 'सिर में दर्द', 'सर में दर्द',
      'माथा दर्द', 'हल्का सिर दर्द', 'हल्का सर दर्द', 'ਸਿਰ ਦਰਦ', 'ਸਿਰ ਵਿੱਚ ਦਰਦ', 'ਸਿਰ ਪੀੜ', 'ਸਿਰ ਦੁਖਦਾ', 'ਹਲਕਾ ਸਿਰ ਦਰਦ'
    ],
    translations: {
      en: {
        title: 'Understanding Mild Headache & Self-Care',
        explanation: 'Headaches are very common and often stem from everyday triggers like dehydration, insufficient sleep, eye or screen strain, stress, skipped meals, or muscle tension in the neck and shoulders.',
        selfCare: [
          'Rest in a quiet, dimly lit, and well-ventilated room.',
          'Drink plenty of water to ensure adequate hydration.',
          'Take regular breaks from digital screens (phones, laptops, TV).',
          'Apply a gentle cool or warm compress to your forehead or the back of your neck.',
          'Eat regular, light meals if you have skipped eating.'
        ],
        otcInfo: [
          'An over-the-counter pain reliever like generic paracetamol (acetaminophen) is commonly used by adults for mild tension headaches.',
          'Always check the product packaging label for appropriate adult dosing and consult a pharmacist or doctor. Do not invent personal dosages or take complex schedules.',
          'Important Precautions & Contraindications: Check if it is safe for you based on age, pregnancy or breastfeeding status, liver or kidney disease, history of ulcers, allergies, blood thinners, or other medicines. Never take multiple medications containing paracetamol simultaneously.'
        ],
        redFlags: [
          'Sudden, explosive or extremely severe headache ("thunderclap" headache).',
          'Headache following a head injury or physical trauma.',
          'Headache accompanied by weakness, numbness, facial droop, slurred speech, confusion, seizures, fainting, or vision loss.',
          'High fever accompanied by a stiff neck.'
        ],
        whenToSeeDoctor: [
          'Consult a doctor if your headache lasts longer than 2–3 days, worsens progressively, occurs frequently, or does not improve with simple rest.'
        ],
        followUpQuestions: [
          'How long have you had this headache?',
          'Is the pain dull, throbbing, or located on one side?',
          'Are you experiencing other symptoms, such as nausea or sensitivity to light?'
        ]
      },
      hi: {
        title: 'हल्का सिरदर्द और प्राथमिक देखभाल (Headache Guidance)',
        explanation: 'सिरदर्द एक आम लक्षण है जो अक्सर पानी की कमी (डिहाइड्रेशन), नींद की कमी, मानसिक तनाव, लगातार स्क्रीन देखना, या गर्दन की मांसपेशियों में खिंचाव के कारण हो सकता है।',
        selfCare: [
          'शांत और हल्की रोशनी वाले हवादार कमरे में विश्राम करें।',
          'पर्याप्त मात्रा में पानी पिएं ताकि शरीर में पानी की कमी न रहे।',
          'मोबाइल, लैपटॉप और टीवी स्क्रीन से कुछ समय का ब्रेक लें।',
          'माथे या गर्दन के पीछे हल्का ठंडा या गुनगुना सेक लगाएं।',
          'समय पर हल्का और सुपाच्य भोजन लें।'
        ],
        otcInfo: [
          'वयस्कों में हल्के सिरदर्द के लिए सामान्यतः जेनेरिक पैरासिटामोल (Paracetamol) का उपयोग किया जाता है।',
          'दवा के पैकेट पर लिखे निर्देशों को ध्यान से पढ़ें और किसी फार्मासिस्ट या डॉक्टर से सलाह लें। खुद से कोई खुराक न बनाएं।',
          'महत्वपूर्ण सावधानियां: यदि आपको लिवर या किडनी की बीमारी, एलर्जी है, आप गर्भवती हैं या कोई अन्य दवा ले रहे हैं, तो बिना डॉक्टर की सलाह के दवा न लें।'
        ],
        redFlags: [
          'अचानक बहुत तेज या असहनीय सिरदर्द ("थंडरक्लैप" सिरदर्द)।',
          'सिर में चोट लगने के बाद शुरू होने वाला सिरदर्द।',
          'सिरदर्द के साथ शरीर में कमजोरी, सुन्नपन, बोलने में परेशानी, भ्रम, दौरे या बेहोशी होना।',
          'गर्दन में तेज अकड़न के साथ तेज बुखार होना।'
        ],
        whenToSeeDoctor: [
          'यदि सिरदर्द 2–3 दिनों से अधिक रहे, बार-बार हो या दर्द लगातार बढ़ रहा हो, तो डॉक्टर से परामर्श लें।'
        ],
        followUpQuestions: [
          'यह सिरदर्द कितने समय से हो रहा है?',
          'क्या दर्द पूरे सिर में है या किसी एक तरफ?',
          'क्या साथ में उल्टी, जी मिचलाना या रोशनी से परेशानी भी है?'
        ]
      },
      pa: {
        title: 'ਹਲਕਾ ਸਿਰ ਦਰਦ ਅਤੇ ਘਰੇਲੂ ਦੇਖਭਾਲ (Headache Guidance)',
        explanation: 'ਸਿਰ ਦਰਦ ਇੱਕ ਬਹੁਤ ਹੀ ਆਮ ਸਮੱਸਿਆ ਹੈ ਜੋ ਅਕਸਰ ਪਾਣੀ ਦੀ ਘਾਟ, ਨੀਂਦ ਪੂਰੀ ਨਾ ਹੋਣਾ, ਤਣਾਅ, ਲੰਮੇ ਸਮੇਂ ਤੱਕ ਸਕ੍ਰੀਨ ਦੇਖਣਾ ਜਾਂ ਗਰਦਨ ਵਿੱਚ ਖਿੱਚ ਕਾਰਨ ਹੋ ਸਕਦੀ ਹੈ।',
        selfCare: [
          'ਸ਼ਾਂਤ ਅਤੇ ਹਲਕੀ ਰੌਸ਼ਨੀ ਵਾਲੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ।',
          'ਖੁੱਲ੍ਹਾ ਪਾਣੀ ਪੀਓ ਤਾਂ ਜੋ ਸਰੀਰ ਵਿੱਚ ਪਾਣੀ ਦੀ ਕਮੀ ਨਾ ਰਹੇ।',
          'ਮੋਬਾਈਲ ਜਾਂ ਕੰਪਿਊਟਰ ਸਕ੍ਰੀਨ ਤੋਂ ਕੁਝ ਸਮੇਂ ਲਈ ਬਰੇਕ ਲਓ।',
          'ਮੱਥੇ ਜਾਂ ਗਰਦਨ ਦੇ ਪਿਛਲੇ ਪਾਸੇ ਹਲਕਾ ਸੇਕ ਲਗਾਓ।',
          'ਸਮੇਂ ਸਿਰ ਹਲਕਾ ਭੋਜਨ ਖਾਓ।'
        ],
        otcInfo: [
          'ਹਲਕੇ ਸਿਰ ਦਰਦ ਲਈ ਬਾਲਗ ਆਮ ਤੌਰ ਤੇ ਜੈਨੇਰਿਕ ਪੈਰਾਸੀਟਾਮੋਲ (Paracetamol) ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਨ।',
          'ਦਵਾਈ ਦੇ ਪੈਕਟ ਉੱਤੇ ਲਿਖੀਆਂ ਹਦਾਇਤਾਂ ਪੜ੍ਹੋ ਅਤੇ ਫਾਰਮਾਸਿਸਟ ਜਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।',
          'ਜ਼ਰੂਰੀ ਸਾਵਧਾਨੀਆਂ: ਜੇਕਰ ਲਿਵਰ ਜਾਂ ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ ਹੈ, ਐਲਰਜੀ ਹੈ, ਗਰਭ ਅਵਸਥਾ ਹੈ ਜਾਂ ਕੋਈ ਹੋਰ ਦਵਾਈ ਲੈ ਰਹੇ ਹੋ, ਤਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਬਿਨਾਂ ਦਵਾਈ ਨਾ ਲਓ।'
        ],
        redFlags: [
          'ਅਚਾਨਕ ਹੋਣ ਵਾਲਾ ਬਹੁਤ ਜ਼ਿਆਦਾ ਤੇਜ਼ ਸਿਰ ਦਰਦ।',
          'ਸਿਰ \'ਤੇ ਸੱਟ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਇਆ ਸਿਰ ਦਰਦ।',
          'ਸਿਰ ਦਰਦ ਦੇ ਨਾਲ ਕਮਜ਼ੋਰੀ, ਸੁੰਨ ਹੋਣਾ, ਬੋਲਣ ਵਿੱਚ ਦਿੱਕਤ, ਬੇਹੋਸ਼ੀ ਜਾਂ ਦੌਰੇ।',
          'ਧੌਣ ਦੀ ਅਕੜਾਹਟ ਦੇ ਨਾਲ ਤੇਜ਼ ਬੁਖ਼ਾਰ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਸਿਰ ਦਰਦ 2–3 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਰਹੇ ਜਾਂ ਵਾਰ-ਵਾਰ ਹੋਵੇ, ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
        ],
        followUpQuestions: [
          'ਇਹ ਸਿਰ ਦਰਦ ਕਿੰਨੇ ਚਿਰ ਤੋਂ ਹੈ?',
          'ਕੀ ਦਰਦ ਦੇ ਨਾਲ ਉਲਟੀ ਜਾਂ ਅੱਖਾਂ ਅੱਗੇ ਹਨੇਰਾ ਆ ਰਿਹਾ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Understanding Mild Headache & Self-Care',
        explanation: 'Headache ek bohot common symptom hai jo dehydration, sleep deprivation, stress, excess screen time, skipped meals, ya neck muscles mein tension ki wajah se ho sakta hai.',
        selfCare: [
          'Quiet aur dim-light room mein relax karein.',
          'Adequate water drink karein taaki hydration bani rahe.',
          'Phone, laptop aur TV screen se regular breaks lein.',
          'Forehead ya neck par gentle cool ya warm compress use karein.',
          'Agar meal skip hui hai toh timely light aur healthy food lein.'
        ],
        otcInfo: [
          'Mild tension headache ke liye adults commonly generic paracetamol (acetaminophen) use karte hain.',
          'Packet label par likhi guidelines check karein aur pharmacist ya doctor se confirm karein. Personal dosage invent na karein.',
          'Important Precautions: Liver/kidney impairment, allergies, pregnancy, breastfeeding, ya blood thinners chal rahe hon toh bina doctor advice medicine na lein.'
        ],
        redFlags: [
          'Sudden aur extreme severe headache ("thunderclap" headache).',
          'Head injury ke baad start hua headache.',
          'Headache ke sath weakness, numbness, speech difficulty, confusion, seizures, ya fainting.',
          'High fever ke sath severe neck stiffness.'
        ],
        whenToSeeDoctor: [
          'Agar headache 2–3 din se jyada continue rahe, progressively worsen ho, ya frequently repeat ho, toh doctor ko consult karein.'
        ],
        followUpQuestions: [
          'Yeh headache kab se hai aur pain kaisa hai (dull ya throbbing)?',
          'Kya sath mein nausea ya light sensitivity bhi hai?'
        ]
      }
    }
  },
  {
    id: 'stomach_ache',
    keywords: [
      'stomach ache', 'stomach pain', 'tummy ache', 'belly pain', 'abdominal pain',
      'mild stomach', 'mild abdominal', 'pet dard', 'pet mein dard', 'pet me dard',
      'halka pet dard', 'pet kharab', 'pet dard ki dava', 'pet dard ki dawa',
      'stomach discomfort', 'abdominal discomfort', 'upset stomach', 'indigestion',
      'पेट दर्द', 'पेट में दर्द', 'हल्का पेट दर्द', 'पेट खराब',
      'ਢਿੱਡ ਦਰਦ', 'ਢਿੱਡ ਵਿੱਚ ਦਰਦ', 'ਪੇਟ ਦਰਦ', 'ਪੇਟ ਵਿੱਚ ਦਰਦ', 'ਢਿੱਡ ਪੀੜ', 'ਹਲਕਾ ਪੇਟ ਦਰਦ'
    ],
    translations: {
      en: {
        title: 'Understanding Mild Stomach Discomfort & Self-Care',
        explanation: 'Mild abdominal discomfort is often caused by indigestion, gas, eating too quickly, spicy or oily meals, or mild dietary irritation.',
        selfCare: [
          'Sip water slowly or take clear fluids to maintain gentle hydration.',
          'Eat small, bland, easily digestible meals (such as plain rice, khichdi, bananas, or toast).',
          'Avoid heavy, greasy, deep-fried, spicy, and acidic foods until your stomach settles.',
          'Rest comfortably in an upright or slightly elevated position rather than lying flat immediately after eating.',
          'Apply a warm water bottle gently to your abdomen if soothing.'
        ],
        otcInfo: [
          '⚠️ CRITICAL MEDICATION SAFETY: Do NOT take routine painkillers (such as ibuprofen, aspirin, or diclofenac) for unexplained stomach pain. Pain relievers can irritate the stomach lining, trigger ulcers or gastrointestinal bleeding, or dangerously mask surgical emergencies like appendicitis.',
          'For mild gas or bloating, simple non-drug dietary adjustments or an oral rehydration solution are safest first steps.',
          'Always consult a qualified doctor or pharmacist before taking any medication for abdominal complaints.'
        ],
        redFlags: [
          'Severe, sharp, or rapidly escalating abdominal pain.',
          'Vomiting blood or dark material that looks like coffee grounds.',
          'Blood in your stool or black, tarry bowel movements.',
          'A rigid, rock-hard, or visibly distended/swollen abdomen.',
          'Persistent vomiting where you cannot retain fluids for more than 12–24 hours.',
          'Severe abdominal pain with pregnancy, high fever, or fainting.'
        ],
        whenToSeeDoctor: [
          'Seek medical evaluation if abdominal discomfort does not improve after 24–48 hours, worsens, or is accompanied by persistent diarrhea or fever.'
        ],
        followUpQuestions: [
          'Where exactly in your abdomen is the pain located?',
          'How long has it been present, and is it a dull ache, cramp, or sharp pain?',
          'Have you experienced any vomiting, fever, or changes in your bowel movements?'
        ]
      },
      hi: {
        title: 'पेट में हल्का दर्द और देखभाल (Stomach Discomfort Guidance)',
        explanation: 'पेट में हल्का दर्द या असहजता अक्सर अपच (indigestion), गैस, अधिक तला-भुना खाने, जल्दी-जल्दी खाने या पेट में हल्की जलन के कारण हो सकती है।',
        selfCare: [
          'हल्के घूंट-घूंट करके पानी पिएं और शरीर में पानी की कमी न होने दें।',
          'हल्का और सादा भोजन लें (जैसे पतली खिचड़ी, दलिया, केला या टोस्ट)।',
          'ज्यादा मिर्च-मसालेदार, तला-भुना, खट्टा और भारी खाना बिल्कुल न खाएं।',
          'खाने के तुरंत बाद सीधे न लेटें, थोड़ा टहलें या सीधे बैठें।',
          'पेट पर हल्का गुनगुना सेक ले सकते हैं।'
        ],
        otcInfo: [
          '⚠️ जरूरी दवा सुरक्षा: बिना कारण जाने पेट दर्द के लिए कोई भी पेनकिलर (जैसे आइबुप्रोफेन, एस्पिरिन) बिल्कुल न लें। पेनकिलर पेट की अंदरूनी परत को नुकसान पहुंचा सकते हैं, अल्सर बढ़ा सकते हैं या किसी गंभीर स्थिति को छिपा सकते हैं।',
          'गैस या बदहजमी के लिए पहले आहार में बदलाव और पर्याप्त पानी सबसे सुरक्षित उपाय हैं।',
          'दवा लेने से पहले हमेशा किसी योग्य डॉक्टर या फार्मासिस्ट से परामर्श लें।'
        ],
        redFlags: [
          'अचानक बहुत तेज या असहनीय पेट दर्द होना।',
          'उल्टी में खून आना या गहरे भूरे रंग की उल्टी होना।',
          'मल में खून आना या काला मल (black stool) होना।',
          'पेट का बहुत कड़ा (rigid) या फूला हुआ हो जाना।',
          'लगातार उल्टियां होना जिससे पानी भी न पच रहा हो।',
          'गर्भावस्था में पेट दर्द, तेज बुखार या बेहोशी होना।'
        ],
        whenToSeeDoctor: [
          'यदि पेट दर्द 24–48 घंटे में ठीक न हो, बढ़ रहा हो या साथ में तेज बुखार या दस्त हो, तो डॉक्टर को दिखाएं।'
        ],
        followUpQuestions: [
          'दर्द पेट में किस जगह पर हो रहा है (ऊपर, नीचे या दाईं तरफ)?',
          'यह दर्द कब से है और किस तरह का है (मरोड़, जलन या चुभन)?',
          'क्या उल्टी, बुखार या दस्त जैसी कोई अन्य समस्या है?'
        ]
      },
      pa: {
        title: 'ਢਿੱਡ ਵਿੱਚ ਹਲਕਾ ਦਰਦ ਅਤੇ ਦੇਖਭਾਲ (Stomach Discomfort Guidance)',
        explanation: 'ਢਿੱਡ ਵਿੱਚ ਹਲਕਾ ਦਰਦ ਜਾਂ ਬੇਚੈਨੀ ਅਕਸਰ ਬਦਹਜ਼ਮੀ, ਗੈਸ, ਤਲਿਆ-ਭੁੰਨਿਆ ਖਾਣ ਜਾਂ ਸਮੇਂ ਸਿਰ ਨਾ ਖਾਣ ਕਰਕੇ ਹੋ ਸਕਦੀ ਹੈ।',
        selfCare: [
          'ਹੌਲੀ-ਹੌਲੀ ਪਾਣੀ ਪੀਓ ਅਤੇ ਡੀਹਾਈਡ੍ਰੇਸ਼ਨ ਤੋਂ ਬਚੋ।',
          'ਹਲਕਾ ਅਤੇ ਸੁਪਚ ਭੋਜਨ ਲਓ (ਜਿਵੇਂ ਖਿਚੜੀ ਜਾਂ ਦਲੀਆ)।',
          'ਮਿਰਚ-ਮਸਾਲੇ ਵਾਲਾ ਜਾਂ ਤਲਿਆ ਖਾਣਾ ਨਾ ਖਾਓ।',
          'ਖਾਣਾ ਖਾਣ ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਨਾ ਲੇਟੋ।'
        ],
        otcInfo: [
          '⚠️ ਦਵਾਈ ਸੰਬੰਧੀ ਜ਼ਰੂਰੀ ਚੇਤਾਵਨੀ: ਅਣਜਾਣ ਕਾਰਨਾਂ ਕਰਕੇ ਢਿੱਡ ਦਰਦ ਵਿੱਚ ਕੋਈ ਵੀ ਦਰਦ ਨਿਵਾਰਕ ਗੋਲੀ (Painkiller) ਨਾ ਲਓ। ਇਹ ਢਿੱਡ ਦੇ ਅੰਦਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ।',
          'ਕਿਸੇ ਵੀ ਦਵਾਈ ਲਈ ਹਮੇਸ਼ਾ ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਦੀ ਸਲਾਹ ਲਓ।'
        ],
        redFlags: [
          'ਬਹੁਤ ਜ਼ਿਆਦਾ ਤੇਜ਼ ਜਾਂ ਅਸਹਿ ਢਿੱਡ ਦਰਦ।',
          'ਉਲਟੀ ਵਿੱਚ ਖੂਨ ਆਉਣਾ ਜਾਂ ਕਾਲੇ ਰੰਗ ਦੀ ਟੱਟੀ ਆਉਣੀ।',
          'ਢਿੱਡ ਦਾ ਬਹੁਤ ਸਖ਼ਤ ਜਾਂ ਫੁੱਲਿਆ ਹੋਣਾ।',
          'ਲਗਾਤਾਰ ਉਲਟੀਆਂ ਆਉਣੀਆਂ ਜਾਂ ਤੇਜ਼ ਬੁਖ਼ਾਰ ਹੋਣਾ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ 24–48 ਘੰਟਿਆਂ ਵਿੱਚ ਦਰਦ ਠੀਕ ਨਾ ਹੋਵੇ, ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਜ਼ਰੂਰ ਦਿਖਾਓ।'
        ],
        followUpQuestions: [
          'ਦਰਦ ਢਿੱਡ ਦੇ ਕਿਹੜੇ ਹਿੱਸੇ ਵਿੱਚ ਹੋ ਰਿਹਾ ਹੈ?',
          'ਕੀ ਨਾਲ ਬੁਖਾਰ ਜਾਂ ਉਲਟੀ ਦੀ ਸ਼ਿਕਾਇਤ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Understanding Mild Stomach Discomfort & Self-Care',
        explanation: 'Mild abdominal discomfort aksar indigestion, gas, fast eating, oily/spicy food, ya mild dietary irritation ki wajah se hota hai.',
        selfCare: [
          'Slowly sips mein water drink karein taaki hydration maintain rahe.',
          'Light aur bland food lein (jaise khichdi, daliya, toast, banana).',
          'Spicy, fried, heavy aur sour foods bilkul avoid karein.',
          'Khane ke turant baad flat na letein, thoda walk karein ya upright baithein.',
          'Pet par gentle warm water bottle se sek kar sakte hain.'
        ],
        otcInfo: [
          '⚠️ CRITICAL MEDICINE SAFETY: Unexplained stomach pain ke liye routine painkillers (jaise ibuprofen, aspirin, diclofenac) bilkul NA LEIN. Painkillers stomach lining ko irritate kar sakte hain, ulcer/bleeding trigger kar sakte hain, ya serious emergency ko mask kar sakte hain.',
          'Mild gas ya bloating ke liye dietary changes aur simple hydration sabse safe first step hai.',
          'Koi bhi medicine lene se pehle pharmacist ya qualified doctor se zaroor consult karein.'
        ],
        redFlags: [
          'Severe, sharp, ya rapidly worsening abdominal pain.',
          'Vomiting blood ya coffee-ground jaisi dark vomiting.',
          'Stool mein blood aana ya black tarry stools.',
          'Pet ka rigid, rock-hard, ya heavily swollen hona.',
          'Persistent vomiting jisme pani bhi retain na ho raha ho.',
          'Severe abdominal pain with pregnancy, high fever, ya fainting.'
        ],
        whenToSeeDoctor: [
          'Agar stomach pain 24–48 hours mein improve na ho, worsen kare, ya high fever/loose motions ho, toh doctor ko dikhayein.'
        ],
        followUpQuestions: [
          'Pain abdomen ke kis part mein hai (upper, lower, ya right side)?',
          'Pain kitne time se hai aur kaisa hai (cramping, burning, ya sharp)?',
          'Kya vomiting, fever, ya bowel changes notice kiye hain?'
        ]
      }
    }
  },
  {
    id: 'acidity',
    keywords: [
      'acidity', 'heartburn', 'acid reflux', 'sour burp', 'burning in chest', 'gastric',
      'gas problem', 'khatti dakar', 'seene mein jalan', 'sine me jalan', 'pet mein jalan',
      'acidity medicine', 'acidity problem', 'एसिडिटी', 'सीने में जलन', 'खट्टी डकार',
      'पेट में जलन', 'गैस की समस्या', 'गैस', 'ਐਸੀਡਿਟੀ', 'ਛਾਤੀ ਵਿੱਚ ਸੜਨ', 'ਖੱਟੇ ਡਕਾਰ', 'ਗੈਸ'
    ],
    translations: {
      en: {
        title: 'Understanding Acidity, Heartburn & Practical Guidance',
        explanation: 'Acidity and heartburn occur when stomach acid flows upward into the food pipe (esophagus), often triggered by heavy, oily, or spicy meals, caffeine, stress, irregular eating habits, or lying down soon after eating.',
        selfCare: [
          'Eat smaller, more frequent meals instead of heavy portions.',
          'Avoid lying down or sleeping for at least 2–3 hours after eating.',
          'Limit known triggers such as spicy, deep-fried foods, citrus, carbonated beverages, coffee, and tea.',
          'Elevate the head of your bed slightly while sleeping.',
          'Avoid tight belts or tight clothing around your waist.'
        ],
        otcInfo: [
          'For occasional mild acidity, generic over-the-counter antacids (such as magnesium hydroxide, aluminum hydroxide, or calcium carbonate) may provide temporary relief by neutralizing stomach acid.',
          'Antacids should only be used as a short-term symptomatic measure, not as an indefinite daily substitute for healthy eating.',
          'Important Precautions: Check with a doctor or pharmacist if you are pregnant, have kidney disease, or take other prescription medications, as antacids can interact with drug absorption.'
        ],
        redFlags: [
          'Chest tightness or burning that radiates to your left shoulder, arm, neck, or jaw (may indicate a cardiac event rather than acidity).',
          'Difficulty or pain when swallowing food.',
          'Vomiting blood or dark black stools.',
          'Unexplained weight loss or persistent vomiting.'
        ],
        whenToSeeDoctor: [
          'Consult a doctor if heartburn occurs more than 2–3 times a week, persists despite dietary changes, or requires frequent medication.'
        ],
        followUpQuestions: [
          'Does the burning sensation occur mostly after specific meals or at night?',
          'Have you noticed any difficulty swallowing or chest tightness?'
        ]
      },
      hi: {
        title: 'एसिडिटी, सीने में जलन और देखभाल (Acidity Guidance)',
        explanation: 'एसिडिटी और सीने में जलन तब होती है जब पेट का एसिड भोजन नली में ऊपर की ओर आता है। यह अक्सर अधिक मसालेदार या तला-भुना खाने, चाय-कॉफी, तनाव या खाने के तुरंत बाद लेटने से होता है।',
        selfCare: [
          'एक बार में ज्यादा खाने के बजाय थोड़ा-थोड़ा करके खाएं।',
          'खाने के कम से कम 2-3 घंटे बाद ही सोएं या लेटें।',
          'ज्यादा मिर्च-मसालेदार, खट्टे और तले-भुने भोजन से परहेज करें।',
          'सोते समय सिर को थोड़ा ऊंचा रखें।'
        ],
        otcInfo: [
          'हल्की एसिडिटी के लिए सामान्य एंटासिड (जैसे मैग्नीशियम/एल्यूमीनियम हाइड्रॉक्साइड) से कुछ समय के लिए राहत मिल सकती है।',
          'एंटासिड केवल तात्कालिक राहत के लिए हैं, इन्हें रोज की आदत न बनाएं। लगातार समस्या होने पर डॉक्टर से जांच कराएं।'
        ],
        redFlags: [
          'सीने का दर्द या जलन जो बाएं हाथ, जबड़े या गर्दन तक फैले (यह दिल के दौरे का संकेत हो सकता है)।',
          'खाना निगलने में कठिनाई या दर्द होना।',
          'उल्टी में खून आना या काला मल आना।'
        ],
        whenToSeeDoctor: [
          'यदि एसिडिटी हफ्ते में 2-3 बार से ज्यादा हो या खान-पान बदलने पर भी ठीक न हो, तो डॉक्टर को दिखाएं।'
        ],
        followUpQuestions: [
          'क्या जलन खाने के तुरंत बाद होती है या रात में लेटते समय?',
          'क्या साथ में सीने में भारीपन या सांस फूलने की समस्या भी है?'
        ]
      },
      pa: {
        title: 'ਐਸੀਡਿਟੀ, ਛਾਤੀ ਵਿੱਚ ਸੜਨ ਅਤੇ ਦੇਖਭਾਲ (Acidity Guidance)',
        explanation: 'ਐਸੀਡਿਟੀ ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਪੇਟ ਦਾ ਤੇਜ਼ਾਬ ਗਲੇ ਵੱਲ ਆਉਂਦਾ ਹੈ, ਜੋ ਕਿ ਤਲਿਆ-ਭੁੰਨਿਆ ਖਾਣ ਜਾਂ ਤੁਰੰਤ ਲੇਟਣ ਨਾਲ ਵੱਧ ਸਕਦੀ ਹੈ।',
        selfCare: [
          'ਥੋੜ੍ਹਾ-ਥੋੜ੍ਹਾ ਭੋਜਨ ਵਾਰ-ਵਾਰ ਖਾਓ।',
          'ਖਾਣਾ ਖਾਣ ਤੋਂ ਬਾਅਦ 2-3 ਘੰਟੇ ਨਾ ਲੇਟੋ।',
          'ਚਾਹ, ਕੌਫੀ ਅਤੇ ਮਿਰਚ-ਮਸਾਲੇ ਵਾਲੇ ਭੋਜਨ ਤੋਂ ਪਰਹੇਜ਼ ਕਰੋ।'
        ],
        otcInfo: [
          'ਆਮ ਐਂਟਾਸਿਡ (Antacid) ਨਾਲ ਆਰਜ਼ੀ ਰਾਹਤ ਮਿਲ ਸਕਦੀ ਹੈ, ਪਰ ਲਗਾਤਾਰ ਦਵਾਈ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।'
        ],
        redFlags: [
          'ਛਾਤੀ ਦਾ ਦਰਦ ਜੋ ਖੱਬੇ ਹੱਥ ਜਾਂ ਗਰਦਨ ਵੱਲ ਜਾਵੇ।',
          'ਨਿਗਲਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਜਾਂ ਉਲਟੀ ਵਿੱਚ ਖੂਨ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਐਸੀਡਿਟੀ ਲਗਾਤਾਰ ਬਣੀ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਜ਼ਰੂਰ ਦਿਖਾਓ।'
        ],
        followUpQuestions: [
          'ਕੀ ਸੜਨ ਖਾਣਾ ਖਾਣ ਤੋਂ ਬਾਅਦ ਹੁੰਦੀ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Understanding Acidity, Heartburn & Practical Guidance',
        explanation: 'Acidity aur heartburn tab hoti hai jab stomach acid food pipe mein flow back karta hai, usually spicy/oily food, caffeine, irregular meals, ya khane ke turant baad letne se.',
        selfCare: [
          'Heavy meal ke bajaye small and frequent meals lein.',
          'Dinner ke baad kam se kam 2-3 hours tak na soyein.',
          'Spicy, deep-fried food, coffee, tea, aur carbonated drinks restrict karein.',
          'Sleep karte waqt head ko slight elevate rakhein.'
        ],
        otcInfo: [
          'Mild occasional acidity ke liye generic OTC antacids temporary relief provide kar sakte hain.',
          'Antacids ko daily routine na banayein; persistent problem par doctor se consult karein.'
        ],
        redFlags: [
          'Chest pain ya heavy pressure jo left arm ya jaw tak radiate ho (emergency cardiac sign).',
          'Swallowing mein pain ya difficulty.',
          'Vomiting blood ya black stools.'
        ],
        whenToSeeDoctor: [
          'Agar heartburn week mein 2-3 times se jyada repeat ho ya dietary changes se theek na ho, toh doctor ko dikhayein.'
        ],
        followUpQuestions: [
          'Kya burning sensation specific meals ke baad hoti hai ya night mein?',
          'Kya chest mein tightness ya swallowing difficulty bhi hai?'
        ]
      }
    }
  },
  {
    id: 'cold_cough',
    keywords: [
      'cold', 'common cold', 'cough', 'mild cough', 'dry cough', 'runny nose', 'blocked nose',
      'stuffy nose', 'sore throat', 'sneezing', 'sardi', 'zukam', 'jukam', 'khasi', 'khansi',
      'gale me kharash', 'gale mein kharash', 'naak behna', 'naak band', 'chheenkein',
      'सर्दी', 'जुकाम', 'खांसी', 'गले में खराश', 'नाक बहना', 'नाक बंद', 'छींक',
      'ਜ਼ੁਕਾਮ', 'ਖੰਘ', 'ਗਲੇ ਵਿੱਚ ਖਰਾਸ਼', 'ਨੱਕ ਵਗਣਾ', 'ਨੱਕ ਬੰਦ'
    ],
    translations: {
      en: {
        title: 'Common Cold, Mild Cough & Supportive Self-Care',
        explanation: 'The common cold and mild cough are generally mild viral upper respiratory infections that typically run their course over 7 to 10 days.',
        selfCare: [
          'Get plenty of rest to support your immune system.',
          'Stay well hydrated with warm water, clear broths, and herbal teas.',
          'Use steam inhalation to soothe congested nasal passages.',
          'Gargle with warm salt water several times a day to relieve throat irritation.',
          'Saline nasal drops or sprays can gently clear a blocked nose.'
        ],
        otcInfo: [
          'For associated mild fever, headache, or body aches, generic paracetamol may be considered cautiously following package directions.',
          'Throat lozenges or saline nasal sprays can provide comfort.',
          '⚠️ CRITICAL NOTE ON ANTIBIOTICS: Antibiotics do NOT work against viral colds or coughs. Never take antibiotics without a physician\'s prescription and direct evaluation.',
          'Precautions: Check package label for contraindications (liver disease, pregnancy, age limits, allergies).'
        ],
        redFlags: [
          'Shortness of breath, rapid breathing, or wheezing.',
          'Persistent high fever (above 102°F / 38.9°C) lasting over 3 days.',
          'Coughing up blood or dark rust-colored phlegm.',
          'Severe chest pain when breathing or coughing.'
        ],
        whenToSeeDoctor: [
          'See a doctor if your cough lasts more than 2–3 weeks, symptoms worsen after initial improvement, or breathing feels labored.'
        ],
        followUpQuestions: [
          'How many days have you had these cold symptoms?',
          'Is your cough dry, or are you bringing up phlegm?',
          'Do you currently have a fever or body aches?'
        ]
      },
      hi: {
        title: 'सामान्य सर्दी-जुकाम, हल्की खांसी और प्राथमिक देखभाल (Cold & Cough Guidance)',
        explanation: 'सामान्य सर्दी-जुकाम और खांसी आमतौर पर हल्के वायरल संक्रमण के कारण होते हैं जो सामान्यतः 7 से 10 दिनों में अपने आप ठीक हो जाते हैं।',
        selfCare: [
          'शरीर को पर्याप्त आराम दें।',
          'गुनगुना पानी, सूप और हर्बल चाय पिएं ताकि शरीर में नमी बनी रहे।',
          'भाप (steam) लें जिससे बंद नाक और गले को आराम मिले।',
          'हल्के गर्म नमक वाले पानी से गरारे (gargles) करें।',
          'सलाइन नेज़ल स्प्रे से बंद नाक साफ करें।'
        ],
        otcInfo: [
          'बुखार या बदन दर्द के लिए आवश्यकतानुसार जेनेरिक पैरासिटामोल का उपयोग किया जा सकता है।',
          '⚠️ एंटीबायोटिक दवाओं पर महत्वपूर्ण चेतावनी: सर्दी-जुकाम जैसे वायरल संक्रमण में एंटीबायोटिक काम नहीं करते हैं। डॉक्टर की सलाह के बिना कभी भी एंटीबायोटिक न लें।'
        ],
        redFlags: [
          'सांस लेने में कठिनाई या सांस फूलना।',
          'खांसी में खून आना।',
          '3 दिन से अधिक समय तक लगातार तेज बुखार रहना।',
          'छाती में तेज दर्द होना।'
        ],
        whenToSeeDoctor: [
          'यदि खांसी 2-3 हफ्ते से अधिक रहे या सांस लेने में परेशानी हो, तो तुरंत डॉक्टर को दिखाएं।'
        ],
        followUpQuestions: [
          'सर्दी-जुकाम कितने दिनों से है?',
          'क्या खांसी सूखी है या बलगम वाली?'
        ]
      },
      pa: {
        title: 'ਜ਼ੁਕਾਮ, ਹਲਕੀ ਖੰਘ ਅਤੇ ਦੇਖਭਾਲ (Cold & Cough Guidance)',
        explanation: 'ਜ਼ੁਕਾਮ ਅਤੇ ਖੰਘ ਆਮ ਤੌਰ ਤੇ ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ ਕਰਕੇ ਹੁੰਦੀ ਹੈ ਜੋ ਕੁਝ ਦਿਨਾਂ ਵਿੱਚ ਠੀਕ ਹੋ ਜਾਂਦੀ ਹੈ।',
        selfCare: [
          'ਚੰਗੀ ਤਰ੍ਹਾਂ ਆਰਾਮ ਕਰੋ।',
          'ਕੋਸਾ ਪਾਣੀ ਅਤੇ ਗਰਮ ਤਰਲ ਪਦਾਰਥ ਪੀਓ।',
          'ਭਾਫ਼ ਲਓ ਅਤੇ ਕੋਸੇ ਲੂਣ ਵਾਲੇ ਪਾਣੀ ਨਾਲ ਗਰਾਰੇ ਕਰੋ।'
        ],
        otcInfo: [
          'ਐਂਟੀਬਾਇਓਟਿਕ ਦਵਾਈਆਂ ਵਾਇਰਲ ਜ਼ੁਕਾਮ ਤੇ ਕੰਮ ਨਹੀਂ ਕਰਦੀਆਂ, ਇਸ ਲਈ ਬਿਨਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਕੋਈ ਐਂਟੀਬਾਇਓਟਿਕ ਨਾ ਲਓ।'
        ],
        redFlags: [
          'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਹੋਣੀ ਜਾਂ ਖੰਘ ਵਿੱਚ ਖੂਨ ਆਉਣਾ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਖੰਘ 2 ਹਫ਼ਤਿਆਂ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ।'
        ],
        followUpQuestions: [
          'ਇਹ ਸਮੱਸਿਆ ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Common Cold, Mild Cough & Supportive Self-Care',
        explanation: 'Common cold aur cough usually mild viral infection hote hain jo generally 7 se 10 days mein naturally resolve ho jate hain.',
        selfCare: [
          'Proper bed rest lein.',
          'Lukewarm water, soups aur herbal tea drink karein.',
          'Steam inhalation karein jisse nasal congestion clear ho.',
          'Gale ke liye warm salt water gargles karein.',
          'Saline nasal spray use kar sakte hain.'
        ],
        otcInfo: [
          'Fever ya body ache ke liye generic paracetamol label follow karke li ja sakti hai.',
          '⚠️ ANTIBIOTICS WARNING: Antibiotics viral cold/cough par kaam nahi karti. Bina doctor prescription antibiotics bilkul na lein.'
        ],
        redFlags: [
          'Breathing difficulty ya shortness of breath.',
          'Cough mein blood aana.',
          '3 din se jyada continuous high fever.',
          'Chest pain breathing ke waqt.'
        ],
        whenToSeeDoctor: [
          'Agar cough 2-3 weeks se jyada chale ya breathing labored ho, toh doctor ko consult karein.'
        ],
        followUpQuestions: [
          'Cold/cough kitne din se hai?',
          'Cough dry hai ya phlegm ke sath?'
        ]
      }
    }
  },
  {
    id: 'mild_fever',
    keywords: [
      'mild fever', 'low grade fever', 'slight fever', 'feeling feverish', 'fever',
      'halka bukhar', 'bukhar', 'hararat', 'bukhar ki dawa', 'fever medicine', 'temperature',
      'हल्का बुखार', 'बुखार', 'हरारत', 'ਹਲਕਾ ਬੁਖਾਰ', 'ਬੁਖਾਰ'
    ],
    translations: {
      en: {
        title: 'Understanding Mild Fever & Supportive Care',
        explanation: 'A mild fever (typically 99°F–100.4°F / 37.2°C–38°C) is usually the body\'s natural and healthy immune response to fighting a common viral infection or seasonal change.',
        selfCare: [
          'Drink plenty of fluids (water, oral rehydration solutions, clear broths, coconut water) to prevent dehydration.',
          'Get ample bed rest and avoid strenuous physical activity.',
          'Wear lightweight, breathable cotton clothing and keep the room pleasantly cool and well ventilated.',
          'A lukewarm (not cold) damp cloth on the forehead can offer soothing comfort.'
        ],
        otcInfo: [
          'Generic paracetamol (acetaminophen) is widely used by adults to relieve discomfort and bring down temperature if the fever causes distress.',
          'Always follow package dosing recommendations and consult a pharmacist or doctor. Never double-dose or combine multiple medicines containing paracetamol.',
          'Important Precautions: Do not use if you have liver disease or severe kidney impairment. For children, pregnant individuals, or elderly adults, always consult a pediatrician or doctor for proper guidance.'
        ],
        redFlags: [
          'High fever exceeding 103°F (39.4°C).',
          'Fever accompanied by a stiff neck, confusion, extreme drowsiness, or seizure.',
          'Difficulty breathing, chest pain, or bluish lips/skin.',
          'A new unexplained skin rash appearing alongside the fever.',
          'Persistent vomiting preventing any fluid intake.'
        ],
        whenToSeeDoctor: [
          'Consult a healthcare professional if the fever lasts more than 3 days, does not come down with simple measures, or continues to rise.'
        ],
        followUpQuestions: [
          'What is your current thermometer temperature reading?',
          'How many days have you had this fever?',
          'Are you experiencing other symptoms, like a cough, chills, or headache?'
        ]
      },
      hi: {
        title: 'हल्का बुखार और प्राथमिक देखभाल (Mild Fever Guidance)',
        explanation: 'हल्का बुखार (99°F–100.4°F) आमतौर पर किसी सामान्य मौसमी बदलाव या वायरल संक्रमण से लड़ने के लिए शरीर की स्वाभाविक प्रतिरक्षा प्रणाली (immune response) का हिस्सा होता है।',
        selfCare: [
          'खूब पानी, सूप, ओआरएस और तरल पदार्थ पिएं ताकि शरीर में पानी की कमी न हो।',
          'पूरा आराम करें और भारी काम से बचें।',
          'हल्के और आरामदायक सूती कपड़े पहनें।',
          'माथे पर ताजे (गुनगुने) पानी की पट्टी रख सकते हैं।'
        ],
        otcInfo: [
          'वयस्कों में बुखार की बेचैनी कम करने के लिए जेनेरिक पैरासिटामोल (Paracetamol) का उपयोग किया जाता है।',
          'पैकेट पर लिखे निर्देशों का पालन करें और फार्मासिस्ट से खुराक की पुष्टि करें।',
          'सावधानियां: लिवर रोग, एलर्जी या गर्भावस्था में बिना डॉक्टर परामर्श कोई दवा न लें।'
        ],
        redFlags: [
          'बुखार 103°F (39.4°C) से अधिक होना।',
          'बुखार के साथ गर्दन में तेज अकड़न, बेहोशी, भ्रम या दौरे आना।',
          'सांस लेने में भारी तकलीफ या शरीर पर नए चकत्ते (rash) निकलना।'
        ],
        whenToSeeDoctor: [
          'यदि बुखार 3 दिन से अधिक बना रहे या बढ़ता जाए, तो डॉक्टर से संपर्क करें।'
        ],
        followUpQuestions: [
          'थर्मामीटर पर तापमान कितना दर्ज हुआ है?',
          'बुखार कितने दिनों से है?'
        ]
      },
      pa: {
        title: 'ਹਲਕਾ ਬੁਖ਼ਾਰ ਅਤੇ ਦੇਖਭਾਲ (Mild Fever Guidance)',
        explanation: 'ਹਲਕਾ ਬੁਖ਼ਾਰ ਅਕਸਰ ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ ਨਾਲ ਲੜਨ ਲਈ ਸਰੀਰ ਦਾ ਕੁਦਰਤੀ ਬਚਾਅ ਹੁੰਦਾ ਹੈ।',
        selfCare: [
          'ਕਾਫ਼ੀ ਪਾਣੀ ਅਤੇ ਤਰਲ ਪਦਾਰਥ ਪੀਓ।',
          'ਆਰਾਮ ਕਰੋ ਅਤੇ ਹਲਕੇ ਕੱਪੜੇ ਪਾਓ।',
          'ਮੱਥੇ \'ਤੇ ਕੋਸੇ ਪਾਣੀ ਦੀ ਪੱਟੀ ਰੱਖ ਸਕਦੇ ਹੋ।'
        ],
        otcInfo: [
          'ਬਾਲਗ ਜ਼ਰੂਰਤ ਪੈਣ ਤੇ ਜੈਨੇਰਿਕ ਪੈਰਾਸੀਟਾਮੋਲ ਲੈ ਸਕਦੇ ਹਨ, ਪਰ ਪੈਕਟ ਉੱਤੇ ਦਿੱਤੀਆਂ ਹਦਾਇਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।'
        ],
        redFlags: [
          'ਬਹੁਤ ਤੇਜ਼ ਬੁਖ਼ਾਰ, ਧੌਣ ਵਿੱਚ ਅਕੜਾਹਟ ਜਾਂ ਸਾਹ ਦੀ ਦਿੱਕਤ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਬੁਖ਼ਾਰ 3 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ।'
        ],
        followUpQuestions: [
          'ਤਾਪਮਾਨ ਕਿੰਨਾ ਹੈ ਅਤੇ ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ ਬੁਖਾਰ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Understanding Mild Fever & Supportive Care',
        explanation: 'Mild fever (99°F–100.4°F) usually common viral seasonal change se ladne ke liye body ka natural immune response hota hai.',
        selfCare: [
          'Plenty of fluids (water, ORS, soup) drink karein.',
          'Proper bed rest lein aur physical exertion avoid karein.',
          'Light aur comfortable cotton clothes pehnein.',
          'Forehead par lukewarm water compress rakh sakte hain.'
        ],
        otcInfo: [
          'Fever discomfort ke liye adults generic paracetamol use karte hain.',
          'Dosing guidelines packet se check karein aur pharmacist/doctor se consult karein.',
          'Precautions: Liver/kidney disease ya pregnancy mein bina doctor consultation avoid karein.'
        ],
        redFlags: [
          'Fever 103°F (39.4°C) se high hona.',
          'Fever with stiff neck, confusion, ya seizures.',
          'Breathing difficulty ya severe chest pain.'
        ],
        whenToSeeDoctor: [
          'Agar fever 3 days se jyada persist kare ya escalate ho, toh doctor ko consult karein.'
        ],
        followUpQuestions: [
          'Thermometer par temperature reading kitni hai?',
          'Fever kitne days se hai?'
        ]
      }
    }
  },
  {
    id: 'body_ache',
    keywords: [
      'body ache', 'mild body ache', 'muscle pain', 'body soreness', 'tired muscles',
      'badan dard', 'shareer mein dard', 'body pain', 'muscle ache', 'halka badan dard',
      'बदन दर्द', 'शरीर में दर्द', 'मांसपेशियों में दर्द', 'ਹਲਕਾ ਸਰੀਰ ਦਰਦ', 'ਸਰੀਰ ਦਰਦ',
      'ਸਰੀਰ ਵਿੱਚ ਦਰਦ', 'ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ'
    ],
    translations: {
      en: {
        title: 'Mild Body Aches & Recovery Guidance',
        explanation: 'Mild body and muscle aches often stem from viral fatigue, unaccustomed physical exertion, dehydration, poor posture, or lack of restorative sleep.',
        selfCare: [
          'Rest and allow your muscles to recover.',
          'Ensure adequate hydration throughout the day.',
          'Take a warm bath or apply a warm compress to tight muscles.',
          'Engage in gentle stretching if comfortable; avoid strenuous exercise.'
        ],
        otcInfo: [
          'Generic paracetamol can be used by adults for temporary relief of mild muscular discomfort.',
          'Check product labels carefully and consult a pharmacist. Observe precautions for liver health, pregnancy, and other medications.'
        ],
        redFlags: [
          'Severe sudden muscle weakness, numbness, or inability to move limbs.',
          'Very dark or tea-colored urine alongside severe muscle soreness.',
          'Body aches accompanied by high fever, confusion, or difficulty breathing.'
        ],
        whenToSeeDoctor: [
          'Seek medical attention if body aches persist beyond 4–5 days or worsen significantly.'
        ],
        followUpQuestions: [
          'Did the aches start after exercise, work, or alongside cold/fever symptoms?',
          'Are the aches all over your body or concentrated in specific muscles?'
        ]
      },
      hi: {
        title: 'बदन दर्द और मांसपेशियों में खिंचाव की देखभाल (Body Ache Guidance)',
        explanation: 'हल्का बदन दर्द अक्सर थकान, भारी शारीरिक काम, पानी की कमी, गलत मुद्रा (posture) या मौसमी वायरल की वजह से हो सकता है।',
        selfCare: [
          'शरीर को पूरा आराम दें।',
          'भरपूर पानी पिएं।',
          'गुनगुने पानी से स्नान करें या दर्द वाले हिस्से पर हल्का सेक करें।',
          'हल्का खिंचाव (stretching) करें।'
        ],
        otcInfo: [
          'हल्के बदन दर्द में राहत के लिए आवश्यकतानुसार जेनेरिक पैरासिटामोल का उपयोग किया जा सकता है।'
        ],
        redFlags: [
          'अचानक मांसपेशियों में अत्यधिक कमजोरी या चलने-फिरने में असमर्थता।',
          'गहरे रंग का पेशाब आना या तेज बुखार होना।'
        ],
        whenToSeeDoctor: [
          'यदि बदन दर्द 4-5 दिन में ठीक न हो, तो डॉक्टर को दिखाएं।'
        ],
        followUpQuestions: [
          'क्या बदन दर्द के साथ बुखार या सर्दी भी है?'
        ]
      },
      pa: {
        title: 'ਸਰੀਰ ਦਰਦ ਅਤੇ ਮਾਸਪੇਸ਼ੀਆਂ ਦੀ ਦੇਖਭਾਲ (Body Ache Guidance)',
        explanation: 'ਸਰੀਰ ਵਿੱਚ ਹਲਕਾ ਦਰਦ ਅਕਸਰ ਥਕਾਵਟ, ਜ਼ਿਆਦਾ ਕੰਮ ਕਰਨ ਜਾਂ ਵਾਇਰਲ ਕਾਰਨ ਹੋ ਸਕਦਾ ਹੈ।',
        selfCare: [
          'ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਓ।',
          'ਕੋਸੇ ਪਾਣੀ ਨਾਲ ਇਸ਼ਨਾਨ ਕਰੋ।'
        ],
        otcInfo: [
          'ਜ਼ਰੂਰਤ ਪੈਣ ਤੇ ਜੈਨੇਰਿਕ ਪੈਰਾਸੀਟਾਮੋਲ ਲਈ ਜਾ ਸਕਦੀ ਹੈ।'
        ],
        redFlags: [
          'ਮਾਸਪੇਸ਼ੀਆਂ ਦੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਕਮਜ਼ੋਰੀ ਜਾਂ ਬੇਹੋਸ਼ੀ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਦਰਦ ਲਗਾਤਾਰ ਬਣਿਆ ਰਹੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਓ।'
        ],
        followUpQuestions: [
          'ਦਰਦ ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Mild Body Aches & Recovery Guidance',
        explanation: 'Mild body aur muscle ache aksar viral fatigue, physical exertion, dehydration, ya poor sleep ki wajah se hota hai.',
        selfCare: [
          'Proper rest lein aur body ko recover hone dein.',
          'Hydration maintain karein.',
          'Warm bath ya gentle warm compress use karein.',
          'Light stretching kar sakte hain.'
        ],
        otcInfo: [
          'Discomfort relief ke liye generic paracetamol safe dosage mein use ki ja sakti hai.'
        ],
        redFlags: [
          'Severe sudden muscle weakness ya inability to walk.',
          'Dark tea-colored urine with intense muscle pain.'
        ],
        whenToSeeDoctor: [
          'Agar body ache 4-5 days se jyada persist kare toh doctor ko consult karein.'
        ],
        followUpQuestions: [
          'Kya ache exercise ke baad hua ya fever ke sath?'
        ]
      }
    }
  },
  {
    id: 'menstrual_cramps',
    keywords: [
      'period pain', 'menstrual cramps', 'period cramps', 'periods ka dard', 'mc pain',
      'period pain relief', 'मासिक धर्म का दर्द', 'पीरियड्स का दर्द', 'ਮਾਹਵਾਰੀ ਦਾ ਦਰਦ', 'ਪੀਰੀਅਡ ਦਾ ਦਰਦ'
    ],
    translations: {
      en: {
        title: 'Understanding Mild Menstrual Cramps & Relief',
        explanation: 'Mild menstrual cramps (dysmenorrhea) are caused by normal uterine contractions triggered by natural prostaglandins during your period.',
        selfCare: [
          'Apply a warm heating pad or hot water bottle to your lower abdomen or lower back.',
          'Rest comfortably with your legs elevated slightly.',
          'Stay hydrated and sip warm herbal teas (like ginger or chamomile).',
          'Engage in gentle walking or light stretching.'
        ],
        otcInfo: [
          'Check with a doctor or pharmacist regarding appropriate over-the-counter options if cramps interfere with normal routines.',
          'Always review contraindications including stomach ulcers, bleeding tendencies, or allergies.'
        ],
        redFlags: [
          'Sudden, incapacitating or unusually severe pelvic pain.',
          'Extremely heavy bleeding (soaking through a sanitary pad every hour for several consecutive hours).',
          'Severe pain accompanied by high fever, fainting, or possible pregnancy.'
        ],
        whenToSeeDoctor: [
          'Consult a gynecologist if cramps progressively worsen over cycles, do not respond to basic care, or disrupt work/school.'
        ],
        followUpQuestions: [
          'On which day of your cycle did the cramps begin?',
          'Are you experiencing severe flow, nausea, or dizziness?'
        ]
      },
      hi: {
        title: 'मासिक धर्म (पीरियड्स) में दर्द और देखभाल (Menstrual Cramps Guidance)',
        explanation: 'मासिक धर्म में हल्का दर्द गर्भाशय के सामान्य संकुचन के कारण होता है।',
        selfCare: [
          'पेट के निचले हिस्से पर गर्म पानी की थैली (heating pad) से सेक करें।',
          'आराम करें और गुनगुना पानी या हर्बल चाय पिएं।'
        ],
        otcInfo: [
          'दवा लेने से पहले फार्मासिस्ट या डॉक्टर से सलाह लें, विशेषकर यदि पेट में अल्सर या एसिडिटी की समस्या हो।'
        ],
        redFlags: [
          'अत्यधिक तेज और असहनीय दर्द, बहुत ज्यादा रक्तस्राव या चक्कर आकर गिरना।'
        ],
        whenToSeeDoctor: [
          'यदि दर्द हर महीने अत्यधिक हो या सामान्य काम करने में बाधा डाले, तो स्त्री रोग विशेषज्ञ (Gynecologist) से मिलें।'
        ],
        followUpQuestions: [
          'दर्द कितने दिनों से है?'
        ]
      },
      pa: {
        title: 'ਮਾਹਵਾਰੀ (ਪੀਰੀਅਡ) ਦਾ ਦਰਦ ਅਤੇ ਦੇਖਭਾਲ (Menstrual Cramps Guidance)',
        explanation: 'ਪੀਰੀਅਡ ਦੌਰਾਨ ਹਲਕਾ ਦਰਦ ਕੁਦਰਤੀ ਕਾਰਨਾਂ ਕਰਕੇ ਹੋ ਸਕਦਾ ਹੈ।',
        selfCare: [
          'ਢਿੱਡ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ ਤੇ ਗਰਮ ਪਾਣੀ ਦੀ ਥੈਲੀ ਨਾਲ ਸੇਕ ਕਰੋ।',
          'ਆਰਾਮ ਕਰੋ ਅਤੇ ਕੋਸਾ ਪਾਣੀ ਪੀਓ।'
        ],
        otcInfo: [
          'ਕਿਸੇ ਵੀ ਦਵਾਈ ਲਈ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
        ],
        redFlags: [
          'ਬਹੁਤ ਜ਼ਿਆਦਾ ਖੂਨ ਪੈਣਾ ਜਾਂ ਬੇਹੋਸ਼ੀ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਦਰਦ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੋਵੇ ਤਾਂ ਲੇਡੀਜ਼ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
        ],
        followUpQuestions: [
          'ਦਰਦ ਕਿੰਨੇ ਚਿਰ ਤੋਂ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Understanding Mild Menstrual Cramps & Relief',
        explanation: 'Mild period cramps normal uterine contractions ki wajah se hote hain.',
        selfCare: [
          'Lower abdomen par warm heating pad use karein.',
          'Rest karein aur warm herbal tea ya water drink karein.',
          'Gentle walking ya light stretching relief de sakti hai.'
        ],
        otcInfo: [
          'Medicine lene se pehle pharmacist ya doctor se confirm karein, especially agar ulcer ya bleeding tendency ho.'
        ],
        redFlags: [
          'Incapacitating severe pelvic pain, excessive heavy bleeding, ya fainting.'
        ],
        whenToSeeDoctor: [
          'Agar cramps regular routine disturb karein toh gynecologist ko consult karein.'
        ],
        followUpQuestions: [
          'Cramps cycle ke kis day par start hue?'
        ]
      }
    }
  },
  {
    id: 'nausea',
    keywords: [
      'nausea', 'feeling nauseous', 'queasy', 'mild nausea', 'ji michlana', 'jee ghabrana',
      'ulti jaisa lagna', 'ulti jaisa', 'मतली', 'जी मिचलाना', 'उल्टी जैसा लगना',
      'ਉਲਟੀ ਵਰਗਾ ਲੱਗਣਾ', 'ਮਤਲੀ', 'ਜੀ ਕੱਚਾ ਹੋਣਾ'
    ],
    translations: {
      en: {
        title: 'Managing Mild Nausea & Supportive Care',
        explanation: 'Mild nausea can be triggered by dietary indiscretion, motion, dehydration, mild viral stomach bugs, stress, or acidity.',
        selfCare: [
          'Take small, frequent sips of cool water, oral rehydration solutions, or clear broth.',
          'Sip ginger tea or suck on a piece of ginger candy.',
          'Eat small amounts of bland foods (crackers, toast, plain rice) when you feel able.',
          'Avoid strong food smells, greasy, or overly sweet items.',
          'Sit upright after eating; avoid lying completely flat.'
        ],
        otcInfo: [
          'Prioritize oral hydration and electrolyte balance over taking heavy anti-nausea medications without doctor advice.'
        ],
        redFlags: [
          'Inability to keep liquids down for more than 12–24 hours.',
          'Vomiting blood or dark black material.',
          'Severe abdominal pain, high fever, or signs of severe dehydration (dry mouth, dizziness, dark urine).'
        ],
        whenToSeeDoctor: [
          'Consult a physician if nausea persists for more than 48 hours or is accompanied by severe weakness.'
        ],
        followUpQuestions: [
          'How long have you felt nauseous, and have you actually vomited?',
          'Are you able to keep water or fluids down?'
        ]
      },
      hi: {
        title: 'मतली (जी मिचलाना) और प्राथमिक देखभाल (Nausea Guidance)',
        explanation: 'हल्की मतली या जी मिचलाना अक्सर खान-पान में गड़बड़ी, सफर, अपच या एसिडिटी के कारण हो सकता है।',
        selfCare: [
          'घूंट-घूंट करके ठंडा पानी या ओआरएस पिएं।',
          'अदरक वाली चाय या नींबू पानी लें।',
          'हल्का खाना जैसे टोस्ट या चावल खाएं और तेज गंध वाले खाने से दूर रहें।'
        ],
        otcInfo: [
          'बिना डॉक्टर सलाह के भारी उल्टी की दवाइयां न लें, पानी और इलेक्ट्रोलाइट्स की पूर्ति सबसे जरूरी है।'
        ],
        redFlags: [
          '24 घंटे से पानी भी न पच पाना या उल्टी में खून आना।'
        ],
        whenToSeeDoctor: [
          'यदि मतली 2 दिन से अधिक बनी रहे, तो डॉक्टर को दिखाएं।'
        ],
        followUpQuestions: [
          'क्या उल्टी भी हुई है या सिर्फ जी मिचला रहा है?'
        ]
      },
      pa: {
        title: 'ਮਤਲੀ (ਜੀ ਕੱਚਾ ਹੋਣਾ) ਅਤੇ ਦੇਖਭਾਲ (Nausea Guidance)',
        explanation: 'ਜੀ ਕੱਚਾ ਹੋਣਾ ਅਕਸਰ ਬਦਹਜ਼ਮੀ ਜਾਂ ਸਫ਼ਰ ਕਰਕੇ ਹੋ ਸਕਦਾ ਹੈ।',
        selfCare: [
          'ਥੋੜ੍ਹਾ-ਥੋੜ੍ਹਾ ਪਾਣੀ ਪੀਓ।',
          'ਅਦਰਕ ਵਾਲੀ ਚਾਹ ਲਓ ਅਤੇ ਹਲਕਾ ਭੋਜਨ ਖਾਓ।'
        ],
        otcInfo: [
          'ਪਾਣੀ ਦੀ ਕਮੀ ਨਾ ਹੋਣ ਦਿਓ।'
        ],
        redFlags: [
          'ਉਲਟੀ ਵਿੱਚ ਖੂਨ ਆਉਣਾ ਜਾਂ ਬਹੁਤ ਜ਼ਿਆਦਾ ਕਮਜ਼ੋਰੀ।'
        ],
        whenToSeeDoctor: [
          'ਜੇਕਰ ਸਮੱਸਿਆ ਨਾ ਘਟੇ ਤਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।'
        ],
        followUpQuestions: [
          'ਇਹ ਸਮੱਸਿਆ ਕਦੋਂ ਤੋਂ ਹੈ?'
        ]
      },
      hinglish: {
        title: 'Managing Mild Nausea & Supportive Care',
        explanation: 'Mild nausea aksar indigestion, motion sickness, dehydration, ya acidity ki wajah se hota hai.',
        selfCare: [
          'Small sips mein cold water ya ORS drink karein.',
          'Ginger tea sip karein.',
          'Bland foods jaise toast ya crackers khayein.',
          'Strong food smells aur greasy items avoid karein.'
        ],
        otcInfo: [
          'Heavy anti-nausea medicines ke bajaye hydration par prioritize karein.'
        ],
        redFlags: [
          '12-24 hours tak fluids retain na kar pana ya vomiting blood.'
        ],
        whenToSeeDoctor: [
          'Agar nausea 48 hours se jyada persist kare toh doctor ko consult karein.'
        ],
        followUpQuestions: [
          'Kya actual vomiting hui hai ya sirf nausea feel ho raha hai?'
        ]
      }
    }
  }
];

export const chatbotService = {
  /**
   * Primary entry point: process a user query in conversational context.
   * 
   * @param {string} userQuery - The raw text entered by the user
   * @param {Object} currentContext - State carried over from previous turns
   * @returns {Promise<Object>} Formatted response with intent, text, hospital items, and updated context
   */
  async processMessage(userQuery, currentContext = {}) {
    const raw = String(userQuery || '').trim();
    if (!raw) {
      const lang = currentContext.language || 'en';
      const emptyMsg = {
        en: "Please enter a question or healthcare topic so I can assist you.",
        hi: "कृपया कोई प्रश्न या स्वास्थ्य संबंधी विषय लिखें ताकि मैं आपकी सहायता कर सकूँ।",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਸਵਾਲ ਜਾਂ ਸਿਹਤ ਸੰਬੰਧੀ ਵਿਸ਼ਾ ਲਿਖੋ ਤਾਂ ਜੋ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਾਂ।",
        hinglish: "Please koi question ya healthcare topic enter karein taaki main aapki help kar sakoon."
      };
      return {
        intent: 'OUT_OF_SCOPE',
        message: emptyMsg[lang] || emptyMsg.en,
        hospitals: [],
        language: lang,
        context: currentContext
      };
    }

    const clean = raw.toLowerCase();

    // Step 1: Detect Language
    const language = this.detectLanguage(clean, raw, currentContext);
    const workingContext = { ...currentContext, language };

    // Step 2: Detect Intent
    const intent = this.detectIntent(clean, raw, workingContext);

    // Step 3: Handle Intent with matched language
    let result;
    switch (intent) {
      case 'OUT_OF_SCOPE':
        result = this.handleOutOfScope(workingContext, language);
        break;

      case 'HEALTH_ADVICE':
      case 'GENERAL_HEALTH_ADVICE':
        result = this.handleHealthAdvice(clean, raw, workingContext, language);
        break;

      case 'HOSPITAL_INFORMATION':
        result = await this.handleHospitalInformation(clean, raw, workingContext, language);
        break;

      case 'HOSPITAL_RECOMMENDATION':
      default:
        result = await this.handleHospitalRecommendation(clean, raw, workingContext, language);
        break;
    }

    return {
      ...result,
      language,
      context: {
        ...(result.context || workingContext),
        language
      }
    };
  },

  /**
   * Automatic language detection supporting English, Hindi, Punjabi, and Hinglish.
   * Maintains language context across follow-up turns when follow-up is ambiguous.
   */
  detectLanguage(clean = '', raw = '', context = {}) {
    const rawText = String(raw || '');
    const cleanText = String(clean || rawText).toLowerCase();

    // 1. Script-based detection
    // Gurmukhi Unicode script: \u0A00-\u0A7F
    if (/[\u0A00-\u0A7F]/.test(rawText)) {
      return 'pa';
    }

    // Devanagari Unicode script: \u0900-\u097F
    if (/[\u0900-\u097F]/.test(rawText)) {
      return 'hi';
    }

    // 2. Explicit switch request phrases
    if (/\b(punjabi|panjabi)\b/i.test(cleanText) || cleanText.includes('ਪੰਜਾਬੀ')) {
      return 'pa';
    }
    if (/\b(hindi)\b/i.test(cleanText) || cleanText.includes('हिन्दी')) {
      return 'hi';
    }
    if (/\b(english)\b/i.test(cleanText)) {
      return 'en';
    }

    // 3. Romanized Punjabi keywords
    const romanPunjabiPattern = /\b(baare|daso|dasso|changa|changi|chahida|chahidi|kehda|kehdi|kehde|vich|wich|kiven|hunda|hundi|hunde|sanu|tuhanu|lai|dass|kithe)\b/i;
    if (romanPunjabiPattern.test(cleanText) || /\bbare\s+daso\b/i.test(cleanText)) {
      return 'pa';
    }

    // 4. Hinglish keywords (Hindi in Roman script)
    const hinglishPattern = /\b(kya|hai|hain|ke|ki|ko|mein|mai|batao|bataiye|chahiye|chaho|hota|hoti|hote|kaunsa|kaunsi|kaunse|kahan|kaha|kidhar|accha|achha|achhi|achhe|paas|mere|meri|mera|mujhe|aapke|aapko|ilaaj|ilaj|aspataal|aspatal|hspatal|karein|karna|karo|nahi|nahin|liye|theek|samasya|dard|dikhao|kripya|bata|kardo)\b/i;
    if (hinglishPattern.test(cleanText)) {
      return 'hinglish';
    }

    // 5. Short / Ambiguous Contextual Follow-up
    // When the follow-up is very brief or contains just a place/number and no English query markers:
    const words = cleanText.split(/\s+/).filter(Boolean);
    const hasEnglishQuestionWord = /\b(what|which|where|how|why|who|is|are|does|do|can|could|would|show|tell|find|list|recommend)\b/i.test(cleanText);
    if (words.length <= 4 && !hasEnglishQuestionWord && context && context.language) {
      return context.language;
    }

    return 'en';
  },

  /**
   * Find if a query references a common mild symptom.
   */
  findSymptom(cleanQuery) {
    const q = String(cleanQuery || '').toLowerCase();
    for (const symptom of MILD_SYMPTOMS) {
      if (symptom.keywords.some(k => q.includes(k))) {
        return symptom;
      }
    }

    // Flexible pattern matching
    if (
      /(headache|head\s*ache)/i.test(q) ||
      (/(sir|sar|head|सिर|ਸਿਰ|माथा)/i.test(q) && /(dard|pain|dukh|दर्द|ਦਰਦ|ਪੀੜ)/i.test(q))
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'headache');
    }

    if (
      (/(stomach|abdominal|belly|tummy)/i.test(q) && /(pain|ache|discomfort|upset|cramp)/i.test(q)) ||
      (/(pet|ਢਿੱਡ|ਪੇਟ|पेट)/i.test(q) && /(dard|pain|dukh|kharab|kharabi|दर्द|ਦਰਦ|ਪੀੜ|खराब)/i.test(q))
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'stomach_ache');
    }

    if (
      /(acidity|heartburn|acid\s*reflux|khatti\s*dakar|एसिडिटी|ਐਸੀਡਿਟੀ)/i.test(q) ||
      (/(seene|sine|pet|छाती|सीने|ਪੇਟ|ਛਾਤੀ)/i.test(q) && /(jalan|सड़न|जलन|ਜਲਣ|gas|गैस|ਗੈਸ)/i.test(q))
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'acidity');
    }

    if (
      /(cold|cough|sardi|zukam|jukam|khasi|khansi|sore\s*throat|runny\s*nose|stuffy\s*nose|सर्दी|जुकाम|खांसी|ਜ਼ੁਕਾਮ|ਖੰਘ)/i.test(q)
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'cold_cough');
    }

    if (
      /(fever|bukhar|hararat|बुखार|ਬੁਖਾਰ)/i.test(q)
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'mild_fever');
    }

    if (
      /(body\s*ache|muscle\s*pain|body\s*pain)/i.test(q) ||
      (/(badan|shareer|शरीर|बदन|ਸਰੀਰ|ਮਾਸਪੇਸ਼ੀ)/i.test(q) && /(dard|pain|dukh|दर्द|ਦਰਦ)/i.test(q))
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'body_ache');
    }

    if (
      /(period\s*pain|period\s*cramp|menstrual|periods?\s*ka\s*dard|मासिक\s*धर्म|ਮਾਹਵਾਰੀ)/i.test(q)
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'menstrual_cramps');
    }

    if (
      /(nausea|queasy|ji\s*michla|jee\s*ghabra|ulti\s*jaisa|मतली|ਜੀ\s*ਕੱਚਾ)/i.test(q)
    ) {
      return MILD_SYMPTOMS.find(s => s.id === 'nausea');
    }

    return null;
  },

  /**
   * Distinguish between the 5 strict healthcare query categories:
   * 1. GENERAL_HEALTH_ADVICE
   * 2. HOSPITAL_INFORMATION
   * 3. HOSPITAL_RECOMMENDATION
   * 4. EMERGENCY_SYMPTOM
   * 5. OUT_OF_SCOPE
   */
  classifyIntent(clean, raw, context = {}) {
    const cleanLower = String(clean || raw || '').toLowerCase();
    if (this.isEmergencyQuery(cleanLower)) {
      return 'EMERGENCY_SYMPTOM';
    }
    const detected = this.detectIntent(cleanLower, raw, context);
    if (detected === 'HEALTH_ADVICE') {
      return 'GENERAL_HEALTH_ADVICE';
    }
    return detected;
  },

  /**
   * Emergency check: identify life-threatening medical queries across all supported languages
   */
  isEmergencyQuery(clean) {
    const cleanLower = String(clean || '').toLowerCase();
    const emergencyWords = [
      'severe chest pain', 'crushing chest pain', 'cannot breathe', 'difficulty breathing',
      'shortness of breath', 'heart attack', 'cardiac arrest', 'stroke', 'unconscious',
      'bleeding heavily', 'heavy bleeding', 'uncontrolled bleeding', 'seizure', 'convulsion',
      'chest pain',
      'face drooping', 'facial droop', 'arm weakness', 'slurred speech', 'speech difficulty',
      'sudden severe headache', 'sudden extremely severe headache', 'thunderclap headache',
      'worst headache of my life', 'headache with weakness', 'headache with numbness',
      'headache after head injury', 'headache after injury', 'headache with confusion',
      'headache with fainting', 'headache with vision loss', 'headache with stiff neck',
      'high fever with stiff neck', 'fever with stiff neck',
      'vomiting blood', 'blood in vomit', 'vomit blood',
      'blood in stool', 'black stool', 'tarry stool',
      'rigid abdomen', 'swollen abdomen', 'hard abdomen',
      'severe abdominal pain with vomiting blood', 'severe stomach pain with vomiting',
      'severe abdominal pain', 'severe stomach pain',
      // Hindi
      'सीने में दर्द', 'सीने में बहुत तेज दर्द', 'सीने में तेज़ दर्द', 'छाती में दर्द',
      'सांस नहीं', 'सांस लेने में तकलीफ', 'सांस फूलना', 'हार्ट अटैक', 'दिल का दौरा',
      'बेहोश', 'बेहोशी', 'खून बह रहा', 'अत्यधिक रक्तस्राव', 'दौरा',
      'सिर दर्द के साथ कमजोरी', 'अचानक तेज सिरदर्द', 'सिर की चोट', 'उल्टी में खून',
      'खून की उल्टी', 'मल में खून', 'काला मल', 'पेट बहुत कड़ा',
      // Punjabi
      'ਛਾਤੀ ਵਿੱਚ ਦਰਦ', 'ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ', 'ਸਾਹ ਨਹੀਂ', 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼',
      'ਦਿਲ ਦਾ ਦੌਰਾ', 'ਬੇਹੋਸ਼', 'ਬੇਹੋਸ਼ੀ', 'ਖੂਨ ਵਹਿ ਰਿਹਾ', 'ਦੌਰੇ',
      'ਸਿਰ ਦਰਦ ਨਾਲ ਕਮਜ਼ੋਰੀ', 'ਅਚਾਨਕ ਤੇਜ਼ ਸਿਰ ਦਰਦ', 'ਉਲਟੀ ਵਿੱਚ ਖੂਨ', 'ਟੱਟੀ ਵਿੱਚ ਖੂਨ',
      // Hinglish
      'chhati mein dard', 'seene mein dard', 'saans nahi', 'tez dard', 'saans lene me dikkat',
      'vomiting blood', 'khoon ki ulti', 'black stool', 'rigid abdomen',
      'sudden severe headache with weakness', 'sar dard with weakness', 'sir dard ke sath kamzori',
      'headache with weakness', 'pet dard ke sath ulti mein khoon'
    ];

    if (emergencyWords.some(w => cleanLower.includes(w))) {
      return true;
    }

    const hasHeadache = cleanLower.includes('headache') || cleanLower.includes('sir dard') || cleanLower.includes('sar dard') || cleanLower.includes('सिर दर्द');
    const hasWeaknessOrNumbness = cleanLower.includes('weakness') || cleanLower.includes('numbness') || cleanLower.includes('kamzori') || cleanLower.includes('कमजोरी');
    if (hasHeadache && (hasWeaknessOrNumbness || cleanLower.includes('stiff neck') || cleanLower.includes('confusion') || cleanLower.includes('fainting') || cleanLower.includes('vision loss') || cleanLower.includes('injury'))) {
      return true;
    }

    const hasStomach = cleanLower.includes('stomach') || cleanLower.includes('abdominal') || cleanLower.includes('pet dard') || cleanLower.includes('पेट दर्द') || cleanLower.includes('belly');
    const hasBleeding = cleanLower.includes('vomiting blood') || cleanLower.includes('blood in vomit') || cleanLower.includes('blood in stool') || cleanLower.includes('black stool') || cleanLower.includes('khoon') || cleanLower.includes('खून');
    if (hasStomach && (hasBleeding || cleanLower.includes('rigid') || cleanLower.includes('fainting') || cleanLower.includes('severe pain with pregnancy'))) {
      return true;
    }

    return false;
  },

  /**
   * Classify user query into one of 4 strict intents:
   * HOSPITAL_INFORMATION, HOSPITAL_RECOMMENDATION, HEALTH_ADVICE, OUT_OF_SCOPE
   */
  detectIntent(clean, raw, context = {}) {
    // 0. Critical Emergency Detection: life-threatening symptoms route directly to health advice emergency protocol
    if (this.isEmergencyQuery(clean)) {
      return 'HEALTH_ADVICE';
    }

    // 1. Explicit Out-of-Scope Detection
    const outOfScopePatterns = [
      /\bpython\b/, /\bjavascript\b/, /\bjava\b/, /\bcode\b/, /\bprogram\b/, /\balgorithm\b/,
      /\breact\b/, /\bhtml\b/, /\bcss\b/, /\bsql\b/, /\bgit\b/, /\bbug\b/,
      /\bweather\b/, /\brecipe\b/, /\bmovie\b/, /\bsong\b/, /\bcricket score\b/,
      /\bpresident\b/, /\bprime minister\b/, /\bcapital of\b/, /\bwho is\b.*\b(actor|actress|singer|politician)\b/
    ];

    if (outOfScopePatterns.some(p => p.test(clean))) {
      return 'OUT_OF_SCOPE';
    }

    // 2. Hospital Information & Comparison Detection
    const infoPhrases = [
      'tell me about', 'about hospital', 'information about', 'details of', 'details about',
      'where is', 'does', 'beds in', 'how many beds in', 'contact of', 'phone number of',
      'address of', 'facilities at', 'compare', 'difference between', 'vs',
      'ke baare mein', 'de baare vich', 'bare daso', 'के बारे में', 'ਬਾਰੇ ਦੱਸੋ'
    ];

    const hasInfoPhrase = infoPhrases.some(p => clean.includes(p));
    const mentionsHospitalName = this.findMentionedHospital(clean) !== null;

    if (
      clean.startsWith('tell me about') ||
      clean.startsWith('information about') ||
      clean.startsWith('details of') ||
      clean.startsWith('where is') ||
      (hasInfoPhrase && (mentionsHospitalName || clean.includes('hospital') || clean.includes('clinic') || clean.includes('institute') || clean.includes('centre') || clean.includes('center') || clean.includes('अस्पताल') || clean.includes('ਹਸਪਤਾਲ')))
    ) {
      return 'HOSPITAL_INFORMATION';
    }

    if (clean.includes('compare') || clean.includes(' vs ') || clean.includes('versus') || clean.includes('ਤੁਲਨਾ') || clean.includes('तुलना')) {
      return 'HOSPITAL_INFORMATION';
    }

    // 3. Explicit Hospital Recommendation Phrases
    const explicitHospitalPhrases = [
      'hospital', 'hospitals', 'clinic', 'clinics', 'centre', 'center', 'institutes', 'nursing home',
      'which hospital', 'best hospital', 'good hospital', 'top hospital', 'recommend hospital', 'find hospital',
      'hospital near', 'hospitals near', 'nearest hospital', 'show hospital', 'show hospitals', 'list hospital',
      'admit', 'admission', 'icu bed', 'emergency room',
      'अस्पताल', 'हस्पताल', 'दवाखाना', 'क्लिनिक', 'कौन सा अस्पताल', 'अच्छा अस्पताल', 'अस्पताल दिखाओ', 'अस्पताल बताओ', 'भर्ती',
      'ਹਸਪਤਾਲ', 'ਕਲੀਨਿਕ', 'ਕਿਹੜਾ ਹਸਪਤਾਲ', 'ਚੰਗਾ ਹਸਪਤਾਲ', 'ਸਭ ਤੋਂ ਵਧੀਆ ਹਸਪਤਾਲ', 'ਹਸਪਤਾਲ ਦੱਸੋ',
      'aspataal', 'aspatal', 'kaunsa hospital', 'accha hospital', 'hospital batao', 'hospital dikhao', 'hospital near me', 'admit hona'
    ];
    const hasExplicitHospitalPhrase = explicitHospitalPhrases.some(p => clean.includes(p));

    // Tertiary surgical / cancer / transplant conditions that inherently require specialized hospital discovery:
    const tertiaryProcedures = [
      'brain surgery', 'neurosurgery', 'craniotomy', 'brain tumor', 'brain tumour',
      'cancer', 'chemo', 'chemotherapy', 'radiation therapy', 'oncology', 'kidney cancer',
      'transplant', 'kidney transplant', 'renal transplant', 'liver transplant',
      'bypass surgery', 'angioplasty', 'open heart surgery', 'cardiac surgery',
      'dialysis center', 'dialysis centre', 'hemodialysis center',
      'joint replacement', 'knee replacement', 'hip replacement',
      'कैंसर', 'कीमोथेरेपी', 'ब्रेन सर्जरी', 'किडनी ट्रांसप्लांट',
      'ਕੈਂਸਰ', 'ਕੀਮੋਥੈਰੇਪੀ', 'ਦਿਮਾਗ ਦਾ ਆਪਰੇਸ਼ਨ'
    ];
    const hasTertiaryProcedure = tertiaryProcedures.some(p => clean.includes(p));

    // 4. Mild Symptoms & Health Advice Check
    const matchedSymptom = this.findSymptom(clean);
    const matchedHealthTopic = this.findHealthTopic(clean);

    const healthQuestionStarters = [
      'what is', 'what are', 'explain', 'how does', 'symptoms of', 'signs of',
      'causes of', 'treatment for', 'how to prevent', 'is it normal', 'when to see a doctor',
      'when should i see', 'why does', 'can you explain', 'what can i take', 'what should i do',
      'how to cure', 'how to treat', 'home remedy', 'remedy for', 'remedies for', 'medicine for',
      'kya hota hai', 'kya hoti hai', 'kya hai', 'kya karein', 'kya karu', 'kya lein',
      'ਕੀ ਹੁੰਦਾ ਹੈ', 'ਕੀ ਹੁੰਦੀ ਹੈ', 'ਕੀ ਹੈ', 'ਕੀ ਕਰੀਏ', 'ਕੀ ਕਰਾਂ', 'ਕੀ ਲਈਏ',
      'क्या होता है', 'क्या होती है', 'क्या है', 'क्या करें', 'क्या करूँ', 'क्या लें'
    ];
    const isHealthQuestion = healthQuestionStarters.some(s => clean.startsWith(s) || clean.includes(s));

    // Rule: Common mild symptoms without explicit hospital query MUST route to HEALTH_ADVICE
    if (matchedSymptom) {
      if (hasExplicitHospitalPhrase || (hasTertiaryProcedure && hasExplicitHospitalPhrase)) {
        return 'HOSPITAL_RECOMMENDATION';
      }
      return 'HEALTH_ADVICE';
    }

    if ((isHealthQuestion || matchedHealthTopic) && !hasExplicitHospitalPhrase && !hasTertiaryProcedure) {
      return 'HEALTH_ADVICE';
    }

    // 5. Hospital Recommendation & Discovery Detection
    const hasCategory = this.extractCategoryFromQuery(clean) !== null;
    const hasBudget = parseBudget(clean) !== null;
    const hasLocation = this.extractLocation(clean) !== null;

    if (hasExplicitHospitalPhrase || hasTertiaryProcedure) {
      return 'HOSPITAL_RECOMMENDATION';
    }

    if (hasCategory || hasBudget || hasLocation) {
      return 'HOSPITAL_RECOMMENDATION';
    }

    // 6. Follow-up query in an existing hospital recommendation context
    if (context.lastIntent === 'HOSPITAL_RECOMMENDATION' && (hasLocation || hasBudget || clean.length < 30)) {
      return 'HOSPITAL_RECOMMENDATION';
    }
    if (context.lastIntent === 'HEALTH_ADVICE' && !hasExplicitHospitalPhrase) {
      return 'HEALTH_ADVICE';
    }

    // 7. Generic medical terms default to HEALTH_ADVICE if recognized topic, else OUT_OF_SCOPE
    if (matchedHealthTopic) {
      return 'HEALTH_ADVICE';
    }

    return 'OUT_OF_SCOPE';
  },

  /**
   * Helper to resolve national category supporting Gurmukhi and Devanagari terms.
   */
  extractCategoryFromQuery(cleanQuery) {
    let q = cleanQuery;
    if (q.includes('ਗੁਰਦ') || q.includes('गुर्दा') || q.includes('gurda')) q += ' kidney';
    if (q.includes('ਦਿਲ') || q.includes('दिल')) q += ' heart';
    if (q.includes('ਕੈਂਸਰ') || q.includes('कैंसर')) q += ' cancer';
    if (q.includes('ਦਿਮਾਗ') || q.includes('दिमाग')) q += ' brain surgery';
    if (q.includes('ਡਾਇਲਿਸਿਸ') || q.includes('ਡਾਇਲਸਿਸ') || q.includes('डायलिसिस')) q += ' dialysis';

    return resolveNationalCategory('', '', q);
  },

  /**
   * Find if a query references an educational health topic.
   */
  findHealthTopic(cleanQuery) {
    for (const topic of HEALTH_TOPICS) {
      if (topic.keywords.some(k => cleanQuery.includes(k))) {
        return topic;
      }
    }
    return null;
  },

  /**
   * Check if a query mentions a specific known hospital name.
   */
  findMentionedHospital(cleanQuery) {
    // 1. Check National Reference dataset
    for (const cat of Object.values(NATIONAL_HOSPITAL_REFERENCES)) {
      for (const h of cat.hospitals) {
        const nameLower = h.name.toLowerCase();
        const shortName = nameLower.split('—')[0].trim();
        if (cleanQuery.includes(nameLower) || cleanQuery.includes(shortName)) {
          return h;
        }
      }
    }

    // 2. Check local HOSPITALS dataset
    for (const h of HOSPITALS) {
      const nameLower = h.name.toLowerCase();
      const short = (h.shortName || '').toLowerCase();
      if (cleanQuery.includes(nameLower) || (short && cleanQuery.includes(short))) {
        return h;
      }
    }

    // Common abbreviations and multilingual hospital names
    if (cleanQuery.includes('aiims') || cleanQuery.includes('एम्स') || cleanQuery.includes('ਏਮਜ਼')) return getNationalReferenceHospitalById('ref_kidney_1');
    if (cleanQuery.includes('pgimer') || cleanQuery.includes('pgi') || cleanQuery.includes('पीजीआई') || cleanQuery.includes('ਪੀਜੀਆਈ')) return getNationalReferenceHospitalById('ref_kidney_2');
    if (cleanQuery.includes('cmc') || cleanQuery.includes('vellore') || cleanQuery.includes('ਵੇਲੋਰ')) return getNationalReferenceHospitalById('ref_kidney_3');
    if (cleanQuery.includes('medanta') || cleanQuery.includes('मेदांता') || cleanQuery.includes('ਮੇਦਾਂਤਾ')) return getNationalReferenceHospitalById('ref_heart_1');
    if (cleanQuery.includes('tata memorial') || cleanQuery.includes('tmh') || cleanQuery.includes('टाटा')) return getNationalReferenceHospitalById('ref_cancer_1');
    if (cleanQuery.includes('nimhans') || cleanQuery.includes('निमहांस')) return getNationalReferenceHospitalById('ref_brain_surgery_2');
    if (cleanQuery.includes('apollo') || cleanQuery.includes('अपोलो') || cleanQuery.includes('ਅਪੋਲੋ')) return getNationalReferenceHospitalById('ref_heart_3');

    return null;
  },

  /**
   * Extract location from query text (local or national).
   */
  extractLocation(cleanQuery) {
    // Local / National cities check in English
    for (const city of [...LOCAL_CITIES, ...NATIONAL_CITIES]) {
      const pattern = new RegExp(`\\b${city}\\b`, 'i');
      if (pattern.test(cleanQuery)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }

    // Check Hindi/Punjabi localized city names
    const cityTranslations = {
      'चंडीगढ़': 'Chandigarh',
      'ਚੰਡੀਗੜ੍ਹ': 'Chandigarh',
      'मोहाली': 'Mohali',
      'ਮੋਹਾਲੀ': 'Mohali',
      'पंचकुला': 'Panchkula',
      'ਪੰਚਕੂਲਾ': 'Panchkula',
      'लुधियाना': 'Ludhiana',
      'ਲੁਧਿਆਣਾ': 'Ludhiana',
      'जालंधर': 'Jalandhar',
      'ਜਲੰਧਰ': 'Jalandhar',
      'होशियारपुर': 'Hoshiarpur',
      'ਹੁਸ਼ਿਆਰਪੁਰ': 'Hoshiarpur',
      'दिल्ली': 'Delhi',
      'ਦਿੱਲੀ': 'Delhi',
      'नई दिल्ली': 'New Delhi',
      'ਨਵੀਂ ਦਿੱਲੀ': 'New Delhi',
      'मुंबई': 'Mumbai',
      'ਮੁੰਬਈ': 'Mumbai'
    };

    for (const [nativeCity, engCity] of Object.entries(cityTranslations)) {
      if (cleanQuery.includes(nativeCity.toLowerCase())) {
        return engCity;
      }
    }

    return null;
  },

  /**
   * Handle OUT_OF_SCOPE queries safely and politely in user's language.
   */
  handleOutOfScope(context = {}, lang = 'en') {
    const text = MULTILINGUAL_OUT_OF_SCOPE[lang] || OUT_OF_SCOPE_RESPONSE;
    return {
      intent: 'OUT_OF_SCOPE',
      message: text,
      hospitals: [],
      language: lang,
      context: { ...context, language: lang }
    };
  },

  /**
   * Dedicated Emergency Advice Protocol for critical red-flag symptoms.
   */
  handleEmergencyAdvice(cleanQuery, rawQuery, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    const titles = {
      en: '🚨 Urgent Medical Alert — Seek Emergency Care Immediately',
      hi: '🚨 आपातकालीन चिकित्सा चेतावनी — तुरंत आपातकालीन सहायता लें',
      pa: '🚨 ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਚੇਤਾਵਨੀ — ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ',
      hinglish: '🚨 Urgent Medical Alert — Turant Emergency Care Lein'
    };

    const lines = {
      en: [
        `### ${titles.en}`,
        '',
        `**The symptoms you described may indicate a serious medical emergency requiring immediate professional intervention.**`,
        '',
        '**Immediate Actions to Take Right Now:**',
        '• **Call Emergency Services Immediately:** In India, dial **112 / 108** (National Emergency / Ambulance) or 102.',
        '• **Go to the Nearest Emergency Department / Hospital:** Do not wait to see if symptoms improve. If possible, have someone drive you immediately.',
        '• **Do NOT Self-Medicate:** Do not take routine home remedies or over-the-counter painkillers, as this can mask critical diagnostic signs or worsen internal conditions.',
        '• **Stay Calm and Rest:** Keep the person seated or comfortably positioned while waiting for medical responders.',
        '',
        '*If you need help locating nearby 24x7 emergency facilities, you can also use Sehat_Sathi\'s Emergency Mode.*',
        '',
        `*${disclaimers.MEDICAL}*`
      ],
      hi: [
        `### ${titles.hi}`,
        '',
        `**आपके द्वारा बताए गए लक्षण किसी गंभीर मेडिकल इमरजेंसी का संकेत हो सकते हैं, जिसके लिए तुरंत डॉक्टरी जांच और इलाज की आवश्यकता है।**`,
        '',
        '**तत्काल उठाए जाने वाले आवश्यक कदम:**',
        '• **तुरंत आपातकालीन नंबर पर कॉल करें:** भारत में तुरंत **112 / 108** (राष्ट्रीय आपातकाल / एम्बुलेंस सेवा) या 102 पर कॉल करें।',
        '• **नजदीकी अस्पताल के आपातकालीन कक्ष (Emergency Room) जाएं:** लक्षणों के ठीक होने का इंतजार न करें। तुरंत किसी के साथ नजदीकी अस्पताल पहुंचें।',
        '• **खुद से कोई दवा न लें:** कोई भी पेनकिलर या घरेलू नुस्खा न लें, क्योंकि इससे स्थिति और बिगड़ सकती है या असली बीमारी छिप सकती है।',
        '• **मरीज को शांत और स्थिर रखें:** एम्बुलेंस आने तक मरीज को आराम की स्थिति में रखें।',
        '',
        '*नजदीकी 24x7 आपातकालीन अस्पताल देखने के लिए आप सेहत_साथी के इमरजेंसी मोड (Emergency Mode) का भी उपयोग कर सकते हैं।*',
        '',
        `*${disclaimers.MEDICAL}*`
      ],
      pa: [
        `### ${titles.pa}`,
        '',
        `**ਤੁਹਾਡੇ ਦੱਸੇ ਗਏ ਲੱਛਣ ਕਿਸੇ ਗੰਭੀਰ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰ ਸਕਦੇ ਹਨ, ਜਿਸ ਲਈ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਜ਼ਰੂਰੀ ਹੈ।**`,
        '',
        '**ਤੁਰੰਤ ਕੀਤੇ ਜਾਣ ਵਾਲੇ ਜ਼ਰੂਰੀ ਕਦਮ:**',
        '• **ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ ਤੇ ਕਾਲ ਕਰੋ:** ਭਾਰਤ ਵਿੱਚ **112 / 108** (ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ / ਐਂਬੂਲੈਂਸ) ਜਾਂ 102 ਡਾਇਲ ਕਰੋ।',
        '• **ਨੇੜਲੇ ਹਸਪਤਾਲ ਦੀ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਜਾਓ:** ਬਿਲਕੁਲ ਦੇਰੀ ਨਾ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਹਸਪਤਾਲ ਪਹੁੰਚੋ।',
        '• **ਆਪਣੇ ਆਪ ਕੋਈ ਦਵਾਈ ਨਾ ਲਓ:** ਕੋਈ ਵੀ ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈ ਜਾਂ ਘਰੇਲੂ ਨੁਸਖ਼ਾ ਨਾ ਵਰਤੋ।',
        '• **ਮਰੀਜ਼ ਨੂੰ ਆਰਾਮ ਨਾਲ ਬਿਠਾਓ:** ਐਂਬੂਲੈਂਸ ਆਉਣ ਤੱਕ ਮਰੀਜ਼ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖੋ।',
        '',
        '*ਨੇੜਲੇ 24x7 ਐਮਰਜੈਂਸੀ ਹਸਪਤਾਲ ਲੱਭਣ ਲਈ ਸਿਹਤ_ਸਾਥੀ ਦੇ ਐਮਰਜੈਂਸੀ ਮੋਡ ਦੀ ਵਰਤੋਂ ਕਰੋ।*',
        '',
        `*${disclaimers.MEDICAL}*`
      ],
      hinglish: [
        `### ${titles.hinglish}`,
        '',
        `**Aapke bataye symptoms kisi serious medical emergency ka sign ho sakte hain jisme immediately medical attention zaroori hai.**`,
        '',
        '**Immediate Steps to Take Right Now:**',
        '• **Emergency Services ko Turant Call Karein:** India mein dial **112 / 108** (National Emergency / Ambulance) ya 102.',
        '• **Nearest Hospital Emergency Room Jayein:** Symptoms theek hone ka wait bilkul na karein. Kisi ke sath turant nearest hospital jayein.',
        '• **Self-Medication Bilkul Na Karein:** Koi bhi painkillers ya home remedies na lein, yeh internal bleeding ya critical conditions ko mask kar sakti hain.',
        '• **Calm aur Comfortable Position Maintain Karein:** Help arrive hone tak patient ko rest position mein rakhein.',
        '',
        '*Nearest 24x7 emergency facilities dekhne ke liye aap Sehat_Sathi ka Emergency Mode bhi use kar sakte hain.*',
        '',
        `*${disclaimers.MEDICAL}*`
      ]
    };

    return {
      intent: 'HEALTH_ADVICE',
      detailedIntent: 'EMERGENCY_SYMPTOM',
      isEmergency: true,
      message: (lines[lang] || lines.en).join('\n'),
      hospitals: [],
      language: lang,
      disclaimer: disclaimers.MEDICAL,
      context: { ...context, lastIntent: 'HEALTH_ADVICE', language: lang }
    };
  },

  /**
   * Format structured mild symptom guidance response.
   */
  formatMildSymptomResponse(symptom, cleanQuery, context = {}, lang = 'en') {
    const data = (symptom.translations && symptom.translations[lang]) || symptom.translations.en;
    const disclaimer = MILD_HEALTH_DISCLAIMER[lang] || MILD_HEALTH_DISCLAIMER.en;

    const labels = {
      en: {
        selfCare: 'Practical Self-Care (Non-Drug First):',
        otc: 'Over-the-Counter (OTC) Medicine Information:',
        redFlags: '🚨 Red-Flag Symptoms (Seek Immediate Emergency Care):',
        whenToSeeDoctor: 'When to Consult a Doctor:',
        followUp: 'Helpful Questions to Consider:'
      },
      hi: {
        selfCare: 'व्यवहारिक प्राथमिक देखभाल (बिना दवा के):',
        otc: 'सामान्य ओटीसी दवा संबंधी जानकारी (OTC Medicine Information):',
        redFlags: '🚨 गंभीर आपातकालीन लक्षण (तुरंत इमरजेंसी सहायता लें):',
        whenToSeeDoctor: 'डॉक्टर से परामर्श कब लें:',
        followUp: 'कुछ महत्वपूर्ण बातें जिनका ध्यान रखें:'
      },
      pa: {
        selfCare: 'ਮੁੱਢਲੀ ਦੇਖਭਾਲ (ਬਿਨਾਂ ਦਵਾਈ ਤੋਂ):',
        otc: 'ਆਮ ਦਵਾਈ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ (OTC Medicine Information):',
        redFlags: '🚨 ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ ਲੱਛਣ (ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਲਓ):',
        whenToSeeDoctor: 'ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਕਦੋਂ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ:',
        followUp: 'ਕੁਝ ਜ਼ਰੂਰੀ ਸਵਾਲ ਜੋ ਧਿਆਨ ਵਿੱਚ ਰੱਖੋ:'
      },
      hinglish: {
        selfCare: 'Practical Self-Care (Non-Drug First):',
        otc: 'Over-the-Counter (OTC) Medicine Information:',
        redFlags: '🚨 Red-Flag Symptoms (Seek Immediate Emergency Care):',
        whenToSeeDoctor: 'Doctor ko kab consult karein:',
        followUp: 'Helpful Questions to Consider:'
      }
    }[lang] || labels.en;

    const lines = [
      `### ${data.title}`,
      '',
      data.explanation,
      '',
      `**${labels.selfCare}**`
    ];

    data.selfCare.forEach(sc => lines.push(`• ${sc}`));

    if (data.otcInfo && data.otcInfo.length > 0) {
      lines.push('');
      lines.push(`**${labels.otc}**`);
      data.otcInfo.forEach(info => lines.push(`• ${info}`));
    }

    if (data.redFlags && data.redFlags.length > 0) {
      lines.push('');
      lines.push(`**${labels.redFlags}**`);
      data.redFlags.forEach(rf => lines.push(`• ${rf}`));
    }

    if (data.whenToSeeDoctor && data.whenToSeeDoctor.length > 0) {
      lines.push('');
      lines.push(`**${labels.whenToSeeDoctor}**`);
      data.whenToSeeDoctor.forEach(doc => lines.push(`• ${doc}`));
    }

    if (data.followUpQuestions && data.followUpQuestions.length > 0) {
      lines.push('');
      lines.push(`**${labels.followUp}**`);
      data.followUpQuestions.forEach(q => lines.push(`• ${q}`));
    }

    lines.push('');
    lines.push(`*${disclaimer}*`);

    return {
      intent: 'HEALTH_ADVICE',
      detailedIntent: 'GENERAL_HEALTH_ADVICE',
      symptomId: symptom.id,
      title: data.title,
      message: lines.join('\n'),
      hospitals: [],
      language: lang,
      disclaimer: disclaimer,
      context: { ...context, lastIntent: 'HEALTH_ADVICE', symptomId: symptom.id, language: lang }
    };
  },

  /**
   * Format structured educational health topic response.
   */
  formatHealthTopicResponse(topic, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    let content = {
      title: topic.title,
      summary: topic.summary,
      details: topic.details,
      whenToSeeDoctor: topic.whenToSeeDoctor
    };

    if (lang !== 'en' && topic.translations && topic.translations[lang]) {
      const tr = topic.translations[lang];
      content = {
        title: tr.title || topic.title,
        summary: tr.summary || topic.summary,
        details: tr.details || topic.details,
        whenToSeeDoctor: tr.whenToSeeDoctor || topic.whenToSeeDoctor
      };
    }

    const keyPointsLabel = {
      en: 'Key Points:',
      hi: 'मुख्य बिंदु (Key Points):',
      pa: 'ਮੁੱਖ ਨੁਕਤੇ (Key Points):',
      hinglish: 'Key Points:'
    }[lang] || 'Key Points:';

    const doctorLabel = {
      en: 'When to see a doctor:',
      hi: 'डॉक्टर से कब मिलें (When to see a doctor):',
      pa: 'ਡਾਕਟਰ ਨੂੰ ਕਦੋਂ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ:',
      hinglish: 'Doctor ko kab consult karein:'
    }[lang] || 'When to see a doctor:';

    const lines = [
      `### ${content.title}`,
      '',
      content.summary,
      '',
      `**${keyPointsLabel}**`
    ];

    content.details.forEach(pt => lines.push(`• ${pt}`));

    if (content.whenToSeeDoctor) {
      lines.push('');
      lines.push(`**${doctorLabel}**`);
      lines.push(content.whenToSeeDoctor);
    }

    lines.push('');
    lines.push(`*${disclaimers.MEDICAL}*`);

    return {
      intent: 'HEALTH_ADVICE',
      detailedIntent: 'GENERAL_HEALTH_ADVICE',
      title: content.title,
      message: lines.join('\n'),
      hospitals: [],
      language: lang,
      disclaimer: disclaimers.MEDICAL,
      context: { ...context, lastIntent: 'HEALTH_ADVICE', healthTopic: topic.id, language: lang }
    };
  },

  /**
   * Handle HEALTH_ADVICE educational answers with multilingual content.
   */
  handleHealthAdvice(cleanQuery, rawQuery, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    // 1. Emergency check
    if (this.isEmergencyQuery(cleanQuery)) {
      return this.handleEmergencyAdvice(cleanQuery, rawQuery, context, lang);
    }

    // 2. Check for mild symptom
    const symptom = this.findSymptom(cleanQuery);
    if (symptom) {
      return this.formatMildSymptomResponse(symptom, cleanQuery, context, lang);
    }

    // 3. Check for educational health topic
    const topic = this.findHealthTopic(cleanQuery);
    if (topic) {
      return this.formatHealthTopicResponse(topic, context, lang);
    }

    // 4. General fallback
    const generalLines = {
      en: `I can provide general educational healthcare guidance. For specific symptoms, medical diagnosis, or personalized treatment plans, please consult a qualified physician or specialist.\n\n${disclaimers.MEDICAL}`,
      hi: `मैं सामान्य शैक्षणिक स्वास्थ्य मार्गदर्शन प्रदान कर सकता हूँ। विशिष्ट लक्षणों, डॉक्टरी निदान या उपचार योजना के लिए कृपया किसी योग्य चिकित्सक (Doctor) से परामर्श लें।\n\n${disclaimers.MEDICAL}`,
      pa: `ਮੈਂ ਆਮ ਸਿੱਖਿਆਤਮਕ ਸਿਹਤ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰ ਸਕਦਾ ਹਾਂ। ਵਿਸ਼ੇਸ਼ ਲੱਛਣਾਂ ਜਾਂ ਇਲਾਜ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਕਿਸੇ ਯੋਗ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।\n\n${disclaimers.MEDICAL}`,
      hinglish: `Main general educational healthcare guidance provide kar sakta hoon. Specific symptoms, medical diagnosis, ya treatment ke liye please qualified doctor se consult karein.\n\n${disclaimers.MEDICAL}`
    };

    return {
      intent: 'HEALTH_ADVICE',
      detailedIntent: 'GENERAL_HEALTH_ADVICE',
      message: generalLines[lang] || generalLines.en,
      hospitals: [],
      language: lang,
      disclaimer: disclaimers.MEDICAL,
      context: { ...context, lastIntent: 'HEALTH_ADVICE', language: lang }
    };
  },

  /**
   * Handle HOSPITAL_INFORMATION: Specific queries about an institution or side-by-side comparison.
   */
  async handleHospitalInformation(cleanQuery, rawQuery, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    // Check if user is asking for a comparison
    if (cleanQuery.includes('compare') || cleanQuery.includes(' vs ') || cleanQuery.includes('versus') || cleanQuery.includes('ਤੁਲਨਾ') || cleanQuery.includes('तुलना')) {
      return this.handleHospitalComparison(cleanQuery, context, lang);
    }

    const hospital = this.findMentionedHospital(cleanQuery);

    if (!hospital) {
      const notFoundMsgs = {
        en: "Data not available in the current Sehat_Sathi dataset. Please specify a hospital name such as AIIMS, PGIMER, CMC Vellore, Medanta, or Tata Memorial.",
        hi: "वर्तमान सेहत_साथी डेटासेट में यह जानकारी उपलब्ध नहीं है। कृपया AIIMS, PGIMER, CMC Vellore, Medanta, या Tata Memorial जैसे अस्पताल का नाम बताएं।",
        pa: "ਮੌਜੂਦਾ ਸਿਹਤ_ਸਾਥੀ ਡਾਟਾਸੈੱਟ ਵਿੱਚ ਇਹ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ AIIMS, PGIMER, CMC Vellore, Medanta, ਜਾਂ Tata Memorial ਵਰਗੇ ਹਸਪਤਾਲ ਦਾ ਨਾਮ ਦੱਸੋ।",
        hinglish: "Current Sehat_Sathi dataset mein yeh data available nahi hai. Please AIIMS, PGIMER, CMC Vellore, Medanta, ya Tata Memorial jaise hospital ka name mention karein."
      };

      return {
        intent: 'HOSPITAL_INFORMATION',
        message: notFoundMsgs[lang] || notFoundMsgs.en,
        hospitals: [],
        language: lang,
        disclaimer: disclaimers.PROTOTYPE,
        context: { ...context, lastIntent: 'HOSPITAL_INFORMATION', language: lang }
      };
    }

    const labels = {
      en: {
        loc: 'Location',
        type: 'Type',
        spec: 'Specialty Focus',
        beds: 'Beds',
        em: '24x7 Emergency',
        fac: 'Key Facilities',
        acc: 'Accreditation',
        contact: 'Contact',
        emContact: 'Emergency Helpline',
        emYes: '✅ Available around the clock',
        emNo: '⚠️ Not available 24x7'
      },
      hi: {
        loc: 'स्थान (Location)',
        type: 'प्रकार (Type)',
        spec: 'विशेषज्ञता (Specialty)',
        beds: 'कुल बेड (Beds)',
        em: '24x7 आपातकालीन सेवा',
        fac: 'प्रमुख सुविधाएं',
        acc: 'मान्यता (Accreditation)',
        contact: 'संपर्क',
        emContact: 'आपातकालीन हेल्पलाइन',
        emYes: '✅ 24x7 उपलब्ध',
        emNo: '⚠️ 24x7 उपलब्ध नहीं'
      },
      pa: {
        loc: 'ਸਥਾਨ (Location)',
        type: 'ਕਿਸਮ (Type)',
        spec: 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ (Specialty)',
        beds: 'ਕੁੱਲ ਬੈੱਡ (Beds)',
        em: '24x7 ਐਮਰਜੈਂਸੀ',
        fac: 'ਮੁੱਖ ਸਹੂਲਤਾਂ',
        acc: 'ਮਾਨਤਾ (Accreditation)',
        contact: 'ਸੰਪਰਕ',
        emContact: 'ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ',
        emYes: '✅ 24x7 ਉਪਲਬਧ',
        emNo: '⚠️ 24x7 ਉਪਲਬਧ ਨਹੀਂ'
      },
      hinglish: {
        loc: 'Location',
        type: 'Type',
        spec: 'Specialty',
        beds: 'Total Beds',
        em: '24x7 Emergency',
        fac: 'Key Facilities',
        acc: 'Accreditation',
        contact: 'Contact',
        emContact: 'Emergency Helpline',
        emYes: '✅ Available 24x7',
        emNo: '⚠️ Not 24x7'
      }
    }[lang] || labels.en;

    const lines = [
      `### ${hospital.fullName || hospital.name}`,
      `**${labels.loc}:** ${hospital.city}, ${hospital.state || 'India'} ${hospital.location?.address ? `(${hospital.location.address})` : ''}`,
      `**${labels.type}:** ${hospital.type || 'Apex Healthcare Institution'}`,
      `**${labels.spec}:** ${hospital.specialty || (hospital.specialties || []).join(', ')}`,
      `**${labels.beds}:** ${hospital.beds ? hospital.beds.toLocaleString('en-IN') : 'Information not recorded'} ${hospital.icuBeds ? `(ICU: ${hospital.icuBeds})` : ''}`,
      `**${labels.em}:** ${hospital.emergency24x7 ? labels.emYes : labels.emNo}`,
      `**${labels.fac}:** ${(hospital.facilities || []).map(f => f.toUpperCase().replace('_', ' ')).join(', ')}`,
      `**${labels.acc}:** ${(hospital.accreditation || []).join(', ') || 'Recognized Centre'}`,
      hospital.phone ? `**${labels.contact}:** ${hospital.phone}` : '',
      hospital.emergencyPhone ? `**${labels.emContact}:** ${hospital.emergencyPhone}` : '',
      '',
      hospital.overview ? `*${hospital.overview}*` : '',
      '',
      `*${disclaimers.PROTOTYPE}*`
    ].filter(Boolean);

    return {
      intent: 'HOSPITAL_INFORMATION',
      hospital,
      hospitals: [hospital],
      message: lines.join('\n'),
      language: lang,
      disclaimer: disclaimers.PROTOTYPE,
      context: {
        ...context,
        lastIntent: 'HOSPITAL_INFORMATION',
        hospitalReferenced: hospital.name,
        language: lang
      }
    };
  },

  /**
   * Handle side-by-side hospital comparison.
   */
  handleHospitalComparison(cleanQuery, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    const mentioned = [];
    const checkNames = [
      { key: 'aiims', name: 'AIIMS — New Delhi', id: 'ref_kidney_1' },
      { key: 'एम्स', name: 'AIIMS — New Delhi', id: 'ref_kidney_1' },
      { key: 'ਏਮਜ਼', name: 'AIIMS — New Delhi', id: 'ref_kidney_1' },
      { key: 'pgimer', name: 'PGIMER — Chandigarh', id: 'ref_kidney_2' },
      { key: 'pgi', name: 'PGIMER — Chandigarh', id: 'ref_kidney_2' },
      { key: 'पीजीआई', name: 'PGIMER — Chandigarh', id: 'ref_kidney_2' },
      { key: 'ਪੀਜੀਆਈ', name: 'PGIMER — Chandigarh', id: 'ref_kidney_2' },
      { key: 'cmc', name: 'CMC Vellore — Vellore', id: 'ref_kidney_3' },
      { key: 'vellore', name: 'CMC Vellore — Vellore', id: 'ref_kidney_3' },
      { key: 'medanta', name: 'Medanta — Gurugram', id: 'ref_heart_1' },
      { key: 'मेदांता', name: 'Medanta — Gurugram', id: 'ref_heart_1' },
      { key: 'ਮੇਦਾਂਤਾ', name: 'Medanta — Gurugram', id: 'ref_heart_1' },
      { key: 'tata', name: 'Tata Memorial Hospital — Mumbai', id: 'ref_cancer_1' },
      { key: 'टाटा', name: 'Tata Memorial Hospital — Mumbai', id: 'ref_cancer_1' },
      { key: 'nimhans', name: 'NIMHANS — Bengaluru', id: 'ref_brain_surgery_2' },
      { key: 'apollo', name: 'Apollo Hospitals — Chennai', id: 'ref_heart_3' },
      { key: 'अपोलो', name: 'Apollo Hospitals — Chennai', id: 'ref_heart_3' },
      { key: 'ਅਪੋਲੋ', name: 'Apollo Hospitals — Chennai', id: 'ref_heart_3' }
    ];

    for (const item of checkNames) {
      if (cleanQuery.includes(item.key) && !mentioned.some(m => m.id === item.id)) {
        const found = getNationalReferenceHospitalById(item.id) || HOSPITALS.find(h => h.name.toLowerCase().includes(item.key));
        if (found) mentioned.push(found);
      }
    }

    if (mentioned.length < 2) {
      const promptMsgs = {
        en: "To compare hospitals, please mention two institutions from our dataset (e.g., *'Compare AIIMS and PGIMER'* or *'Compare Medanta and Apollo'*).",
        hi: "अस्पतालों की तुलना करने के लिए, कृपया हमारे डेटासेट से दो संस्थानों के नाम बताएं (जैसे *'Compare AIIMS and PGIMER'* या *'एम्स और पीजीआई की तुलना'* )।",
        pa: "ਹਸਪਤਾਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਦੋ ਹਸਪਤਾਲਾਂ ਦੇ ਨਾਮ ਦੱਸੋ (ਜਿਵੇਂ *'Compare AIIMS and PGIMER'* ਜਾਂ *'ਏਮਜ਼ ਅਤੇ ਪੀਜੀਆਈ ਦੀ ਤੁਲਨਾ'* )।",
        hinglish: "Hospitals compare karne ke liye please dataset se do institutions mention karein (e.g. *'Compare AIIMS and PGIMER'* ya *'Medanta vs Apollo'*)."
      };

      return {
        intent: 'HOSPITAL_INFORMATION',
        message: promptMsgs[lang] || promptMsgs.en,
        hospitals: [],
        language: lang,
        disclaimer: disclaimers.PROTOTYPE,
        context: { ...context, language: lang }
      };
    }

    const [h1, h2] = mentioned;

    const titlePrefix = {
      en: 'Comparison',
      hi: 'तुलना (Comparison)',
      pa: 'ਤੁਲਨਾ (Comparison)',
      hinglish: 'Comparison'
    }[lang] || 'Comparison';

    const vsWord = {
      en: 'vs',
      hi: 'बनाम',
      pa: 'ਬਨਾਮ',
      hinglish: 'vs'
    }[lang] || 'vs';

    const lines = [
      `### ${titlePrefix}: ${h1.name} ${vsWord} ${h2.name}`,
      '',
      `| Metric | ${h1.name} | ${h2.name} |`,
      `| :--- | :--- | :--- |`,
      `| **City / State** | ${h1.city}, ${h1.state || ''} | ${h2.city}, ${h2.state || ''} |`,
      `| **Total Beds** | ${h1.beds ? h1.beds.toLocaleString('en-IN') : 'N/A'} | ${h2.beds ? h2.beds.toLocaleString('en-IN') : 'N/A'} |`,
      `| **ICU Beds** | ${h1.icuBeds || 'Available'} | ${h2.icuBeds || 'Available'} |`,
      `| **24x7 Emergency** | ${h1.emergency24x7 ? 'Yes' : 'No'} | ${h2.emergency24x7 ? 'Yes' : 'No'} |`,
      `| **Primary Focus** | ${h1.specialty || (h1.specialties || []).slice(0, 2).join(', ')} | ${h2.specialty || (h2.specialties || []).slice(0, 2).join(', ')} |`,
      `| **Accreditation** | ${(h1.accreditation || []).slice(0, 2).join(', ')} | ${(h2.accreditation || []).slice(0, 2).join(', ')} |`,
      '',
      `*${disclaimers.PROTOTYPE}*`
    ];

    return {
      intent: 'HOSPITAL_INFORMATION',
      hospitals: [h1, h2],
      message: lines.join('\n'),
      language: lang,
      disclaimer: disclaimers.PROTOTYPE,
      context: {
        ...context,
        lastIntent: 'HOSPITAL_INFORMATION',
        hospitalsCompared: [h1.id, h2.id],
        language: lang
      }
    };
  },

  /**
   * Handle HOSPITAL_RECOMMENDATION: Finding hospitals with multi-turn conversational context in user's language.
   */
  async handleHospitalRecommendation(cleanQuery, rawQuery, context = {}, lang = 'en') {
    const disclaimers = MULTILINGUAL_DISCLAIMERS[lang] || MULTILINGUAL_DISCLAIMERS.en;

    // 1. Merge Context: condition, location, budget, procedure
    const detectedCategory = this.extractCategoryFromQuery(cleanQuery);
    const detectedCondition = detectedCategory || normalizeCondition(cleanQuery)?.condition || null;
    const detectedProcedure = matchProcedure(cleanQuery)?.id || null;
    const detectedBudget = parseBudget(cleanQuery);
    const detectedLocation = this.extractLocation(cleanQuery);

    // Merge with previous turn context
    const condition = detectedCondition || context.condition || null;
    const procedure = detectedProcedure || context.procedure || null;
    const location = detectedLocation || context.location || '';
    const budget = detectedBudget !== null ? detectedBudget : (context.budget !== undefined ? context.budget : null);

    // Update conversation context
    const updatedContext = {
      ...context,
      lastIntent: 'HOSPITAL_RECOMMENDATION',
      condition,
      procedure,
      location,
      budget,
      language: lang
    };

    // 2. Perform Discovery via searchService
    const searchRes = await searchService.searchHospitals({
      query: rawQuery,
      condition: condition || '',
      procedure: procedure || '',
      location: location,
      budget: budget
    });

    const isNational = searchRes.isNationalReference;
    const results = searchRes.results || [];

    if (results.length === 0) {
      const noResultsMsgs = {
        en: `No hospitals were found matching all of your specified criteria in the current dataset.${budget ? ` You searched with a budget constraint of ₹${Number(budget).toLocaleString('en-IN')}.` : ''}${location ? ` Searching around ${location}.` : ''}\n\nTry broadening your location or budget to see available facilities.`,
        hi: `वर्तमान डेटासेट में आपके द्वारा निर्दिष्ट मानदंडों से मेल खाने वाला कोई अस्पताल नहीं मिला।${budget ? ` आपने ₹${Number(budget).toLocaleString('en-IN')} के बजट के साथ खोज की थी।` : ''}${location ? ` खोज क्षेत्र: ${location}।` : ''}\n\nसुझाव: अधिक विकल्प देखने के लिए बजट या स्थान का दायरा बढ़ाएं।`,
        pa: `ਮੌਜੂਦਾ ਡਾਟਾਸੈੱਟ ਵਿੱਚ ਤੁਹਾਡੇ ਦੱਸੇ ਗਏ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਹਸਪਤਾਲ ਨਹੀਂ ਮਿਲਿਆ।${budget ? ` ਬਜਟ ਸੀਮਾ: ₹${Number(budget).toLocaleString('en-IN')}।` : ''}${location ? ` ਸਥਾਨ: ${location}।` : ''}\n\nਹੋਰ ਵਿਕਲਪ ਦੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਬਜਟ ਜਾਂ ਖੇਤਰ ਵਧਾਓ।`,
        hinglish: `Current dataset mein aapke specified criteria se match karne wala koi hospital nahi mila.${budget ? ` Budget ceiling: ₹${Number(budget).toLocaleString('en-IN')}.` : ''}${location ? ` Location: ${location}.` : ''}\n\nAvailable facilities dekhne ke liye please location ya budget expand karein.`
      };

      return {
        intent: 'HOSPITAL_RECOMMENDATION',
        message: noResultsMsgs[lang] || noResultsMsgs.en,
        hospitals: [],
        language: lang,
        disclaimer: disclaimers.PROTOTYPE,
        context: updatedContext
      };
    }

    // 3. Format Response for National Specialized Search
    if (isNational) {
      const catKey = searchRes.nationalCategoryKey;
      const catName = searchRes.nationalCategoryName || 'Specialized Care';

      const headers = {
        en: `Here are Sehat_Sathi's curated national reference centres for **${catName}** in recommended deterministic order:`,
        hi: `**${catName}** के लिए सेहत_साथी के अनुशंसित राष्ट्रीय संदर्भ केंद्र (National Reference Centres):`,
        pa: `**${catName}** ਲਈ ਸਿਹਤ_ਸਾਥੀ ਦੇ ਸਿਫ਼ਾਰਸ਼ੀ ਰਾਸ਼ਟਰੀ ਰੈਫ਼ਰੈਂਸ ਕੇਂਦਰ (National Reference Centres):`,
        hinglish: `**${catName}** ke liye Sehat_Sathi ke curated national reference centres recommended order mein:`
      };

      const locMatchNote = {
        en: ' *(Matches your requested location)*',
        hi: ' *(आपके द्वारा चुने गए स्थान से मेल खाता है)*',
        pa: ' *(ਤੁਹਾਡੇ ਚੁਣੇ ਹੋਏ ਸਥਾਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ)*',
        hinglish: ' *(Matches your requested location)*'
      }[lang] || ' *(Matches your requested location)*';

      const lines = [
        headers[lang] || headers.en,
        ''
      ];

      results.slice(0, 5).forEach((h, idx) => {
        const rank = h.referenceRank || idx + 1;
        const locNote = location && h.city.toLowerCase() === location.toLowerCase() ? locMatchNote : '';
        lines.push(`${rank}. **${h.name}** — ${h.city}, ${h.state || ''}${locNote}`);
        lines.push(`   • *Full Name:* ${h.fullName || h.name}`);
        lines.push(`   • *Specialty:* ${h.specialty || (h.specialties || []).slice(0, 2).join(', ')}`);
        lines.push(`   • *Facilities:* ${(h.facilities || []).slice(0, 4).join(', ').toUpperCase()}`);
      });

      const footerNotes = {
        en: `*Note: Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.*`,
        hi: `*नोट: सेहत_साथी का अनुशंसित राष्ट्रीय संदर्भ क्रम। यह कोई आधिकारिक सरकारी या सार्वभौमिक रैंकिंग नहीं है।*`,
        pa: `*ਨੋਟ: ਸਿਹਤ_ਸਾਥੀ ਦਾ ਸਿਫ਼ਾਰਸ਼ੀ ਰਾਸ਼ਟਰੀ ਰੈਫ਼ਰੈਂਸ ਕ੍ਰਮ। ਇਹ ਕੋਈ ਸਰਕਾਰੀ ਜਾਂ ਸਰਬਵਿਆਪੀ ਰੈਂਕਿੰਗ ਨਹੀਂ ਹੈ।*`,
        hinglish: `*Note: Sehat_Sathi ka curated national reference order. Yeh koi official government ranking nahi hai.*`
      };

      lines.push('');
      lines.push(footerNotes[lang] || footerNotes.en);
      if (location) {
        const locFilterNote = {
          en: `*Location filter "${location}" has been applied as an informational alignment indicator without reordering the curated benchmark list.*`,
          hi: `*स्थान फ़िल्टर "${location}" को बिना क्रम बदले केवल सूचना के रूप में दर्शाया गया है।*`,
          pa: `*ਸਥਾਨ ਫਿਲਟਰ "${location}" ਨੂੰ ਸਿਰਫ ਜਾਣਕਾਰੀ ਵਜੋਂ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।*`,
          hinglish: `*Location filter "${location}" alignment indicator ke taur par apply kiya gaya hai without reordering.*`
        }[lang] || `*Location filter "${location}" has been applied as an informational alignment indicator without reordering the curated benchmark list.*`;
        lines.push(locFilterNote);
      }
      lines.push(`*${disclaimers.PROTOTYPE}*`);

      return {
        intent: 'HOSPITAL_RECOMMENDATION',
        isNational: true,
        categoryName: catName,
        message: lines.join('\n'),
        hospitals: results.slice(0, 5),
        language: lang,
        disclaimer: disclaimers.PROTOTYPE,
        context: updatedContext
      };
    }

    // 4. Format Response for Local Discovery
    const discoveryHeaders = {
      en: `Found **${results.length}** hospital(s) matching your criteria:`,
      hi: `आपकी आवश्यकताओं के अनुसार **${results.length}** अस्पताल मिले:`,
      pa: `ਤੁਹਾਡੀਆਂ ਲੋੜਾਂ ਅਨੁਸਾਰ **${results.length}** ਹਸਪਤਾਲ ਮਿਲੇ:`,
      hinglish: `Aapke criteria ke according **${results.length}** hospital(s) mile:`
    };

    const lines = [
      discoveryHeaders[lang] || discoveryHeaders.en,
      ''
    ];

    results.slice(0, 4).forEach((h, idx) => {
      const distText = h.distance != null ? ` (~${h.distance} km away)` : '';
      lines.push(`${idx + 1}. **${h.name}** — ${h.location?.city || h.city || ''}${distText}`);
      if (h.emergency24x7) {
        const emText = {
          en: '24x7 Emergency Ready',
          hi: '24x7 आपातकालीन सेवा उपलब्ध',
          pa: '24x7 ਐਮਰਜੈਂਸੀ ਸੇਵਾ ਉਪਲਬਧ',
          hinglish: '24x7 Emergency Ready'
        }[lang] || '24x7 Emergency Ready';
        lines.push(`   • ${emText}`);
      }
      if (h.specialties && h.specialties.length > 0) {
        lines.push(`   • Specialties: ${h.specialties.slice(0, 3).join(', ')}`);
      }
    });

    if (budget) {
      const budgetNote = {
        en: `*Budget ceiling applied: ₹${Number(budget).toLocaleString('en-IN')}*`,
        hi: `*बजट सीमा लागू: ₹${Number(budget).toLocaleString('en-IN')}*`,
        pa: `*ਬਜਟ ਸੀਮਾ: ₹${Number(budget).toLocaleString('en-IN')}*`,
        hinglish: `*Budget ceiling applied: ₹${Number(budget).toLocaleString('en-IN')}*`
      }[lang] || `*Budget ceiling applied: ₹${Number(budget).toLocaleString('en-IN')}*`;
      lines.push('');
      lines.push(budgetNote);
    }
    lines.push('');
    lines.push(`*${disclaimers.PROTOTYPE}*`);

    return {
      intent: 'HOSPITAL_RECOMMENDATION',
      isNational: false,
      message: lines.join('\n'),
      hospitals: results.slice(0, 4),
      language: lang,
      disclaimer: disclaimers.PROTOTYPE,
      context: updatedContext
    };
  }
};

/**
 * Clean up markdown text for natural, pleasant speech synthesis
 */
export function stripMarkdownForSpeech(text = '') {
  if (!text) return '';

  return text
    // Remove headers: ### Title -> Title
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic markers: **bold** or *italic*
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove markdown table divider bars and dashes: | --- |
    .replace(/\|[\s-:]+\|/g, ' ')
    // Replace table cell pipes with commas
    .replace(/\|/g, ', ')
    // Remove bullet points / dashes at start of line
    .replace(/^[\s•\-\*]+\s*/gm, '')
    // Remove numbered lists markers like "1. "
    .replace(/^\d+\.\s*/gm, '')
    // Remove common emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]|\p{Extended_Pictographic}/gu, '')
    // Remove raw URLs
    .replace(/https?:\/\/\S+/g, '')
    // Collapse excess spaces and newlines
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Select best matched voice from browser speech synthesis
 */
export function getBestVoiceForLanguage(lang = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, langCode: 'en-IN' };
  }

  const voices = window.speechSynthesis.getVoices() || [];
  let voice = null;
  let langCode = 'en-IN';

  if (lang === 'hi') {
    langCode = 'hi-IN';
    voice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else if (lang === 'pa') {
    langCode = 'pa-IN';
    voice = voices.find(v => v.lang === 'pa-IN' || v.lang.startsWith('pa') || /punjabi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else if (lang === 'hinglish') {
    langCode = 'hi-IN';
    voice = voices.find(v => v.lang === 'hi-IN' || /hindi/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
  } else {
    langCode = 'en-IN';
    voice = voices.find(v => v.lang === 'en-IN' || /india/i.test(v.name));
    if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
  }

  return { voice, langCode };
}

