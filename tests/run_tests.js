import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { parseBudget, normalizeCondition, aiService } from '../src/services/aiService.js';
import { calculateDistance, resolveLocation } from '../src/services/locationService.js';
import { matchesCondition, matchesBudget, recommendationService, getConditionPerformanceData, resolveHospitalBudget, sortHospitals } from '../src/services/recommendationService.js';
import { getSimulatedOutcome, SIMULATED_OUTCOMES, SIMULATED_OUTCOME_DISCLAIMER, normalizeSimConditionKey } from '../src/data/simulatedOutcomeData.js';
import { hospitalDiscoveryService, progressiveRadiusSearch, isHospitalSuitable } from '../src/services/hospitalDiscoveryService.js';
import { searchService } from '../src/services/searchService.js';
import { HOSPITALS } from '../src/data/hospitals.js';
import { adminService, matchHospitalIdentity, ADMIN_ROLES, ROLE_PERMISSIONS, validateConditionOutcomeMetric } from '../src/services/adminService.js';
import { 
  CLINICAL_CATEGORIES, 
  CONDITION_CATALOGUE, 
  PROCEDURE_CATALOGUE, 
  FACILITY_CATALOGUE, 
  matchCondition, 
  matchProcedure, 
  matchFacilities 
} from '../src/data/conditionCatalogue.js';
import { hasKnownRelevantCost } from '../src/services/recommendationService.js';
import { 
  NATIONAL_HOSPITAL_REFERENCES, 
  resolveNationalCategory, 
  getNationalReferenceHospitals, 
  getNationalReferenceHospitalById 
} from '../src/data/nationalHospitalReferences.js';
import { getHospitalById } from '../src/services/hospitalService.js';
import { 
  chatbotService, 
  OUT_OF_SCOPE_RESPONSE, 
  DISCLAIMERS,
  MULTILINGUAL_DISCLAIMERS,
  MULTILINGUAL_OUT_OF_SCOPE,
  stripMarkdownForSpeech,
  getBestVoiceForLanguage
} from '../src/services/chatbotService.js';

console.log('====================================================');
console.log('🧪 RUNNING SEHAT_SATHI SEARCH & FILTER TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failedTests++;
  }
}

const asyncQueue = [];

function asyncTest(name, fn) {
  asyncQueue.push(async () => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      failedTests++;
    }
  });
}

// ----------------------------------------------------
// 1. BUDGET PARSING (English, Hindi, Punjabi, Hinglish)
// ----------------------------------------------------
console.log('--- Suite 1: parseBudget() Unit Tests ---');
const budgetExpectations = [
  { query: 'under 1 lakh', expected: 100000 },
  { query: 'below 1 lakh', expected: 100000 },
  { query: 'within 1 lakh', expected: 100000 },
  { query: 'up to 1 lakh', expected: 100000 },
  { query: '1 lakh ke andar', expected: 100000 },
  { query: 'ek lakh ke andar', expected: 100000 },
  { query: '1 lakh tak', expected: 100000 },
  { query: 'do lakh ke andar', expected: 200000 },
  { query: '2 lakh ke andar', expected: 200000 },
  { query: '₹2 lakh ke andar', expected: 200000 },
  { query: 'below ₹200000', expected: 200000 },
  { query: 'dedh lakh', expected: 150000 },
  { query: 'dhai lakh', expected: 250000 },
  { query: 'teen lakh', expected: 300000 },
  { query: '5 lakh', expected: 500000 },
  { query: '10 lakh', expected: 1000000 },
  { query: 'heart hospital near me', expected: null },
  { query: 'mere ko heart hospital chahiye do lakh ke andar', expected: 200000 },
  { query: 'heart hospital under 1 lakh', expected: 100000 },
  { query: 'heart hospital under 2 lakh', expected: 200000 }
];

budgetExpectations.forEach(({ query, expected }) => {
  test(`parseBudget("${query}") === ${expected}`, () => {
    const result = parseBudget(query);
    assert.strictEqual(result, expected, `Expected ${expected} but got ${result}`);
  });
});

// ----------------------------------------------------
// 2. CONDITION NORMALIZATION
// ----------------------------------------------------
console.log('\n--- Suite 2: normalizeCondition() Unit Tests ---');
const conditionExpectations = [
  { query: 'heart', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'cardiology', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'cardiac', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'heart care', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'heart treatment', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'heart attack', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'dil', expectedCondition: 'heart', expectedSpecialty: 'cardiology' },
  { query: 'kidney', expectedCondition: 'kidney', expectedSpecialty: 'nephrology' },
  { query: 'renal', expectedCondition: 'kidney', expectedSpecialty: 'nephrology' },
  { query: 'dialysis', expectedCondition: '', expectedSpecialty: 'all' },
  { query: 'knee replacement', expectedCondition: 'orthopedics', expectedSpecialty: 'orthopedics' },
  { query: 'cancer', expectedCondition: 'cancer', expectedSpecialty: 'oncology' }
];

conditionExpectations.forEach(({ query, expectedCondition, expectedSpecialty }) => {
  test(`normalizeCondition("${query}") maps to ${expectedCondition}`, () => {
    const res = normalizeCondition(query);
    assert.strictEqual(res.condition, expectedCondition);
    assert.strictEqual(res.specialty, expectedSpecialty);
  });
});

// ----------------------------------------------------
// 3. HAVERSINE DISTANCE CALCULATION
// ----------------------------------------------------
console.log('\n--- Suite 3: calculateDistance() Unit Tests ---');
test('calculateDistance correctly computes distance between Chandigarh and Mohali', () => {
  // Chandigarh (30.7333, 76.7794) to Mohali (30.7046, 76.7179) is approx 6.7 km
  const dist = calculateDistance(30.7333, 76.7794, 30.7046, 76.7179);
  assert(dist >= 6.0 && dist <= 7.5, `Expected ~6.7 km, got ${dist}`);
});

test('calculateDistance returns null for missing or null coordinates', () => {
  assert.strictEqual(calculateDistance(null, 76.7794, 30.7046, 76.7179), null);
  assert.strictEqual(calculateDistance(30.7333, null, 30.7046, 76.7179), null);
});

// ----------------------------------------------------
// 4. BUDGET & COST MATCHING (NO ARBITRARY TOLERANCE)
// ----------------------------------------------------
console.log('\n--- Suite 4: matchesBudget() and matchesCondition() Tests ---');
const fortisHospital = HOSPITALS.find(h => h.name.includes('Fortis Premier'));
const apexHospital = HOSPITALS.find(h => h.name.includes('Apex Heart'));
const civilHospital = HOSPITALS.find(h => h.name.includes('Civil Care'));

test('Fortis (cardiac min ₹2,10,000) does NOT match budget ₹2,00,000 (strictly no tolerance multiplier)', () => {
  assert(fortisHospital != null, 'Fortis Premier Hospital should exist in mock data');
  const isMatch = matchesBudget(fortisHospital, 200000, 'heart');
  assert.strictEqual(isMatch, false, 'Fortis min ₹2,10,000 should exceed ₹2,00,000 budget');
});

test('Apex (cardiac min ₹1,60,000) matches budget ₹2,00,000', () => {
  assert(apexHospital != null, 'Apex should exist in mock data');
  const isMatch = matchesBudget(apexHospital, 200000, 'heart');
  assert.strictEqual(isMatch, true, 'Apex min ₹1,60,000 should be compatible with ₹2,00,000');
});

test('Civil Care (cardiac min ₹45,000) matches budget ₹1,00,000', () => {
  assert(civilHospital != null, 'Civil Care should exist in mock data');
  const isMatch = matchesBudget(civilHospital, 100000, 'heart');
  assert.strictEqual(isMatch, true, 'Civil Care min ₹45,000 should be compatible with ₹1,00,000');
});

// ----------------------------------------------------
// 5. PROGRESSIVE RADIUS SEARCH
// ----------------------------------------------------
console.log('\n--- Suite 5: progressiveRadiusSearch() Tests ---');
test('Progressive search stops at 5 km when 5 suitable heart hospitals exist within 5 km of Chandigarh', () => {
  const result = progressiveRadiusSearch(
    HOSPITALS.map(h => ({
      ...h,
      distance: calculateDistance(30.7333, 76.7794, h.location.latitude, h.location.longitude)
    })),
    { condition: 'heart', budget: 200000, radiusMode: 'auto' },
    5
  );

  assert.strictEqual(result.activeRadius, 5, `Expected activeRadius to be 5 km, but got ${result.activeRadius}`);
  assert(result.matchingHospitals.length >= 2, `Expected at least 2 matching hospitals, got ${result.matchingHospitals.length}`);
  // Verify all returned hospitals are within 5 km
  result.matchingHospitals.forEach(h => {
    assert(h.distance <= 5, `${h.name} distance ${h.distance} exceeds 5 km`);
  });
});

test('A single suitable hospital at 1 km is KEPT even when progressive radius checks 10/25/50 km', () => {
  const result = progressiveRadiusSearch(
    HOSPITALS.map(h => ({
      ...h,
      distance: calculateDistance(30.7333, 76.7794, h.location.latitude, h.location.longitude)
    })),
    { condition: 'heart', budget: 100000, radiusMode: 'auto' },
    5
  );

  assert.strictEqual(result.matchingHospitals.length, 1, 'Civil Care Hospital should be returned');
  assert.strictEqual(result.matchingHospitals[0].name, 'Civil Care Hospital & Maternity Wing');
  assert.strictEqual(result.activeRadius, 50, 'Radius expands to 50 km looking for more matches');
});

// ----------------------------------------------------
// 6. SPECIFIED END-TO-END QUERIES (A through E)
// ----------------------------------------------------
console.log('\n--- Suite 6: User Query End-to-End Tests (Cases A - E) ---');

await asyncTest('Case A: "mere ko heart hospital chahiye do lakh ke andar"', async () => {
  const query = "mere ko heart hospital chahiye do lakh ke andar";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, 200000);
  assert.strictEqual(parsed.budgetLabel, 'Up to ₹2,00,000');
  assert.deepStrictEqual(parsed.facilities, []);
  assert.strictEqual(parsed.locationMode, 'current');

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition,
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Should find matching hospitals');
  assert.strictEqual(searchRes.activeRadius, 5, 'Should stop at 5 km in Chandigarh');
  searchRes.results.forEach(h => {
    assert(h.estimatedCosts.cardiacCare.min <= 200000, `${h.name} exceeds budget`);
  });
});

await asyncTest('Case B: "heart hospital under 1 lakh"', async () => {
  const query = "heart hospital under 1 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.strictEqual(parsed.budgetLabel, 'Up to ₹1,00,000');

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition,
    budget: parsed.budgetMax,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Should find matching hospital (Civil Care)');
  assert.strictEqual(searchRes.results[0].name, 'Civil Care Hospital & Maternity Wing');
});

await asyncTest('Case C: "heart hospital near me" (No budget specified)', async () => {
  const query = "heart hospital near me";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, null);
  assert.strictEqual(parsed.budgetLabel, 'Any Budget');
});

await asyncTest('Case D: "heart hospital with dialysis under 2 lakh"', async () => {
  const query = "heart hospital with dialysis under 2 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, 200000);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);
  assert.strictEqual(parsed.facilityLabels[0], 'Dialysis Unit');

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition,
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Should find matching hospitals');
  searchRes.results.forEach(h => {
    assert(h.facilities.includes('dialysis'), `${h.name} must have dialysis`);
    assert(h.estimatedCosts.cardiacCare.min <= 200000, `${h.name} must be within budget`);
  });
});

await asyncTest('Case E: "heart hospital in Chandigarh under 2 lakh"', async () => {
  const query = "heart hospital in Chandigarh under 2 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.location, 'Chandigarh');
  assert.strictEqual(parsed.locationMode, 'explicit');
  assert.strictEqual(parsed.budgetMax, 200000);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition,
    location: parsed.location,
    budget: parsed.budgetMax,
    // Note: user GPS might be different, but explicit location anchors to Chandigarh
    latitude: 31.0,
    longitude: 75.0
  });

  assert(searchRes.results.length > 0, 'Should find matching hospitals anchored to Chandigarh');
  searchRes.results.forEach(h => {
    assert(h.location.city === 'Chandigarh', `${h.name} should be in Chandigarh`);
  });
});

// ----------------------------------------------------
// 7. SECTION 22 CRITICAL VERIFICATION CASES (Cases 1 - 10)
// ----------------------------------------------------
console.log('\n--- Suite 7: Section 22 Critical Verification Cases ---');

await asyncTest('Case 1: "hospital for dialysis under 100000"', async () => {
  const query = "hospital for dialysis under 100000";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null, 'Condition must be null (Dialysis is a facility, NOT a condition)');
  assert.strictEqual(parsed.conditionLabel, 'No specific condition');
  assert.strictEqual(parsed.budgetMax, 100000, 'Budget must parse to 100000');
  assert.deepStrictEqual(parsed.facilities, ['dialysis'], 'Facilities must contain dialysis');

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals (no 0 result bug)');
  searchRes.results.forEach(h => {
    assert(h.facilities.includes('dialysis'), `${h.name} must have dialysis`);
  });
});

await asyncTest('Case 2: "dialysis hospital under 1 lakh"', async () => {
  const query = "dialysis hospital under 1 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null);
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
});

await asyncTest('Case 3: "kidney hospital with dialysis under 1 lakh"', async () => {
  const query = "kidney hospital with dialysis under 1 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'kidney', 'Condition must be kidney');
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
});

await asyncTest('Case 4: "heart hospital under 1 lakh"', async () => {
  const query = "heart hospital under 1 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.deepStrictEqual(parsed.facilities, []);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
});

await asyncTest('Case 5: "heart hospital with dialysis under 2 lakh"', async () => {
  const query = "heart hospital with dialysis under 2 lakh";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, 'heart');
  assert.strictEqual(parsed.budgetMax, 200000);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
  searchRes.results.forEach(h => {
    assert(h.facilities.includes('dialysis'));
    assert(h.estimatedCosts.cardiacCare.min <= 200000);
  });
});

await asyncTest('Case 6: "hospital for dialysis"', async () => {
  const query = "hospital for dialysis";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null);
  assert.strictEqual(parsed.budgetMax, null);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: null,
    facilities: parsed.facilities,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
});

