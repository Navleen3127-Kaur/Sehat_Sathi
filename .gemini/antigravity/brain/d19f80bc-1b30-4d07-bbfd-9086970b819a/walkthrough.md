# Walkthrough: Phase 4.2 — Organisation Verification, Dynamic Top-2 Comparison, Secure Admin Portal & Disease-Specific Data

This walkthrough details the complete implementation of **Phase 4.2** for Sehat_Sathi, delivering statutory organisation verification, dynamic top-2 comparison from live search results, secure administrative route guards and audit logging, and zero-superlative clinical comparison tables.

---

## 1. Summary of Changes

### A. Independent Organisation / Accreditation Verification
- **Strict Separation of Facilities from Statutory Programmes**:
  - `Dialysis !== PMNDP`: Having a dialysis machine on-site does not automatically imply accreditation or subsidy under the Pradhan Mantri National Dialysis Programme.
  - `Nephrology !== NABH`: Offering nephrology does not imply NABH hospital accreditation.
  - `NABH !== NABL`: NABH hospital accreditation does not automatically confer NABL laboratory accreditation.
- **Identity Matching Standard**:
  - Name matching alone is strictly prohibited. Identity matching requires exact verification across `hospital name + street address + city + state`.
  - Supported verification statuses: `verified`, `unverified`, `not_found`, `expired`, `conflicting`, `pending_review`.
  - Every verified affiliation requires mandatory source citation and audit date.

### B. Dynamic Top-2 Comparison Matrix
- **Elimination of Hardcoded Comparison**:
  - In [`src/context/ComparisonContext.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/context/ComparisonContext.jsx), initialized `selectedHospitals` as `[]` (previously pre-seeded with CityCare vs Apollo).
  - Added `dynamicTopTwo`, `setDynamicTopTwo()`, `clearDynamicTopTwo()`, and `applyTopTwoComparison()`.
- **Dynamic CTA on SearchResultsPage**:
  - In [`src/pages/SearchResultsPage.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/pages/SearchResultsPage.jsx), when search yields &ge; 2 hospitals, a prominent CTA banner dynamically displays:
    > *"Compare Top 2 Matches: [Hospital A] vs [Hospital B]"*
  - Automatically clears and recalculates comparison candidates whenever search query, coordinates, condition, or budget criteria change.
  - Single Match: When exactly 1 hospital matches, displays `"Only 1 matching hospital found for your criteria. At least 2 matches required for comparison"` with a one-click CTA to expand radius.
  - Zero Matches: No compare CTA is displayed.
