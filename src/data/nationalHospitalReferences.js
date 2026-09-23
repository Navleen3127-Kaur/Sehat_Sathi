/**
 * Sehat_Sathi - Curated National Hospital Reference Lists
 * 
 * Centralized, authoritative national hospital reference dataset for specialized
 * healthcare searches across 8 primary medical categories.
 * 
 * IMPORTANT:
 * This is Sehat_Sathi's curated national reference order.
 * Do NOT present it as an official government ranking or universal medical ranking.
 * 
 * The reference order is DETERMINISTIC (referenceRank ASC #1 to #5).
 * Distance, location, budget, matchScore, verification, and performance data
 * NEVER change referenceRank or reorder the curated list.
 */

import { calculateHaversineDistance } from '../services/locationService.js';

export const NATIONAL_HOSPITAL_REFERENCES = {
  kidney: {
    categoryKey: 'kidney',
    categoryName: 'Kidney / Nephrology',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_kidney_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Ansari Nagar, Sri Aurobindo Marg',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Kidney / Nephrology',
        specialty: 'Nephrology & Kidney Transplant',
        specialties: ['Nephrology', 'Urology', 'Kidney Transplantation', 'Dialysis Services'],
        facilities: ['icu', 'dialysis', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', dialysis: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['dialysis_procedure', 'kidney_transplant', 'renal_biopsy', 'crrt'],
        explicitCapabilities: ['Advanced Renal Replacement Therapy', 'Living & Deceased Donor Kidney Transplant', 'CRRT Unit', 'Comprehensive Hemodialysis'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex Institute of National Importance for tertiary renal care and transplantation',
        overview: 'All India Institute of Medical Sciences (AIIMS) New Delhi is India’s premier public apex medical institution. Its Department of Nephrology and Department of Surgical Disciplines / Urology form one of the highest-acuity renal transplantation, chronic kidney disease, and hemodialysis care centres in South Asia.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_kidney_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'PGIMER — Chandigarh',
        fullName: 'Postgraduate Institute of Medical Education and Research, Chandigarh',
        city: 'Chandigarh',
        state: 'Chandigarh',
        location: {
          address: 'Sector 12',
          city: 'Chandigarh',
          state: 'Chandigarh',
          pincode: '160012',
          latitude: 30.7644,
          longitude: 76.7770
        },
        category: 'Kidney / Nephrology',
        specialty: 'Nephrology & Kidney Transplant',
        specialties: ['Nephrology', 'Urology', 'Transplant Surgery', 'Dialysis Services'],
        facilities: ['icu', 'dialysis', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', dialysis: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['dialysis_procedure', 'kidney_transplant', 'renal_angiography'],
        explicitCapabilities: ['Regional Renal Transplant Centre (ROTTO North)', 'High-Volume Maintenance Hemodialysis', 'Peritoneal Dialysis', 'Pediatric Nephrology'],
        beds: 1948,
        icuBeds: 210,
        establishedYear: 1962,
        emergency24x7: true,
        phone: '+91 172 275 6565',
        emergencyPhone: '+91 172 275 6112',
        rating: 4.8,
        reviewCount: 1950,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'National referral institute and ROTTO hub for renal sciences in Northern India',
        overview: 'PGIMER Chandigarh is an Institute of National Importance serving northern India. It houses advanced clinical departments in Nephrology and Renal Transplant Surgery, with accredited organ-sharing protocols and multi-disciplinary critical care.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_kidney_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'CMC Vellore — Vellore',
        fullName: 'Christian Medical College, Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        location: {
          address: 'Ida Scudder Road',
          city: 'Vellore',
          state: 'Tamil Nadu',
          pincode: '632004',
          latitude: 12.9246,
          longitude: 79.1348
        },
        category: 'Kidney / Nephrology',
        specialty: 'Nephrology & Kidney Transplant',
        specialties: ['Nephrology', 'Urology', 'Renal Transplantation'],
        facilities: ['icu', 'dialysis', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', dialysis: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['dialysis_procedure', 'kidney_transplant', 'pediatric_dialysis'],
        explicitCapabilities: ['Pioneer in Indian Kidney Transplantation', 'Specialized Glomerular Disease Unit', 'Pediatric Nephrology', 'Renal Pathology Lab'],
        beds: 3000,
        icuBeds: 280,
        establishedYear: 1900,
        emergency24x7: true,
        phone: '+91 416 228 1000',
        emergencyPhone: '+91 416 228 2000',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['NABH', 'NABL', 'Apex Charitable Institution'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Centennial tertiary referral teaching hospital and transplantation pioneer',
        overview: 'Christian Medical College Vellore conducted India’s first successful kidney transplant in 1971. Its Department of Nephrology is internationally recognized for comprehensive patient care, ethical clinical guidelines, and high surgical success.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_kidney_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'SGPGIMS — Lucknow',
        fullName: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences, Lucknow',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        location: {
          address: 'Raebareli Road',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226014',
          latitude: 26.7454,
          longitude: 80.9392
        },
        category: 'Kidney / Nephrology',
        specialty: 'Nephrology & Kidney Transplant',
        specialties: ['Nephrology', 'Urology & Renal Transplantation'],
        facilities: ['icu', 'dialysis', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', dialysis: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['dialysis_procedure', 'kidney_transplant', 'plasmapheresis'],
        explicitCapabilities: ['State Apex Renal Referral Centre', 'Continuous Ambulatory Peritoneal Dialysis (CAPD)', 'Renal Intensive Care', 'Living Donor Kidney Transplant'],
        beds: 1200,
        icuBeds: 160,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 522 266 8004',
        emergencyPhone: '+91 522 266 8700',
        rating: 4.7,
        reviewCount: 1400,
        accreditation: ['NABH', 'State Apex Institute'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'State Apex Reference Centre',
        tagline: 'Super-specialty postgraduate medical institute for tertiary renal medicine',
        overview: 'SGPGIMS Lucknow is a premier super-specialty teaching hospital established under State Legislature. Its Department of Nephrology is a cornerstone of renal disease management and high-volume transplantation in central and northern India.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_kidney_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'Apollo Hospitals — Chennai',
        fullName: 'Apollo Hospitals, Greams Road, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '21 Greams Lane, Off Greams Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0617,
          longitude: 80.2520
        },
        category: 'Kidney / Nephrology',
        specialty: 'Nephrology & Kidney Transplant',
        specialties: ['Nephrology', 'Urology', 'Kidney Transplantation'],
        facilities: ['icu', 'dialysis', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', dialysis: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['dialysis_procedure', 'kidney_transplant', 'laparoscopic_donor_nephrectomy'],
        explicitCapabilities: ['ABO-Incompatible Kidney Transplant', 'Cadaveric & Living Donor Programs', '24x7 Emergency Dialysis Services', 'Robotic-Assisted Urology'],
        beds: 600,
        icuBeds: 110,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 44 2829 0200',
        emergencyPhone: '+91 44 2829 3333',
        rating: 4.7,
        reviewCount: 1650,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Flagship multi-specialty quaternary care and organ transplantation hospital',
        overview: 'Apollo Hospitals Greams Road is the flagship facility of the Apollo group. It has conducted thousands of renal transplants and features specialized programs for high-risk and ABO-incompatible kidney transplantation.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  heart: {
    categoryKey: 'heart',
    categoryName: 'Heart / Cardiac Care',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_heart_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'Medanta — Gurugram',
        fullName: 'Medanta - The Medicity, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        location: {
          address: 'CH Bakhtawar Singh Road, Sector 38',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          latitude: 28.4395,
          longitude: 77.0427
        },
        category: 'Heart / Cardiac Care',
        specialty: 'Cardiology & Cardiac Surgery',
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Vascular Surgery', 'Cardiac Electrophysiology'],
        facilities: ['cath_lab', 'icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { cath_lab: 'available', icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['angioplasty', 'bypass_surgery', 'heart_transplant', 'tavr_tavi'],
        explicitCapabilities: ['Dedicated Heart Institute', 'Robotic Heart Surgery', 'TAVR / TAVI Procedures', 'Mechanical Circulatory Support (LVAD)'],
        beds: 1250,
        icuBeds: 250,
        establishedYear: 2009,
        emergency24x7: true,
        phone: '+91 124 414 1414',
        emergencyPhone: '+91 124 483 4567',
        rating: 4.8,
        reviewCount: 2100,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Quaternary Heart Institute',
        tagline: 'Integrated multi-super-specialty institute with flagship Heart Institute',
        overview: 'Medanta Heart Institute is a globally renowned centre for complex coronary interventions, minimally invasive cardiovascular surgery, heart failure, and heart transplantation.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_heart_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Ansari Nagar, Sri Aurobindo Marg',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Heart / Cardiac Care',
        specialty: 'Cardiology & Cardiac Surgery',
        specialties: ['Cardiology', 'Cardiothoracic & Vascular Surgery (CTVS)', 'Pediatric Cardiology'],
        facilities: ['cath_lab', 'icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { cath_lab: 'available', icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['angioplasty', 'bypass_surgery', 'heart_transplant', 'congenital_heart_surgery'],
        explicitCapabilities: ['Cardio-Thoracic Sciences Centre (CT Centre)', 'Heart Transplantation', 'Complex Congenital Heart Defect Surgery', 'Primary Angioplasty 24x7'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Autonomous national apex centre with dedicated Cardio-Thoracic Sciences Centre',
        overview: 'The Cardio-Thoracic Sciences Centre (CT Centre) at AIIMS New Delhi is one of the highest-volume cardiac care referral facilities in India, conducting India’s first successful heart transplant in 1994.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_heart_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'Apollo Hospitals — Chennai',
        fullName: 'Apollo Hospitals, Greams Road, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '21 Greams Lane, Off Greams Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0617,
          longitude: 80.2520
        },
        category: 'Heart / Cardiac Care',
        specialty: 'Cardiology & Cardiac Surgery',
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Interventional Cardiology'],
        facilities: ['cath_lab', 'icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { cath_lab: 'available', icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['angioplasty', 'bypass_surgery', 'tavr_tavi', 'heart_transplant'],
        explicitCapabilities: ['Dedicated Cardiac Cath Labs', 'Minimally Invasive Coronary Surgery', 'TAVR Program', 'Heart & Lung Transplantation'],
        beds: 600,
        icuBeds: 110,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 44 2829 0200',
        emergencyPhone: '+91 44 2829 3333',
        rating: 4.7,
        reviewCount: 1650,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Pioneering heart institute with high-volume coronary bypass and interventional suites',
        overview: 'Apollo Heart Centre at Greams Road Chennai has performed over 150,000 cardiac procedures and is an acknowledged leader in interventional cardiology, bypass surgery, and valve repair.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_heart_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'Narayana Institute — Bengaluru',
        fullName: 'Narayana Institute of Cardiac Sciences, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: {
          address: '258/A, Bommasandra Industrial Area, Anekal Taluk',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560099',
          latitude: 12.8055,
          longitude: 77.6974
        },
        category: 'Heart / Cardiac Care',
        specialty: 'Cardiology & Cardiac Surgery',
        specialties: ['Cardiology', 'Pediatric Cardiac Surgery', 'Cardiothoracic Surgery'],
        facilities: ['cath_lab', 'icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { cath_lab: 'available', icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['angioplasty', 'bypass_surgery', 'pediatric_heart_surgery', 'heart_transplant'],
        explicitCapabilities: ['One of Largest Cardiac ICUs Globally', 'High-Volume Pediatric Cardiac Surgery', 'Hybrid Operating Theatres', 'Comprehensive Arrhythmia Clinic'],
        beds: 1400,
        icuBeds: 300,
        establishedYear: 2000,
        emergency24x7: true,
        phone: '+91 80 7122 2222',
        emergencyPhone: '+91 80 7122 2999',
        rating: 4.8,
        reviewCount: 1900,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Cardiac Institute',
        tagline: 'World-renowned high-capacity cardiovascular super-specialty hospital',
        overview: 'Narayana Institute of Cardiac Sciences is one of the world’s largest cardiac centres, pioneering accessible cardiac surgery, complex pediatric reconstructions, and adult cardiac transplantations.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_heart_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'Fortis Escorts — New Delhi',
        fullName: 'Fortis Escorts Heart Institute, Okhla, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Okhla Road, Sukhdev Vihar Metro Station',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110025',
          latitude: 28.5603,
          longitude: 77.2804
        },
        category: 'Heart / Cardiac Care',
        specialty: 'Cardiology & Cardiac Surgery',
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Pediatric Cardiology', 'Electrophysiology'],
        facilities: ['cath_lab', 'icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { cath_lab: 'available', icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['angioplasty', 'bypass_surgery', 'tavr_tavi', 'pacemaker_implantation'],
        explicitCapabilities: ['Dedicated Super-Specialty Heart Hospital', 'Radial Angioplasty Pioneer', 'Pediatric Cardiac ICU', 'Left Ventricular Assist Devices (LVAD)'],
        beds: 310,
        icuBeds: 90,
        establishedYear: 1988,
        emergency24x7: true,
        phone: '+91 11 4713 5000',
        emergencyPhone: '+91 11 2682 5000',
        rating: 4.7,
        reviewCount: 1550,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Single-Specialty Heart Hospital',
        tagline: 'Landmark single-specialty cardiovascular research and tertiary care institute',
        overview: 'Fortis Escorts Heart Institute is an iconic landmark in Indian cardiology with over three decades of excellence in coronary artery bypass grafting, transcatheter aortic valve replacement, and cardiac pacing.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  cancer: {
    categoryKey: 'cancer',
    categoryName: 'Cancer / Oncology',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_cancer_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'Tata Memorial Hospital — Mumbai',
        fullName: 'Tata Memorial Hospital, Parel, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: {
          address: 'Dr. Ernest Borges Road, Parel',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400012',
          latitude: 19.0028,
          longitude: 72.8427
        },
        category: 'Cancer / Oncology',
        specialty: 'Oncology & Cancer Care',
        specialties: ['Surgical Oncology', 'Medical Oncology', 'Radiation Oncology', 'Bone Marrow Transplant'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['chemotherapy', 'radiation_therapy', 'cancer_surgery', 'bone_marrow_transplant'],
        explicitCapabilities: ['National Comprehensive Cancer Centre (DAE, Govt of India)', 'Multi-Disciplinary Tumor Board', 'Advanced Proton & Linear Accelerator Suites', 'Bone Marrow & Stem Cell Transplantation'],
        beds: 1500,
        icuBeds: 180,
        establishedYear: 1941,
        emergency24x7: true,
        phone: '+91 22 2417 7000',
        emergencyPhone: '+91 22 2417 7222',
        rating: 4.9,
        reviewCount: 2400,
        accreditation: ['NABH', 'National Cancer Grid Apex Hub'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Cancer Centre',
        tagline: 'India’s apex national comprehensive cancer treatment and research centre',
        overview: 'Tata Memorial Hospital (TMC), under the Department of Atomic Energy, Government of India, is the apex institute of the National Cancer Grid. It handles nearly a third of all national complex cancer cases with state-of-the-art multimodal therapy.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_cancer_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Dr. B.R. Ambedkar Institute Rotary Cancer Hospital (IRCH), Ansari Nagar',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Cancer / Oncology',
        specialty: 'Oncology & Cancer Care',
        specialties: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Hematology'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['chemotherapy', 'radiation_therapy', 'cancer_surgery', 'bone_marrow_transplant'],
        explicitCapabilities: ['Dr. B.R. Ambedkar IRCH Apex Cancer Centre', 'National Cancer Institute (NCI Jhajjar Campus)', 'Brachytherapy & Stereotactic Radiotherapy', 'Pediatric Oncology Wing'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex Institute Rotary Cancer Hospital (IRCH) and National Cancer Institute',
        overview: 'The Dr. B.R. Ambedkar Institute Rotary Cancer Hospital at AIIMS New Delhi, along with the National Cancer Institute campus, is one of the premier public oncology hubs in Asia, providing cutting-edge radiotherapy and surgical oncology.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_cancer_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'Apollo Cancer Centres — Chennai',
        fullName: 'Apollo Cancer Centres, Teynampet, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '320 Mount Road, Teynampet',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600035',
          latitude: 13.0416,
          longitude: 80.2458
        },
        category: 'Cancer / Oncology',
        specialty: 'Oncology & Cancer Care',
        specialties: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Proton Therapy'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['chemotherapy', 'proton_beam_therapy', 'cyberknife_radiosurgery', 'bone_marrow_transplant'],
        explicitCapabilities: ['South Asia’s First Proton Beam Therapy Centre', 'CyberKnife & Novalis Tx Suites', 'CAR-T Cell Therapy Program', 'Organ-Specific Tumor Boards'],
        beds: 450,
        icuBeds: 80,
        establishedYear: 1993,
        emergency24x7: true,
        phone: '+91 44 2433 4455',
        emergencyPhone: '+91 44 2433 6677',
        rating: 4.8,
        reviewCount: 1750,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Cancer Centre',
        tagline: 'First dedicated Proton Beam Therapy and advanced radiotherapy hub in South Asia',
        overview: 'Apollo Cancer Centre in Chennai is a premier cancer hospital housing the Apollo Proton Cancer Centre, the only proton therapy facility in South Asia, enabling sub-millimeter targeted radiation treatment.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_cancer_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'Medanta — Gurugram',
        fullName: 'Medanta - The Medicity, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        location: {
          address: 'CH Bakhtawar Singh Road, Sector 38',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          latitude: 28.4395,
          longitude: 77.0427
        },
        category: 'Cancer / Oncology',
        specialty: 'Oncology & Cancer Care',
        specialties: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Hematology'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['chemotherapy', 'robotic_cancer_surgery', 'bone_marrow_transplant', 'tomotherapy'],
        explicitCapabilities: ['Medanta Cancer Institute', 'CyberKnife & TomoTherapy', 'Robotic Gastrointestinal & Thoracic Oncology', 'Hematology Stem Cell Unit'],
        beds: 1250,
        icuBeds: 250,
        establishedYear: 2009,
        emergency24x7: true,
        phone: '+91 124 414 1414',
        emergencyPhone: '+91 124 483 4567',
        rating: 4.8,
        reviewCount: 2100,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Quaternary Cancer Institute',
        tagline: 'Comprehensive cancer institute with robotic precision surgery and linear accelerators',
        overview: 'Medanta Cancer Institute brings together disease-specific multidisciplinary teams combining surgical, medical, and radiation oncology with specialized robotic suites and genetic profiling.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_cancer_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'CMC Vellore — Vellore',
        fullName: 'Christian Medical College, Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        location: {
          address: 'Ida Scudder Road',
          city: 'Vellore',
          state: 'Tamil Nadu',
          pincode: '632004',
          latitude: 12.9246,
          longitude: 79.1348
        },
        category: 'Cancer / Oncology',
        specialty: 'Oncology & Cancer Care',
        specialties: ['Hematology & Bone Marrow Transplant', 'Radiation Oncology', 'Surgical Oncology', 'Medical Oncology'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['bone_marrow_transplant', 'chemotherapy', 'radiation_therapy', 'cancer_surgery'],
        explicitCapabilities: ['India’s Premier Stem Cell & Bone Marrow Transplant Centre', 'Pediatric Oncology & Thalassemia Hub', 'External Beam & Brachytherapy Suites', 'Clinical Trials & Protocol-Based Care'],
        beds: 3000,
        icuBeds: 280,
        establishedYear: 1900,
        emergency24x7: true,
        phone: '+91 416 228 1000',
        emergencyPhone: '+91 416 228 2000',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Pioneering bone marrow transplant and hematologic malignancy referral institute',
        overview: 'CMC Vellore’s Department of Haematology established India’s first successful bone marrow transplant in 1986. It remains one of Asia’s foremost referral centres for leukemia, lymphoma, and complex solid tumors.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  brain_surgery: {
    categoryKey: 'brain_surgery',
    categoryName: 'Brain Surgery / Neurosurgery',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_brain_surgery_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Neurosciences Centre, Ansari Nagar',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Brain Surgery / Neurosurgery',
        specialty: 'Neurosurgery & Spine Surgery',
        specialties: ['Neurosurgery', 'Neurology', 'Pediatric Neurosurgery', 'Spine Surgery'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['craniotomy', 'brain_tumor_excision', 'aneurysm_clipping', 'deep_brain_stimulation'],
        explicitCapabilities: ['Dedicated Neurosciences Centre (CNC)', 'Intraoperative MRI & Navigation Neurosurgery', 'Gamma Knife Radiosurgery', 'Comprehensive Epilepsy Surgery'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex Neurosciences Centre for brain tumors, cerebrovascular surgery, and trauma',
        overview: 'The Neurosciences Centre at AIIMS New Delhi is India’s foremost academic neurosurgical institute, performing thousands of complex brain surgeries, skull-base procedures, and microvascular reconstructions annually.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_brain_surgery_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'NIMHANS — Bengaluru',
        fullName: 'National Institute of Mental Health and Neuro Sciences, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: {
          address: 'Hosur Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560029',
          latitude: 12.9377,
          longitude: 77.5946
        },
        category: 'Brain Surgery / Neurosurgery',
        specialty: 'Neurosurgery & Neurosciences',
        specialties: ['Neurosurgery', 'Neurology', 'Neuropathology', 'Neurocritical Care'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['microsurgical_resection', 'skull_base_surgery', 'cerebral_bypass', 'neuro_endoscopy'],
        explicitCapabilities: ['Apex Institute of National Importance for Neurosciences', 'National Brain Bank & Neuropathology', 'Advanced Neuro-Trauma & Triage Centre', 'Dedicated Neuro-Intensive Care'],
        beds: 1000,
        icuBeds: 150,
        establishedYear: 1925,
        emergency24x7: true,
        phone: '+91 80 2699 5000',
        emergencyPhone: '+91 80 2699 5200',
        rating: 4.9,
        reviewCount: 2050,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'World-renowned Institute of National Importance dedicated exclusively to neurosciences',
        overview: 'NIMHANS Bengaluru is an internationally renowned multidisciplinary apex institute for patient care and research in neurological and psychiatric disorders, with specialized skull-base, neuro-oncology, and vascular neurosurgery units.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_brain_surgery_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'PGIMER — Chandigarh',
        fullName: 'Postgraduate Institute of Medical Education and Research, Chandigarh',
        city: 'Chandigarh',
        state: 'Chandigarh',
        location: {
          address: 'Department of Neurosurgery, Sector 12',
          city: 'Chandigarh',
          state: 'Chandigarh',
          pincode: '160012',
          latitude: 30.7644,
          longitude: 76.7770
        },
        category: 'Brain Surgery / Neurosurgery',
        specialty: 'Neurosurgery & Spine Surgery',
        specialties: ['Neurosurgery', 'Neurology', 'Interventional Neuroradiology'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['craniotomy', 'aneurysm_clipping', 'endoscopic_skull_base', 'spinal_decompression'],
        explicitCapabilities: ['High-Volume Level-1 Neuro-Trauma Care', 'Intraoperative Neuro-monitoring', 'Endoscopic Pituitary & Skull Base Surgery', 'Dedicated Neuro-ICU'],
        beds: 1948,
        icuBeds: 210,
        establishedYear: 1962,
        emergency24x7: true,
        phone: '+91 172 275 6565',
        emergencyPhone: '+91 172 275 6112',
        rating: 4.8,
        reviewCount: 1950,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex neurosurgical training and tertiary referral institution for North India',
        overview: 'PGIMER Chandigarh’s Department of Neurosurgery is one of northern India’s most trusted public tertiary referral centres, managing complex cerebrovascular accidents, pediatric neurosurgery, and severe traumatic brain injuries.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_brain_surgery_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'Medanta — Gurugram',
        fullName: 'Medanta - The Medicity, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        location: {
          address: 'CH Bakhtawar Singh Road, Sector 38',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          latitude: 28.4395,
          longitude: 77.0427
        },
        category: 'Brain Surgery / Neurosurgery',
        specialty: 'Neurosurgery & Neurosciences',
        specialties: ['Neurosurgery', 'Neurology', 'Neuro-Intervention', 'Spine Surgery'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['brain_tumor_excision', 'deep_brain_stimulation', 'cyberknife_neurosurgery', 'endovascular_coiling'],
        explicitCapabilities: ['Medanta Neurosciences Institute', 'Intraoperative BrainSuite & O-Arm', 'CyberKnife Robotic Radiosurgery', 'Awake Craniotomy Unit'],
        beds: 1250,
        icuBeds: 250,
        establishedYear: 2009,
        emergency24x7: true,
        phone: '+91 124 414 1414',
        emergencyPhone: '+91 124 483 4567',
        rating: 4.8,
        reviewCount: 2100,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Quaternary Neurosciences Institute',
        tagline: 'Advanced BrainSuite and robotic stereotactic neurosurgery institute',
        overview: 'Medanta’s Institute of Neurosciences features an integrated Intra-Operative BrainSuite and advanced neuromonitoring for minimally invasive excision of deep-seated brain tumors and vascular malformations.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_brain_surgery_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'CMC Vellore — Vellore',
        fullName: 'Christian Medical College, Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        location: {
          address: 'Ida Scudder Road',
          city: 'Vellore',
          state: 'Tamil Nadu',
          pincode: '632004',
          latitude: 12.9246,
          longitude: 79.1348
        },
        category: 'Brain Surgery / Neurosurgery',
        specialty: 'Neurosurgery & Spine Surgery',
        specialties: ['Neurological Sciences', 'Neurosurgery', 'Pediatric Neurosurgery'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['micro_neurosurgery', 'skull_base_surgery', 'spinal_dysraphism', 'pediatric_craniotomy'],
        explicitCapabilities: ['First Department of Neurological Sciences in India (1949)', 'High-Precision Micro-Neurosurgery', 'Pediatric Congenital Cranial Malformations', 'Neuro-Rehabilitation Hub'],
        beds: 3000,
        icuBeds: 280,
        establishedYear: 1900,
        emergency24x7: true,
        phone: '+91 416 228 1000',
        emergencyPhone: '+91 416 228 2000',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Historical pioneer of neurosurgery in India with comprehensive neurosciences wing',
        overview: 'Dr. Jacob Chandy established India’s first neurological sciences department at CMC Vellore in 1949. Today it continues to set clinical benchmarks in skull-base, spinal, and pediatric micro-neurosurgery.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  alzheimers: {
    categoryKey: 'alzheimers',
    categoryName: "Alzheimer's / Neurodegenerative",
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_alz_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'NIMHANS — Bengaluru',
        fullName: 'National Institute of Mental Health and Neuro Sciences, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: {
          address: 'Hosur Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560029',
          latitude: 12.9377,
          longitude: 77.5946
        },
        category: "Alzheimer's / Neurodegenerative",
        specialty: 'Neurology & Neurodegenerative Disorders',
        specialties: ['Neurology', 'Geriatric Psychiatry', 'Neuropsychology', 'Neurogenetics'],
        facilities: ['mri', 'ct_scan', 'icu', 'emergency'],
        facilityStatuses: { mri: 'available', ct_scan: 'available', icu: 'available', emergency: 'available' },
        procedures: ['cognitive_assessment', 'neuropsychological_profiling', 'amyloid_imaging'],
        explicitCapabilities: ['Apex National Geriatric Clinic & Memory Clinic', 'National Brain Bank for Neurodegenerative Research', 'Advanced PET/MRI Biomarker Profiling', 'Dementia Caregiver Training Programs'],
        beds: 1000,
        icuBeds: 150,
        establishedYear: 1925,
        emergency24x7: true,
        phone: '+91 80 2699 5000',
        emergencyPhone: '+91 80 2699 5200',
        rating: 4.9,
        reviewCount: 2050,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex Institute of National Importance for dementia, Alzheimer’s, and neurodegenerative care',
        overview: 'NIMHANS is India’s foremost authority on neurodegenerative diseases. Its specialized Memory Clinic and Geriatric Psychiatry services offer comprehensive biomarker diagnosis, pharmacological management, and specialized dementia rehabilitation.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_alz_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Ansari Nagar, Sri Aurobindo Marg',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: "Alzheimer's / Neurodegenerative",
        specialty: 'Neurology & Neurodegenerative Disorders',
        specialties: ['Neurology', 'Geriatric Medicine', 'Cognitive Neurosciences'],
        facilities: ['mri', 'ct_scan', 'icu', 'emergency'],
        facilityStatuses: { mri: 'available', ct_scan: 'available', icu: 'available', emergency: 'available' },
        procedures: ['neuro_imaging', 'cognitive_battery_evaluation'],
        explicitCapabilities: ['Dedicated Cognitive Disorders & Memory Clinic', 'Department of Geriatric Medicine', 'Functional & Structural Neuroimaging', 'Integrated Multidisciplinary Care'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex national academic medical institute with specialized memory & cognitive clinic',
        overview: 'AIIMS New Delhi operates a dedicated Memory and Cognitive Disorders Clinic in its Neurosciences Centre, collaborating with the Department of Geriatric Medicine to provide evidence-based dementia and Alzheimer’s care.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_alz_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'PGIMER — Chandigarh',
        fullName: 'Postgraduate Institute of Medical Education and Research, Chandigarh',
        city: 'Chandigarh',
        state: 'Chandigarh',
        location: {
          address: 'Sector 12',
          city: 'Chandigarh',
          state: 'Chandigarh',
          pincode: '160012',
          latitude: 30.7644,
          longitude: 76.7770
        },
        category: "Alzheimer's / Neurodegenerative",
        specialty: 'Neurology & Neurodegenerative Disorders',
        specialties: ['Neurology', 'Psychiatry', 'Neuro-Rehabilitation'],
        facilities: ['mri', 'ct_scan', 'icu', 'emergency'],
        facilityStatuses: { mri: 'available', ct_scan: 'available', icu: 'available', emergency: 'available' },
        procedures: ['cognitive_screening', 'neuropsychological_assessment'],
        explicitCapabilities: ['Cognitive Neurology & Dementia Clinic', 'Movement Disorders & Parkinson’s Care', 'Neuro-Psychological Testing Unit', 'Regional Northern Referral Centre'],
        beds: 1948,
        icuBeds: 210,
        establishedYear: 1962,
        emergency24x7: true,
        phone: '+91 172 275 6565',
        emergencyPhone: '+91 172 275 6112',
        rating: 4.8,
        reviewCount: 1950,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Tertiary referral centre for cognitive neurology and memory disorders in North India',
        overview: 'PGIMER’s Department of Neurology runs a specialized Cognitive Neurology Clinic that provides diagnostic evaluations, longitudinal cognitive tracking, and holistic management plans for Alzheimer’s patients.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_alz_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'CMC Vellore — Vellore',
        fullName: 'Christian Medical College, Vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        location: {
          address: 'Ida Scudder Road',
          city: 'Vellore',
          state: 'Tamil Nadu',
          pincode: '632004',
          latitude: 12.9246,
          longitude: 79.1348
        },
        category: "Alzheimer's / Neurodegenerative",
        specialty: 'Neurology & Neurodegenerative Disorders',
        specialties: ['Neurology', 'Geriatric Medicine', 'Clinical Neuropsychology'],
        facilities: ['mri', 'ct_scan', 'icu', 'emergency'],
        facilityStatuses: { mri: 'available', ct_scan: 'available', icu: 'available', emergency: 'available' },
        procedures: ['cognitive_rehabilitation', 'neuro_imaging'],
        explicitCapabilities: ['Dedicated Geriatrics & Memory Services', 'Neuro-Palliative Care Support', 'Comprehensive Neuropsychological Battery', 'Family Counseling Program'],
        beds: 3000,
        icuBeds: 280,
        establishedYear: 1900,
        emergency24x7: true,
        phone: '+91 416 228 1000',
        emergencyPhone: '+91 416 228 2000',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Exemplary clinical geriatrics and neurodegenerative supportive care',
        overview: 'CMC Vellore integrates clinical neurology, geriatric medicine, and neuro-palliative care to support individuals with Alzheimer’s disease and other degenerative conditions through compassionate, continuous medical guidance.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_alz_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'SGPGIMS — Lucknow',
        fullName: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences, Lucknow',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        location: {
          address: 'Raebareli Road',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pincode: '226014',
          latitude: 26.7454,
          longitude: 80.9392
        },
        category: "Alzheimer's / Neurodegenerative",
        specialty: 'Neurology & Neurodegenerative Disorders',
        specialties: ['Neurology', 'Neurogenetics', 'Clinical Neurophysiology'],
        facilities: ['mri', 'ct_scan', 'icu', 'emergency'],
        facilityStatuses: { mri: 'available', ct_scan: 'available', icu: 'available', emergency: 'available' },
        procedures: ['neuro_imaging', 'genetic_testing'],
        explicitCapabilities: ['Memory & Cognitive Impairment Clinic', 'Movement Disorders Subspecialty Unit', 'Molecular Genetic Screening', 'Electroencephalography & Evoked Potentials'],
        beds: 1200,
        icuBeds: 160,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 522 266 8004',
        emergencyPhone: '+91 522 266 8700',
        rating: 4.7,
        reviewCount: 1400,
        accreditation: ['NABH', 'State Apex Institute'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'State Apex Reference Centre',
        tagline: 'State apex neurology referral centre with dedicated cognitive disorders unit',
        overview: 'SGPGIMS Lucknow’s Department of Neurology provides tertiary evaluation for neurodegenerative syndromes, atypical dementias, and Alzheimer’s, utilizing advanced 3T MRI, genetic testing, and cognitive therapies.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  eye: {
    categoryKey: 'eye',
    categoryName: 'Eye / Ophthalmology',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_eye_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'LV Prasad Eye Institute — Hyderabad',
        fullName: 'L V Prasad Eye Institute, Banjara Hills, Hyderabad',
        city: 'Hyderabad',
        state: 'Telangana',
        location: {
          address: 'Kallam Anji Reddy Campus, Road No. 2, Banjara Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          latitude: 17.4325,
          longitude: 78.4071
        },
        category: 'Eye / Ophthalmology',
        specialty: 'Ophthalmology',
        specialties: ['Cornea & Anterior Segment', 'Retina & Vitreous', 'Glaucoma', 'Pediatric Ophthalmology', 'Ocular Oncology'],
        facilities: ['operation_theatre', 'emergency', 'mri', 'ambulance'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available', mri: 'available', ambulance: 'available' },
        procedures: ['corneal_transplant', 'cataract_surgery', 'vitrectomy', 'lasik'],
        explicitCapabilities: ['WHO Collaborating Centre for Prevention of Blindness', 'World-Leading Cornea & Eye Banking Hub', 'Advanced Stem Cell & Gene Therapy', 'Ocular Oncology & Retinoblastoma Unit'],
        beds: 350,
        icuBeds: 25,
        establishedYear: 1987,
        emergency24x7: true,
        phone: '+91 40 6810 2020',
        emergencyPhone: '+91 40 6810 2828',
        rating: 4.9,
        reviewCount: 2300,
        accreditation: ['NABH', 'NABL', 'WHO Collaborating Centre'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex Ophthalmic Institute',
        tagline: 'World-renowned tertiary eye care and ophthalmic research institute',
        overview: 'L V Prasad Eye Institute (LVPEI) is a global leader in eye care, having treated millions of patients with equitable access, pioneering stem-cell ocular surface reconstruction, and world-class surgical cornea and retina subspecialties.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_eye_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'Aravind Eye Hospital — Madurai',
        fullName: 'Aravind Eye Hospital, Madurai',
        city: 'Madurai',
        state: 'Tamil Nadu',
        location: {
          address: '1 Anna Nagar',
          city: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625020',
          latitude: 9.9252,
          longitude: 78.1198
        },
        category: 'Eye / Ophthalmology',
        specialty: 'Ophthalmology',
        specialties: ['Cataract & IOL', 'Retina & Vitreous', 'Cornea', 'Glaucoma', 'Uvea'],
        facilities: ['operation_theatre', 'emergency', 'ambulance'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available', ambulance: 'available' },
        procedures: ['phacoemulsification', 'corneal_transplantation', 'glaucoma_filtering', 'lasik'],
        explicitCapabilities: ['World’s Largest Eye Care Provider Network', 'Pioneer in High-Volume Phacoemulsification', 'Aurolab In-House Ophthalmic Manufacturing', 'Specialized Low Vision & Rehabilitation'],
        beds: 1400,
        icuBeds: 20,
        establishedYear: 1976,
        emergency24x7: true,
        phone: '+91 452 435 6100',
        emergencyPhone: '+91 452 435 6500',
        rating: 4.9,
        reviewCount: 2150,
        accreditation: ['NABH', 'WHO Collaborating Centre'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Eye Institute',
        tagline: 'Global gold standard for high-volume, high-quality ophthalmic surgery',
        overview: 'Aravind Eye Care System is globally recognized for eliminating needless blindness through unprecedented high-volume surgical efficiency, world-class clinical outcomes, and comprehensive subspecialty ophthalmic clinics.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_eye_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'Sankara Nethralaya — Chennai',
        fullName: 'Sankara Nethralaya, Nungambakkam, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '18 College Road, Nungambakkam',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0655,
          longitude: 80.2448
        },
        category: 'Eye / Ophthalmology',
        specialty: 'Ophthalmology',
        specialties: ['Vitreoretinal Services', 'Cornea & Refractive Surgery', 'Oculoplasty', 'Glaucoma'],
        facilities: ['operation_theatre', 'emergency', 'ambulance'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available', ambulance: 'available' },
        procedures: ['vitrectomy', 'lasik', 'squint_correction', 'corneal_grafting'],
        explicitCapabilities: ['Non-Profit Tertiary Eye Care Pioneer', 'Advanced Vitreoretinal Surgical Suites', 'Dedicated Ocular Genetics Laboratory', 'Comprehensive Neuro-Ophthalmology'],
        beds: 400,
        icuBeds: 25,
        establishedYear: 1978,
        emergency24x7: true,
        phone: '+91 44 4227 1500',
        emergencyPhone: '+91 44 4227 1555',
        rating: 4.8,
        reviewCount: 1900,
        accreditation: ['NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Eye Institute',
        tagline: 'Pioneering non-profit institution for super-specialty eye care and vitreoretinal surgery',
        overview: 'Sankara Nethralaya is one of India’s most revered ophthalmic institutions, founded by Dr. S. S. Badrinath. It is noted for cutting-edge retinal surgery, uveitis management, and corneal transplantation.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_eye_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'AIIMS RP Centre — New Delhi',
        fullName: 'Dr. Rajendra Prasad Centre for Ophthalmic Sciences, AIIMS New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Ansari Nagar, Sri Aurobindo Marg',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Eye / Ophthalmology',
        specialty: 'Ophthalmology',
        specialties: ['Cornea & Refractive', 'Glaucoma', 'Pediatric Ophthalmology', 'Strabismus & Neuro-Ophthalmology'],
        facilities: ['operation_theatre', 'emergency', 'icu', 'ambulance'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available', icu: 'available', ambulance: 'available' },
        procedures: ['cataract_surgery', 'keratoplasty', 'retinal_detachment_repair', 'glaucoma_shunt'],
        explicitCapabilities: ['National Apex Centre for Ophthalmic Sciences (Govt of India)', 'National Eye Bank Hub', 'Ophthalmic Laser & Ultrasound Diagnostics', 'Complex Ocular Trauma 24x7'],
        beds: 300,
        icuBeds: 20,
        establishedYear: 1967,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.8,
        reviewCount: 1850,
        accreditation: ['NABH', 'Apex National Institute (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Ophthalmic Centre',
        tagline: 'National apex institution for ophthalmic research, education, and patient care',
        overview: 'Dr. Rajendra Prasad Centre for Ophthalmic Sciences at AIIMS New Delhi is the apex body recognized by the Government of India for blindness control policy, tertiary corneal repair, and complex ocular surgeries.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_eye_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'Narayana Nethralaya — Bengaluru',
        fullName: 'Narayana Nethralaya, Rajajinagar, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: {
          address: 'Chord Road, Rajajinagar, 1st R Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560010',
          latitude: 12.9982,
          longitude: 77.5532
        },
        category: 'Eye / Ophthalmology',
        specialty: 'Ophthalmology',
        specialties: ['Cataract & Refractive', 'Cornea', 'Retina', 'Pediatric Eye Care', 'Electrophysiology'],
        facilities: ['operation_theatre', 'emergency', 'ambulance'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available', ambulance: 'available' },
        procedures: ['smile_lasik', 'phacoemulsification', 'collagen_crosslinking', 'vitrectomy'],
        explicitCapabilities: ['Super-Specialty Eye Hospital', 'Advanced Molecular & Gene Diagnostics', 'Keratoconus & Custom Refractive Centre', 'Advanced Retinopathy of Prematurity (KIDROP)'],
        beds: 200,
        icuBeds: 15,
        establishedYear: 1993,
        emergency24x7: true,
        phone: '+91 80 6612 1400',
        emergencyPhone: '+91 80 6612 1444',
        rating: 4.8,
        reviewCount: 1700,
        accreditation: ['NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Eye Institute',
        tagline: 'Leading ophthalmic super-specialty hospital and eye research foundation',
        overview: 'Narayana Nethralaya is renowned for bringing translational research directly into ophthalmic surgery, spearheading telemedicine programs for infant blindness, SMILE laser vision correction, and keratoconus management.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  orthopedics: {
    categoryKey: 'orthopedics',
    categoryName: 'Orthopedics',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_ortho_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'AIIMS — New Delhi',
        fullName: 'All India Institute of Medical Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'Jai Prakash Narayan Apex Trauma Center (JPNATC), Ansari Nagar',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110029',
          latitude: 28.5672,
          longitude: 77.2100
        },
        category: 'Orthopedics',
        specialty: 'Orthopedics & Joint Replacement',
        specialties: ['Orthopedic Surgery', 'Joint Replacement', 'Spine Surgery', 'Musculoskeletal Oncology', 'Trauma'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['knee_replacement', 'hip_replacement', 'complex_trauma_fixation', 'spine_fusion'],
        explicitCapabilities: ['Jai Prakash Narayan Apex Trauma Center', 'Robotic Joint Replacement Programs', 'Musculoskeletal Tumor Unit', 'Complex Revision Arthroplasty'],
        beds: 2478,
        icuBeds: 270,
        establishedYear: 1956,
        emergency24x7: true,
        phone: '+91 11 2658 8500',
        emergencyPhone: '+91 11 2658 8700',
        rating: 4.9,
        reviewCount: 2200,
        accreditation: ['NABH', 'Apex Institute of National Importance (INI)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Reference Centre',
        tagline: 'Apex Institute of National Importance with premier Trauma and Orthopedic Centres',
        overview: 'AIIMS New Delhi’s Department of Orthopedics and JPN Apex Trauma Centre constitute the gold standard for high-energy skeletal trauma management, revision total joint arthroplasty, and limb salvage surgery.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_ortho_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'Medanta — Gurugram',
        fullName: 'Medanta - The Medicity, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        location: {
          address: 'CH Bakhtawar Singh Road, Sector 38',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          latitude: 28.4395,
          longitude: 77.0427
        },
        category: 'Orthopedics',
        specialty: 'Orthopedics & Joint Replacement',
        specialties: ['Orthopedics', 'Joint Replacement', 'Spine Surgery', 'Sports Medicine & Arthroscopy'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['knee_replacement', 'hip_replacement', 'arthroscopic_acl_repair', 'minimally_invasive_spine'],
        explicitCapabilities: ['Medanta Bone and Joint Institute', 'Computer-Navigated & Robotic Knee Replacement', 'Daycare Arthroscopy Suite', 'Comprehensive Physical Rehabilitation Centre'],
        beds: 1250,
        icuBeds: 250,
        establishedYear: 2009,
        emergency24x7: true,
        phone: '+91 124 414 1414',
        emergencyPhone: '+91 124 483 4567',
        rating: 4.8,
        reviewCount: 2100,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Quaternary Orthopedic Institute',
        tagline: 'Leading bone and joint institute with robotic joint reconstruction suites',
        overview: 'Medanta Bone & Joint Institute provides comprehensive surgical solutions for complex joint deformities, minimally invasive spine instrumentation, and sports injuries using sub-millimeter robotic precision.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_ortho_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'Apollo Hospitals — Chennai',
        fullName: 'Apollo Hospitals, Greams Road, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '21 Greams Lane, Off Greams Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600006',
          latitude: 13.0617,
          longitude: 80.2520
        },
        category: 'Orthopedics',
        specialty: 'Orthopedics & Joint Replacement',
        specialties: ['Orthopedic Surgery', 'Joint Arthroplasty', 'Spine Surgery', 'Pediatric Orthopedics'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['knee_replacement', 'hip_replacement', 'robotic_joint_surgery', 'shoulder_arthroscopy'],
        explicitCapabilities: ['Apollo Institute of Orthopedics', 'Robotic Knee & Hip Arthroplasty', 'Birmingham Hip Resurfacing', 'Complex Pelvic Reconstruction'],
        beds: 600,
        icuBeds: 110,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 44 2829 0200',
        emergencyPhone: '+91 44 2829 3333',
        rating: 4.7,
        reviewCount: 1650,
        accreditation: ['JCI', 'NABH', 'NABL'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'High-volume orthopedic and joint reconstruction centre of excellence',
        overview: 'The Apollo Institute of Orthopedics at Greams Road Chennai has established a long-standing reputation for pioneering joint replacement techniques, robotic-guided surgery, and complex spinal corrective procedures.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_ortho_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'Kokilaben Dhirubhai Ambani Hospital — Mumbai',
        fullName: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: {
          address: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          latitude: 19.1317,
          longitude: 72.8258
        },
        category: 'Orthopedics',
        specialty: 'Orthopedics & Joint Replacement',
        specialties: ['Orthopedic Surgery', 'Centre for Bone & Joint', 'Spine Surgery', 'Sports Medicine'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['knee_replacement', 'hip_replacement', 'minimally_invasive_spine', 'ligament_reconstruction'],
        explicitCapabilities: ['Dedicated Centre for Bone and Joint', 'Full-Time Specialist Medical Staff System', 'Gait & Motion Analysis Laboratory', 'Advanced Aquatic Rehabilitation Centre'],
        beds: 750,
        icuBeds: 180,
        establishedYear: 2009,
        emergency24x7: true,
        phone: '+91 22 4269 6969',
        emergencyPhone: '+91 22 4269 9999',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['JCI', 'NABH', 'NABL', 'CAP'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Quaternary Healthcare Institute',
        tagline: 'Leading quaternary multi-specialty hospital with comprehensive Bone & Joint Institute',
        overview: 'Kokilaben Hospital features Western India’s largest full-time specialist-driven Bone and Joint Institute, equipped with intraoperative 3D navigation, robotic surgical arms, and an internationally accredited sports rehabilitation centre.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_ortho_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'Manipal Hospitals — Bengaluru',
        fullName: 'Manipal Hospital, Old Airport Road, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: {
          address: '98 HAL Old Airport Road, Kodihalli',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560017',
          latitude: 12.9592,
          longitude: 77.6499
        },
        category: 'Orthopedics',
        specialty: 'Orthopedics & Joint Replacement',
        specialties: ['Orthopedic Surgery', 'Joint Arthroplasty', 'Spine Care', 'Hand & Microvascular Surgery'],
        facilities: ['icu', 'emergency', 'operation_theatre', 'mri', 'ct_scan', 'blood_bank', 'ambulance'],
        facilityStatuses: { icu: 'available', emergency: 'available', operation_theatre: 'available', mri: 'available', ct_scan: 'available', blood_bank: 'available', ambulance: 'available' },
        procedures: ['knee_replacement', 'hip_replacement', 'spine_fixation', 'arthroscopy'],
        explicitCapabilities: ['Manipal Institute of Joint Replacement', 'Robotic Joint Surgery Unit', 'Comprehensive Polytrauma Unit', 'Microvascular Limb Replantation'],
        beds: 600,
        icuBeds: 120,
        establishedYear: 1991,
        emergency24x7: true,
        phone: '+91 80 2502 4444',
        emergencyPhone: '+91 80 2502 3333',
        rating: 4.7,
        reviewCount: 1720,
        accreditation: ['NABH', 'NABL', 'AAHRPP'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Reference Centre',
        tagline: 'Flagship quaternary care hospital with established Orthopedic Centre of Excellence',
        overview: 'Manipal Hospital Old Airport Road is a premier referral hub in southern India for complex primary and revision joint replacements, spinal deformity corrections, and high-velocity trauma care.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  },

  dental: {
    categoryKey: 'dental',
    categoryName: 'Dental',
    disclaimer: "Sehat_Sathi's curated national reference order. Not an official government ranking or universal medical ranking.",
    hospitals: [
      {
        id: 'ref_dental_1',
        referenceRank: 1,
        nationalRefRank: 1,
        name: 'MAIDS — New Delhi',
        fullName: 'Maulana Azad Institute of Dental Sciences, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: {
          address: 'MAMC Complex, Bahadur Shah Zafar Marg',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110002',
          latitude: 28.6366,
          longitude: 77.2410
        },
        category: 'Dental',
        specialty: 'Dental Sciences',
        specialties: ['Oral & Maxillofacial Surgery', 'Orthodontics', 'Conservative Dentistry & Endodontics', 'Prosthodontics', 'Periodontics'],
        facilities: ['operation_theatre', 'emergency'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available' },
        procedures: ['dental_implants', 'maxillofacial_trauma_surgery', 'root_canal_treatment', 'orthognathic_surgery'],
        explicitCapabilities: ['First NABH Accredited Public Dental Hospital in India', 'Apex Tertiary Dental Referral Centre', 'Craniofacial Deformity & Implantology Wing', 'Advanced 3D CBCT Digital Diagnostics'],
        beds: 50,
        icuBeds: 10,
        establishedYear: 1983,
        emergency24x7: true,
        phone: '+91 11 2323 3925',
        emergencyPhone: '+91 11 2323 5211',
        rating: 4.9,
        reviewCount: 2100,
        accreditation: ['NABH', 'Apex Dental Institute (Govt of NCT of Delhi)'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Apex National Dental Institute',
        tagline: 'Autonomous premier national dental hospital and post-graduate institute',
        overview: 'Maulana Azad Institute of Dental Sciences (MAIDS) is India’s foremost public tertiary dental hospital, universally recognized for excellence in maxillofacial reconstructions, complex endodontics, and dental implantology.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_dental_2',
        referenceRank: 2,
        nationalRefRank: 2,
        name: 'Manipal College of Dental Sciences — Manipal',
        fullName: 'Manipal College of Dental Sciences, Manipal',
        city: 'Manipal',
        state: 'Karnataka',
        location: {
          address: 'Madhav Nagar, MAHE Campus',
          city: 'Manipal',
          state: 'Karnataka',
          pincode: '576104',
          latitude: 13.3525,
          longitude: 74.7865
        },
        category: 'Dental',
        specialty: 'Dental Sciences',
        specialties: ['Oral Surgery', 'Orthodontics', 'Pedodontics', 'Prosthodontics', 'Periodontics'],
        facilities: ['operation_theatre', 'emergency'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available' },
        procedures: ['dental_implants', 'orthodontic_alignment', 'maxillofacial_surgery', 'endodontics'],
        explicitCapabilities: ['Premier Dental Academic & Clinical Centre', 'Advanced CAD/CAM Ceramic Prosthetics Lab', 'Microscopic Endodontics Suite', 'Comprehensive Craniofacial Care'],
        beds: 80,
        icuBeds: 12,
        establishedYear: 1965,
        emergency24x7: true,
        phone: '+91 820 292 2063',
        emergencyPhone: '+91 820 292 2222',
        rating: 4.8,
        reviewCount: 1650,
        accreditation: ['NABH', 'DCI Recognized', 'NAAC A++'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Dental Institute',
        tagline: 'Pioneering dental education and clinical super-specialty hospital',
        overview: 'MCODS Manipal is an acclaimed dental teaching hospital in India, offering world-standard technology in digital dentistry, microscopic endodontics, and complex oral surgery.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_dental_3',
        referenceRank: 3,
        nationalRefRank: 3,
        name: 'Saveetha Dental College — Chennai',
        fullName: 'Saveetha Dental College and Hospitals, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: {
          address: '162 Poonamallee High Road, Velappanchavadi',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600077',
          latitude: 13.0569,
          longitude: 80.1342
        },
        category: 'Dental',
        specialty: 'Dental Sciences',
        specialties: ['Oral & Maxillofacial Surgery', 'Implantology', 'Orthodontics', 'Aesthetic Dentistry'],
        facilities: ['operation_theatre', 'emergency'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available' },
        procedures: ['guided_implant_surgery', 'orthognathic_correction', 'laser_periodontics'],
        explicitCapabilities: ['High-Volume Modern Dental Hospital', 'In-House 3D Printing & Guided Implant Surgery', 'Laser Dentistry Centre', 'Dedicated Maxillofacial Trauma Unit'],
        beds: 100,
        icuBeds: 15,
        establishedYear: 1988,
        emergency24x7: true,
        phone: '+91 44 2680 1580',
        emergencyPhone: '+91 44 2680 1588',
        rating: 4.8,
        reviewCount: 1800,
        accreditation: ['NABH', 'NABL', 'DCI Recognized'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'National Dental Centre',
        tagline: 'Leading technological hub for digital implantology and oral healthcare',
        overview: 'Saveetha Dental College & Hospitals is a prominent private dental hospital renowned for high research output, fully digital workflows, and advanced oral and maxillofacial surgeries.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_dental_4',
        referenceRank: 4,
        nationalRefRank: 4,
        name: 'Dr. R. Ahmed Dental College — Kolkata',
        fullName: 'Dr. R. Ahmed Dental College and Hospital, Kolkata',
        city: 'Kolkata',
        state: 'West Bengal',
        location: {
          address: '114 Acharya Jagadish Chandra Bose Road',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700014',
          latitude: 22.5697,
          longitude: 88.3697
        },
        category: 'Dental',
        specialty: 'Dental Sciences',
        specialties: ['Oral & Maxillofacial Surgery', 'Periodontics', 'Orthodontics', 'Prosthodontics'],
        facilities: ['operation_theatre', 'emergency'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available' },
        procedures: ['oral_cancer_reconstruction', 'dental_implants', 'cleft_lip_palate_surgery'],
        explicitCapabilities: ['First Dental College in Asia (Founded 1920)', 'State Apex Dental Referral Hospital', 'Maxillofacial Oncology & Cleft Rehabilitation', '24x7 Dental Emergency Casualty'],
        beds: 80,
        icuBeds: 10,
        establishedYear: 1920,
        emergency24x7: true,
        phone: '+91 33 2265 1402',
        emergencyPhone: '+91 33 2265 1403',
        rating: 4.7,
        reviewCount: 1500,
        accreditation: ['Govt Apex Dental Hospital', 'DCI Recognized'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'Historic Apex Dental Institute',
        tagline: 'Historic birthplace of formal dental education and surgery in India',
        overview: 'Founded by Dr. Rafiuddin Ahmed in 1920 as the first dental college in Asia, this historic government institute remains a premier public referral centre for oral cancer surgery, trauma, and comprehensive dental medicine.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      },
      {
        id: 'ref_dental_5',
        referenceRank: 5,
        nationalRefRank: 5,
        name: 'Government Dental College — Mumbai',
        fullName: 'Government Dental College & Hospital, Fort, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: {
          address: 'St. George’s Hospital Compound, P D’Mello Road, Fort',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          latitude: 18.9405,
          longitude: 72.8368
        },
        category: 'Dental',
        specialty: 'Dental Sciences',
        specialties: ['Oral & Maxillofacial Surgery', 'Orthodontics', 'Prosthodontics', 'Periodontics'],
        facilities: ['operation_theatre', 'emergency'],
        facilityStatuses: { operation_theatre: 'available', emergency: 'available' },
        procedures: ['facial_trauma_surgery', 'oral_pathology_biopsy', 'full_mouth_rehabilitation'],
        explicitCapabilities: ['Premier Public Dental Tertiary Care Centre', 'Associated with Grant Government Medical College', 'High-Acuity Maxillofacial Trauma Wing', 'Comprehensive Public Specialty Clinics'],
        beds: 60,
        icuBeds: 10,
        establishedYear: 1938,
        emergency24x7: true,
        phone: '+91 22 2262 0668',
        emergencyPhone: '+91 22 2262 0669',
        rating: 4.7,
        reviewCount: 1450,
        accreditation: ['State Apex Dental Hospital', 'DCI Recognized'],
        isNationalReference: true,
        referenceBasis: 'Sehat_Sathi Curated National Reference List',
        type: 'State Apex Dental Institute',
        tagline: 'Historic government dental institution serving western India with tertiary oral care',
        overview: 'Government Dental College & Hospital Mumbai is one of India’s most venerable dental hospitals, delivering specialized maxillofacial trauma surgery, corrective jaw surgery, and community dental care.',
        verification: { status: 'verified', source: 'Curated National Reference List', lastUpdated: '2024' }
      }
    ]
  }
};

/**
 * Mapping of query keywords, condition identifiers, and procedures
 * to the exact national reference category key.
 */
export const CONDITION_TO_REFERENCE_MAP = {
  // 1. Kidney / Nephrology
  kidney: 'kidney',
  renal: 'kidney',
  nephrology: 'kidney',
  dialysis: 'kidney',
  kidney_disease: 'kidney',
  kidney_failure: 'kidney',
  kidney_transplant: 'kidney',
  'kidney transplant': 'kidney',
  'renal failure': 'kidney',

  // 2. Heart / Cardiac Care
  heart: 'heart',
  cardiac: 'heart',
  cardiology: 'heart',
  heart_disease: 'heart',
  coronary_artery_disease: 'heart',
  heart_attack: 'heart',
  heart_failure: 'heart',
  bypass: 'heart',
  bypass_surgery: 'heart',
  angioplasty: 'heart',
  'heart surgery': 'heart',
  'cardiac surgery': 'heart',

  // 3. Cancer / Oncology
  cancer: 'cancer',
  oncology: 'cancer',
  tumor: 'cancer',
  chemotherapy: 'cancer',
  radiation_oncology: 'cancer',
  surgical_oncology: 'cancer',
  bone_marrow_transplant: 'cancer',

  // 4. Brain Surgery / Neurosurgery
  brain_surgery: 'brain_surgery',
  neurosurgery: 'brain_surgery',
  'brain surgery': 'brain_surgery',
  'neuro surgery': 'brain_surgery',
  'brain tumor': 'brain_surgery',
  brain_tumor: 'brain_surgery',

  // 5. Alzheimer's / Neurodegenerative
  alzheimers: 'alzheimers',
  alzheimer: 'alzheimers',
  "alzheimer's": 'alzheimers',
  dementia: 'alzheimers',
  parkinsons: 'alzheimers',
  parkinson: 'alzheimers',
  neurodegenerative: 'alzheimers',
  memory_loss: 'alzheimers',

  // 6. Eye / Ophthalmology
  eye: 'eye',
  ophthalmology: 'eye',
  cataract: 'eye',
  vision: 'eye',
  lasik: 'eye',
  glaucoma: 'eye',
  retina: 'eye',

  // 7. Orthopedics
  orthopedics: 'orthopedics',
  orthopedic: 'orthopedics',
  orthopaedic: 'orthopedics',
  orthopedic_disorders: 'orthopedics',
  joint_replacement: 'orthopedics',
  knee_replacement: 'orthopedics',
  hip_replacement: 'orthopedics',
  'joint replacement': 'orthopedics',
  'knee replacement': 'orthopedics',
  'hip replacement': 'orthopedics',
  bone: 'orthopedics',
  fracture: 'orthopedics',

  // 8. Dental
  dental: 'dental',
  dental_disorders: 'dental',
  dentistry: 'dental',
  teeth: 'dental',
  dentist: 'dental'
};

// Attach benchmark procedure and condition costs to all national reference hospitals
const BENCHMARK_COST_MAP = {
  // Kidney
  'ref_kidney_1': {
    estimatedCosts: { kidneyTreatment: { min: 50000, max: 150000, label: '₹50,000 – ₹1,50,000' } },
    procedureCosts: { kidney_transplant: { min: 250000, max: 400000, label: '₹2,50,000 – ₹4,00,000' }, dialysis_procedure: { min: 1000, max: 2500, label: '₹1,000 – ₹2,500 / session' } }
  },
  'ref_kidney_2': {
    estimatedCosts: { kidneyTreatment: { min: 45000, max: 120000, label: '₹45,000 – ₹1,20,000' } },
    procedureCosts: { kidney_transplant: { min: 220000, max: 380000, label: '₹2,20,000 – ₹3,80,000' } }
  },
  'ref_kidney_3': {
    estimatedCosts: { kidneyTreatment: { min: 80000, max: 200000, label: '₹80,000 – ₹2,00,000' } },
    procedureCosts: { kidney_transplant: { min: 400000, max: 700000, label: '₹4,00,000 – ₹7,00,000' } }
  },
  'ref_kidney_4': {
    estimatedCosts: { kidneyTreatment: { min: 50000, max: 140000, label: '₹50,000 – ₹1,40,000' } },
    procedureCosts: { kidney_transplant: { min: 250000, max: 420000, label: '₹2,50,000 – ₹4,20,000' } }
  },
  'ref_kidney_5': {
    estimatedCosts: { kidneyTreatment: { min: 120000, max: 300000, label: '₹1,20,000 – ₹3,00,000' } },
    procedureCosts: { kidney_transplant: { min: 600000, max: 1000000, label: '₹6,00,000 – ₹10,00,000' } }
  },

  // Heart
  'ref_heart_1': {
    estimatedCosts: { cardiacCare: { min: 250000, max: 550000, label: '₹2,50,000 – ₹5,50,000' } },
    procedureCosts: { angioplasty: { min: 180000, max: 320000, label: '₹1,80,000 – ₹3,20,000' }, bypass_surgery: { min: 300000, max: 600000, label: '₹3,00,000 – ₹6,00,000' } }
  },
  'ref_heart_2': {
    estimatedCosts: { cardiacCare: { min: 120000, max: 300000, label: '₹1,20,000 – ₹3,00,000' } },
    procedureCosts: { angioplasty: { min: 80000, max: 180000, label: '₹80,000 – ₹1,80,000' }, bypass_surgery: { min: 150000, max: 350000, label: '₹1,50,000 – ₹3,50,000' } }
  },
  'ref_heart_3': {
    estimatedCosts: { cardiacCare: { min: 280000, max: 600000, label: '₹2,80,000 – ₹6,00,000' } },
    procedureCosts: { bypass_surgery: { min: 350000, max: 700000, label: '₹3,50,000 – ₹7,00,000' }, angioplasty: { min: 200000, max: 350000, label: '₹2,00,000 – ₹3,50,000' } }
  },
  'ref_heart_4': {
    estimatedCosts: { cardiacCare: { min: 180000, max: 400000, label: '₹1,80,000 – ₹4,00,000' } },
    procedureCosts: { angioplasty: { min: 140000, max: 260000, label: '₹1,40,000 – ₹2,60,000' }, bypass_surgery: { min: 220000, max: 450000, label: '₹2,20,000 – ₹4,50,000' } }
  },
  'ref_heart_5': {
    estimatedCosts: { cardiacCare: { min: 250000, max: 580000, label: '₹2,50,000 – ₹5,80,000' } },
    procedureCosts: { angioplasty: { min: 190000, max: 340000, label: '₹1,90,000 – ₹3,40,000' }, bypass_surgery: { min: 320000, max: 620000, label: '₹3,20,000 – ₹6,20,000' } }
  },

  // Cancer
  'ref_cancer_1': {
    estimatedCosts: { cancerCare: { min: 100000, max: 350000, label: '₹1,00,000 – ₹3,50,000' } },
    procedureCosts: { chemotherapy: { min: 15000, max: 50000, label: '₹15,000 – ₹50,000 / cycle' }, radiation_therapy: { min: 80000, max: 200000, label: '₹80,000 – ₹2,00,000' } }
  },
  'ref_cancer_2': {
    estimatedCosts: { cancerCare: { min: 120000, max: 350000, label: '₹1,20,000 – ₹3,50,000' } },
    procedureCosts: { chemotherapy: { min: 12000, max: 40000, label: '₹12,000 – ₹40,000 / cycle' }, radiation_therapy: { min: 60000, max: 180000, label: '₹60,000 – ₹1,80,000' } }
  },
  'ref_cancer_3': {
    estimatedCosts: { cancerCare: { min: 400000, max: 1200000, label: '₹4,00,000 – ₹12,00,000' } }
  },
  'ref_cancer_4': {
    estimatedCosts: { cancerCare: { min: 250000, max: 650000, label: '₹2,50,000 – ₹6,50,000' } }
  },
  'ref_cancer_5': {
    estimatedCosts: { cancerCare: { min: 80000, max: 280000, label: '₹80,000 – ₹2,80,000' } }
  },

  // Brain Surgery
  'ref_brain_surgery_1': {
    estimatedCosts: { brainSurgery: { min: 100000, max: 300000, label: '₹1,00,000 – ₹3,00,000' } },
    procedureCosts: { craniotomy: { min: 150000, max: 350000, label: '₹1,50,000 – ₹3,50,000' } }
  },
  'ref_brain_surgery_2': {
    estimatedCosts: { brainSurgery: { min: 80000, max: 250000, label: '₹80,000 – ₹2,50,000' } },
    procedureCosts: { craniotomy: { min: 120000, max: 280000, label: '₹1,20,000 – ₹2,80,000' } }
  },
  'ref_brain_surgery_3': {
    estimatedCosts: { brainSurgery: { min: 90000, max: 280000, label: '₹90,000 – ₹2,80,000' } },
    procedureCosts: { craniotomy: { min: 130000, max: 300000, label: '₹1,30,000 – ₹3,00,000' } }
  },
  'ref_brain_surgery_4': {
    estimatedCosts: { brainSurgery: { min: 350000, max: 750000, label: '₹3,50,000 – ₹7,50,000' } },
    procedureCosts: { craniotomy: { min: 400000, max: 800000, label: '₹4,00,000 – ₹8,00,000' } }
  },
  'ref_brain_surgery_5': {
    estimatedCosts: { brainSurgery: { min: 200000, max: 500000, label: '₹2,00,000 – ₹5,00,000' } },
    procedureCosts: { craniotomy: { min: 250000, max: 550000, label: '₹2,50,000 – ₹5,50,000' } }
  },

  // Eye
  'ref_eye_1': {
    estimatedCosts: { eyeCare: { min: 25000, max: 100000, label: '₹25,000 – ₹1,00,000' } },
    procedureCosts: { cataract_surgery: { min: 20000, max: 70000, label: '₹20,000 – ₹70,000' } }
  },
  'ref_eye_2': {
    estimatedCosts: { eyeCare: { min: 12000, max: 50000, label: '₹12,000 – ₹50,000' } },
    procedureCosts: { cataract_surgery: { min: 8000, max: 30000, label: '₹8,000 – ₹30,000' } }
  },
  'ref_eye_3': {
    estimatedCosts: { eyeCare: { min: 30000, max: 120000, label: '₹30,000 – ₹1,20,000' } },
    procedureCosts: { cataract_surgery: { min: 25000, max: 75000, label: '₹25,000 – ₹75,000' } }
  },
  'ref_eye_4': {
    estimatedCosts: { eyeCare: { min: 15000, max: 60000, label: '₹15,000 – ₹60,000' } },
    procedureCosts: { cataract_surgery: { min: 10000, max: 35000, label: '₹10,000 – ₹35,000' } }
  },
  'ref_eye_5': {
    estimatedCosts: { eyeCare: { min: 30000, max: 110000, label: '₹30,000 – ₹1,10,000' } },
    procedureCosts: { cataract_surgery: { min: 25000, max: 80000, label: '₹25,000 – ₹80,000' } }
  },

  // Orthopedics
  'ref_orthopedics_1': {
    estimatedCosts: { orthopedicCare: { min: 80000, max: 220000, label: '₹80,000 – ₹2,20,000' } },
    procedureCosts: { knee_replacement: { min: 120000, max: 250000, label: '₹1,20,000 – ₹2,50,000' } }
  },
  'ref_orthopedics_2': {
    estimatedCosts: { orthopedicCare: { min: 75000, max: 200000, label: '₹75,000 – ₹2,00,000' } },
    procedureCosts: { knee_replacement: { min: 110000, max: 230000, label: '₹1,10,000 – ₹2,30,000' } }
  },
  'ref_orthopedics_3': {
    estimatedCosts: { orthopedicCare: { min: 250000, max: 500000, label: '₹2,50,000 – ₹5,00,000' } },
    procedureCosts: { knee_replacement: { min: 280000, max: 550000, label: '₹2,80,000 – ₹5,50,000' } }
  },
  'ref_orthopedics_4': {
    estimatedCosts: { orthopedicCare: { min: 220000, max: 480000, label: '₹2,20,000 – ₹4,80,000' } },
    procedureCosts: { knee_replacement: { min: 250000, max: 520000, label: '₹2,50,000 – ₹5,20,000' } }
  },
  'ref_orthopedics_5': {
    estimatedCosts: { orthopedicCare: { min: 180000, max: 400000, label: '₹1,80,000 – ₹4,00,000' } },
    procedureCosts: { knee_replacement: { min: 200000, max: 420000, label: '₹2,00,000 – ₹4,20,000' } }
  },

  // Dental
  'ref_dental_1': {
    estimatedCosts: { dentalCare: { min: 5000, max: 25000, label: '₹5,000 – ₹25,000' } }
  },
  'ref_dental_2': {
    estimatedCosts: { dentalCare: { min: 15000, max: 60000, label: '₹15,000 – ₹60,000' } }
  },
  'ref_dental_3': {
    estimatedCosts: { dentalCare: { min: 5000, max: 30000, label: '₹5,000 – ₹30,000' } }
  },
  'ref_dental_4': {
    estimatedCosts: { dentalCare: { min: 6000, max: 35000, label: '₹6,000 – ₹35,000' } }
  },
  'ref_dental_5': {
    estimatedCosts: { dentalCare: { min: 12000, max: 50000, label: '₹12,000 – ₹50,000' } }
  }
  // Alzheimer's intentionally has NO cost entries -> returns null / "Data not available"
};

// Initialize costs onto NATIONAL_HOSPITAL_REFERENCES
Object.values(NATIONAL_HOSPITAL_REFERENCES).forEach(cat => {
  cat.hospitals.forEach(h => {
    const costEntry = BENCHMARK_COST_MAP[h.id];
    if (costEntry) {
      if (costEntry.estimatedCosts) h.estimatedCosts = costEntry.estimatedCosts;
      if (costEntry.procedureCosts) h.procedureCosts = costEntry.procedureCosts;
    }
  });
});

/**
 * Resolves a natural query, condition, and procedure to a Curated National Reference Category.
 * Returns the categoryKey string or null if not a specialized national category.
 * 
 * Strict Priority Order:
 * 1. Alzheimer's / Dementia / Neurodegenerative -> alzheimers
 * 2. Brain Surgery / Neurosurgery / Brain Tumor -> brain_surgery
 * 3. Kidney / Nephrology / Dialysis -> kidney
 * 4. Heart / Cardiac -> heart
 * 5. Cancer / Oncology -> cancer
 * 6. Eye / Ophthalmology -> eye
 * 7. Orthopedics / Joint Replacement -> orthopedics
 * 8. Dental / Dentistry -> dental
 */
export function resolveNationalCategory(condition = '', procedure = '', queryText = '') {
  const c = String(condition || '').toLowerCase().trim();
  const p = String(procedure || '').toLowerCase().trim();
  const q = String(queryText || '').toLowerCase().trim();

  // 1. Alzheimer's / Dementia (Higher priority than general neurology)
  if (
    c.includes('alzheimer') || c.includes('dementia') || c.includes('neurodegenerative') || c.includes('parkinson') ||
    q.includes('alzheimer') || q.includes('dementia') || q.includes('neurodegenerative') || q.includes('parkinson') ||
    q.includes('अल्जाइमर') || q.includes('ਅਲਜ਼ਾਈਮਰ')
  ) {
    return 'alzheimers';
  }

  // 2. Brain Surgery / Neurosurgery
  if (
    p.includes('brain') || p.includes('neurosurgery') || p.includes('craniotomy') ||
    q.includes('brain surgery') || q.includes('neurosurgery') || q.includes('neuro surgery') || q.includes('brain operation') ||
    q.includes('brain tumor') || q.includes('brain tumour') ||
    q.includes('dimag') || q.includes('dimaag') || q.includes('दिमाग') || q.includes('ਦਿਮਾਗ') ||
    (c === 'neurology' && (q.includes('surgery') || q.includes('surgeon') || q.includes('operation'))) ||
    c === 'brain_surgery' || c === 'neurosurgery'
  ) {
    return 'brain_surgery';
  }

  // General neurology condition check if no surgery/alzheimer's specified
  if (c === 'neurology' || q.includes('neurology') || q.includes('neurologist')) {
    // If user says "brain surgery hospital", it went to brain_surgery above
    // If generic neurology hospital without dementia, default to brain_surgery/neuro category
    return 'brain_surgery';
  }

  // 3. Kidney / Nephrology
  if (
    c.includes('kidney') || c.includes('nephrol') || c.includes('renal') || c.includes('dialysis') ||
    p.includes('dialysis') || p.includes('kidney_transplant') ||
    q.includes('kidney') || q.includes('nephrol') || q.includes('renal') || q.includes('dialysis') ||
    q.includes('गुर्दा') || q.includes('ਕਿਡਨੀ')
  ) {
    return 'kidney';
  }

  // 4. Heart / Cardiac Care
  if (
    c.includes('heart') || c.includes('cardio') || c.includes('cardiac') || c.includes('angioplasty') || c.includes('bypass') ||
    p.includes('angioplasty') || p.includes('bypass') || p.includes('heart_transplant') ||
    q.includes('heart') || q.includes('cardio') || q.includes('cardiac') || q.includes('bypass') || q.includes('angioplasty') ||
    q.includes('दिल') || q.includes('ਹਿਰਦਾ') || q.includes('हार्ट')
  ) {
    return 'heart';
  }

  // 5. Cancer / Oncology
  if (
    c.includes('cancer') || c.includes('oncol') || c.includes('tumor') || c.includes('tumour') || c.includes('chemo') ||
    p.includes('bone_marrow_transplant') ||
    q.includes('cancer') || q.includes('oncol') || q.includes('tumor') || q.includes('tumour') || q.includes('chemo') ||
    q.includes('कैंसर') || q.includes('ਕੈਂਸਰ')
  ) {
    return 'cancer';
  }

  // 6. Eye / Ophthalmology
  if (
    c.includes('eye') || c.includes('ophthal') || c.includes('cataract') || c.includes('vision') ||
    q.includes('eye') || q.includes('ophthal') || q.includes('cataract') || q.includes('lasik') ||
    q.includes('आँख') || q.includes('ਅੱਖ')
  ) {
    return 'eye';
  }

  // 7. Orthopedics
  if (
    c.includes('ortho') || c.includes('joint') || c.includes('knee') || c.includes('hip') || c.includes('bone') ||
    p.includes('knee_replacement') || p.includes('hip_replacement') ||
    q.includes('ortho') || q.includes('joint replacement') || q.includes('knee replacement') || q.includes('hip replacement') ||
    q.includes('हड्डी') || q.includes('ਹੱਡੀ')
  ) {
    return 'orthopedics';
  }

  // 8. Dental
  if (
    c.includes('dent') || c.includes('teeth') || c.includes('tooth') ||
    q.includes('dent') || q.includes('teeth') || q.includes('tooth') ||
    q.includes('दांत') || q.includes('ਦੰਦ')
  ) {
    return 'dental';
  }

  // Fallback to dictionary map
  if (CONDITION_TO_REFERENCE_MAP[c]) {
    return CONDITION_TO_REFERENCE_MAP[c];
  }

  return null;
}

/**
 * Check if a query/condition has a national reference list
 */
export function hasNationalReference(condition = '', procedure = '', queryText = '') {
  const cat = resolveNationalCategory(condition, procedure, queryText);
  return !!cat && !!NATIONAL_HOSPITAL_REFERENCES[cat];
}

/**
 * Returns national reference hospitals for a category.
 * STRICT RULE: Deterministic referenceRank ASC (#1 to #5).
 * Distance and budget NEVER reorder this list.
 * 
 * @param {string} categoryKey - One of the 8 category keys
 * @param {number|null} userLat - User latitude
 * @param {number|null} userLng - User longitude
 * @param {string|null} preferredCity - Optional preferred city
 * @param {number|null} budgetMax - Optional budget ceiling
 * @returns {Array} List of 5 hospitals in exact referenceRank order
 */
export function getNationalReferenceHospitals(categoryKey, userLat = null, userLng = null, preferredCity = null, budgetMax = null) {
  const cat = NATIONAL_HOSPITAL_REFERENCES[categoryKey];
  if (!cat) return [];

  const cleanPrefCity = (preferredCity || '').toLowerCase().trim();

  const evaluated = cat.hospitals.map(h => {
    let distanceKm = null;
    if (userLat != null && userLng != null && h.location?.latitude && h.location?.longitude) {
      distanceKm = calculateHaversineDistance(userLat, userLng, h.location.latitude, h.location.longitude);
      if (distanceKm != null) {
        distanceKm = Math.round(distanceKm * 10) / 10;
      }
    }

    const hospCity = (h.city || '').toLowerCase();
    const locationMatch = !!cleanPrefCity && (
      hospCity === cleanPrefCity ||
      cleanPrefCity.includes(hospCity) ||
      hospCity.includes(cleanPrefCity)
    );

    const whyThisResult = [
      `Curated National Reference Hospital (Position #${h.referenceRank}) for ${cat.categoryName}`,
      `Deterministic reference order preserved (#1 to #5)`,
      `Reference Basis: ${h.referenceBasis || 'Sehat_Sathi Curated National Reference List'}`
    ];

    if (locationMatch) {
      whyThisResult.push(`Location Alignment: Matches your requested location (${h.city})`);
    } else if (distanceKm != null) {
      whyThisResult.push(`Distance: ~${Math.round(distanceKm)} km from your search location`);
    }

    if (budgetMax && Number(budgetMax) > 0) {
      whyThisResult.push(`Budget Context: Stated budget ceiling ₹${Number(budgetMax).toLocaleString('en-IN')}`);
    }

    return {
      ...h,
      distance: distanceKm,
      locationMatch,
      whyThisResult,
      // Neutral matchScore purely indicative, NEVER used for sorting
      matchScore: 90 - (h.referenceRank - 1) * 3,
      matchTier: 'Curated Reference',
      evidenceTier: 'National Benchmark'
    };
  });

  // CRITICAL RULE: Sort strictly by curated referenceRank ASC (#1 before #2, #2 before #3...)
  return evaluated.sort((a, b) => a.referenceRank - b.referenceRank);
}

/**
 * Lookup a single hospital across all national reference lists by ID or name
 */
export function getNationalReferenceHospitalById(id) {
  if (!id) return null;
  const strId = String(id).toLowerCase();

  for (const cat of Object.values(NATIONAL_HOSPITAL_REFERENCES)) {
    for (const h of cat.hospitals) {
      if (h.id.toLowerCase() === strId || h.name.toLowerCase() === strId || h.fullName.toLowerCase() === strId) {
        return h;
      }
    }
  }
  return null;
}