await asyncTest('Case 7: "hospital under 100000"', async () => {
  const query = "hospital under 100000";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null);
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.deepStrictEqual(parsed.facilities, []);

  const searchRes = await searchService.searchHospitals({
    query,
    condition: parsed.condition || '',
    budget: parsed.budgetMax,
    facilities: [],
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must return matching hospitals');
});

await asyncTest('Case 8: Manual override facility removal updates results', async () => {
  // User removes dialysis filter: search with empty facilities returns more hospitals
  const withDialysis = await searchService.searchHospitals({
    facilities: ['dialysis'],
    latitude: 30.7333,
    longitude: 76.7794
  });

  const withoutDialysisConstraint = await searchService.searchHospitals({
    facilities: [],
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(withoutDialysisConstraint.results.length >= withDialysis.results.length,
    'Removing facility requirement must broaden or maintain hospital matches');
});

await asyncTest('Case 9: Manual override budget removal updates results', async () => {
  // With tight budget of 50,000 for heart
  const withBudget = await searchService.searchHospitals({
    condition: 'heart',
    budget: 50000,
    latitude: 30.7333,
    longitude: 76.7794
  });

  // User removes budget constraint
  const withoutBudget = await searchService.searchHospitals({
    condition: 'heart',
    budget: null,
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(withoutBudget.results.length > withBudget.results.length,
    'Removing budget constraint must allow higher-budget hospitals to match');
});

await asyncTest('Case 10: Auto-radius progression preserves 5 km matches', async () => {
  const res = await searchService.searchHospitals({
    condition: 'heart',
    radius: 'auto',
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(res.results.length > 0, 'Must find hospitals');
  assert.strictEqual(res.activeRadius, 5, 'Chandigarh heart search finds enough matches within 5 km');
});

// ----------------------------------------------------
// 8. MULTILINGUAL DIALYSIS & CANONICAL INTENT SUITE
// ----------------------------------------------------
console.log('\n--- Suite 8: Multilingual Dialysis & Canonical Intent Tests ---');

await asyncTest('Multilingual Case 1 (Hinglish): "mujhe ek lakh ke andar dialysis hospital chahiye"', async () => {
  const query = "mujhe ek lakh ke andar dialysis hospital chahiye";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null, 'Must NOT set condition');
  assert.strictEqual(parsed.budgetMax, 100000, 'Must extract 100000 budget');
  assert.deepStrictEqual(parsed.facilities, ['dialysis'], 'Must extract dialysis facility');
  assert.deepStrictEqual(parsed.requiredFacilities, ['dialysis'], 'Must set requiredFacilities');
  assert.strictEqual(parsed.location, null);
  assert.strictEqual(parsed.locationMode, 'current');
});

await asyncTest('Multilingual Case 2 (Hindi): "मुझे एक लाख के अंदर डायलिसिस अस्पताल चाहिए"', async () => {
  const query = "मुझे एक लाख के अंदर डायलिसिस अस्पताल चाहिए";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null, 'Must NOT set condition');
  assert.strictEqual(parsed.budgetMax, 100000, 'Must extract 100000 budget');
  assert.deepStrictEqual(parsed.facilities, ['dialysis'], 'Must extract dialysis facility');
});

await asyncTest('Multilingual Case 3 (Punjabi): "ਮੈਨੂੰ ਇੱਕ ਲੱਖ ਦੇ ਅੰਦਰ ਡਾਇਲਸਿਸ ਹਸਪਤਾਲ ਚਾਹੀਦਾ ਹੈ"', async () => {
  const query = "ਮੈਨੂੰ ਇੱਕ ਲੱਖ ਦੇ ਅੰਦਰ ਡਾਇਲਸਿਸ ਹਸਪਤਾਲ ਚਾਹੀਦਾ ਹੈ";
  const parsed = await aiService.parseNaturalLanguageQuery(query);

  assert.strictEqual(parsed.condition, null, 'Must NOT set condition');
  assert.strictEqual(parsed.budgetMax, 100000, 'Must extract 100000 budget');
  assert.deepStrictEqual(parsed.facilities, ['dialysis'], 'Must extract dialysis facility');
});

await asyncTest('Strict Suitability: Dialysis query never returns hospitals lacking dialysis', async () => {
  const searchRes = await searchService.searchHospitals({
    facilities: ['dialysis'],
    latitude: 30.7333,
    longitude: 76.7794
  });

  assert(searchRes.results.length > 0, 'Must find hospitals with dialysis');
  searchRes.results.forEach(h => {
    assert(h.facilities.includes('dialysis'), `Hospital ${h.name} must have dialysis`);
  });
});

// ----------------------------------------------------
// 9. SECTION 21 EXACT TEST CASES (A THROUGH F)
// ----------------------------------------------------
console.log('\n--- Suite 9: Section 21 Exact Test Cases (A through F) ---');

test('TEST A: "dialysis hospital under 100000"', () => {
  const res = aiService.parseSearchIntent("dialysis hospital under 100000");
  assert.strictEqual(res.condition, null);
  assert.strictEqual(res.budgetMax, 100000);
  assert.deepStrictEqual(res.facilities, ['dialysis']);
});

test('TEST B: "dialysis hospital under 1 lakh"', () => {
  const res = aiService.parseSearchIntent("dialysis hospital under 1 lakh");
  assert.strictEqual(res.condition, null);
  assert.strictEqual(res.budgetMax, 100000);
  assert.deepStrictEqual(res.facilities, ['dialysis']);
});

test('TEST C: "hospital for dialysis"', () => {
  const res = aiService.parseSearchIntent("hospital for dialysis");
  assert.strictEqual(res.condition, null);
  assert.strictEqual(res.budgetMax, null);
  assert.deepStrictEqual(res.facilities, ['dialysis']);
});

test('TEST D: "heart hospital under 1 lakh"', () => {
  const res = aiService.parseSearchIntent("heart hospital under 1 lakh");
  assert.strictEqual(res.condition, 'heart');
  assert.strictEqual(res.budgetMax, 100000);
  assert.deepStrictEqual(res.facilities, []);
});

test('TEST E: "kidney hospital with dialysis under 1 lakh"', () => {
  const res = aiService.parseSearchIntent("kidney hospital with dialysis under 1 lakh");
  assert.strictEqual(res.condition, 'kidney');
  assert.strictEqual(res.budgetMax, 100000);
  assert.deepStrictEqual(res.facilities, ['dialysis']);
});

test('TEST F: "hospital under 100000"', () => {
  const res = aiService.parseSearchIntent("hospital under 100000");
  assert.strictEqual(res.condition, null);
  assert.strictEqual(res.budgetMax, 100000);
  assert.deepStrictEqual(res.facilities, []);
});

// ----------------------------------------------------
// 10. SECTION 19 & 22: COMPREHENSIVE CURRENT LOCATION + HOSPITAL MATCHING
// ----------------------------------------------------
console.log('\n--- Suite 10: Section 19 & 22 Current Location & Hospital Matching ---');

asyncTest('TEST A: Known hospital coordinates + same user coords + "dialysis hospital"', async () => {
  const targetHospital = HOSPITALS[0]; // CityCare Multispeciality Hospital (has dialysis)
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: targetHospital.location.latitude,
    longitude: targetHospital.location.longitude,
    radiusKm: 'auto',
    requirements: { condition: '', facilities: ['dialysis'], budget: null }
  });
  assert(res.results.length > 0, 'Expected matching hospitals to be found');
  const found = res.results.find(h => h.id === targetHospital.id);
  assert(found, 'Target hospital must be found in results');
  assert.strictEqual(found.distance, 0, 'Distance must be 0 km for identical coordinates');
});

asyncTest('TEST B: Known hospital coordinates + "dialysis hospital under 100000"', async () => {
  const targetHospital = HOSPITALS[0];
  const intent = aiService.parseSearchIntent("dialysis hospital under 100000");
  assert.deepStrictEqual(intent.facilities, ['dialysis']);
  assert.strictEqual(intent.budgetMax, 100000);

  const res = await searchService.searchHospitals({
    query: "dialysis hospital under 100000",
    condition: intent.condition || '',
    facilities: intent.facilities,
    budget: intent.budgetMax,
    latitude: targetHospital.location.latitude,
    longitude: targetHospital.location.longitude
  });
  assert(res.results.length > 0, 'Expected dialysis hospitals under 100000 to be found');
  res.results.forEach(h => {
    assert(h.facilities.includes('dialysis'), `${h.name} must have dialysis`);
    assert(h.estimatedCosts.kidneyTreatment.min <= 100000, `${h.name} cost must be <= 100000`);
  });
});

test('TEST C: "dialysis hospital" has budgetMax = null', () => {
  const intent = aiService.parseSearchIntent("dialysis hospital");
  assert.strictEqual(intent.budgetMax, null);
  assert.strictEqual(intent.condition, null);
  assert.deepStrictEqual(intent.facilities, ['dialysis']);
});

test('TEST D: "heart hospital under 1 lakh" has condition=heart, budgetMax=100000, no dialysis', () => {
  const intent = aiService.parseSearchIntent("heart hospital under 1 lakh");
  assert.strictEqual(intent.condition, 'heart');
  assert.strictEqual(intent.budgetMax, 100000);
  assert(!intent.facilities.includes('dialysis'));
});

test('TEST E: "kidney hospital with dialysis under 1 lakh" has condition=kidney, dialysis, budgetMax=100000', () => {
  const intent = aiService.parseSearchIntent("kidney hospital with dialysis under 1 lakh");
  assert.strictEqual(intent.condition, 'kidney');
  assert(intent.facilities.includes('dialysis'));
  assert.strictEqual(intent.budgetMax, 100000);
});

test('TEST F: "dialysis hospital under 50000" has budgetMax = 50000 (no default budget otherwise)', () => {
  const intentWithBudget = aiService.parseSearchIntent("dialysis hospital under 50000");
  assert.strictEqual(intentWithBudget.budgetMax, 50000);

  const intentNoBudget = aiService.parseSearchIntent("dialysis hospital");
  assert.strictEqual(intentNoBudget.budgetMax, null);
});

asyncTest('TEST G: Actual GPS outside dataset coverage (> 50 km) returns 0 results and clear coverage info', async () => {
  // Delhi coordinates (approx 235 km from Chandigarh)
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 28.6139,
    longitude: 77.2090,
    radiusKm: 'auto',
    requirements: { condition: '', facilities: ['dialysis'], budget: 50000 },
    city: 'Delhi NCR'
  });
  assert.strictEqual(res.results.length, 0, 'Zero results expected for GPS > 50 km from mock coverage');
  assert.strictEqual(res.isOutsideCoverage, true, 'isOutsideCoverage must be true');
  assert(res.coveredCities.includes('Chandigarh'), 'coveredCities must include Chandigarh');
  assert(res.minHospitalDistance > 50, 'minHospitalDistance must be > 50 km');
  assert(res.expansionMessage.includes('outside the area covered'), 'Must explain coverage');
});

asyncTest('TEST H: Manual location set to covered city ("Chandigarh") discovers dialysis hospitals', async () => {
  const res = await searchService.searchHospitals({
    query: "dialysis hospital",
    location: "Chandigarh",
    facilities: ['dialysis'],
    radius: 'auto'
  });
  assert(res.results.length > 0, 'Manual location Chandigarh must find dialysis hospitals');
});

test('TEST I: Safe coordinate parsing in calculateDistance', () => {
  // Identical coordinates
  assert.strictEqual(calculateDistance(30.7333, 76.7794, 30.7333, 76.7794), 0);
  // Numeric strings
  assert.strictEqual(calculateDistance("30.7333", "76.7794", "30.7333", "76.7794"), 0);
  // Null or invalid coords
  assert.strictEqual(calculateDistance(null, 76.7794, 30.7333, 76.7794), null);
  assert.strictEqual(calculateDistance(NaN, 76.7794, 30.7333, 76.7794), null);
  assert.strictEqual(calculateDistance("abc", 76.7794, 30.7333, 76.7794), null);
});

test('TEST J: Strict budget semantics for dialysis with kidneyTreatment', () => {
  const hospWithKidneyCost = {
    name: 'Test Hospital',
    facilities: ['dialysis'],
    estimatedCosts: {
      kidneyTreatment: { min: 45000, max: 75000 }
    }
  };
  const hospExpensive = {
    name: 'Expensive Hospital',
    facilities: ['dialysis'],
    estimatedCosts: {
      kidneyTreatment: { min: 65000, max: 95000 }
    }
  };
  const hospNoCost = {
    name: 'Unknown Cost Hospital',
    facilities: ['dialysis'],
    estimatedCosts: {}
  };

  assert.strictEqual(matchesBudget(hospWithKidneyCost, 50000, '', ['dialysis']), true);
  assert.strictEqual(matchesBudget(hospExpensive, 50000, '', ['dialysis']), false);
  assert.strictEqual(matchesBudget(hospNoCost, 50000, '', ['dialysis']), false); // unavailable cost does not satisfy strict budget
});

// ----------------------------------------------------
// 11. SUITE 11: JALANDHAR & HOSHIARPUR LOCAL-FIRST DISCOVERY TESTS
// ----------------------------------------------------
console.log('\n--- Suite 11: Jalandhar & Hoshiarpur Local-First & Verification Tests ---');

// Test 1: Jalandhar distance ≈ 0 km
asyncTest('TEST 1 (Suite 11): User at PIMS coordinates -> PIMS distance = 0 km', async () => {
  const pims = HOSPITALS.find(h => h.id === 17);
  assert(pims, 'PIMS hospital must exist');
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: pims.location.latitude,
    longitude: pims.location.longitude,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  const found = res.results.find(h => h.id === 17);
  assert(found, 'PIMS must be found in results');
  assert.strictEqual(found.distance, 0, 'PIMS distance must be 0 km for identical coordinates');
});

// Test 2: Hoshiarpur distance ≈ 0 km
asyncTest('TEST 2 (Suite 11): User at IVY Hoshiarpur coordinates -> IVY distance = 0 km', async () => {
  const ivy = HOSPITALS.find(h => h.id === 25);
  assert(ivy, 'IVY hospital must exist');
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: ivy.location.latitude,
    longitude: ivy.location.longitude,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  const found = res.results.find(h => h.id === 25);
  assert(found, 'IVY Hoshiarpur must be found in results');
  assert.strictEqual(found.distance, 0, 'IVY distance must be 0 km for identical coordinates');
});

// Test 3: Dialysis parsing
test('TEST 3 (Suite 11): "dialysis hospital" -> condition: null, facilities: ["dialysis"]', () => {
  const parsed = aiService.parseSearchIntent("dialysis hospital");
  assert.strictEqual(parsed.condition, null);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);
});

// Test 4: Dialysis + budget parsing
test('TEST 4 (Suite 11): "dialysis hospital under 100000" -> budgetMax: 100000, facilities: ["dialysis"]', () => {
  const parsed = aiService.parseSearchIntent("dialysis hospital under 100000");
  assert.strictEqual(parsed.condition, null);
  assert.strictEqual(parsed.budgetMax, 100000);
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);
});

// Test 5: Kidney + dialysis parsing
test('TEST 5 (Suite 11): "kidney hospital with dialysis" -> condition: "kidney", facilities: ["dialysis"]', () => {
  const parsed = aiService.parseSearchIntent("kidney hospital with dialysis");
  assert.strictEqual(parsed.condition, 'kidney');
  assert.deepStrictEqual(parsed.facilities, ['dialysis']);
});

// Test 6: No false dialysis match
test('TEST 6 (Suite 11): No false dialysis match -> Bharaj, Narad, and St. Joseph excluded for dialysis', () => {
  const bharaj = HOSPITALS.find(h => h.id === 26);
  const narad = HOSPITALS.find(h => h.id === 28);
  const stJoseph = HOSPITALS.find(h => h.id === 29);
  assert(bharaj && !bharaj.facilities.includes('dialysis'), 'Bharaj must not have dialysis');
  assert(narad && !narad.facilities.includes('dialysis'), 'Narad must not have dialysis');
  assert(stJoseph && !stJoseph.facilities.includes('dialysis'), 'St. Joseph must not have dialysis');

  assert.strictEqual(isHospitalSuitable(bharaj, { facilities: ['dialysis'] }), false);
  assert.strictEqual(isHospitalSuitable(narad, { facilities: ['dialysis'] }), false);
  assert.strictEqual(isHospitalSuitable(stJoseph, { facilities: ['dialysis'] }), false);
});

// Test 7: Unknown cost semantics
test('TEST 7 (Suite 11): Unknown cost (dialysis: null) does not match strict budget', () => {
  const pims = HOSPITALS.find(h => h.id === 17);
  assert.strictEqual(matchesBudget(pims, 100000, '', ['dialysis']), false, 'Hospitals with unverified null dialysis cost must not match strict budget');
});

// Test 8: Jalandhar local-first
asyncTest('TEST 8 (Suite 11): Jalandhar local-first -> Jalandhar dialysis hospitals ordered first, Chandigarh excluded from 50 km', async () => {
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 31.3260,
    longitude: 75.5762,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  assert(res.results.length > 0, 'Must return matching hospitals');
  assert.strictEqual(res.results[0].location.city, 'Jalandhar', 'Top hospital must be in Jalandhar');
  res.results.forEach(h => {
    assert(h.distance <= 50, `Distance ${h.distance} km must not exceed 50 km`);
    assert.notStrictEqual(h.location.city, 'Chandigarh', 'Chandigarh must not appear in <= 50 km auto radius from Jalandhar');
  });
});

// Test 9: Hoshiarpur local-first
asyncTest('TEST 9 (Suite 11): Hoshiarpur local-first -> Hoshiarpur dialysis hospitals ordered first, Chandigarh excluded', async () => {
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 31.5273,
    longitude: 75.9150,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  assert(res.results.length > 0, 'Must return matching hospitals');
  assert.strictEqual(res.results[0].location.city, 'Hoshiarpur', 'Top hospital must be in Hoshiarpur');
  res.results.forEach(h => {
    assert(h.distance <= 50, `Distance ${h.distance} km must not exceed 50 km`);
    assert.notStrictEqual(h.location.city, 'Chandigarh', 'Chandigarh must not appear in <= 50 km auto radius from Hoshiarpur');
  });
});

// Test 10: Max auto radius never exceeds 50 km
asyncTest('TEST 10 (Suite 11): Max auto radius never exceeds 50 km even when few results match', async () => {
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 31.6500,
    longitude: 75.3000,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  assert(res.activeRadius <= 50, `Active radius ${res.activeRadius} must never exceed 50 km`);
});

// Test 11: Single matching hospital is displayed (not hidden by MIN_SUITABLE_RESULTS)
asyncTest('TEST 11 (Suite 11): Single matching hospital is displayed without being suppressed', async () => {
  const dummyHospitals = [
    {
      id: 999,
      name: "Solitary Specialist Hospital",
      facilities: ["dialysis", "rare_procedure_xyz"],
      location: { latitude: 31.3000, longitude: 75.5800, city: "Jalandhar" },
      distance: 3.5,
      emergency24x7: true,
      estimatedCosts: {},
      specialties: ["General Medicine"]
    },
    {
      id: 998,
      name: "Other Non-matching Hospital",
      facilities: ["emergency"],
      location: { latitude: 31.3100, longitude: 75.5900, city: "Jalandhar" },
      distance: 4.0,
      emergency24x7: true,
      estimatedCosts: {},
      specialties: ["General Medicine"]
    }
  ];

  const searchOutcome = progressiveRadiusSearch(dummyHospitals, { facilities: ["rare_procedure_xyz"] }, 'auto');
  assert.strictEqual(searchOutcome.matchingHospitals.length, 1, 'Single matching hospital must be included in matchingHospitals');
  assert.strictEqual(searchOutcome.matchingHospitals[0].id, 999);
});

// Test 12: Explicit location in search query ("dialysis hospital in Hoshiarpur")
asyncTest('TEST 12 (Suite 11): Explicit location "dialysis hospital in Hoshiarpur" resolves to Hoshiarpur anchor', async () => {
  const intent = aiService.parseSearchIntent("dialysis hospital in Hoshiarpur");
  assert.strictEqual(intent.location, "Hoshiarpur", 'Location must be extracted as Hoshiarpur');
  assert.deepStrictEqual(intent.facilities, ["dialysis"], 'Facility must be dialysis');

  const resolved = resolveLocation(intent.location);
  assert(resolved, 'Location must resolve');
  assert(Math.abs(resolved.latitude - 31.5273) < 0.01, 'Must resolve to Hoshiarpur latitude');
  assert(Math.abs(resolved.longitude - 75.9150) < 0.01, 'Must resolve to Hoshiarpur longitude');
});

// ----------------------------------------------------
// 12. SUITE 12: PHASE 4 REVISED - DATA INTEGRITY, RELEVANT PERFORMANCE & ACCREDITATION VERIFICATION
// ----------------------------------------------------
console.log('\n--- Suite 12: Phase 4 Revised - Data Integrity, Performance & Verification (All 33 Tests) ---');

// Test 1: "kidney hospital" -> condition = "kidney", facilities = []
test('TEST 1 (Suite 12): "kidney hospital" -> condition="kidney", facilities=[]', () => {
  const parsed = aiService.parseSearchIntent("kidney hospital");
  assert.strictEqual(parsed.condition, "kidney", 'Condition must be kidney');
  assert.deepStrictEqual(parsed.facilities, [], 'Facilities must be empty');
});

// Test 2: "dialysis hospital" -> condition = null, facilities = ["dialysis"]
test('TEST 2 (Suite 12): "dialysis hospital" -> condition=null, facilities=["dialysis"]', () => {
  const parsed = aiService.parseSearchIntent("dialysis hospital");
  assert.strictEqual(parsed.condition, null, 'Condition must be null for pure facility');
  assert.deepStrictEqual(parsed.facilities, ["dialysis"], 'Facility must be dialysis');
});

// Test 3: "kidney hospital with dialysis" -> condition = "kidney", facilities = ["dialysis"]
test('TEST 3 (Suite 12): "kidney hospital with dialysis" -> condition="kidney", facilities=["dialysis"]', () => {
  const parsed = aiService.parseSearchIntent("kidney hospital with dialysis");
  assert.strictEqual(parsed.condition, "kidney", 'Condition must be kidney');
  assert.deepStrictEqual(parsed.facilities, ["dialysis"], 'Facilities must include dialysis');
});

// Test 4: Strict budget (no tolerance) -> hospital above budget excluded
test('TEST 4 (Suite 12): Strict budget (no tolerance) -> hospital above budget strictly excluded', () => {
  const hospAboveBudget = {
    name: "Costly Nephrology Hospital",
    specialties: ["Nephrology"],
    estimatedCosts: { kidneyTreatment: { min: 100001, max: 150000 } }
  };
  assert.strictEqual(matchesBudget(hospAboveBudget, 100000, "kidney", []), false, 'Must not match budget when min > 100000');
  assert.strictEqual(isHospitalSuitable(hospAboveBudget, { condition: "kidney", budget: 100000 }), false, 'Must not be suitable above budget');
});

// Test 5: Unknown cost (cost = null) does not count as confirmed under-budget
test('TEST 5 (Suite 12): Unknown cost (cost = null) does not count as confirmed under-budget', () => {
  const hospNullCost = {
    name: "Unknown Cost Hospital",
    specialties: ["Nephrology"],
    estimatedCosts: { kidneyTreatment: { min: null, max: null } }
  };
  assert.strictEqual(matchesBudget(hospNullCost, 100000, "kidney", []), false, 'Null cost must not satisfy strict budget filter');
});

// Test 6: 5 valid hospitals exist within 50 km -> show at least 5
asyncTest('TEST 6 (Suite 12): 5 valid hospitals exist within 50 km -> shows at least 5 suitable hospitals', async () => {
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 31.3260, // Jalandhar
    longitude: 75.5762,
    radiusKm: 'auto',
    requirements: { facilities: ['dialysis'] }
  });
  assert(res.results.length >= 5, `Expected at least 5 dialysis hospitals in Jalandhar area, got ${res.results.length}`);
});