- **Side-by-Side Neutral Matrix ([`ComparisonTable.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/components/compare/ComparisonTable.jsx))**:
  - Displays exactly 2 columns when launched from Dynamic Top-2 CTA (or up to 4 on manual selection).
  - Rows: Requirement Match score (e.g. `93/100`), Distance from user, 24x7 Emergency, Individual Facilities, Condition-Isolated Clinical Metrics, Organisation Affiliations with status badges & sources, Baseline Costs, and Contact info.
  - **Strict Null Preservation**: Missing metrics display `"Data not available"`. Missing costs display `"Cost data not available"` (never `"₹0"`).
  - **Factual Presentation Only**: Strictly zero superlatives ("Winner", "Best Hospital", "Recommended Choice").

### C. Secure Admin Portal & Audit Governance
- **Route Guard Protection**:
  - Created [`src/components/admin/AdminProtectedRoute.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/components/admin/AdminProtectedRoute.jsx) which checks authentication and role (`role: 'admin'`).
  - Unauthenticated access to `/admin` or `/admin/*` redirects immediately to `/admin/login`.
- **Session-Based Authentication Context**:
  - Created [`src/context/AdminAuthContext.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/context/AdminAuthContext.jsx) with tab-scoped `sessionStorage` credential state.
  - Created [`src/pages/admin/AdminLogin.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/pages/admin/AdminLogin.jsx) with secure login UI and governance disclaimer.
- **Strict Input Validation & Soft-Delete**:
  - In [`src/services/adminService.js`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/services/adminService.js):
    - `validateHospitalInput`: Rejects non-positive integer beds, invalid coordinates outside `[-90..90, -180..180]`, negative treatment costs, and verified status without non-empty source citation and verification date.
    - `deleteHospital`: Implemented soft-delete (`isActive: false`, `deletedAt`, `deactivationReason`) and created administrative audit entry.
    - `logAudit` & `getAuditLogs`: Immutable tracking of `adminUserId`, `action`, `entityType`, `entityId`, `timestamp`, `beforeValue`, `afterValue`, and `reason`.
- **Destructive Action Confirmation Modal**:
  - In [`src/pages/admin/AdminHospitals.jsx`](file:///c:/Users/navle/Desktop/Sehat_Sathi/src/pages/admin/AdminHospitals.jsx), added a soft-delete button with a modal showing target hospital name, reason input, and cancellation safeguard. Single-click deletion is strictly prevented.
- **Zero Plaintext Passwords in Source Code**:
  - Audited and verified all JS/JSX files in `src/`. Zero hardcoded passwords exist in client source code.

---

## 2. Automated Test Verification (158 Tests Passed)

All 39 required tests from **Part O** were implemented in **Suite 13** of [`tests/run_tests.js`](file:///c:/Users/navle/Desktop/Sehat_Sathi/tests/run_tests.js).

### Suite 13 Test Execution Results:

| # | Test Scenario | Status |
|---|---|:---:|
| 1 | Dialysis facility present without PMNDP affiliation does not show PMNDP badge | ✅ PASS |
| 2 | PMNDP affiliated hospital displays PMNDP status with source; dialysis is independently true | ✅ PASS |
| 3 | Hospital with Nephrology specialty without NABH accreditation shows NABH as unverified/not_found | ✅ PASS |
| 4 | NABH-accredited hospital does not automatically receive NABL accreditation | ✅ PASS |
| 5 | NABL-accredited laboratory does not automatically confer NABH hospital accreditation | ✅ PASS |
| 6 | Accreditation search by hospital name must also match address/city/state | ✅ PASS |
| 7 | Expired NABH accreditation displays "Expired" status with previous validity date | ✅ PASS |
| 8 | Hospital claiming PMNDP but not found on official registry displays "Not Found" status | ✅ PASS |
| 9 | Conflicting registry data displays "Conflicting Information" flag | ✅ PASS |
| 10 | Affiliation with status "pending_review" displays "Verification in Progress" badge | ✅ PASS |
| 11 | Dynamic Top-2: Search returning 5 hospitals selects top 2 by Requirement Match score | ✅ PASS |
| 12 | Dynamic Top-2: Search returning 2 hospitals selects both for comparison | ✅ PASS |
| 13 | Dynamic Top-2: Search returning 1 hospital does not display top-2 comparison CTA | ✅ PASS |
| 14 | Dynamic Top-2: Search returning 0 hospitals does not display top-2 comparison CTA | ✅ PASS |
| 15 | Dynamic Top-2: Changing search query clears previous comparison candidates and recalculates | ✅ PASS |
| 16 | Dynamic Top-2: Changing location clears previous comparison candidates and recalculates | ✅ PASS |
| 17 | Dynamic Top-2: Changing budget filter clears previous comparison candidates and recalculates | ✅ PASS |
| 18 | Dynamic Top-2: Comparison CTA displays hospital names dynamically | ✅ PASS |
| 19 | Comparison view displays exactly 2 columns when launched from dynamic top-2 CTA | ✅ PASS |
| 20 | Comparison view displays Requirement Match score for each compared hospital | ✅ PASS |
| 21 | Comparison view displays condition-specific performance metrics relevant to query | ✅ PASS |
| 22 | Comparison view displays organisation affiliations with verification status and sources | ✅ PASS |
| 23 | Comparison view does not display "Winner" or "Recommended Choice" badge | ✅ PASS |
| 24 | Comparison view displays "Cost data not available" for missing procedure costs (never ₹0) | ✅ PASS |
| 25 | Disease-specific: Missing performance metric displays "Data not available" (never fabricated number) | ✅ PASS |
| 26 | Disease-specific: Zero cure/success rate claims exist across all hospitals in dataset | ✅ PASS |
| 27 | Disease-specific: Query for "kidney" only displays kidney metrics (not cardiac/cancer) | ✅ PASS |
| 28 | Disease-specific: Query for "heart" only displays cardiac metrics (not kidney/cancer) | ✅ PASS |
| 29 | Admin: Unauthenticated request to /admin redirects to login page | ✅ PASS |
| 30 | Admin: Valid admin credentials grant access to admin dashboard | ✅ PASS |
| 31 | Admin: Non-admin role cannot access admin actions | ✅ PASS |
| 32 | Admin: Hospital modification creates audit log entry with timestamp and user ID | ✅ PASS |
| 33 | Admin: Verification status change logs previous and new status in audit trail | ✅ PASS |
| 34 | Admin: Deleting hospital requires confirmation and performs soft-delete (isActive: false) | ✅ PASS |
| 35 | Admin: Bed count validation rejects negative numbers and non-integers | ✅ PASS |
| 36 | Admin: Coordinate validation rejects values outside [-90..90] and [-180..180] | ✅ PASS |
| 37 | Admin: Verified status requires non-empty source name and verification date | ✅ PASS |
| 38 | Admin: Treatment cost validation rejects negative values | ✅ PASS |
| 39 | Security: No plaintext passwords found in client-side source code | ✅ PASS |

**Total Suite 1–13 Test Summary**:
```text
====================================================
🏁 TEST RESULTS: 158 passed, 0 failed
====================================================
```

---

## 3. Production Build Verification

Executed `cmd.exe /c npm run build`:
```text
> sehat-sathi@1.0.0 build
> vite build

vite v6.4.3 building for production...
transforming...
✓ 1635 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.06 kB │ gzip:   0.59 kB
dist/assets/index-DSIiZG5m.css   50.44 kB │ gzip:   8.59 kB
dist/assets/index-CP9P64T8.js   571.81 kB │ gzip: 139.59 kB
✓ built in 2.04s
```
**Exit Code**: 0 (Clean production build with zero errors).