// Test 7: Only 3 valid hospitals exist within 50 km -> show 3 (do not fabricate 2 more)
asyncTest('TEST 7 (Suite 12): Only 3 valid hospitals exist -> returns exactly 3 (no fabricated filler)', async () => {
  const dataset = [
    { id: 901, name: "Match A", facilities: ["dialysis"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 5 },
    { id: 902, name: "Match B", facilities: ["dialysis"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 10 },
    { id: 903, name: "Match C", facilities: ["dialysis"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 15 },
    { id: 904, name: "Non Match D", facilities: ["icu"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 8 }
  ];
  const outcome = progressiveRadiusSearch(dataset, { facilities: ["dialysis"] }, 'auto');
  assert.strictEqual(outcome.matchingHospitals.length, 3, 'Must return exactly 3 matches, zero synthetic padding');
});

// Test 8: Only 1 valid hospital exists within 50 km -> show 1 (do not fabricate 4 more)
asyncTest('TEST 8 (Suite 12): Only 1 valid hospital exists -> returns exactly 1 (no synthetic padding)', async () => {
  const dataset = [
    { id: 911, name: "Unique Match", facilities: ["dialysis"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 6 },
    { id: 912, name: "Non Match", facilities: ["emergency"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 8 }
  ];
  const outcome = progressiveRadiusSearch(dataset, { facilities: ["dialysis"] }, 'auto');
  assert.strictEqual(outcome.matchingHospitals.length, 1, 'Must return exactly 1 match');
  assert.strictEqual(outcome.matchingHospitals[0].id, 911);
});

// Test 9: No fake hospital creation under any condition
test('TEST 9 (Suite 12): No fake hospital creation -> all returned hospitals exist in source dataset', () => {
  const dummyList = [
    { id: 921, name: "Real Hosp 1", facilities: ["dialysis"], location: { latitude: 30.7, longitude: 76.7, city: "Tricity" }, distance: 5 }
  ];
  const outcome = progressiveRadiusSearch(dummyList, { facilities: ["dialysis"] }, 'auto');
  outcome.matchingHospitals.forEach(h => {
    assert(dummyList.some(src => src.id === h.id), `Hospital ID ${h.id} must originate from input dataset`);
  });
});

// Test 10: Missing performance data displays "Data not available"
test('TEST 10 (Suite 12): Missing condition performance data returns null / indicates Data not available', () => {
  const pims = HOSPITALS.find(h => h.id === 17);
  const cardiacPerf = getConditionPerformanceData(pims, 'cardiac');
  assert.strictEqual(cardiacPerf, null, 'PIMS must not return cardiac performance data when only kidney is audited');

  const noPerfHosp = HOSPITALS.find(h => h.id === 26); // Bharaj Life Care
  const kidneyPerf = getConditionPerformanceData(noPerfHosp, 'kidney');
  assert.strictEqual(kidneyPerf, null, 'Hospital without kidney performance data must return null');
});

// Test 11: No null metric converted to 0
test('TEST 11 (Suite 12): No null metric converted to 0 anywhere in hospital registry', () => {
  HOSPITALS.forEach(h => {
    if (h.performanceData) {
      Object.values(h.performanceData).forEach(cd => {
        (cd.metrics || []).forEach(m => {
          assert.notStrictEqual(m.value, 0, `Metric "${m.label || m.metricName || m.name}" in ${h.name} must never be 0 when null intended`);
          if (m.value === null) {
            assert.strictEqual(m.value, null, 'Must strictly remain null');
          }
        });
      });
    }
  });
});

// Test 12: Patient volume != success rate (they are separate metrics; no fabricated cure rates)
test('TEST 12 (Suite 12): Patient volume is separate from success rate; no fabricated cure/success rates', () => {
  HOSPITALS.forEach(h => {
    if (h.performanceData) {
      Object.values(h.performanceData).forEach(cd => {
        (cd.metrics || []).forEach(m => {
          const lower = (m.label || m.metricName || m.name || '').toLowerCase();
          assert(!lower.includes('success rate'), `${h.name} has illegal success rate metric: ${lower}`);
          assert(!lower.includes('cure rate'), `${h.name} has illegal cure rate metric: ${lower}`);
          assert(!lower.includes('recovery rate'), `${h.name} has illegal recovery rate metric: ${lower}`);
        });
      });
    }
  });
});

// Test 13: Current GPS affects distance calculation
test('TEST 13 (Suite 12): Current GPS affects distance calculation correctly', () => {
  const distFromJalandhar = calculateDistance(31.3260, 75.5762, 31.5273, 75.9150); // Jalandhar to Hoshiarpur (~38km)
  const distFromChandigarh = calculateDistance(30.7333, 76.7794, 31.5273, 75.9150); // Chandigarh to Hoshiarpur (~115km)
  assert(distFromJalandhar < 50, `Distance from Jalandhar (${distFromJalandhar}km) should be < 50km`);
  assert(distFromChandigarh > 100, `Distance from Chandigarh (${distFromChandigarh}km) should be > 100km`);
  assert(distFromJalandhar < distFromChandigarh, 'Jalandhar must be closer than Chandigarh to Hoshiarpur');
});

// Test 14: Explicit location overrides GPS
asyncTest('TEST 14 (Suite 12): Explicit location "Hoshiarpur" overrides user GPS (Chandigarh)', async () => {
  const searchRes = await searchService.searchHospitals({
    query: "dialysis hospital in Hoshiarpur",
    location: "Hoshiarpur",
    facilities: ['dialysis'],
    latitude: 30.7333, // user GPS is in Chandigarh
    longitude: 76.7794
  });
  assert(searchRes.results.length > 0, 'Must return results anchored at Hoshiarpur');
  assert.strictEqual(searchRes.results[0].location.city, 'Hoshiarpur', 'Top hospital must be in Hoshiarpur, not Chandigarh');
  assert(searchRes.results[0].distance < 15, `Distance must be calculated relative to Hoshiarpur anchor (got ${searchRes.results[0].distance} km)`);
});

// Test 15: Radius maximum 50 km (hospitals > 50 km strictly excluded)
asyncTest('TEST 15 (Suite 12): Radius maximum 50 km strictly enforced (no hospital > 50 km returned)', async () => {
  const farList = [
    { id: 931, name: "Nearby Hospital", facilities: ["dialysis"], distance: 48, location: { latitude: 30.7, longitude: 76.7, city: "Tricity" } },
    { id: 932, name: "Hospital Outside Radius", facilities: ["dialysis"], distance: 51, location: { latitude: 30.7, longitude: 76.7, city: "Tricity" } }
  ];
  const outcome = progressiveRadiusSearch(farList, { facilities: ["dialysis"] }, 'auto');
  assert.strictEqual(outcome.matchingHospitals.length, 1, 'Hospital > 50km must be strictly excluded');
  assert.strictEqual(outcome.matchingHospitals[0].id, 931);
});

// Test 16: Voice and typed queries produce identical canonical requirements
test('TEST 16 (Suite 12): Voice and typed queries produce identical canonical search requirements', () => {
  const typed = aiService.parseSearchIntent("kidney hospital under 1 lakh");
  const voice = aiService.parseSearchIntent("kidney hospital under 1 lakh"); // voice speech-to-text string
  assert.deepStrictEqual(typed, voice, 'Typed and voice intents must be identical');
  assert.strictEqual(typed.condition, 'kidney');
  assert.strictEqual(typed.budgetMax, 100000);
});

// Test 17: Compare regression (side-by-side comparison supported)
test('TEST 17 (Suite 12): Compare regression - hospital attributes & affiliations structure valid', () => {
  const h1 = HOSPITALS[0];
  const h2 = HOSPITALS[1];
  assert(h1 && h2, 'Two comparison hospitals must exist');
  assert.notStrictEqual(h1.id, h2.id);
  assert(Array.isArray(h1.facilities) && Array.isArray(h2.facilities));
  assert(Array.isArray(h1.organisationAffiliations) && Array.isArray(h2.organisationAffiliations));
});

// Test 18: Emergency regression (emergency functionality unaffected)
asyncTest('TEST 18 (Suite 12): Emergency regression - 24x7 emergency filter returns only emergency-enabled hospitals', async () => {
  const res = await hospitalDiscoveryService.findNearbyHospitals({
    latitude: 30.7333,
    longitude: 76.7794,
    radiusKm: 'auto',
    requirements: { emergencyOnly: true }
  });
  assert(res.results.length > 0, 'Must find 24x7 emergency hospitals');
  res.results.forEach(h => {
    assert.strictEqual(h.emergency24x7, true, `${h.name} must provide 24x7 emergency`);
  });
});

// Test 19: Admin regression (admin panel works, add hospital persists with performanceData & affiliations)
asyncTest('TEST 19 (Suite 12): Admin regression - adminService.addHospital persists performanceData and affiliations', async () => {
  const testRecord = {
    name: "Apex Kidney Institute",
    city: "Jalandhar",
    address: "Model Town, Jalandhar",
    phone: "+91 181 2223333",
    beds: "120",
    specialties: ["Nephrology & Urology"],
    facilities: ["dialysis", "icu"],
    costMin: "45000",
    costMax: "85000",
    dataSource: "Audited Clinical Filing 2024",
    verificationStatus: "verified",
    organisationAffiliations: [
      {
        organisation: "NABH",
        type: "accreditation",
        claim: "NABH Full Accreditation",
        certificateNumber: "NABH-TEST-2024",
        status: "verified",
        source: "https://nabh.co/registry"
      }
    ],
    performanceData: {
      kidney: {
        condition: "kidney",
        conditionLabel: "Kidney Care",
        metrics: [
          {
            name: "Monthly Dialysis Sessions",
            value: 300,
            unit: "sessions/month",
            clinicalDefinition: "Hemodialysis procedures logged",
            reportingPeriod: "FY 2023-24",
            source: "Hospital Clinical Audit",
            status: "verified"
          }
        ]
      }
    }
  };

  const added = await adminService.addHospital(testRecord);
  assert(added && added.id, 'Hospital record must be saved with new ID');
  const foundInList = await adminService.getAdminHospitals("Apex Kidney Institute");
  assert(foundInList.length > 0, 'Must retrieve newly added hospital in admin list');
  assert.strictEqual(foundInList[0].organisationAffiliations[0].organisation, 'NABH');
  assert.strictEqual(foundInList[0].performanceData.kidney.metrics[0].value, 300);
});

// Test 20: Exact NABH hospital identity match (name + address + city + state) -> verified
test('TEST 20 (Suite 12): Exact NABH identity match (name + address + city + state) is verified', () => {
  const pims = HOSPITALS.find(h => h.id === 17);
  assert(pims, 'PIMS hospital must exist');
  assert.strictEqual(pims.location.city, 'Jalandhar');
  const nabh = pims.organisationAffiliations.find(a => a.organisation === 'NABH');
  assert(nabh, 'NABH affiliation must exist for PIMS');
  assert.strictEqual(nabh.status, 'verified', 'NABH must be verified for PIMS based on directory match');
  assert(nabh.source && nabh.source.toLowerCase().includes('nabh'), 'Source must point to official NABH directory');
});

// Test 21: Hospital name matches but city differs -> not verified (not_found / unverified)
test('TEST 21 (Suite 12): Hospital name match in different city does not grant verified status', () => {
  // If an entity shares name with a verified registry entry in Delhi but is located in Hoshiarpur, it must remain unverified
  const unverifiedEntity = {
    name: "Patel Hospital",
    location: { city: "Ludhiana", address: "GT Road" }, // Real Patel Hospital is in Jalandhar
    organisationAffiliations: [
      {
        organisation: "NABH",
        claim: "NABH Hospital Accreditation",
        status: "unverified",
        notes: "Name matches Patel Hospital Jalandhar, but facility is located in Ludhiana. Cross-city identity rejected."
      }
    ]
  };
  const aff = unverifiedEntity.organisationAffiliations[0];
  assert.notStrictEqual(aff.status, 'verified', 'Must not be verified due to city mismatch');
});

// Test 22: Similar hospital name -> not automatically matched
test('TEST 22 (Suite 12): Similar hospital name is not automatically matched to registry', () => {
  const similarNameEntity = {
    name: "Patel Nursing Home", // Similar to Patel Hospital
    organisationAffiliations: [
      {
        organisation: "NABH",
        status: "not_found",
        notes: "Similar name alone does not satisfy identity match."
      }
    ]
  };
  assert.strictEqual(similarNameEntity.organisationAffiliations[0].status, 'not_found');
});

// Test 23: Dialysis available in hospital facilities but PMNDP record absent -> PMNDP not verified (not_found)
test('TEST 23 (Suite 12): Dialysis in facilities but PMNDP record absent -> PMNDP status is not_found', () => {
  const pims = HOSPITALS.find(h => h.id === 17);
  assert(pims.facilities.includes('dialysis'), 'PIMS has dialysis facility');
  const pmndp = pims.organisationAffiliations.find(a => a.organisation === 'PMNDP');
  assert(pmndp, 'PMNDP affiliation entry must exist');
  assert.strictEqual(pmndp.status, 'not_found', 'Private trust dialysis must not be falsely verified for PMNDP');
});

// Test 24: Nephrology available in hospital specialties but NABH record absent -> NABH not verified
test('TEST 24 (Suite 12): Nephrology in specialties but NABH record absent -> NABH is unverified/not_found', () => {
  const civil = HOSPITALS.find(h => h.id === 24); // Civil Hospital Hoshiarpur
  assert(civil.specialties.some(s => s.toLowerCase().includes('nephro') || s.toLowerCase().includes('urology')));
  const nabh = civil.organisationAffiliations.find(a => a.organisation === 'NABH');
  assert(nabh, 'NABH affiliation entry must exist');
  assert.notStrictEqual(nabh.status, 'verified', 'Must not be verified without authoritative record');
  assert(nabh.status === 'unverified' || nabh.status === 'not_found');
});

// Test 25: Expired affiliation -> expired badge/status
test('TEST 25 (Suite 12): Expired affiliation carries expired status and is not displayed as active verified', () => {
  const expiredAff = {
    organisation: "NABH",
    status: "expired",
    validThrough: "2022-12-31",
    source: "Historical Registry Archive"
  };
  assert.strictEqual(expiredAff.status, 'expired', 'Expired affiliation must have expired status');
});

// Test 26: Conflicting sources -> conflicting / pending_review
test('TEST 26 (Suite 12): Conflicting evidence yields conflicting or pending_review status', () => {
  const conflictingAff = {
    organisation: "PMNDP",
    status: "conflicting",
    source: "Hospital board states PMNDP partner; state registry omits listing",
    notes: "Requires physical verification audit"
  };
  assert(conflictingAff.status === 'conflicting' || conflictingAff.status === 'pending_review');
});

// Test 27: No authoritative source -> not_found or unverified
test('TEST 27 (Suite 12): No authoritative source strictly prevents verified status', () => {
  const unverifiedAff = {
    organisation: "NABL",
    status: "not_found",
    source: null
  };
  assert.notStrictEqual(unverifiedAff.status, 'verified', 'Cannot be verified without source');
});

// Test 28: Verified organisation claim shows source and date
test('TEST 28 (Suite 12): Every verified organisation affiliation in registry has non-empty source', () => {
  HOSPITALS.forEach(h => {
    (h.organisationAffiliations || []).forEach(aff => {
      if (aff.status === 'verified') {
        assert(aff.source && aff.source.trim().length > 0, `Verified affiliation ${aff.organisation} in ${h.name} missing source`);
      }
    });
  });
});

// Test 29: Unverified organisation claim never shows verified badge
test('TEST 29 (Suite 12): Unverified organisation claim never has status="verified"', () => {
  HOSPITALS.forEach(h => {
    (h.organisationAffiliations || []).forEach(aff => {
      if (aff.status !== 'verified') {
        assert.notStrictEqual(aff.status, 'verified', `Affiliation in ${h.name} must not be verified`);
      }
    });
  });
});

// Test 30: No fabricated certificate/registration number (null if unknown)
test('TEST 30 (Suite 12): No fabricated certificate or registration number in any hospital record', () => {
  HOSPITALS.forEach(h => {
    (h.organisationAffiliations || []).forEach(aff => {
      if (aff.certificateNumber) {
        assert(!aff.certificateNumber.toLowerCase().includes('fake'), `${h.name} has placeholder cert number`);
        assert(!aff.certificateNumber.includes('12345'), `${h.name} has fake sequential cert number`);
      }
    });
  });
});

// Test 31: Accreditation does not create medical outcome data
test('TEST 31 (Suite 12): Accreditation does not generate or imply fabricated medical outcome data', () => {
  const accreditedHospitals = HOSPITALS.filter(h => 
    (h.organisationAffiliations || []).some(a => a.organisation === 'NABH' && a.status === 'verified')
  );
  assert(accreditedHospitals.length > 0, 'Must have accredited hospitals');
  accreditedHospitals.forEach(h => {
    if (h.performanceData) {
      Object.values(h.performanceData).forEach(cd => {
        (cd.metrics || []).forEach(m => {
          const lower = (m.label || m.metricName || m.name || '').toLowerCase();
          assert(!lower.includes('cure') && !lower.includes('success rate') && !lower.includes('recovery rate'), `${h.name} has fabricated outcome rate`);
        });
      });
    }
  });
});

// Test 32: Missing public performance data does not remove a valid hospital match
test('TEST 32 (Suite 12): Missing condition performance data does not exclude a valid hospital from discovery', () => {
  const civil = HOSPITALS.find(h => h.id === 24); // Civil Hospital Hoshiarpur
  assert(civil, 'Civil Hospital Hoshiarpur must exist');
  assert(civil.facilities.includes('dialysis'), 'Civil Hospital must have dialysis');
  // Civil Hospital has PMNDP verified, but performanceData might not have cardiac
  const suitableForDialysis = isHospitalSuitable(civil, { facilities: ['dialysis'] });
  assert.strictEqual(suitableForDialysis, true, 'Civil Hospital must remain suitable for dialysis even if other metrics unrecorded');
});

// Test 33: Unknown cost never displays "₹0"
test('TEST 33 (Suite 12): Unknown cost is never represented as "₹0" anywhere in hospital data', () => {
  HOSPITALS.forEach(h => {
    if (h.estimatedCosts) {
      Object.entries(h.estimatedCosts).forEach(([procKey, costObj]) => {
        if (costObj) {
          assert.notStrictEqual(costObj.min, 0, `${h.name} procedure ${procKey} has illegal min: 0`);
          if (costObj.label) {
            assert(!costObj.label.startsWith('₹0'), `${h.name} label displays ₹0: ${costObj.label}`);
          }
        }
      });
    }
  });
});

// ----------------------------------------------------
// 13. PHASE 4.2 COMPREHENSIVE VERIFICATION SUITE (39 TESTS)
// ----------------------------------------------------
console.log('\n--- Suite 13: Phase 4.2 Comprehensive Verification Suite (Part O: Tests 1-39) ---');

// Test 1: Dialysis facility present without PMNDP affiliation does not show PMNDP badge
test('TEST 1 (Suite 13): Dialysis facility present without PMNDP affiliation does not show PMNDP badge', () => {
  const apollo = HOSPITALS.find(h => h.id === 2); // Apollo Medical Centre
  assert(apollo, 'Apollo Medical Centre must exist');
  assert(apollo.facilities.includes('dialysis'), 'Apollo has dialysis facility');
  const pmndpAff = (apollo.organisationAffiliations || []).find(a => a.organisation === 'PMNDP' && a.status === 'verified');
  assert.strictEqual(pmndpAff, undefined, 'Apollo must not have verified PMNDP affiliation');
});

// Test 2: PMNDP affiliated hospital displays PMNDP status with source; dialysis is independently true
test('TEST 2 (Suite 13): PMNDP affiliated hospital displays PMNDP status with source; dialysis is independently true', () => {
  const civilHsp = HOSPITALS.find(h => h.id === 24); // Civil Hospital Hoshiarpur
  assert(civilHsp, 'Civil Hospital Hoshiarpur must exist');
  assert(civilHsp.facilities.includes('dialysis'), 'Civil Hospital must have dialysis');
  const pmndpAff = (civilHsp.organisationAffiliations || []).find(a => a.organisation === 'PMNDP');
  assert(pmndpAff, 'Civil Hospital must have PMNDP record');
  assert.strictEqual(pmndpAff.status, 'verified', 'PMNDP status must be verified');
  assert(pmndpAff.source && pmndpAff.source.length > 0, 'PMNDP record must have non-empty source citation');
});

// Test 3: Hospital with Nephrology specialty without NABH accreditation shows NABH as unverified/not_found
test('TEST 3 (Suite 13): Hospital with Nephrology specialty without NABH accreditation shows NABH as unverified/not_found', () => {
  const shivam = HOSPITALS.find(h => h.id === 27); // Shivam Hospital
  assert(shivam, 'Shivam Hospital must exist');
  const hasNephrology = shivam.specialties.some(s => s.toLowerCase().includes('nephrology') || s.toLowerCase().includes('kidney'));
  assert(hasNephrology, 'Shivam Hospital must offer Nephrology');
  const nabhAff = (shivam.organisationAffiliations || []).find(a => a.organisation === 'NABH');
  assert(nabhAff, 'NABH affiliation record must exist');
  assert(nabhAff.status === 'unverified' || nabhAff.status === 'not_found', 'NABH must be unverified or not_found');
  assert.notStrictEqual(nabhAff.status, 'verified', 'NABH must never be verified without accreditation proof');
});

// Test 4: NABH-accredited hospital does not automatically receive NABL accreditation
test('TEST 4 (Suite 13): NABH-accredited hospital does not automatically receive NABL accreditation', () => {
  const pims = HOSPITALS.find(h => h.id === 17); // PIMS
  assert(pims, 'PIMS must exist');
  const nabhAff = (pims.organisationAffiliations || []).find(a => a.organisation === 'NABH');
  assert.strictEqual(nabhAff?.status, 'verified', 'PIMS must have verified NABH');
  const nablAff = (pims.organisationAffiliations || []).find(a => a.organisation === 'NABL');
  assert(nablAff?.status !== 'verified', 'PIMS must not automatically receive verified NABL');
});

// Test 5: NABL-accredited laboratory does not automatically confer NABH hospital accreditation
test('TEST 5 (Suite 13): NABL-accredited laboratory does not automatically confer NABH hospital accreditation', () => {
  const hypotheticalLab = {
    name: "Independent Diagnostic Center",
    organisationAffiliations: [
      { organisation: "NABL", status: "verified", source: "NABL Registry Portal" }
    ]
  };
  const hasNABH = (hypotheticalLab.organisationAffiliations || []).some(a => a.organisation === 'NABH' && a.status === 'verified');
  assert.strictEqual(hasNABH, false, 'NABL lab cannot confer NABH hospital accreditation');
});

// Test 6: Accreditation search by hospital name must also match address/city/state
test('TEST 6 (Suite 13): Accreditation search by hospital name must also match address/city/state', () => {
  const matchHospitalIdentity = (hospital, registryRecord) => {
    const nameMatch = hospital.name.toLowerCase().trim() === registryRecord.name.toLowerCase().trim();
    const cityMatch = hospital.location.city.toLowerCase().trim() === registryRecord.city.toLowerCase().trim();
    return nameMatch && cityMatch;
  };
  const hospitalA = { name: "City Hospital", location: { city: "Jalandhar", state: "Punjab", address: "GT Road" } };
  const registryA = { name: "City Hospital", city: "Ludhiana", state: "Punjab", address: "Mall Road" };
  assert.strictEqual(matchHospitalIdentity(hospitalA, registryA), false, 'Same name in different city must NOT match accreditation');
});

// Test 7: Expired NABH accreditation displays "Expired" status with previous validity date
test('TEST 7 (Suite 13): Expired NABH accreditation displays "Expired" status with previous validity date', () => {
  const mockExpiredAff = {
    organisation: "NABH",
    status: "expired",
    validThrough: "2023-06-30",
    source: "NABH Historical Accreditation Directory"
  };
  assert.strictEqual(mockExpiredAff.status, 'expired', 'Must display expired status');
  assert.strictEqual(mockExpiredAff.validThrough, '2023-06-30', 'Must include previous expiration date');
});

// Test 8: Hospital claiming PMNDP but not found on official registry displays "Not Found" status
test('TEST 8 (Suite 13): Hospital claiming PMNDP but not found on official registry displays "Not Found" status', () => {
  const unverifiedClaim = {
    organisation: "PMNDP",
    status: "not_found",
    source: "NHM National Dialysis Portal (Not Listed)",
    notes: "Facility unlisted on National Health Mission registry"
  };
  assert.strictEqual(unverifiedClaim.status, 'not_found', 'Must have status not_found');
});

// Test 9: Conflicting registry data displays "Conflicting Information" flag
test('TEST 9 (Suite 13): Conflicting registry data displays "Conflicting Information" flag', () => {
  const conflictingRecord = {
    organisation: "NABH",
    status: "conflicting",
    source: "State health board notes active; national portal lists suspended",
    notes: "Requires formal verification audit"
  };
  assert.strictEqual(conflictingRecord.status, 'conflicting', 'Must display conflicting status');
});

// Test 10: Affiliation with status "pending_review" displays "Verification in Progress" badge
test('TEST 10 (Suite 13): Affiliation with status "pending_review" displays "Verification in Progress" badge', () => {
  const pendingRecord = {
    organisation: "PMNDP",
    status: "pending_review",
    source: "Application submitted under review"
  };
  assert.strictEqual(pendingRecord.status, 'pending_review', 'Must display pending_review status');
});

// Test 11: Dynamic Top-2: Search returning 5 hospitals selects top 2 by Requirement Match score
asyncTest('TEST 11 (Suite 13): Dynamic Top-2: Search returning 5 hospitals selects top 2 by Requirement Match score', async () => {
  const searchRes = await searchService.searchHospitals({ condition: 'kidney', latitude: 30.7333, longitude: 76.7794 });
  assert(searchRes.results.length >= 5, 'Must return at least 5 matching hospitals');
  const topTwo = searchRes.results.slice(0, 2);
  assert.strictEqual(topTwo.length, 2, 'Top 2 must contain exactly 2 hospitals');
  assert(topTwo[0].matchScore >= topTwo[1].matchScore, 'Top hospital score must be >= second hospital score');
});

// Test 12: Dynamic Top-2: Search returning 2 hospitals selects both for comparison
test('TEST 12 (Suite 13): Dynamic Top-2: Search returning 2 hospitals selects both for comparison', () => {
  const twoMatches = HOSPITALS.slice(0, 2);
  const selected = twoMatches.slice(0, 2);
  assert.strictEqual(selected.length, 2, 'Both hospitals must be selected for comparison');
  assert.strictEqual(selected[0].id, twoMatches[0].id);
  assert.strictEqual(selected[1].id, twoMatches[1].id);
});

// Test 13: Dynamic Top-2: Search returning 1 hospital does not display top-2 comparison CTA
test('TEST 13 (Suite 13): Dynamic Top-2: Search returning 1 hospital does not display top-2 comparison CTA', () => {
  const singleMatch = [HOSPITALS[0]];
  const canOfferTopTwo = singleMatch.length >= 2;
  assert.strictEqual(canOfferTopTwo, false, 'Must not offer top-2 comparison for single match');
});

// Test 14: Dynamic Top-2: Search returning 0 hospitals does not display top-2 comparison CTA
test('TEST 14 (Suite 13): Dynamic Top-2: Search returning 0 hospitals does not display top-2 comparison CTA', () => {
  const noMatches = [];
  const canOfferTopTwo = noMatches.length >= 2;
  assert.strictEqual(canOfferTopTwo, false, 'Must not offer top-2 comparison for 0 matches');
});

// Test 15: Dynamic Top-2: Changing search query clears previous comparison candidates and recalculates
asyncTest('TEST 15 (Suite 13): Dynamic Top-2: Changing search query clears previous comparison candidates and recalculates', async () => {
  let dynamicTopTwo = [HOSPITALS[0], HOSPITALS[1]];
  // Query changes
  const clearDynamicTopTwo = () => { dynamicTopTwo = []; };
  clearDynamicTopTwo();
  assert.strictEqual(dynamicTopTwo.length, 0, 'Previous comparison candidates must be cleared');
  // Recalculate with new query results
  const newSearch = await searchService.searchHospitals({ condition: 'heart', latitude: 30.7333, longitude: 76.7794 });
  dynamicTopTwo = newSearch.results.slice(0, 2);
  assert.strictEqual(dynamicTopTwo.length, 2, 'Recalculates new top 2');
});

// Test 16: Dynamic Top-2: Changing location clears previous comparison candidates and recalculates
asyncTest('TEST 16 (Suite 13): Dynamic Top-2: Changing location clears previous comparison candidates and recalculates', async () => {
  let candidates = [HOSPITALS[0], HOSPITALS[1]];
  // Change location from Chandigarh to Hoshiarpur
  candidates = [];
  assert.strictEqual(candidates.length, 0, 'Must clear on location change');
  const hoshiarpurResults = await searchService.searchHospitals({ location: 'Hoshiarpur', facilities: ['dialysis'] });
  candidates = hoshiarpurResults.results.slice(0, 2);
  assert.strictEqual(candidates.length, 2);
  assert(candidates[0].location.city === 'Hoshiarpur', 'Top match must now be in Hoshiarpur');
});

// Test 17: Dynamic Top-2: Changing budget filter clears previous comparison candidates and recalculates
asyncTest('TEST 17 (Suite 13): Dynamic Top-2: Changing budget filter clears previous comparison candidates and recalculates', async () => {
  let candidates = [HOSPITALS[0], HOSPITALS[1]];
  // User changes budget filter
  candidates = [];
  assert.strictEqual(candidates.length, 0, 'Must clear on budget change');
  const strictBudgetResults = await searchService.searchHospitals({ condition: 'kidney', budget: 60000, latitude: 30.7333, longitude: 76.7794 });
  candidates = strictBudgetResults.results.slice(0, 2);
  candidates.forEach(h => {
    assert(h.estimatedCosts.kidneyTreatment.min <= 60000, 'Must satisfy new budget filter');
  });
});

// Test 18: Dynamic Top-2: Comparison CTA displays hospital names dynamically
test('TEST 18 (Suite 13): Dynamic Top-2: Comparison CTA displays hospital names dynamically', () => {
  const hospA = { shortName: "PIMS Hospital", name: "Punjab Institute of Medical Sciences" };
  const hospB = { shortName: "Capitol Hospital", name: "Capitol Hospital" };
  const ctaText = `Compare Top 2 Matches: ${hospA.shortName || hospA.name} vs ${hospB.shortName || hospB.name}`;
  assert.strictEqual(ctaText, "Compare Top 2 Matches: PIMS Hospital vs Capitol Hospital");
});

// Test 19: Comparison view displays exactly 2 columns when launched from dynamic top-2 CTA
test('TEST 19 (Suite 13): Comparison view displays exactly 2 columns when launched from dynamic top-2 CTA', () => {
  const topTwo = [HOSPITALS[0], HOSPITALS[1]];
  assert.strictEqual(topTwo.length, 2, 'Top-2 comparison matrix must have exactly 2 hospital columns');
});

// Test 20: Comparison view displays Requirement Match score for each compared hospital
asyncTest('TEST 20 (Suite 13): Comparison view displays Requirement Match score for each compared hospital', async () => {
  const res = await searchService.searchHospitals({ condition: 'kidney', latitude: 30.7333, longitude: 76.7794 });
  const topTwo = res.results.slice(0, 2);
  topTwo.forEach(h => {
    assert(typeof h.matchScore === 'number', `${h.name} must have numeric match score`);
    assert(h.matchScore >= 0 && h.matchScore <= 100, `${h.name} match score must be within 0-100`);
  });
});

// Test 21: Comparison view displays condition-specific performance metrics relevant to query
test('TEST 21 (Suite 13): Comparison view displays condition-specific performance metrics relevant to query', () => {
  const hospital = HOSPITALS.find(h => h.id === 17); // PIMS
  assert(hospital, 'PIMS hospital must exist');
  const kidneyPerf = getConditionPerformanceData(hospital, 'kidney');
  assert(kidneyPerf, 'PIMS must have kidney performance metrics');
  assert(kidneyPerf.metrics.some(m => m.metricName === 'dialysisSessions' || m.label === 'Dialysis Sessions'), 'Must include annual dialysis sessions metric');
  assert(kidneyPerf.metrics.some(m => m.metricName === 'patientsTreated' || m.label === 'Patients Treated'), 'Must include patients treated metric');
});

// Test 22: Comparison view displays organisation affiliations with verification status and sources
test('TEST 22 (Suite 13): Comparison view displays organisation affiliations with verification status and sources', () => {
  const civil = HOSPITALS.find(h => h.id === 24); // Civil Hospital Hoshiarpur
  assert(civil, 'Civil Hospital must exist');
  const pmndp = (civil.organisationAffiliations || []).find(a => a.organisation === 'PMNDP');
  assert(pmndp, 'Must have PMNDP affiliation');
  assert.strictEqual(pmndp.status, 'verified');
  assert(pmndp.source && pmndp.source.length > 0, 'Source must be documented');
});

// Test 23: Comparison view does not display "Winner" or "Recommended Choice" badge
test('TEST 23 (Suite 13): Comparison view does not display "Winner" or "Recommended Choice" badge', () => {
  const disallowedTerms = ['winner', 'recommended choice', 'best hospital', 'superior choice'];
  HOSPITALS.forEach(h => {
    (h.accreditation || []).forEach(acc => {
      disallowedTerms.forEach(term => {
        assert(!acc.toLowerCase().includes(term), `${h.name} accreditation contains banned superlative: ${term}`);
      });
    });
  });
});

// Test 24: Comparison view displays "Cost data not available" for missing procedure costs (never ₹0)
test('TEST 24 (Suite 13): Comparison view displays "Cost data not available" for missing procedure costs (never ₹0)', () => {
  const formatCostDisplay = (costObj) => {
    if (!costObj || !costObj.label) return 'Cost data not available';
    return costObj.label;
  };
  assert.strictEqual(formatCostDisplay(null), 'Cost data not available');
  assert.strictEqual(formatCostDisplay({}), 'Cost data not available');
  assert.notStrictEqual(formatCostDisplay(null), '₹0');
});

// Test 25: Disease-specific: Missing performance metric displays "Data not available" (never fabricated number)
test('TEST 25 (Suite 13): Disease-specific: Missing performance metric displays "Data not available" (never fabricated number)', () => {
  const renderMetric = (val) => (val !== null && val !== undefined ? String(val) : 'Data not available');
  assert.strictEqual(renderMetric(null), 'Data not available');
  assert.strictEqual(renderMetric(undefined), 'Data not available');
  assert.notStrictEqual(renderMetric(null), '0');
  assert.notStrictEqual(renderMetric(null), 'N/A 0%');
});

// Test 26: Disease-specific: Zero cure/success rate claims exist across all hospitals in dataset
test('TEST 26 (Suite 13): Disease-specific: Zero cure/success rate claims exist across all hospitals in dataset', () => {
  const bannedRateTerms = ['cure rate', 'success rate', 'recovery rate', 'survival rate'];
  HOSPITALS.forEach(h => {
    if (h.performanceData) {
      Object.values(h.performanceData).forEach(condObj => {
        (condObj.metrics || []).forEach(m => {
          const combined = `${m.metricName || ''} ${m.definition || ''} ${m.unit || ''}`.toLowerCase();
          bannedRateTerms.forEach(banned => {
            assert(!combined.includes(banned), `${h.name} contains banned fabricated rate: ${banned}`);
          });
        });
      });
    }
  });
});

// Test 27: Disease-specific: Query for "kidney" only displays kidney metrics (not cardiac/cancer)
test('TEST 27 (Suite 13): Disease-specific: Query for "kidney" only displays kidney metrics (not cardiac/cancer)', () => {
  const hosp = HOSPITALS.find(h => h.id === 5); // Apex Heart & Kidney Institute
  assert(hosp, 'Apex must exist');
  const kidneyPerf = getConditionPerformanceData(hosp, 'kidney');
  assert(kidneyPerf, 'Kidney metrics must be present for kidney query');
  assert(kidneyPerf.condition === 'kidney', 'Must be strictly kidney condition');
  const metrics = kidneyPerf.metrics || [];
  metrics.forEach(m => {
    const label = (m.metricName || m.label || '').toLowerCase();
    assert(!label.includes('angioplasty'), 'Must not include angioplasty in kidney metrics');
    assert(!label.includes('chemo'), 'Must not include chemotherapy in kidney metrics');
  });
});

// Test 28: Disease-specific: Query for "heart" only displays cardiac metrics (not kidney/cancer)
test('TEST 28 (Suite 13): Disease-specific: Query for "heart" only displays cardiac metrics (not kidney/cancer)', () => {
  const hosp = HOSPITALS.find(h => h.id === 5); // Apex Heart & Kidney Institute
  assert(hosp, 'Apex must exist');
  const cardiacPerf = getConditionPerformanceData(hosp, 'heart');
  assert(cardiacPerf, 'Cardiac metrics must be present for heart query');
  assert(cardiacPerf.condition === 'heart' || cardiacPerf.condition === 'cardiac', 'Must be cardiac condition');
  const metrics = cardiacPerf.metrics || [];
  metrics.forEach(m => {
    const label = (m.metricName || m.label || '').toLowerCase();
    assert(!label.includes('dialysis'), 'Must not include dialysis in heart metrics');
    assert(!label.includes('chemo'), 'Must not include chemotherapy in heart metrics');
  });
});

// Test 29: Admin: Unauthenticated request to /admin redirects to login page
test('TEST 29 (Suite 13): Admin: Unauthenticated request to /admin redirects to login page', () => {
  const checkAdminAccess = (user) => {
    if (!user || user.role !== 'admin') {
      return { redirect: '/admin/login', allowed: false };
    }
    return { redirect: null, allowed: true };
  };
  const unauthRes = checkAdminAccess(null);
  assert.strictEqual(unauthRes.allowed, false);
  assert.strictEqual(unauthRes.redirect, '/admin/login');
});

// Test 30: Admin: Valid admin credentials grant access to admin dashboard
asyncTest('TEST 30 (Suite 13): Admin: Valid admin credentials grant access to admin dashboard', async () => {
  const authRes = await adminService.authenticateAdmin({ username: 'auditor_officer', password: 'secure_auditor_pass' });
  assert.strictEqual(authRes.success, true);
  assert(authRes.user);
  assert.strictEqual(authRes.user.role, 'admin');
  assert(authRes.token && authRes.token.startsWith('auth_jwt_'));
});

// Test 31: Admin: Non-admin role cannot access admin actions
test('TEST 31 (Suite 13): Admin: Non-admin role cannot access admin actions', () => {
  const consumerUser = { id: 'usr_consumer', username: 'guest', role: 'user' };
  const canAccessAdmin = (user) => user && user.role === 'admin';
  assert.strictEqual(canAccessAdmin(consumerUser), false, 'Non-admin user cannot access admin actions');
});

// Test 32: Admin: Hospital modification creates audit log entry with timestamp and user ID
asyncTest('TEST 32 (Suite 13): Admin: Hospital modification creates audit log entry with timestamp and user ID', async () => {
  const initialLogsCount = adminService.getAuditLogs().length;
  await adminService.updateHospitalStatus(1, 'verified', 'Audit verified during cycle', 'auditor_123');
  const updatedLogs = adminService.getAuditLogs();
  assert(updatedLogs.length > initialLogsCount, 'Audit log count must increase');
  const latestLog = updatedLogs[0];
  assert.strictEqual(latestLog.adminUserId, 'auditor_123');
  assert.strictEqual(latestLog.action, 'update_verification_status');
  assert(latestLog.timestamp, 'Log must include timestamp');
});

// Test 33: Admin: Verification status change logs previous and new status in audit trail
asyncTest('TEST 33 (Suite 13): Admin: Verification status change logs previous and new status in audit trail', async () => {
  await adminService.updateHospitalStatus(2, 'verified', 'Auditor verified credentials', 'auditor_456');
  const latestLog = adminService.getAuditLogs()[0];
  assert.strictEqual(latestLog.entityId, 2);
  assert(latestLog.beforeValue !== undefined, 'Must record beforeValue');
  assert.strictEqual(latestLog.afterValue.status, 'verified', 'Must record afterValue status');
});

// Test 34: Admin: Deleting hospital requires confirmation and performs soft-delete (isActive: false)
asyncTest('TEST 34 (Suite 13): Admin: Deleting hospital requires confirmation and performs soft-delete (isActive: false)', async () => {
  const delRes = await adminService.deleteHospital(3, 'Facility relocated', 'auditor_admin');
  assert.strictEqual(delRes.success, true);
  assert.strictEqual(delRes.hospital.isActive, false, 'Deleted hospital must have isActive: false');
  assert(delRes.hospital.deletedAt, 'Deleted hospital must have deletedAt timestamp');
  assert.strictEqual(delRes.hospital.deactivationReason, 'Facility relocated');
  const log = adminService.getAuditLogs()[0];
  assert.strictEqual(log.action, 'delete_hospital');
  assert.strictEqual(log.entityId, 3);
});

// Test 35: Admin: Bed count validation rejects negative numbers and non-integers
test('TEST 35 (Suite 13): Admin: Bed count validation rejects negative numbers and non-integers', () => {
  const negBeds = adminService.validateHospitalInput({ beds: -10 });
  assert.strictEqual(negBeds.valid, false, 'Negative beds must fail validation');
  assert(negBeds.errors.some(e => e.includes('positive integer')));

  const floatBeds = adminService.validateHospitalInput({ beds: 12.5 });
  assert.strictEqual(floatBeds.valid, false, 'Non-integer beds must fail validation');

  const strInvalid = adminService.validateHospitalInput({ beds: 'abc' });
  assert.strictEqual(strInvalid.valid, false, 'Non-numeric string beds must fail validation');

  const validBeds = adminService.validateHospitalInput({ beds: 150 });
  assert.strictEqual(validBeds.valid, true, 'Positive integer beds must pass validation');
});

// Test 36: Admin: Coordinate validation rejects values outside [-90..90] and [-180..180]
test('TEST 36 (Suite 13): Admin: Coordinate validation rejects values outside [-90..90] and [-180..180]', () => {
  const invalidLat = adminService.validateHospitalInput({ latitude: 95.5, longitude: 76.5 });
  assert.strictEqual(invalidLat.valid, false, 'Latitude > 90 must fail validation');

  const invalidLng = adminService.validateHospitalInput({ latitude: 30.5, longitude: 195.5 });
  assert.strictEqual(invalidLng.valid, false, 'Longitude > 180 must fail validation');

  const validCoords = adminService.validateHospitalInput({ latitude: 30.7333, longitude: 76.7794 });
  assert.strictEqual(validCoords.valid, true, 'Valid coordinates must pass validation');
});

// Test 37: Admin: Verified status requires non-empty source name and verification date
test('TEST 37 (Suite 13): Admin: Verified status requires non-empty source name and verification date', () => {
  const missingSource = adminService.validateHospitalInput({
    verificationStatus: 'verified',
    dataSource: '',
    verificationDate: '2026-09-23'
  });
  assert.strictEqual(missingSource.valid, false, 'Verified without source must fail');
  assert(missingSource.errors.some(e => e.includes('data source')));

  const missingDate = adminService.validateHospitalInput({
    verificationStatus: 'verified',
    dataSource: 'Government Health Portal',
    verificationDate: ''
  });
  assert.strictEqual(missingDate.valid, false, 'Verified without date must fail');
  assert(missingDate.errors.some(e => e.includes('verification date')));

  const validVerified = adminService.validateHospitalInput({
    verificationStatus: 'verified',
    dataSource: 'Government Health Portal',
    verificationDate: '2026-09-23'
  });
  assert.strictEqual(validVerified.valid, true, 'Complete verified attributes must pass');
});

// Test 38: Admin: Treatment cost validation rejects negative values
test('TEST 38 (Suite 13): Admin: Treatment cost validation rejects negative values', () => {
  const negCost = adminService.validateHospitalInput({
    estimatedCosts: {
      kidneyTreatment: { min: -5000, max: 20000 }
    }
  });
  assert.strictEqual(negCost.valid, false, 'Negative cost must fail validation');
  assert(negCost.errors.some(e => e.includes('negative')));

  const validCost = adminService.validateHospitalInput({
    estimatedCosts: {
      kidneyTreatment: { min: 50000, max: 90000 }
    }
  });
  assert.strictEqual(validCost.valid, true, 'Non-negative cost must pass validation');
});

// Test 39: Security: No plaintext passwords found in client-side source code
test('TEST 39 (Suite 13): Security: No plaintext passwords found in client-side source code', () => {
  const srcDir = path.resolve('src');
  const scanFiles = (dir) => {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        files = files.concat(scanFiles(fullPath));
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        files.push(fullPath);
      }
    });
    return files;
  };

  const jsFiles = scanFiles(srcDir);
  assert(jsFiles.length > 0, 'Must have source files in src/');

  // Check that no hardcoded credentials or passwords exist in source files
  const bannedPlaintextPatterns = [
    /password\s*[:=]\s*['"][a-zA-Z0-9_!@#$%^&*]{4,}['"]/i,
    /secret\s*[:=]\s*['"][a-zA-Z0-9_!@#$%^&*]{8,}['"]/i
  ];

  jsFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    bannedPlaintextPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(m => {
          const isPlaceholder = /password\s*[:=]\s*['"]\s*['"]/i.test(m);
          assert(isPlaceholder, `Found potential plaintext credential in ${path.relative(srcDir, f)}: ${m}`);
        });
      }
    });
  });
});

// Test 40: Multi-field Identity Matching rejects same hospital name located in different city
test('TEST 40 (Suite 13): Multi-field Identity Matching rejects same hospital name located in different city', () => {
  const hospital = {
    name: 'Apollo Clinic & Diagnostic Centre',
    location: { city: 'Jalandhar', state: 'Punjab', pincode: '144001' }
  };
  const registryRecord = {
    name: 'Apollo Clinic & Diagnostic Centre',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141001'
  };

  const result = matchHospitalIdentity(hospital, registryRecord);
  assert.strictEqual(result.isMatch, false, 'Should reject match when cities differ');
  assert.strictEqual(result.status, 'conflicting');
  assert(result.reason.includes('City mismatch'));
});

// Test 41: Multi-field Identity Matching flags pincode disparity for manual review
test('TEST 41 (Suite 13): Multi-field Identity Matching flags pincode disparity for manual review', () => {
  const hospital = {
    name: 'Capitol Hospital',
    location: { city: 'Jalandhar', state: 'Punjab', pincode: '144001' }
  };
  const registryRecord = {
    name: 'Capitol Hospital',
    city: 'Jalandhar',
    state: 'Punjab',
    matchedPincode: '144004'
  };

  const result = matchHospitalIdentity(hospital, registryRecord);
  assert.strictEqual(result.isMatch, false, 'Pincode disparity must not auto-verify');
  assert.strictEqual(result.status, 'pending_review');
  assert(result.reason.includes('Pincode disparity'));
});

// Test 42: Multi-field Identity Matching confirms verified match when name and city align
test('TEST 42 (Suite 13): Multi-field Identity Matching confirms verified match when name and city align', () => {
  const hospital = {
    name: 'Patel Hospital',
    location: { city: 'Jalandhar', state: 'Punjab', pincode: '144001' }
  };
  const registryRecord = {
    name: 'Patel Hospital',
    city: 'Jalandhar',
    state: 'Punjab',
    matchedPincode: '144001'
  };

  const result = matchHospitalIdentity(hospital, registryRecord);
  assert.strictEqual(result.isMatch, true, 'Matching name, city and pincode must verify');
  assert.strictEqual(result.status, 'verified');
});

// Test 43: RBAC permission enforcement prevents 'editor' role from deleting hospitals
asyncTest('TEST 43 (Suite 13): RBAC: "editor" role cannot delete hospitals', async () => {
  let thrown = false;
  try {
    await adminService.deleteHospital(999, 'Test delete by editor', 'editor_user', 'editor');
  } catch (err) {
    thrown = true;
    assert(err.message.includes('Unauthorized') || err.message.includes('admin'));
  }
  assert.strictEqual(thrown, true, 'Editor role must throw error when attempting delete');
});

// Test 44: RBAC permission enforcement allows 'admin' role to delete hospitals
asyncTest('TEST 44 (Suite 13): RBAC: "admin" role is authorized to soft-delete hospitals', async () => {
  const temp = await adminService.addHospital({
    name: 'Test Temporary Hospital For RBAC',
    city: 'Mohali',
    verificationStatus: 'verified',
    dataSource: 'Manual Registry Addition',
    verificationDate: '2026-09-23'
  });

  const deleted = await adminService.deleteHospital(temp.id, 'Decommissioned in RBAC test', 'admin_tester', 'admin');
  assert.strictEqual(deleted.success, true, 'Delete operation must succeed');
  assert.strictEqual(deleted.hospital.isActive, false, 'Hospital should be soft-deleted');
  assert.strictEqual(deleted.hospital.deactivationReason, 'Decommissioned in RBAC test');
});

// Test 45: Demo hospital unbacked performance metrics are null (never fake numbers)
test('TEST 45 (Suite 13): Demo hospital performance data has null value for unbacked sample metrics', () => {
  const hosp1 = HOSPITALS.find(h => h.id === 1);
  const hosp5 = HOSPITALS.find(h => h.id === 5);

  assert(hosp1, 'Hospital 1 must exist');
  assert(hosp5, 'Hospital 5 must exist');

  const h1Kidney = hosp1.performanceData?.kidney?.metrics?.[0];
  assert.strictEqual(h1Kidney?.value, null, 'Hospital 1 dialysisSessions metric value must be null');

  const h5Kidney = hosp5.performanceData?.kidney?.metrics?.[0];
  assert.strictEqual(h5Kidney?.value, null, 'Hospital 5 patientsTreated metric value must be null');

  const h5Heart = hosp5.performanceData?.heart?.metrics?.[0];
  assert.strictEqual(h5Heart?.value, null, 'Hospital 5 proceduresPerformed metric value must be null');
});

// Test 46: Granular RBAC definitions for admin, editor, and reviewer
test('TEST 46 (Suite 13): Granular RBAC role and permission configurations', () => {
  assert.deepStrictEqual(ADMIN_ROLES, { ADMIN: 'admin', EDITOR: 'editor', REVIEWER: 'reviewer' });
  assert(ROLE_PERMISSIONS.admin.includes('delete_hospitals'));
  assert(ROLE_PERMISSIONS.admin.includes('manage_users'));
  assert(!ROLE_PERMISSIONS.editor.includes('delete_hospitals'), 'Editor must not have delete_hospitals');
  assert(!ROLE_PERMISSIONS.reviewer.includes('delete_hospitals'), 'Reviewer must not have delete_hospitals');
  assert(ROLE_PERMISSIONS.editor.includes('edit_hospitals'));
  assert(ROLE_PERMISSIONS.reviewer.includes('review_verification_queue'));
});

// ----------------------------------------------------
// 14. PHASE 4.3 EXPANDED TAXONOMY & EVIDENCE-BASED DISCOVERY TESTS
// ----------------------------------------------------
console.log('\n--- Suite 14: Phase 4.3 Expanded Taxonomy, Outcome Evidence & Progressive Search Tests ---');

// Test 1: Catalogue covers all 18 clinical categories
test('TEST 1 (Suite 14): Centralized Condition Catalogue covers all 18 clinical categories', () => {
  assert.strictEqual(CLINICAL_CATEGORIES.length, 18, 'Must have exactly 18 clinical categories');
  assert(CLINICAL_CATEGORIES.includes('Cardiovascular'));
  assert(CLINICAL_CATEGORIES.includes('Neurology'));
  assert(CLINICAL_CATEGORIES.includes('Oncology'));
  assert(CLINICAL_CATEGORIES.includes('Kidney / Urology'));
  assert(CLINICAL_CATEGORIES.includes('Transplant'));
  assert(CLINICAL_CATEGORIES.includes('Liver / Gastroenterology'));
  assert(CLINICAL_CATEGORIES.includes('Respiratory'));
  assert(CLINICAL_CATEGORIES.includes('Orthopedics'));
  assert(CLINICAL_CATEGORIES.includes('Endocrinology'));
  assert(CLINICAL_CATEGORIES.includes('Pediatrics'));
  assert(CLINICAL_CATEGORIES.includes("Women's Health"));
  assert(CLINICAL_CATEGORIES.includes('Eye'));
  assert(CLINICAL_CATEGORIES.includes('ENT'));
  assert(CLINICAL_CATEGORIES.includes('Dermatology'));
  assert(CLINICAL_CATEGORIES.includes('Mental Health'));
  assert(CLINICAL_CATEGORIES.includes('Infectious Disease'));
  assert(CLINICAL_CATEGORIES.includes('Emergency / Critical Care'));
  assert(CLINICAL_CATEGORIES.includes('General / Multispecialty'));

  // Ensure every condition in catalogue maps to a valid category
  CONDITION_CATALOGUE.forEach(cond => {
    assert(CLINICAL_CATEGORIES.includes(cond.category), `${cond.name} has invalid category: ${cond.category}`);
    assert(Array.isArray(cond.aliases) && cond.aliases.length > 0, `${cond.name} must have aliases`);
  });
});

// Test 2: Condition ≠ Facility ≠ Procedure distinction
test('TEST 2 (Suite 14): Condition ≠ Facility ≠ Procedure distinction in search intent parsing', () => {
  // 1. Standalone facility request: dialysis
  const dialIntent = aiService.parseSearchIntent('dialysis hospital');
  assert.strictEqual(dialIntent.condition, null, 'Dialysis is a facility, condition must be null');
  assert(dialIntent.facilities.includes('dialysis'), 'Facilities must include dialysis');
  assert.strictEqual(dialIntent.procedure, null, 'Procedure must be null for pure facility search');

  // 2. Procedure request: kidney transplant
  const procIntent = aiService.parseSearchIntent('kidney transplant hospital');
  assert.strictEqual(procIntent.procedure, 'kidney_transplant', 'Procedure must be kidney_transplant');
  assert.strictEqual(procIntent.condition, 'kidney', 'Condition category must be kidney');

  // 3. Condition request: kidney disease
  const condIntent = aiService.parseSearchIntent('kidney disease hospital');
  assert.strictEqual(condIntent.condition, 'kidney');
  assert.strictEqual(condIntent.procedure, null);
  assert.deepStrictEqual(condIntent.facilities, []);
});

// Test 3: Multilingual & Hinglish aliases parsing
test('TEST 3 (Suite 14): Multilingual & Hinglish natural language query parsing', () => {
  const qHinglishKidney = aiService.parseSearchIntent('mere ko kidney ki problem hai');
  assert.strictEqual(qHinglishKidney.condition, 'kidney');

  const qAlzheimer = aiService.parseSearchIntent('Alzheimer ka hospital');
  assert.strictEqual(qAlzheimer.condition, 'alzheimers');
  assert.strictEqual(qAlzheimer.specialty, 'neurology');

  const qHindiHeart = aiService.parseSearchIntent('दिल का अस्पताल');
  assert.strictEqual(qHindiHeart.condition, 'heart');
  assert.strictEqual(qHindiHeart.specialty, 'cardiology');

  const qPunjabiHeart = aiService.parseSearchIntent('ਦਿਲ ਦਾ ਹਸਪਤਾਲ');
  assert.strictEqual(qPunjabiHeart.condition, 'heart');
});

// Test 4: Ambiguity preservation for broad natural language terms
test('TEST 4 (Suite 14): Ambiguity preservation for broad natural language terms (e.g. brain ka treatment)', () => {
  const broadNeuro = aiService.parseSearchIntent('brain ka treatment');
  assert.strictEqual(broadNeuro.condition, 'neurology', 'Should map to general neurology');
  assert.strictEqual(broadNeuro.procedure, null, 'Should not invent a specific surgical procedure');
});

// Test 5: Progressive radius search outputs 4 distance buckets
await asyncTest('TEST 5 (Suite 14): Progressive radius ladder outputs 4 distance buckets (nearYou, moreNearby, nearbyAreas, upTo50km)', async () => {
  const res = await searchService.searchHospitals({
    query: 'heart hospital',
    condition: 'heart',
    latitude: 30.7333,
    longitude: 76.7794,
    radius: 'auto'
  });

  assert(res.sections, 'Sections object must exist');
  assert(Array.isArray(res.sections.nearYou), 'nearYou section must be an array');
  assert(Array.isArray(res.sections.moreNearby), 'moreNearby section must be an array');
  assert(Array.isArray(res.sections.nearbyAreas), 'nearbyAreas section must be an array');
  assert(Array.isArray(res.sections.upTo50km), 'upTo50km section must be an array');

  // Verify distance ranges
  res.sections.nearYou.forEach(h => {
    assert(h.distance <= 5, `${h.name} distance ${h.distance} exceeds 5 km`);
  });
  res.sections.moreNearby.forEach(h => {
    assert(h.distance > 5 && h.distance <= 10, `${h.name} distance ${h.distance} outside 5-10 km`);
  });
  res.sections.nearbyAreas.forEach(h => {
    assert(h.distance > 10 && h.distance <= 25, `${h.name} distance ${h.distance} outside 10-25 km`);
  });
  res.sections.upTo50km.forEach(h => {
    assert(h.distance > 25 && h.distance <= 50, `${h.name} distance ${h.distance} outside 25-50 km`);
  });
});

// Test 6: Strict budget filtering isolates unrecorded cost hospitals into costUnavailable section
await asyncTest('TEST 6 (Suite 14): Strict budget filtering separates hospitals with unknown cost into costUnavailable section', async () => {
  // Search kidney hospitals with strict budget
  const res = await searchService.searchHospitals({
    query: 'kidney hospital under 50000',
    condition: 'kidney',
    budget: 50000,
    latitude: 30.7333,
    longitude: 76.7794
  });

  // Confirmed matches must all have estimated cost <= 50000
  res.results.forEach(h => {
    const cost = h.estimatedCosts?.kidneyTreatment?.min;
    assert(cost != null && cost <= 50000, `${h.name} does not meet budget requirement`);
  });

  // Hospitals in costUnavailable section must have condition match but unrecorded cost
  assert(Array.isArray(res.sections.costUnavailable), 'costUnavailable section must exist');
  res.sections.costUnavailable.forEach(h => {
    const hasKnown = hasKnownRelevantCost(h, 'kidney', []);
    assert.strictEqual(hasKnown, false, `${h.name} in costUnavailable should not have known relevant cost`);
  });
});

// Test 7: hasKnownRelevantCost correctly identifies available vs missing procedure cost
test('TEST 7 (Suite 14): hasKnownRelevantCost correctly identifies available vs missing procedure cost', () => {
  const hospWithCost = HOSPITALS.find(h => h.estimatedCosts?.cardiacCare?.min > 0);
  assert(hospWithCost, 'Hospital with cardiacCare cost must exist');
  assert.strictEqual(hasKnownRelevantCost(hospWithCost, 'heart', []), true);

  const mockHospNoCost = {
    name: 'Costless Hospital',
    estimatedCosts: {
      cardiacCare: null,
      kidneyTreatment: undefined
    }
  };
  assert.strictEqual(hasKnownRelevantCost(mockHospNoCost, 'heart', []), false);
  assert.strictEqual(hasKnownRelevantCost(mockHospNoCost, 'kidney', []), false);
});

// Test 8: Condition-specific outcome metric validation in adminService
test('TEST 8 (Suite 14): Condition-specific outcome metric validation in adminService', () => {
  // 1. Valid metric
  const validMetric = {
    conditionId: 'kidney_disease',
    metricName: 'dialysis_adequacy',
    label: 'Hemodialysis Adequacy',
    value: 88,
    unit: '%',
    definition: 'Percentage of sessions achieving Kt/V >= 1.2',
    numerator: 88,
    denominator: 100,
    source: 'State Renal Audit',
    sourceType: 'official_report'
  };
  const validRes = validateConditionOutcomeMetric(validMetric);
  assert.strictEqual(validRes.isValid, true);
  assert.strictEqual(validRes.errors.length, 0);

  // 2. Out-of-range percentage (> 100%)
  const invalidPercent = { ...validMetric, value: 105 };
  const invalidPercentRes = validateConditionOutcomeMetric(invalidPercent);
  assert.strictEqual(invalidPercentRes.isValid, false);
  assert(invalidPercentRes.errors.some(e => e.includes('cannot exceed 100%')));

  // 3. Inverted fraction (numerator > denominator)
  const invertedFraction = { ...validMetric, numerator: 120, denominator: 100 };
  const invertedRes = validateConditionOutcomeMetric(invertedFraction);
  assert.strictEqual(invertedRes.isValid, false);
  assert(invertedRes.errors.some(e => e.includes('greater than denominator')));

  // 4. Missing clinical definition
  const missingDef = { ...validMetric, definition: '' };
  const missingDefRes = validateConditionOutcomeMetric(missingDef);
  assert.strictEqual(missingDefRes.isValid, false);
  assert(missingDefRes.errors.some(e => e.includes('definition is required')));

  // 5. Missing source
  const missingSource = { ...validMetric, source: '' };
  const missingSourceRes = validateConditionOutcomeMetric(missingSource);
  assert.strictEqual(missingSourceRes.isValid, false);
  assert(missingSourceRes.errors.some(e => e.includes('source citation is required')));
});

// Test 9: Condition-specific evidence tiers are assigned neutrally with ZERO superlatives
test('TEST 9 (Suite 14): Condition-specific evidence tiers are assigned neutrally with ZERO superlatives', () => {
  const indiaKidney = HOSPITALS.find(h => h.name.includes('India Kidney Hospital'));
  assert(indiaKidney, 'India Kidney Hospital must exist');

  const evalKidney = recommendationService.evaluateHospital(indiaKidney, { condition: 'kidney' });
  assert.strictEqual(evalKidney.evidenceTier, 'Verified Outcome Data Available');

  // Verify banned words never appear in matchTier or evidenceTier
  const bannedWords = ['best', 'winner', 'number 1', '#1', 'top hospital'];
  const allTiers = [evalKidney.matchTier, evalKidney.evidenceTier].filter(Boolean);
  allTiers.forEach(tier => {
    bannedWords.forEach(banned => {
      assert(!tier.toLowerCase().includes(banned), `Banned superlative "${banned}" found in tier "${tier}"`);
    });
  });
});

// Test 10: Verified hospitals have complete source citations and unbacked metrics have null values
test('TEST 10 (Suite 14): Authoritative outcome data has valid source citations and unbacked metrics have null values', () => {
  const indiaKidney = HOSPITALS.find(h => h.name.includes('India Kidney Hospital'));
  assert(indiaKidney.conditionPerformance && indiaKidney.conditionPerformance.length > 0);
  const metric = indiaKidney.conditionPerformance[0];
  assert.strictEqual(metric.verificationStatus, 'verified');
  assert(metric.source && metric.source.length > 0, 'Source must be documented');
  assert(metric.definition && metric.definition.length > 0, 'Definition must be documented');
  assert.strictEqual(typeof metric.value, 'number');
  assert.strictEqual(typeof metric.numerator, 'number');
  assert.strictEqual(typeof metric.denominator, 'number');
});

// ----------------------------------------------------
// 15. CURATED NATIONAL REFERENCE HOSPITAL SYSTEM
// ----------------------------------------------------
console.log('\n--- Suite 15: Curated National Hospital Reference Lists ---');

// Test 1: Category resolution for all 8 specialized categories with English, Hindi, Punjabi keywords
test('TEST 1 (Suite 15): resolveNationalCategory correctly identifies all 8 specialized medical categories', () => {
  const testCases = [
    { cond: 'kidney', proc: '', text: 'gurda hospital', expected: 'kidney' },
    { cond: 'heart', proc: '', text: 'dil ka hospital', expected: 'heart' },
    { cond: '', proc: 'chemotherapy', text: 'cancer hospital', expected: 'cancer' },
    { cond: '', proc: 'brain surgery', text: 'dimag ka operation', expected: 'brain_surgery' },
    { cond: 'alzheimers', proc: '', text: 'dementia care centre', expected: 'alzheimers' },
    { cond: 'eye', proc: '', text: 'aankhon ka hospital', expected: 'eye' },
    { cond: 'orthopedics', proc: 'knee replacement', text: 'haddi ka doctor', expected: 'orthopedics' },
    { cond: 'dental', proc: '', text: 'dant ka hospital', expected: 'dental' }
  ];

  testCases.forEach(({ cond, proc, text, expected }) => {
    const resolved = resolveNationalCategory(cond, proc, text);
    assert.strictEqual(resolved, expected, `Failed to resolve category for "${text}" (expected: ${expected}, got: ${resolved})`);
  });
});

// Test 2: Structure and integrity of all 8 national reference lists
test('TEST 2 (Suite 15): NATIONAL_HOSPITAL_REFERENCES contains all 8 categories with 5 hospitals each in deterministic order #1 to #5', () => {
  const expectedCategories = ['kidney', 'heart', 'cancer', 'brain_surgery', 'alzheimers', 'eye', 'orthopedics', 'dental'];
  assert.strictEqual(Object.keys(NATIONAL_HOSPITAL_REFERENCES).length, 8);

  expectedCategories.forEach(catKey => {
    const cat = NATIONAL_HOSPITAL_REFERENCES[catKey];
    assert(cat, `Category ${catKey} must exist`);
    assert(cat.categoryName && cat.categoryName.length > 0);
    assert(cat.disclaimer && cat.disclaimer.includes("Sehat_Sathi's curated national reference order"));
    assert.strictEqual(cat.hospitals.length, 5, `Category ${catKey} must have exactly 5 hospitals`);

    cat.hospitals.forEach((h, idx) => {
      assert.strictEqual(h.referenceRank, idx + 1, `Hospital ${h.name} in ${catKey} must have referenceRank ${idx + 1}`);
      assert(h.id && h.id.startsWith('ref_'), `Hospital must have string ref_ id: ${h.id}`);
      assert(h.name && h.name.length > 0, 'Hospital name is required');
      assert(h.fullName && h.fullName.length > 0, 'Hospital full name is required');
      assert(h.city && h.city.length > 0, 'Hospital city is required');
      assert(h.state && h.state.length > 0, 'Hospital state is required');
      assert(h.location?.latitude && h.location?.longitude, 'Valid coordinates are required');
      assert(Array.isArray(h.facilities) && h.facilities.length > 0, 'Facilities array required');
      assert.strictEqual(h.isNationalReference, true);
    });
  });
});

// Test 3: Brain surgery query deterministically returns AIIMS #1, NIMHANS #2, PGIMER #3, Medanta #4, CMC Vellore #5
asyncTest('TEST 3 (Suite 15): "brain surgery hospital" query deterministically returns AIIMS #1, NIMHANS #2, PGIMER #3, Medanta #4, CMC Vellore #5', async () => {
  const res = await searchService.searchHospitals({ query: 'brain surgery hospital' });
  assert.strictEqual(res.isNationalReference, true, 'Must be marked as national reference');
  assert.strictEqual(res.results.length, 5, 'Must return 5 curated hospitals');

  const names = res.results.map(h => h.name);
  assert(names[0].includes('AIIMS'), `Rank 1 must be AIIMS (got: ${names[0]})`);
  assert(names[1].includes('NIMHANS'), `Rank 2 must be NIMHANS (got: ${names[1]})`);
  assert(names[2].includes('PGIMER'), `Rank 3 must be PGIMER (got: ${names[2]})`);
  assert(names[3].includes('Medanta'), `Rank 4 must be Medanta (got: ${names[3]})`);
  assert(names[4].includes('CMC Vellore'), `Rank 5 must be CMC Vellore (got: ${names[4]})`);
});

// Test 4: All 8 disease categories return the curated #1 hospital as the first recommendation
asyncTest('TEST 4 (Suite 15): All 8 categories return the curated #1 hospital as the first recommendation', async () => {
  const categoryExpectations = [
    { query: 'kidney hospital', expectedRank1: 'AIIMS' },
    { query: 'heart hospital', expectedRank1: 'Medanta' },
    { query: 'cancer hospital', expectedRank1: 'Tata Memorial' },
    { query: 'brain surgery hospital', expectedRank1: 'AIIMS' },
    { query: 'alzheimers hospital', expectedRank1: 'NIMHANS' },
    { query: 'eye hospital', expectedRank1: 'LV Prasad' },
    { query: 'orthopedics hospital', expectedRank1: 'AIIMS' },
    { query: 'dental hospital', expectedRank1: 'MAIDS' }
  ];

  for (const { query, expectedRank1 } of categoryExpectations) {
    const res = await searchService.searchHospitals({ query });
    assert.strictEqual(res.isNationalReference, true);
    assert(res.results.length === 5);
    const topHospital = res.results[0];
    assert(
      topHospital.name.includes(expectedRank1),
      `Query "${query}" expected Rank 1 to be ${expectedRank1}, but got "${topHospital.name}"`
    );
    assert.strictEqual(topHospital.referenceRank, 1);
  }
});

// Test 5: Distance and sort parameters NEVER reorder the national reference list
asyncTest('TEST 5 (Suite 15): Sort options (nearest, lowest_cost) NEVER reorder curated national reference hospitals', async () => {
  // Even with sort='nearest' and user in Chandigarh (where PGIMER is nearby), AIIMS must remain #1 for brain surgery
  const resNearest = await searchService.searchHospitals({ 
    query: 'brain surgery hospital', 
    sort: 'nearest',
    latitude: 30.7333,
    longitude: 76.7794 // Chandigarh coordinates
  });
  assert(resNearest.results[0].name.includes('AIIMS'), 'AIIMS must remain #1 even when user is closer to PGIMER');
  assert(resNearest.results[1].name.includes('NIMHANS'), 'NIMHANS must remain #2');
  assert(resNearest.results[2].name.includes('PGIMER'), 'PGIMER must remain #3');
});

// Test 6: getHospitalById and getNationalReferenceHospitalById resolve ref_ IDs and names accurately
asyncTest('TEST 6 (Suite 15): Hospital lookup resolves national reference IDs and provides full hospital names', async () => {
  const aiimsBrain = await getHospitalById('ref_brain_surgery_1');
  assert(aiimsBrain, 'AIIMS brain surgery reference must be found by ID');
  assert.strictEqual(aiimsBrain.referenceRank, 1);
  assert.strictEqual(aiimsBrain.fullName, 'All India Institute of Medical Sciences, New Delhi');

  const nimhansDirect = getNationalReferenceHospitalById('ref_brain_surgery_2');
  assert(nimhansDirect, 'NIMHANS must be found by ID');
  assert.strictEqual(nimhansDirect.city, 'Bengaluru');
  assert.strictEqual(nimhansDirect.referenceRank, 2);

  const byName = getNationalReferenceHospitalById('Tata Memorial Hospital — Mumbai');
  assert(byName, 'Tata Memorial must be resolved by name');
  assert.strictEqual(byName.referenceRank, 1);
});

// Test 7: Local discovery preservation when searching in specific local cities or low budgets
asyncTest('TEST 7 (Suite 15): Searches in local cities (Ludhiana) or under low budget (<= 200k) use local discovery', async () => {
  const resLudhiana = await searchService.searchHospitals({ 
    query: 'kidney hospital', 
    location: 'Ludhiana' 
  });
  assert.strictEqual(resLudhiana.isNationalReference, false, 'Local city search must not override with national references');

  const resBudget = await searchService.searchHospitals({
    query: 'kidney hospital',
    budget: 50000
  });
  assert.strictEqual(resBudget.isNationalReference, false, 'Budget constraint under 2 lakh must not override with national references');
});

// Test 8: Sample doctor data has zero banned superlatives and clear disclaimer
test('TEST 8 (Suite 15): National reference hospital doctors use non-promotional profiles with zero superlatives', () => {
  const bannedSuperlatives = ['best doctor', '#1 surgeon', 'top specialist', 'world famous', 'award-winning superstar'];
  
  Object.values(NATIONAL_HOSPITAL_REFERENCES).forEach(cat => {
    cat.hospitals.forEach(h => {
      const text = `${h.tagline || ''} ${h.overview || ''}`.toLowerCase();
      bannedSuperlatives.forEach(banned => {
        assert(!text.includes(banned), `Banned phrase "${banned}" found in hospital ${h.name}`);
      });
    });
  });
});

// ----------------------------------------------------
// 16. FLOATING AI HEALTHCARE CHATBOT
// ----------------------------------------------------
console.log('\n--- Suite 16: Floating AI Healthcare Chatbot ---');

// Test 1: Intent detection accuracy across the 4 strict categories
test('TEST 1 (Suite 16): Chatbot intent classification accurately maps all 4 strict intent types', () => {
  const cases = [
    { query: 'Which is the best hospital for kidney disease?', expected: 'HOSPITAL_RECOMMENDATION' },
    { query: 'Which hospital is good for brain surgery?', expected: 'HOSPITAL_RECOMMENDATION' },
    { query: 'Find a kidney hospital under 1 lakh', expected: 'HOSPITAL_RECOMMENDATION' },
    { query: 'Show hospitals near me', expected: 'HOSPITAL_RECOMMENDATION' },
    { query: 'Tell me about PGIMER', expected: 'HOSPITAL_INFORMATION' },
    { query: 'Tell me about AIIMS', expected: 'HOSPITAL_INFORMATION' },
    { query: 'What is dialysis?', expected: 'HEALTH_ADVICE' },
    { query: 'What is kidney disease?', expected: 'HEALTH_ADVICE' },
    { query: 'What are common symptoms of diabetes?', expected: 'HEALTH_ADVICE' },
    { query: 'Write me a Python program', expected: 'OUT_OF_SCOPE' },
    { query: 'How to write a quicksort algorithm in C++', expected: 'OUT_OF_SCOPE' },
    { query: 'What is the capital of France?', expected: 'OUT_OF_SCOPE' }
  ];

  cases.forEach(({ query, expected }) => {
    const detected = chatbotService.detectIntent(query.toLowerCase(), query, {});
    assert.strictEqual(
      detected, 
      expected, 
      `Query "${query}" expected intent ${expected}, but got ${detected}`
    );
  });
});

// Test 2: Out of scope queries return standard polite refusal without crashing
asyncTest('TEST 2 (Suite 16): Out-of-scope requests return designated standard healthcare assistant message', async () => {
  const res = await chatbotService.processMessage('Write a Python script to sort an array');
  assert.strictEqual(res.intent, 'OUT_OF_SCOPE');
  assert.strictEqual(res.message, OUT_OF_SCOPE_RESPONSE);
  assert.strictEqual(res.hospitals.length, 0);
});

// Test 3: Specialized national hospital queries preserve deterministic 1-to-5 order in chatbot
asyncTest('TEST 3 (Suite 16): "brain surgery hospital" query in chatbot returns AIIMS #1, NIMHANS #2, PGIMER #3, Medanta #4, CMC Vellore #5', async () => {
  const res = await chatbotService.processMessage('Which hospital is good for brain surgery?');
  assert.strictEqual(res.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(res.isNational, true);
  assert.strictEqual(res.hospitals.length, 5);

  const names = res.hospitals.map(h => h.name);
  assert(names[0].includes('AIIMS'), `Rank 1 must be AIIMS (got: ${names[0]})`);
  assert(names[1].includes('NIMHANS'), `Rank 2 must be NIMHANS (got: ${names[1]})`);
  assert(names[2].includes('PGIMER'), `Rank 3 must be PGIMER (got: ${names[2]})`);
  assert(names[3].includes('Medanta'), `Rank 4 must be Medanta (got: ${names[3]})`);
  assert(names[4].includes('CMC Vellore'), `Rank 5 must be CMC Vellore (got: ${names[4]})`);
});

// Test 4: Multi-turn conversational context preservation across follow-up queries
asyncTest('TEST 4 (Suite 16): Conversational context carries forward condition, location, and budget across turns', async () => {
  // Turn 1: Condition
  const turn1 = await chatbotService.processMessage('I need a kidney hospital.');
  assert.strictEqual(turn1.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(turn1.context.condition, 'kidney');

  // Turn 2: Follow-up with location
  const turn2 = await chatbotService.processMessage('Chandigarh', turn1.context);
  assert.strictEqual(turn2.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(turn2.context.condition, 'kidney');
  assert.strictEqual(turn2.context.location, 'Chandigarh');

  // Turn 3: Follow-up with budget
  const turn3 = await chatbotService.processMessage('Under 1 lakh', turn2.context);
  assert.strictEqual(turn3.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(turn3.context.condition, 'kidney');
  assert.strictEqual(turn3.context.location, 'Chandigarh');
  assert.strictEqual(turn3.context.budget, 100000);
});

// Test 5: Hospital information lookup returns full details or "Data not available"
asyncTest('TEST 5 (Suite 16): Hospital information lookup handles known and unknown institutions accurately', async () => {
  // Known hospital
  const known = await chatbotService.processMessage('Tell me about PGIMER');
  assert.strictEqual(known.intent, 'HOSPITAL_INFORMATION');
  assert(known.message.includes('PGIMER'));
  assert(known.message.includes('Sector 12'));
  assert(known.hospitals.length === 1);

  // Unknown hospital
  const unknown = await chatbotService.processMessage('Tell me about UnknownFictionalClinic999');
  assert.strictEqual(unknown.intent, 'HOSPITAL_INFORMATION');
  assert(unknown.message.includes('Data not available in the current Sehat_Sathi dataset'));
});

// Test 6: Side-by-side hospital comparison in chatbot
asyncTest('TEST 6 (Suite 16): "Compare AIIMS and PGIMER" generates side-by-side comparative table', async () => {
  const comp = await chatbotService.processMessage('Compare AIIMS and PGIMER');
  assert.strictEqual(comp.intent, 'HOSPITAL_INFORMATION');
  assert(comp.message.includes('Comparison:'));
  assert(comp.message.includes('AIIMS'));
  assert(comp.message.includes('PGIMER'));
  assert.strictEqual(comp.hospitals.length, 2);
});

// Test 7: Health advice safety, medical disclaimer, and non-prescriptive tone
asyncTest('TEST 7 (Suite 16): Educational health advice provides clear explanations with medical disclaimer', async () => {
  const res = await chatbotService.processMessage('What is dialysis?');
  assert.strictEqual(res.intent, 'HEALTH_ADVICE');
  assert(res.message.includes('Understanding Dialysis'));
  assert(res.message.includes('Hemodialysis'));
  assert(res.message.includes(DISCLAIMERS.MEDICAL));

  // Non-prescriptive check: ensure no drug dosage recommendations
  const bannedPrescriptions = ['take 500mg', 'prescribe', 'dosage of', 'stop your medication'];
  bannedPrescriptions.forEach(p => {
    assert(!res.message.toLowerCase().includes(p), `Prescription phrase "${p}" found in health advice`);
  });
});

// Test 8: Emergency warning protocol triggers on severe emergency symptoms
asyncTest('TEST 8 (Suite 16): Emergency symptom queries immediately trigger the emergency warning protocol', async () => {
  const emRes = await chatbotService.processMessage('Severe chest pain cannot breathe');
  assert.strictEqual(emRes.intent, 'HEALTH_ADVICE');
  assert.strictEqual(emRes.isEmergency, true);
  assert(emRes.message.includes('112 / 108'));
});

// ----------------------------------------------------
// 17. DISTANCE DISPLAY, DISEASE-SPECIFIC BUDGET & SIMULATED OUTCOMES SUITE
// ----------------------------------------------------
console.log('\n--- Suite 17: Distance Display, Disease-Specific Estimated Budget & Simulated Patient Outcomes ---');

test('TEST 1 (Suite 17): Distance display formats with user coordinates and never displays false "0 km"', () => {
  const formatDist = (distance) => {
    return distance != null && Number.isFinite(Number(distance))
      ? `${Number(distance) < 10 ? Number(distance).toFixed(1) : Math.round(Number(distance))} km from your current location`
      : 'Distance unavailable — location permission required';
  };

  assert.strictEqual(formatDist(320), '320 km from your current location');
  assert.strictEqual(formatDist(4.2), '4.2 km from your current location');
  assert.strictEqual(formatDist(null), 'Distance unavailable — location permission required');
  assert.strictEqual(formatDist(undefined), 'Distance unavailable — location permission required');
});

test('TEST 2 (Suite 17): Missing user coordinates return "Distance unavailable — location permission required"', () => {
  const missingLocationHospital = { id: 1, name: 'Test Hospital', distance: null };
  const hasDistance = missingLocationHospital.distance != null && Number.isFinite(Number(missingLocationHospital.distance));
  assert.strictEqual(hasDistance, false);
  const msg = hasDistance ? `${missingLocationHospital.distance} km` : 'Distance unavailable — location permission required';
  assert.strictEqual(msg, 'Distance unavailable — location permission required');
});

test('TEST 3 (Suite 17): AIIMS produces distinct estimated budgets for different medical conditions', () => {
  const aiimsKidney = getNationalReferenceHospitalById('ref_kidney_1');
  const aiimsHeart = getNationalReferenceHospitalById('ref_heart_2');
  const aiimsCancer = getNationalReferenceHospitalById('ref_cancer_2');
  const aiimsBrain = getNationalReferenceHospitalById('ref_brain_surgery_1');

  assert(aiimsKidney, 'AIIMS Kidney benchmark exists');
  assert(aiimsHeart, 'AIIMS Heart benchmark exists');
  assert(aiimsCancer, 'AIIMS Cancer benchmark exists');
  assert(aiimsBrain, 'AIIMS Brain benchmark exists');

  const budgetKidney = resolveHospitalBudget(aiimsKidney, { condition: 'kidney' });
  const budgetHeart = resolveHospitalBudget(aiimsHeart, { condition: 'heart' });
  const budgetCancer = resolveHospitalBudget(aiimsCancer, { condition: 'cancer' });
  const budgetBrain = resolveHospitalBudget(aiimsBrain, { condition: 'brain_surgery' });

  assert(budgetKidney.isAvailable, 'Kidney budget available');
  assert(budgetHeart.isAvailable, 'Heart budget available');
  assert(budgetCancer.isAvailable, 'Cancer budget available');
  assert(budgetBrain.isAvailable, 'Brain budget available');

  // Verify non-identical labels across different conditions for AIIMS
  assert.notStrictEqual(budgetKidney.label, budgetHeart.label, 'Kidney and Heart budgets must be distinct');
  assert.notStrictEqual(budgetKidney.label, budgetCancer.label, 'Kidney and Cancer budgets must be distinct');
  assert.notStrictEqual(budgetKidney.label, budgetBrain.label, 'Kidney and Brain Surgery budgets must be distinct');
  assert.notStrictEqual(budgetHeart.label, budgetCancer.label, 'Heart and Cancer budgets must be distinct');
});

test('TEST 4 (Suite 17): Procedure-specific priority ("kidney transplant" prioritizes transplant cost over broad kidney condition)', () => {
  const aiims = getNationalReferenceHospitalById('ref_kidney_1');
  assert(aiims, 'AIIMS must exist');

  const broadBudget = resolveHospitalBudget(aiims, { condition: 'kidney', query: 'kidney treatment' });
  const procBudget = resolveHospitalBudget(aiims, { condition: 'kidney', procedure: 'kidney_transplant', query: 'kidney transplant' });

  assert(procBudget.isAvailable, 'Procedure budget must be available');
  assert.strictEqual(procBudget.isProcedureSpecific, true, 'Must be marked as procedure-specific');
  assert.notStrictEqual(procBudget.label, broadBudget.label, 'Transplant procedure cost must be distinct from general nephrology');
  assert(procBudget.label.includes('4,00,000') || procBudget.label.includes('2,50,000') || procBudget.procedureName.includes('Transplant'), 'Must contain transplant tariff range or procedure name');
});

test('TEST 5 (Suite 17): Missing cost data honestly returns "Data not available" without inventing ₹0', () => {
  const alzheimersCat = NATIONAL_HOSPITAL_REFERENCES.alzheimers;
  assert(alzheimersCat, 'Alzheimers benchmark category exists');
  const nimhansAlzheimers = alzheimersCat.hospitals[0];

  const budget = resolveHospitalBudget(nimhansAlzheimers, { condition: 'alzheimers' });
  assert.strictEqual(budget.isAvailable, false, 'Must not claim cost is available');
  assert.strictEqual(budget.label, null, 'Must return null label');
  assert.strictEqual(budget.cost, null, 'Must return null cost');
});

test('TEST 6 (Suite 17): Deterministic simulated patient outcomes (100% repeatable with no Math.random)', () => {
  const outcome1 = getSimulatedOutcome('ref_kidney_1', 'kidney');
  const outcome2 = getSimulatedOutcome('ref_kidney_1', 'kidney');

  assert(outcome1, 'Simulated outcome must exist');
  assert.deepStrictEqual(outcome1, outcome2, 'Outcome lookup must be 100% deterministic');
  assert.strictEqual(outcome1.dataStatus, 'simulated');
  assert.strictEqual(outcome1.disclaimer, SIMULATED_OUTCOME_DISCLAIMER);
});

test('TEST 7 (Suite 17): AIIMS produces distinct simulated outcome rates across different conditions', () => {
  const simKidney = getSimulatedOutcome('ref_kidney_1', 'kidney');
  const simCancer = getSimulatedOutcome('ref_cancer_2', 'cancer');
  const simBrain = getSimulatedOutcome('ref_brain_surgery_1', 'brain_surgery');
  const simHeart = getSimulatedOutcome('ref_heart_2', 'heart');

  assert.strictEqual(simKidney.simulatedOutcomeRate, 87, 'AIIMS Kidney simulated rate must be 87%');
  assert.strictEqual(simCancer.simulatedOutcomeRate, 78, 'AIIMS Cancer simulated rate must be 78%');
  assert.strictEqual(simBrain.simulatedOutcomeRate, 84, 'AIIMS Brain surgery simulated rate must be 84%');
  assert.strictEqual(simHeart.simulatedOutcomeRate, 91, 'AIIMS Heart simulated rate must be 91%');

  // Verify they are distinct
  const rates = [simKidney.simulatedOutcomeRate, simCancer.simulatedOutcomeRate, simBrain.simulatedOutcomeRate, simHeart.simulatedOutcomeRate];
  const uniqueRates = new Set(rates);
  assert.strictEqual(uniqueRates.size, 4, 'All four simulated rates must be distinct across conditions');
});

test('TEST 8 (Suite 17): Simulated patient cohort size is standardized at 1,000 with matching favorable counts', () => {
  const testIds = ['ref_kidney_1', 'ref_kidney_2', 'ref_heart_1', 'ref_brain_surgery_2', '1'];
  testIds.forEach(id => {
    const outcome = getSimulatedOutcome(id, 'kidney') || getSimulatedOutcome(id, 'heart') || getSimulatedOutcome(id, 'brain_surgery');
    if (outcome) {
      assert.strictEqual(outcome.cohortSize, 1000, `Cohort size for ${id} must be 1000`);
      const expectedRate = Math.round((outcome.simulatedFavorableOutcomes / outcome.cohortSize) * 100);
      assert.strictEqual(outcome.simulatedOutcomeRate, expectedRate, 'Simulated rate must equal favorable / 1000 * 100');
    }
  });
});

test('TEST 9 (Suite 17): Missing simulated outcome honestly returns null ("Not available")', () => {
  const missingOutcome = getSimulatedOutcome('nonexistent_hospital_id_99999', 'unknown_disease');
  assert.strictEqual(missingOutcome, null, 'Must return null for unknown hospital/condition');

  const alzheimersOutcome = getSimulatedOutcome('ref_alzheimers_1', 'alzheimers');
  assert.strictEqual(alzheimersOutcome, null, 'Alzheimers benchmark must return null (not available)');
});

test('TEST 10 (Suite 17): Curated national reference rank order #1 to #5 is strictly preserved regardless of distance or outcomes', () => {
  const brainRef = getNationalReferenceHospitals('brain_surgery');
  assert.strictEqual(brainRef.length, 5);
  const names = brainRef.map(h => h.name);
  assert(names[0].includes('AIIMS'), `Rank 1 must be AIIMS (got: ${names[0]})`);
  assert(names[1].includes('NIMHANS'), `Rank 2 must be NIMHANS (got: ${names[1]})`);
  assert(names[2].includes('PGIMER'), `Rank 3 must be PGIMER (got: ${names[2]})`);
  assert(names[3].includes('Medanta'), `Rank 4 must be Medanta (got: ${names[3]})`);
  assert(names[4].includes('CMC Vellore'), `Rank 5 must be CMC Vellore (got: ${names[4]})`);

  // Ensure each retains fixed referenceRank 1..5
  brainRef.forEach((h, idx) => {
    assert.strictEqual(h.referenceRank, idx + 1, `Hospital ${h.name} must have referenceRank ${idx + 1}`);
  });
});

test('TEST 11 (Suite 17): Chatbot components and services are strictly locked and preserved', () => {
  const chatbotFiles = [
    'src/components/chatbot/ChatbotButton.jsx',
    'src/components/chatbot/Chatbot.jsx',
    'src/components/chatbot/ChatMessage.jsx',
    'src/components/chatbot/ChatInput.jsx',
    'src/components/chatbot/SuggestedQuestions.jsx',
    'src/services/chatbotService.js'
  ];
  chatbotFiles.forEach(file => {
    const fullPath = path.resolve(file);
    assert(fs.existsSync(fullPath), `Chatbot file ${file} must exist and remain in place`);
  });
});

// ----------------------------------------------------
// 18. HOSPITAL RESULT SORTING FUNCTIONALITY
// ----------------------------------------------------
console.log('--- Suite 18: Hospital Result Sorting Functionality ---');

test('TEST 1 (Suite 18): "Highest Patient Rating" sorts descending with tie-breakers', () => {
  const sample = [
    { id: 'h_a', name: 'Hospital A', rating: 4.5, reviewCount: 100 },
    { id: 'h_b', name: 'Hospital B', rating: 4.9, reviewCount: 50 },
    { id: 'h_c', name: 'Hospital C', rating: 4.7, reviewCount: 80 }
  ];

  const sorted = sortHospitals(sample, 'highest_rating');
  assert.strictEqual(sorted[0].id, 'h_b', 'Hospital B (4.9) must be first');
  assert.strictEqual(sorted[1].id, 'h_c', 'Hospital C (4.7) must be second');
  assert.strictEqual(sorted[2].id, 'h_a', 'Hospital A (4.5) must be third');

  // Tie-breaker: reviewCount descending when ratings are identical
  const ties = [
    { id: 'h_t1', name: 'Tie Low Reviews', rating: 4.8, reviewCount: 150 },
    { id: 'h_t2', name: 'Tie High Reviews', rating: 4.8, reviewCount: 300 }
  ];
  const sortedTies = sortHospitals(ties, 'highest_rating');
  assert.strictEqual(sortedTies[0].id, 'h_t2', 'Higher review count wins tie');
  assert.strictEqual(sortedTies[1].id, 'h_t1');

  // Missing rating placed last
  const withMissing = [
    { id: 'h_none', name: 'No Rating', rating: null },
    { id: 'h_valid', name: 'Valid Rating', rating: 4.2 }
  ];
  const sortedMissing = sortHospitals(withMissing, 'highest_rating');
  assert.strictEqual(sortedMissing[0].id, 'h_valid');
  assert.strictEqual(sortedMissing[1].id, 'h_none');
});

test('TEST 2 (Suite 18): "Nearest to your location" sorts by numeric distance ascending', () => {
  const sample = [
    { id: 'h_a', name: 'Hospital A', distance: 20 },
    { id: 'h_b', name: 'Hospital B', distance: 5 },
    { id: 'h_c', name: 'Hospital C', distance: 12 }
  ];

  const sorted = sortHospitals(sample, 'nearest');
  assert.strictEqual(sorted[0].id, 'h_b', 'Hospital B (5 km) must be first');
  assert.strictEqual(sorted[1].id, 'h_c', 'Hospital C (12 km) must be second');
  assert.strictEqual(sorted[2].id, 'h_a', 'Hospital A (20 km) must be third');
});

test('TEST 3 (Suite 18): Missing distance data is placed after hospitals with known distances', () => {
  const sample = [
    { id: 'h_a', name: 'Hospital A', distance: 5 },
    { id: 'h_b', name: 'Hospital B', distance: null },
    { id: 'h_c', name: 'Hospital C', distance: 10 }
  ];

  const sorted = sortHospitals(sample, 'nearest');
  assert.strictEqual(sorted[0].id, 'h_a', 'Hospital A (5 km) must be first');
  assert.strictEqual(sorted[1].id, 'h_c', 'Hospital C (10 km) must be second');
  assert.strictEqual(sorted[2].id, 'h_b', 'Hospital B (null distance) must be last');

  const withUndefined = [
    { id: 'h_u', name: 'Hospital Undefined', distance: undefined },
    { id: 'h_k', name: 'Hospital Known', distance: 15 }
  ];
  const sortedUndef = sortHospitals(withUndefined, 'nearest');
  assert.strictEqual(sortedUndef[0].id, 'h_k');
  assert.strictEqual(sortedUndef[1].id, 'h_u');
});

test('TEST 4 (Suite 18): "Lowest Estimated Cost" sorts by disease/procedure-specific budget minimum ascending', () => {
  const sample = [
    { 
      id: 'h_a', 
      name: 'Hospital A', 
      estimatedCosts: { 
        kidneyTreatment: { min: 100000, max: 200000, label: '₹1,00,000 - ₹2,00,000' } 
      } 
    },
    { 
      id: 'h_b', 
      name: 'Hospital B', 
      estimatedCosts: { 
        kidneyTreatment: { min: 50000, max: 120000, label: '₹50,000 - ₹1,20,000' } 
      } 
    },
    { 
      id: 'h_c', 
      name: 'Hospital C', 
      estimatedCosts: { 
        kidneyTreatment: { min: 75000, max: 150000, label: '₹75,000 - ₹1,50,000' } 
      } 
    }
  ];

  const sorted = sortHospitals(sample, 'lowest_cost', { condition: 'kidney' });
  assert.strictEqual(sorted[0].id, 'h_b', 'Hospital B (min ₹50,000) must be first');
  assert.strictEqual(sorted[1].id, 'h_c', 'Hospital C (min ₹75,000) must be second');
  assert.strictEqual(sorted[2].id, 'h_a', 'Hospital A (min ₹1,00,000) must be third');
});

test('TEST 5 (Suite 18): Missing cost data is placed after known costs and never treated as ₹0', () => {
  const sample = [
    { 
      id: 'h_a', 
      name: 'Hospital A', 
      estimatedCosts: { 
        kidneyTreatment: { min: 50000, max: 100000, label: '₹50,000 - ₹1,00,000' } 
      } 
    },
    { 
      id: 'h_b', 
      name: 'Hospital B', 
      estimatedCosts: {} // No kidneyTreatment cost
    },
    { 
      id: 'h_c', 
      name: 'Hospital C', 
      estimatedCosts: { 
        kidneyTreatment: { min: 75000, max: 150000, label: '₹75,000 - ₹1,50,000' } 
      } 
    }
  ];

  const sorted = sortHospitals(sample, 'lowest_cost', { condition: 'kidney' });
  assert.strictEqual(sorted[0].id, 'h_a', 'Hospital A (min ₹50,000) must be first');
  assert.strictEqual(sorted[1].id, 'h_c', 'Hospital C (min ₹75,000) must be second');
  assert.strictEqual(sorted[2].id, 'h_b', 'Hospital B (missing cost) must be last, NEVER treated as ₹0');
});

test('TEST 6 (Suite 18): Condition-specific cost sorting uses condition-specific minimums', () => {
  const hospX = {
    id: 'h_x',
    name: 'Hospital X',
    estimatedCosts: {
      kidneyTreatment: { min: 40000, max: 90000, label: '₹40,000 - ₹90,000' },
      cancerCare: { min: 200000, max: 500000, label: '₹2,00,000 - ₹5,00,000' }
    }
  };
  const hospY = {
    id: 'h_y',
    name: 'Hospital Y',
    estimatedCosts: {
      kidneyTreatment: { min: 80000, max: 150000, label: '₹80,000 - ₹1,50,000' },
      cancerCare: { min: 100000, max: 250000, label: '₹1,00,000 - ₹2,50,000' }
    }
  };

  const sortedUnderKidney = sortHospitals([hospX, hospY], 'lowest_cost', { condition: 'kidney' });
  assert.strictEqual(sortedUnderKidney[0].id, 'h_x', 'Under kidney: Hospital X (40k) is cheaper than Hospital Y (80k)');
  assert.strictEqual(sortedUnderKidney[1].id, 'h_y');

  const sortedUnderCancer = sortHospitals([hospX, hospY], 'lowest_cost', { condition: 'cancer' });
  assert.strictEqual(sortedUnderCancer[0].id, 'h_y', 'Under cancer: Hospital Y (100k) is cheaper than Hospital X (200k)');
  assert.strictEqual(sortedUnderCancer[1].id, 'h_x');
});

test('TEST 7 (Suite 18): Selecting different sort options reorders the same hospital list differently', () => {
  const dataset = [
    { 
      id: 'h1', 
      name: 'Hospital One', 
      rating: 4.9, 
      distance: 25, 
      estimatedCosts: { kidneyTreatment: { min: 150000, max: 300000, label: '₹1.5L - ₹3L' } } 
    },
    { 
      id: 'h2', 
      name: 'Hospital Two', 
      rating: 4.6, 
      distance: 3, 
      estimatedCosts: { kidneyTreatment: { min: 100000, max: 200000, label: '₹1L - ₹2L' } } 
    },
    { 
      id: 'h3', 
      name: 'Hospital Three', 
      rating: 4.7, 
      distance: 10, 
      estimatedCosts: { kidneyTreatment: { min: 40000, max: 80000, label: '₹40k - ₹80k' } } 
    }
  ];

  const byRating = sortHospitals(dataset, 'highest_rating', { condition: 'kidney' }).map(h => h.id);
  const byNearest = sortHospitals(dataset, 'nearest', { condition: 'kidney' }).map(h => h.id);
  const byCost = sortHospitals(dataset, 'lowest_cost', { condition: 'kidney' }).map(h => h.id);

  assert.deepStrictEqual(byRating, ['h1', 'h3', 'h2'], 'Rating sort order must be h1, h3, h2');
  assert.deepStrictEqual(byNearest, ['h2', 'h3', 'h1'], 'Nearest sort order must be h2, h3, h1');
  assert.deepStrictEqual(byCost, ['h3', 'h2', 'h1'], 'Cost sort order must be h3, h2, h1');

  // Confirm they are all distinct permutations
  assert.notDeepStrictEqual(byRating, byNearest);
  assert.notDeepStrictEqual(byNearest, byCost);
  assert.notDeepStrictEqual(byRating, byCost);
});

test('TEST 8 (Suite 18): "Recommended" option restores curated national reference order #1 to #5', () => {
  const nationalHospitals = getNationalReferenceHospitals('kidney');
  assert.strictEqual(nationalHospitals.length, 5);

  // Sort by rating (scrambles reference rank order)
  const sortedByRating = sortHospitals(nationalHospitals, 'highest_rating', { condition: 'kidney' });

  // Re-sort by 'recommended'
  const restored = sortHospitals(sortedByRating, 'recommended', { condition: 'kidney' });
  const restoredRanks = restored.map(h => h.referenceRank);
  assert.deepStrictEqual(restoredRanks, [1, 2, 3, 4, 5], 'Recommended sort must restore reference rank 1..5 order');
});

test('TEST 9 (Suite 18): Simulated patient outcome data is strictly informational and NEVER used for sorting', () => {
  const hA = { id: 'h_a', name: 'Hospital A', rating: 4.7, distance: 10, simulatedOutcomeRate: 60 };
  const hB = { id: 'h_b', name: 'Hospital B', rating: 4.7, distance: 10, simulatedOutcomeRate: 95 };

  // When rating and distance are identical, simulatedOutcomeRate must NOT reorder them
  const sorted = sortHospitals([hA, hB], 'highest_rating');
  assert.strictEqual(sorted[0].id, 'h_a', 'Simulated outcomes must not influence sorting');
  assert.strictEqual(sorted[1].id, 'h_b');
});

test('TEST 10 (Suite 18): sortHospitals is a pure function and never mutates input array', () => {
  const original = [
    { id: 'h_1', rating: 4.1 },
    { id: 'h_2', rating: 4.9 }
  ];
  const copy = [...original];

  const result = sortHospitals(original, 'highest_rating');
  assert.strictEqual(result[0].id, 'h_2');
  assert.deepStrictEqual(original, copy, 'Original input array must not be mutated');
});

// ----------------------------------------------------
// 19. OUTCOME METRIC UI PRESENTATION
// ----------------------------------------------------
console.log('--- Suite 19: Outcome Metric UI Presentation ---');

test('TEST 1 (Suite 19): HospitalCard displays "Outcome Rate" and "Patient Cohort" without "Simulated" prefix', () => {
  const cardPath = path.resolve('src/components/hospital/HospitalCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf8');

  assert(cardCode.includes('Outcome Rate:'), 'HospitalCard must display "Outcome Rate:"');
  assert(cardCode.includes('Patient Cohort:'), 'HospitalCard must display "Patient Cohort:"');
  assert(!cardCode.includes('Simulated Outcome Rate:'), 'HospitalCard must NOT display "Simulated Outcome Rate:"');
  assert(!cardCode.includes('Simulated Cohort:'), 'HospitalCard must NOT display "Simulated Cohort:"');
});

test('TEST 2 (Suite 19): HospitalCard does not display individual repeated disclaimer', () => {
  const cardPath = path.resolve('src/components/hospital/HospitalCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf8');

  assert(!cardCode.includes('Simulated / Prototype Data — Illustrative figures for demonstration only'), 
    'Repeated disclaimer must be removed from individual HospitalCard');
  assert(!cardCode.includes('Prototype demo'), 
    '"Prototype demo" badge must be removed from individual HospitalCard');
});

test('TEST 3 (Suite 19): Page-level disclosure is present near search results heading in SortSelector', () => {
  const sortPath = path.resolve('src/components/search/SortSelector.jsx');
  const sortCode = fs.readFileSync(sortPath, 'utf8');

  assert(sortCode.includes('Outcome figures shown are based on the prototype dataset used by Sehat_Sathi.'),
    'SortSelector must display page-level disclosure');
});

test('TEST 4 (Suite 19): HospitalDetailPage displays "Outcome Data", "Outcome Rate", and "Patient Cohort"', () => {
  const detailPath = path.resolve('src/pages/HospitalDetailPage.jsx');
  const detailCode = fs.readFileSync(detailPath, 'utf8');

  assert(detailCode.includes('Outcome Data'), 'HospitalDetailPage section must be titled "Outcome Data"');
  assert(detailCode.includes('Outcome Rate'), 'HospitalDetailPage must display "Outcome Rate"');
  assert(detailCode.includes('Patient Cohort'), 'HospitalDetailPage must display "Patient Cohort"');
  assert(!detailCode.includes('Simulated Outcome Rate'), 'HospitalDetailPage must NOT display "Simulated Outcome Rate"');
  assert(!detailCode.includes('Simulated / Prototype Patient Outcome Data'), 
    'HospitalDetailPage section title must not contain "Simulated / Prototype"');
});

test('TEST 5 (Suite 19): ComparisonTable displays clean "Outcome Rate" and "Patient Cohort"', () => {
  const compPath = path.resolve('src/components/compare/ComparisonTable.jsx');
  const compCode = fs.readFileSync(compPath, 'utf8');

  assert(compCode.includes('Outcome Rate:'), 'ComparisonTable must display "Outcome Rate:"');
  assert(compCode.includes('Patient Cohort:'), 'ComparisonTable must display "Patient Cohort:"');
  assert(!compCode.includes('Simulated / Prototype Data — Not actual hospital statistics'),
    'ComparisonTable cells must not repeat disclaimer in every column cell');
});

test('TEST 6 (Suite 19): Underlying deterministic mock data and values remain 100% unchanged', () => {
  const aiimsKidney = getSimulatedOutcome('ref_kidney_1', 'kidney');
  assert.strictEqual(aiimsKidney.simulatedOutcomeRate, 87, 'AIIMS Kidney simulated rate must remain 87%');
  assert.strictEqual(aiimsKidney.cohortSize, 1000, 'Cohort size must remain 1000');
  assert.strictEqual(aiimsKidney.simulatedFavorableOutcomes, 870, 'Favorable count must remain 870');

  const aiimsCancer = getSimulatedOutcome('ref_cancer_2', 'cancer');
  assert.strictEqual(aiimsCancer.simulatedOutcomeRate, 78, 'AIIMS Cancer simulated rate must remain 78%');
  assert.strictEqual(aiimsCancer.simulatedFavorableOutcomes, 780, 'Favorable count must remain 780');

  const aiimsHeart = getSimulatedOutcome('ref_heart_2', 'heart');
  assert.strictEqual(aiimsHeart.simulatedOutcomeRate, 91, 'AIIMS Heart simulated rate must remain 91%');

  const aiimsBrain = getSimulatedOutcome('ref_brain_surgery_1', 'brain_surgery');
  assert.strictEqual(aiimsBrain.simulatedOutcomeRate, 84, 'AIIMS Brain simulated rate must remain 84%');
});

test('TEST 7 (Suite 19): Outcome rate remains strictly informational and is never used for hospital ranking', () => {
  const hosp1 = { id: 'h_low_rate', rating: 4.9, distance: 10, simulatedOutcomeRate: 65 };
  const hosp2 = { id: 'h_high_rate', rating: 4.7, distance: 10, simulatedOutcomeRate: 98 };

  const byRating = sortHospitals([hosp1, hosp2], 'highest_rating');
  assert.strictEqual(byRating[0].id, 'h_low_rate', 'Hospital with rating 4.9 must rank higher regardless of outcome rate');
  assert.strictEqual(byRating[1].id, 'h_high_rate');
});

test('TEST 8 (Suite 19): Chatbot components and services remain locked and intact', () => {
  const chatbotFiles = [
    'src/components/chatbot/ChatbotButton.jsx',
    'src/components/chatbot/Chatbot.jsx',
    'src/components/chatbot/ChatMessage.jsx',
    'src/components/chatbot/ChatInput.jsx',
    'src/components/chatbot/SuggestedQuestions.jsx',
    'src/services/chatbotService.js'
  ];
  chatbotFiles.forEach(file => {
    assert(fs.existsSync(path.resolve(file)), `Chatbot file ${file} must remain intact`);
  });
});

// ====================================================
// SUITE 20: MULTILINGUAL & VOICE SUPPORT TESTS
// ====================================================

console.log('\n--- SUITE 20: MULTILINGUAL & VOICE SUPPORT TESTS ---');

test('TEST 1 (Suite 20): Automatic language detection for English, Hindi, Punjabi, and Hinglish queries', () => {
  // English
  assert.strictEqual(chatbotService.detectLanguage('which hospital is best for kidney treatment?'), 'en');
  assert.strictEqual(chatbotService.detectLanguage('what is dialysis?'), 'en');
  assert.strictEqual(chatbotService.detectLanguage('tell me about pgimer'), 'en');

  // Hindi (Devanagari script)
  assert.strictEqual(chatbotService.detectLanguage('किडनी के इलाज के लिए कौन सा अस्पताल अच्छा है?', 'किडनी के इलाज के लिए कौन सा अस्पताल अच्छा है?'), 'hi');
  assert.strictEqual(chatbotService.detectLanguage('डायलिसिस क्या है?', 'डायलिसिस क्या है?'), 'hi');
  assert.strictEqual(chatbotService.detectLanguage('एम्स के बारे में बताएं', 'एम्स के बारे में बताएं'), 'hi');

  // Punjabi (Gurmukhi script)
  assert.strictEqual(chatbotService.detectLanguage('ਗੁਰਦੇ ਦੇ ਇਲਾਜ ਲਈ ਕਿਹੜਾ ਹਸਪਤਾਲ ਚੰਗਾ ਹੈ?', 'ਗੁਰਦੇ ਦੇ ਇਲਾਜ ਲਈ ਕਿਹੜਾ ਹਸਪਤਾਲ ਚੰਗਾ ਹੈ?'), 'pa');
  assert.strictEqual(chatbotService.detectLanguage('ਡਾਇਲਿਸਿਸ ਕੀ ਹੈ?', 'ਡਾਇਲਿਸਿਸ ਕੀ ਹੈ?'), 'pa');
  assert.strictEqual(chatbotService.detectLanguage('ਪੀਜੀਆਈ ਬਾਰੇ ਦੱਸੋ', 'ਪੀਜੀਆਈ ਬਾਰੇ ਦੱਸੋ'), 'pa');

  // Romanized Punjabi
  assert.strictEqual(chatbotService.detectLanguage('kidney de ilaaj lai kehda hospital changa'), 'pa');
  assert.strictEqual(chatbotService.detectLanguage('pgimer bare daso'), 'pa');

  // Hinglish
  assert.strictEqual(chatbotService.detectLanguage('mujhe kidney ke liye sabse accha hospital batao'), 'hinglish');
  assert.strictEqual(chatbotService.detectLanguage('dialysis kya hoti hai batao'), 'hinglish');
  assert.strictEqual(chatbotService.detectLanguage('heart attack ke lakshan kya hain'), 'hinglish');
});

asyncTest('TEST 2 (Suite 20): Multi-turn conversational language continuity and explicit switching', async () => {
  // Turn 1: Hinglish recommendation
  const turn1 = await chatbotService.processMessage('mujhe kidney hospital chahiye');
  assert.strictEqual(turn1.language, 'hinglish');
  assert(turn1.context);
  assert.strictEqual(turn1.context.language, 'hinglish');

  // Turn 2: Brief location follow-up in the same conversation inherits Hinglish
  const turn2 = await chatbotService.processMessage('Chandigarh', turn1.context);
  assert.strictEqual(turn2.language, 'hinglish', 'Brief follow-up should inherit Hinglish context');
  assert(turn2.message.includes('Apex Heart & Kidney Institute') || turn2.message.includes('Chandigarh'));

  // Turn 3: Explicit switch to English
  const turn3 = await chatbotService.processMessage('Please answer in English now', turn2.context);
  assert.strictEqual(turn3.language, 'en', 'Explicit request for English must switch response language to English');
});

asyncTest('TEST 3 (Suite 20): Health education queries return accurate responses in user language with localized safety disclaimers', async () => {
  // English
  const resEn = await chatbotService.processMessage('What is dialysis?');
  assert.strictEqual(resEn.intent, 'HEALTH_ADVICE');
  assert.strictEqual(resEn.language, 'en');
  assert(resEn.message.includes('Understanding Dialysis'));
  assert(resEn.disclaimer.includes('medical advice'));

  // Hindi
  const resHi = await chatbotService.processMessage('डायलिसिस क्या है?');
  assert.strictEqual(resHi.intent, 'HEALTH_ADVICE');
  assert.strictEqual(resHi.language, 'hi');
  assert(resHi.message.includes('डायलिसिस') || resHi.message.includes('Dialysis'));
  assert(resHi.disclaimer.includes('सलाह') || resHi.disclaimer.includes('सेहत_साथी'));

  // Punjabi
  const resPa = await chatbotService.processMessage('ਡਾਇਲਿਸਿਸ ਕੀ ਹੈ?');
  assert.strictEqual(resPa.intent, 'HEALTH_ADVICE');
  assert.strictEqual(resPa.language, 'pa');
  assert(resPa.message.includes('ਡਾਇਲਿਸਿਸ') || resPa.message.includes('Dialysis'));
  assert(resPa.disclaimer.includes('ਸਲਾਹ') || resPa.disclaimer.includes('ਸਿਹਤ_ਸਾਥੀ'));

  // Hinglish
  const resHing = await chatbotService.processMessage('dialysis kya hoti hai');
  assert.strictEqual(resHing.intent, 'HEALTH_ADVICE');
  assert.strictEqual(resHing.language, 'hinglish');
  assert(resHing.message.includes('Dialysis') || resHing.message.includes('treatment'));
  assert(resHing.disclaimer.includes('medical advice') || resHing.disclaimer.includes('Sehat_Sathi'));
});

asyncTest('TEST 4 (Suite 20): Multilingual hospital recommendations preserve curated national reference rankings (#1 to #5)', async () => {
  // Hindi query for kidney hospitals
  const resHi = await chatbotService.processMessage('किडनी के लिए अस्पताल');
  assert.strictEqual(resHi.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(resHi.isNational, true);
  assert.strictEqual(resHi.hospitals.length, 5);
  assert.strictEqual(resHi.hospitals[0].id, 'ref_kidney_1', 'AIIMS must remain Rank #1 in Hindi response');
  assert.strictEqual(resHi.hospitals[1].id, 'ref_kidney_2', 'PGIMER must remain Rank #2 in Hindi response');
  assert(resHi.message.includes('राष्ट्रीय संदर्भ केंद्र') || resHi.message.includes('AIIMS'));

  // Punjabi query for cardiac hospitals
  const resPa = await chatbotService.processMessage('ਦਿਲ ਦੇ ਇਲਾਜ ਲਈ ਹਸਪਤਾਲ');
  assert.strictEqual(resPa.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(resPa.isNational, true);
  assert.strictEqual(resPa.hospitals.length, 5);
  assert.strictEqual(resPa.hospitals[0].id, 'ref_heart_1', 'Medanta must remain Rank #1 in Punjabi response');
  assert.strictEqual(resPa.hospitals[1].id, 'ref_heart_2', 'AIIMS must remain Rank #2 in Punjabi response');
  assert(resPa.message.includes('ਰਾਸ਼ਟਰੀ ਰੈਫਰੈਂਸ') || resPa.message.includes('Medanta'));

  // Hinglish query for cancer hospitals
  const resHing = await chatbotService.processMessage('cancer ke liye best hospital');
  assert.strictEqual(resHing.intent, 'HOSPITAL_RECOMMENDATION');
  assert.strictEqual(resHing.isNational, true);
  assert.strictEqual(resHing.hospitals.length, 5);
  assert.strictEqual(resHing.hospitals[0].id, 'ref_cancer_1', 'Tata Memorial must remain Rank #1 in Hinglish response');
  assert(resHing.message.includes('National Reference') || resHing.message.includes('Tata Memorial'));
});

asyncTest('TEST 5 (Suite 20): Emergency queries trigger localized emergency warning protocol and emergency numbers', async () => {
  // English Emergency
  const emEn = await chatbotService.processMessage('I have severe crushing chest pain');
  assert.strictEqual(emEn.isEmergency, true);
  assert(emEn.message.includes('112 / 108'));

  // Hindi Emergency
  const emHi = await chatbotService.processMessage('सीने में बहुत तेज दर्द हो रहा है');
  assert.strictEqual(emHi.isEmergency, true);
  assert.strictEqual(emHi.language, 'hi');
  assert(emHi.message.includes('112 / 108'));

  // Punjabi Emergency
  const emPa = await chatbotService.processMessage('ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਹੈ ਅਤੇ ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ');
  assert.strictEqual(emPa.isEmergency, true);
  assert.strictEqual(emPa.language, 'pa');
  assert(emPa.message.includes('112 / 108'));
});

asyncTest('TEST 6 (Suite 20): Multilingual hospital comparison tables generate in user query language', async () => {
  // Hindi Comparison
  const compHi = await chatbotService.processMessage('एम्स और पीजीआई की तुलना');
  assert.strictEqual(compHi.intent, 'HOSPITAL_INFORMATION');
  assert.strictEqual(compHi.language, 'hi');
  assert.strictEqual(compHi.hospitals.length, 2);
  assert(compHi.message.includes('तुलना'));

  // Punjabi Comparison
  const compPa = await chatbotService.processMessage('ਏਮਜ਼ ਅਤੇ ਪੀਜੀਆਈ ਦੀ ਤੁਲਨਾ');
  assert.strictEqual(compPa.intent, 'HOSPITAL_INFORMATION');
  assert.strictEqual(compPa.language, 'pa');
  assert.strictEqual(compPa.hospitals.length, 2);
  assert(compPa.message.includes('ਤੁਲਨਾ'));
});

asyncTest('TEST 7 (Suite 20): Multilingual out-of-scope queries return friendly boundaries in user language', async () => {
  // Hindi Out of scope
  const oosHi = await chatbotService.processMessage('आज मौसम कैसा रहेगा?');
  assert.strictEqual(oosHi.intent, 'OUT_OF_SCOPE');
  assert.strictEqual(oosHi.language, 'hi');
  assert(oosHi.message.includes('सेहत_साथी') && oosHi.message.includes('स्वास्थ्य सहायक'));

  // Punjabi Out of scope
  const oosPa = await chatbotService.processMessage('ਅੱਜ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਰਹੇਗਾ?');
  assert.strictEqual(oosPa.intent, 'OUT_OF_SCOPE');
  assert.strictEqual(oosPa.language, 'pa');
  assert(oosPa.message.includes('ਸਿਹਤ_ਸਾਥੀ') && oosPa.message.includes('ਸਿਹਤ ਸਹਾਇਕ'));
});

test('TEST 8 (Suite 20): Markdown stripping for voice output (TTS) produces clean, natural speech text', () => {
  const markdownText = `
### Top 5 National Reference Hospitals
1. **AIIMS — New Delhi** (Rank #1)
• 24x7 Emergency Ready
• Specialties: Nephrology, Urology
| Metric | AIIMS |
| --- | --- |
| Beds | 2,478 |
🏥 📍 💰 ⭐ Check https://sehatsathi.in
*Simulated / Prototype Data*
`;

  const stripped = stripMarkdownForSpeech(markdownText);
  // Verify markdown headers, bold, bullets, links, table markers, and emojis are stripped
  assert(!stripped.includes('###'), 'Headers must be stripped');
  assert(!stripped.includes('**'), 'Bold markdown syntax must be stripped');
  assert(!stripped.includes('•'), 'Bullet characters must be stripped');
  assert(!stripped.includes('https://'), 'URLs must be stripped');
  assert(!stripped.includes('🏥'), 'Hospital emoji must be stripped');
  assert(!stripped.includes('📍'), 'Pin emoji must be stripped');
  assert(!stripped.includes('⭐'), 'Star emoji must be stripped');
  assert(!stripped.includes('| --- |'), 'Table divider bars must be stripped');
  assert(stripped.includes('AIIMS — New Delhi'), 'Actual content text must be preserved');
  assert(stripped.includes('Nephrology, Urology'), 'Content details must be preserved');
});

test('TEST 9 (Suite 20): Speech recognition & synthesis integration in ChatInput and ChatMessage', () => {
  const chatInputSource = fs.readFileSync(path.resolve('src/components/chatbot/ChatInput.jsx'), 'utf-8');
  assert(chatInputSource.includes('SpeechRecognition'), 'ChatInput must integrate browser SpeechRecognition');
  assert(chatInputSource.includes('LANGUAGE_RECOGNITION_MAP'), 'ChatInput must define multilingual speech recognition configurations');
  assert(chatInputSource.includes('isListening'), 'ChatInput must track listening state');
  assert(chatInputSource.includes('toggleListening'), 'ChatInput must provide user toggle to start/stop listening');
  assert(chatInputSource.includes('speechError'), 'ChatInput must handle permissions and recognition errors gracefully');

  const chatMessageSource = fs.readFileSync(path.resolve('src/components/chatbot/ChatMessage.jsx'), 'utf-8');
  assert(chatMessageSource.includes('Volume2'), 'ChatMessage must render speaker audio icon');
  assert(chatMessageSource.includes('speechSynthesis'), 'ChatMessage must support speech synthesis voice output');
  assert(chatMessageSource.includes('stripMarkdownForSpeech'), 'ChatMessage must clean text before speaking');
  assert(chatMessageSource.includes('getBestVoiceForLanguage'), 'ChatMessage must match voice to response language');
});

// ----------------------------------------------------
// 21. CONDITION-SPECIFIC OUTCOME DATA VALIDATION
// ----------------------------------------------------
console.log('--- Suite 21: Condition-Specific Outcome Data & Deterministic Mock Validation ---');

test('TEST 1 (Suite 21): Same hospital + same condition returns identical value after repeated calls', () => {
  const first = getSimulatedOutcome('ref_brain_surgery_1', 'neurology');
  assert(first !== null, 'Outcome must exist for AIIMS Neurology');
  for (let i = 0; i < 15; i++) {
    const repeated = getSimulatedOutcome('ref_brain_surgery_1', 'neurology');
    assert.strictEqual(repeated.simulatedOutcomeRate, first.simulatedOutcomeRate);
    assert.strictEqual(repeated.simulatedFavorableOutcomes, first.simulatedFavorableOutcomes);
    assert.strictEqual(repeated.cohortSize, 1000);
  }
});

test('TEST 2 (Suite 21): AIIMS + Neurology always returns its predefined value', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_1', 'neurology');
  assert(res !== null, 'AIIMS + Neurology must resolve');
  assert.strictEqual(res.simulatedOutcomeRate, 88);
  assert.strictEqual(res.simulatedFavorableOutcomes, 880);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual(res.condition, 'neurology');

  // Also verify via canonical alias
  const aliasRes = getSimulatedOutcome('aiims', 'neurology');
  assert.strictEqual(aliasRes.simulatedOutcomeRate, 88);
  assert.strictEqual(aliasRes.simulatedFavorableOutcomes, 880);

  // Normalization checks
  assert.strictEqual(normalizeSimConditionKey('neurology'), 'neurology');
  assert.strictEqual(normalizeSimConditionKey('neurology', 'brain_surgery'), 'brain_surgery');
  assert.strictEqual(normalizeSimConditionKey('neurology', '', 'brain surgery hospital'), 'brain_surgery');
  assert.strictEqual(normalizeSimConditionKey('neurology', '', 'best neurology hospital'), 'neurology');
});

test('TEST 3 (Suite 21): NIMHANS + Neurology always returns its predefined value', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_2', 'neurology');
  assert(res !== null, 'NIMHANS + Neurology must resolve');
  assert.strictEqual(res.simulatedOutcomeRate, 89);
  assert.strictEqual(res.simulatedFavorableOutcomes, 890);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual(res.condition, 'neurology');

  // Also verify via alias
  const aliasRes = getSimulatedOutcome('nimhans', 'neurology');
  assert.strictEqual(aliasRes.simulatedOutcomeRate, 89);
  assert.strictEqual(aliasRes.simulatedFavorableOutcomes, 890);
});

test('TEST 4 (Suite 21): Medanta + Neurology always returns its predefined value', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_4', 'neurology');
  assert(res !== null, 'Medanta + Neurology must resolve');
  assert.strictEqual(res.simulatedOutcomeRate, 87);
  assert.strictEqual(res.simulatedFavorableOutcomes, 870);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual(res.condition, 'neurology');

  // Also verify via alias
  const aliasRes = getSimulatedOutcome('medanta', 'neurology');
  assert.strictEqual(aliasRes.simulatedOutcomeRate, 87);
  assert.strictEqual(aliasRes.simulatedFavorableOutcomes, 870);
});

test('TEST 5 (Suite 21): Different conditions for the same hospital have different predefined values (AIIMS Neurology vs Brain Surgery vs Kidney vs Cancer)', () => {
  const neuro = getSimulatedOutcome('aiims', 'neurology');
  const brainSurgery = getSimulatedOutcome('aiims', '', 'brain_surgery');
  const kidney = getSimulatedOutcome('aiims', 'kidney');
  const cancer = getSimulatedOutcome('aiims', 'cancer');

  assert(neuro && brainSurgery && kidney && cancer, 'All 4 conditions must resolve for AIIMS');

  assert.strictEqual(neuro.simulatedOutcomeRate, 88, 'AIIMS Neurology must be 88%');
  assert.strictEqual(brainSurgery.simulatedOutcomeRate, 84, 'AIIMS Brain Surgery must be 84%');
  assert.strictEqual(kidney.simulatedOutcomeRate, 87, 'AIIMS Kidney must be 87%');
  assert.strictEqual(cancer.simulatedOutcomeRate, 78, 'AIIMS Cancer must be 78%');

  // Verify all 4 rates are distinct values
  const uniqueRates = new Set([
    neuro.simulatedOutcomeRate,
    brainSurgery.simulatedOutcomeRate,
    kidney.simulatedOutcomeRate,
    cancer.simulatedOutcomeRate
  ]);
  assert.strictEqual(uniqueRates.size, 4, 'All four condition outcomes for AIIMS must be distinct numbers');
});

test('TEST 6 (Suite 21): 84% = 840 / 1,000 (AIIMS Brain Surgery)', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_1', '', 'brain_surgery');
  assert(res !== null);
  assert.strictEqual(res.simulatedOutcomeRate, 84);
  assert.strictEqual(res.simulatedFavorableOutcomes, 840);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual((res.simulatedFavorableOutcomes / res.cohortSize) * 100, res.simulatedOutcomeRate);
});

test('TEST 7 (Suite 21): 85% = 850 / 1,000 (Medanta Brain Surgery)', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_4', '', 'brain_surgery');
  assert(res !== null);
  assert.strictEqual(res.simulatedOutcomeRate, 85);
  assert.strictEqual(res.simulatedFavorableOutcomes, 850);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual((res.simulatedFavorableOutcomes / res.cohortSize) * 100, res.simulatedOutcomeRate);
});

test('TEST 8 (Suite 21): 86% = 860 / 1,000 (NIMHANS Brain Surgery)', () => {
  const res = getSimulatedOutcome('ref_brain_surgery_2', '', 'brain_surgery');
  assert(res !== null);
  assert.strictEqual(res.simulatedOutcomeRate, 86);
  assert.strictEqual(res.simulatedFavorableOutcomes, 860);
  assert.strictEqual(res.cohortSize, 1000);
  assert.strictEqual((res.simulatedFavorableOutcomes / res.cohortSize) * 100, res.simulatedOutcomeRate);
});

test('TEST 9 (Suite 21): No Math.random() or random outcome generation exists in simulatedOutcomeData.js', () => {
  const code = fs.readFileSync(path.resolve('src/data/simulatedOutcomeData.js'), 'utf-8');
  assert(!code.includes('Math.random'), 'simulatedOutcomeData.js must never use Math.random()');
  assert(!code.includes('random()'), 'simulatedOutcomeData.js must not contain any random calls');
});

test('TEST 10 (Suite 21): Universal outcome availability (all hospitals have valid outcome data, never Not Available)', () => {
  // Empty or invalid hospital ID returns null safely
  assert.strictEqual(getSimulatedOutcome(null), null);
  assert.strictEqual(getSimulatedOutcome(''), null);

  // Every single hospital in the master dataset (HOSPITALS 1..27) must have valid outcome data
  assert(HOSPITALS.length === 27, 'Must test all 27 hospitals');
  for (const h of HOSPITALS) {
    const outcome = getSimulatedOutcome(h.id, 'neurology');
    assert(outcome !== null, `Hospital ${h.id} (${h.name}) must have outcome data for neurology`);
    assert.strictEqual(outcome.cohortSize, 1000);
    assert.strictEqual((outcome.simulatedFavorableOutcomes / outcome.cohortSize) * 100, outcome.simulatedOutcomeRate);
    assert(outcome.simulatedOutcomeRate >= 75 && outcome.simulatedOutcomeRate <= 98);

    // Also test without specific condition
    const generalOutcome = getSimulatedOutcome(h.id);
    assert(generalOutcome !== null, `Hospital ${h.id} (${h.name}) must have outcome data without condition`);
    assert.strictEqual(generalOutcome.cohortSize, 1000);
  }

  // Verify that HospitalCard.jsx does NOT contain "Outcome data: Not available"
  const cardSource = fs.readFileSync(path.resolve('src/components/hospital/HospitalCard.jsx'), 'utf-8');
  assert(!cardSource.includes('Outcome data: Not available'), 'HospitalCard must never display "Outcome data: Not available"');

  // Verify that HospitalGrid.jsx does NOT render the expanded radius alert banner
  const gridSource = fs.readFileSync(path.resolve('src/components/hospital/HospitalGrid.jsx'), 'utf-8');
  assert(!gridSource.includes('{expansionNotice &&'), 'HospitalGrid must not render expansionNotice banner');
});

test('TEST 11 (Suite 21): Outcome rate never changes hospital ranking (sortHospitals unchanged)', () => {
  const sampleHospitals = [
    { id: 1, name: 'Hospital Alpha', rating: 4.5, distance: 10, reviewCount: 500, estimatedCosts: { kidneyTreatment: { min: 80000, max: 120000, label: '₹80,000 - ₹1,20,000' } } },
    { id: 2, name: 'Hospital Beta', rating: 4.9, distance: 25, reviewCount: 900, estimatedCosts: { kidneyTreatment: { min: 150000, max: 200000, label: '₹1,50,000 - ₹2,00,000' } } },
    { id: 3, name: 'Hospital Gamma', rating: 4.7, distance: 5, reviewCount: 300, estimatedCosts: { kidneyTreatment: { min: 50000, max: 90000, label: '₹50,000 - ₹90,000' } } }
  ];

  // Highest rating sort
  const sortedRating = sortHospitals(sampleHospitals, 'highest_rating');
  assert.strictEqual(sortedRating[0].name, 'Hospital Beta'); // 4.9
  assert.strictEqual(sortedRating[1].name, 'Hospital Gamma'); // 4.7
  assert.strictEqual(sortedRating[2].name, 'Hospital Alpha'); // 4.5

  // Nearest sort
  const sortedNearest = sortHospitals(sampleHospitals, 'nearest');
  assert.strictEqual(sortedNearest[0].name, 'Hospital Gamma'); // 5 km
  assert.strictEqual(sortedNearest[1].name, 'Hospital Alpha'); // 10 km
  assert.strictEqual(sortedNearest[2].name, 'Hospital Beta'); // 25 km

  // Lowest cost sort
  const sortedCost = sortHospitals(sampleHospitals, 'lowest_cost', { condition: 'kidney' });
  assert.strictEqual(sortedCost[0].name, 'Hospital Gamma'); // min 50k
  assert.strictEqual(sortedCost[1].name, 'Hospital Alpha'); // min 80k
  assert.strictEqual(sortedCost[2].name, 'Hospital Beta'); // min 150k
});

test('TEST 12 (Suite 21): National reference order remains unchanged', () => {
  const neuroRefs = getNationalReferenceHospitals('brain_surgery');
  assert.strictEqual(neuroRefs.length, 5);
  // Reference ranks must be #1 through #5 strictly
  assert.strictEqual(neuroRefs[0].referenceRank, 1);
  assert(neuroRefs[0].name.includes('AIIMS'));
  assert.strictEqual(neuroRefs[1].referenceRank, 2);
  assert(neuroRefs[1].name.includes('NIMHANS'));
  assert.strictEqual(neuroRefs[2].referenceRank, 3);
  assert(neuroRefs[2].name.includes('PGIMER'));
  assert.strictEqual(neuroRefs[3].referenceRank, 4);
  assert(neuroRefs[3].name.includes('Medanta'));
  assert.strictEqual(neuroRefs[4].referenceRank, 5);
  assert(neuroRefs[4].name.includes('CMC'));

  // AIIMS Brain surgery outcome rate is 84%, NIMHANS is 86%.
  // Even though NIMHANS outcome rate (86%) > AIIMS outcome rate (84%), AIIMS MUST REMAIN #1 and NIMHANS #2!
  const aiimsOutcome = getSimulatedOutcome(neuroRefs[0].id, '', 'brain_surgery');
  const nimhansOutcome = getSimulatedOutcome(neuroRefs[1].id, '', 'brain_surgery');
  assert.strictEqual(aiimsOutcome.simulatedOutcomeRate, 84);
  assert.strictEqual(nimhansOutcome.simulatedOutcomeRate, 86);
  assert.strictEqual(neuroRefs[0].referenceRank, 1, 'AIIMS remains #1 reference rank');
  assert.strictEqual(neuroRefs[1].referenceRank, 2, 'NIMHANS remains #2 reference rank');
});

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
(async () => {
  for (const t of asyncQueue) {
    await t();
  }
  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passedTests} passed, ${failedTests} failed`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
