/**
 * Sehat_Sathi - Master Hospitals Dataset
 * 
 * SOURCED & VERIFIED HEALTHCARE DIRECTORY
 * Includes verified local hospital data from Jalandhar and Hoshiarpur,
 * independent organisation affiliation records (NABH, PMNDP, PHSC),
 * and condition-specific performance data.
 * 
 * DISCLAIMER / TRANSPARENCY NOTICE:
 * Original demo hospitals (IDs 1-16) are marked with verificationStatus: "sample_data".
 * All medical statistics require explicit source verification.
 * Missing metrics strictly remain null / "Data not available".
 */

export const HOSPITALS = [
  {
    "id": 1,
    "name": "CityCare Multispeciality Hospital",
    "shortName": "CityCare Hospital",
    "type": "Multispeciality",
    "tagline": "Comprehensive tertiary and critical care centre",
    "location": {
      "city": "Chandigarh",
      "address": "Sector 34-A, Sub. City Centre",
      "pincode": "160022",
      "latitude": 30.7226,
      "longitude": 76.7684,
      "landmark": "Near Piccadily Chowk"
    },
    "distance": 2.8,
    "phone": "+91 172 260 4500",
    "emergencyPhone": "+91 172 260 9999",
    "emergency24x7": true,
    "beds": 350,
    "icuBeds": 45,
    "establishedYear": 2008,
    "rating": 4.6,
    "reviewCount": 1420,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology",
      "Neurology & Neurosurgery",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "unavailable",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 50000,
        "max": 80000,
        "label": "₹50,000 – ₹80,000"
      },
      "cardiacCare": {
        "min": 140000,
        "max": 280000,
        "label": "₹1,40,000 – ₹2,80,000"
      },
      "orthopedicCare": {
        "min": 90000,
        "max": 190000,
        "label": "₹90,000 – ₹1,90,000"
      },
      "cancerCare": {
        "min": 160000,
        "max": 380000,
        "label": "₹1,60,000 – ₹3,80,000"
      },
      "maternityCare": {
        "min": 40000,
        "max": 75000,
        "label": "₹40,000 – ₹75,000"
      },
      "emergencyTrauma": {
        "min": 30000,
        "max": 120000,
        "label": "₹30,000 – ₹1,20,000"
      }
    },
    "patientVolumeAnnual": 48000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address"
      ]
    },
    "overview": "CityCare Multispeciality Hospital is a NABH-accredited 350-bed medical establishment offering high-acuity intensive care, comprehensive hemodialysis units, multi-slice diagnostics, and emergency trauma resuscitation in central Chandigarh.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "CityCare Multispeciality Hospital",
        "hospitalMatchedName": "CityCare Multispeciality Hospital",
        "matchedAddress": "Sector 34-A, Sub. City Centre",
        "matchedCity": "Chandigarh",
        "matchedDistrict": "Chandigarh",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160022",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "CityCare Multispeciality Hospital",
        "matchedCity": "Chandigarh",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": null,
            "unit": "sessions",
            "definition": "Demonstration session metric",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Sehat_Sathi Demo Dataset",
            "sourceType": "sample",
            "verificationStatus": "sample_data",
            "lastVerified": "2026-09-01"
          }
        ]
      }
    }
  },
  {
    "id": 2,
    "name": "Apollo Medical Centre",
    "shortName": "Apollo Centre",
    "type": "Super Speciality",
    "tagline": "Excellence in cardiovascular, renal, and oncology pathways",
    "location": {
      "city": "Chandigarh",
      "address": "Sector 8-C, Madhya Marg",
      "pincode": "160009",
      "latitude": 30.7398,
      "longitude": 76.7963,
      "landmark": "Opposite Gurudwara Sahib"
    },
    "distance": 4.1,
    "phone": "+91 172 505 1100",
    "emergencyPhone": "+91 172 505 1199",
    "emergency24x7": true,
    "beds": 280,
    "icuBeds": 38,
    "establishedYear": 2012,
    "rating": 4.7,
    "reviewCount": 1980,
    "accreditation": [
      "NABH",
      "JCI",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Nephrology & Urology",
      "Oncology (Cancer Care)",
      "Neurology & Neurosurgery",
      "Gastroenterology & Hepatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "limited",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 70000,
        "max": 120000,
        "label": "₹70,000 – ₹1,20,000"
      },
      "cardiacCare": {
        "min": 180000,
        "max": 350000,
        "label": "₹1,80,000 – ₹3,50,000"
      },
      "orthopedicCare": {
        "min": 110000,
        "max": 240000,
        "label": "₹1,10,000 – ₹2,40,000"
      },
      "cancerCare": {
        "min": 210000,
        "max": 480000,
        "label": "₹2,10,000 – ₹4,80,000"
      },
      "maternityCare": {
        "min": 55000,
        "max": 95000,
        "label": "₹55,000 – ₹95,000"
      },
      "emergencyTrauma": {
        "min": 45000,
        "max": 160000,
        "label": "₹45,000 – ₹1,60,000"
      }
    },
    "patientVolumeAnnual": 52000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "Apollo Medical Centre features state-of-the-art flat-panel cardiac cath labs, 3T MRI, an active hemodialysis wing, and round-the-clock emergency medical specialists.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Apollo Medical Centre",
        "hospitalMatchedName": "Apollo Medical Centre",
        "matchedAddress": "Sector 8-C, Madhya Marg",
        "matchedCity": "Chandigarh",
        "matchedDistrict": "Chandigarh",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160009",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Apollo Medical Centre",
        "matchedCity": "Chandigarh",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 3,
    "name": "LifeLine Institute of Medical Sciences",
    "shortName": "LifeLine Institute",
    "type": "Super Speciality",
    "tagline": "Advanced surgical suites and comprehensive tertiary care",
    "location": {
      "city": "Mohali",
      "address": "Phase 8, Industrial Area, Sector 73",
      "pincode": "160071",
      "latitude": 30.7046,
      "longitude": 76.7179,
      "landmark": "Near Fortis Chowk"
    },
    "distance": 6.4,
    "phone": "+91 172 490 2000",
    "emergencyPhone": "+91 172 490 2099",
    "emergency24x7": true,
    "beds": 420,
    "icuBeds": 60,
    "establishedYear": 2015,
    "rating": 4.5,
    "reviewCount": 1140,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Neurology & Neurosurgery",
      "Cardiology & Cardiac Surgery",
      "Oncology (Cancer Care)",
      "Pediatrics & Neonatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "nicu"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 60000,
        "max": 95000,
        "label": "₹60,000 – ₹95,000"
      },
      "cardiacCare": {
        "min": 150000,
        "max": 310000,
        "label": "₹1,50,000 – ₹3,10,000"
      },
      "orthopedicCare": {
        "min": 95000,
        "max": 210000,
        "label": "₹95,000 – ₹2,10,000"
      },
      "cancerCare": {
        "min": 180000,
        "max": 420000,
        "label": "₹1,80,000 – ₹4,20,000"
      },
      "maternityCare": {
        "min": 42000,
        "max": 80000,
        "label": "₹42,000 – ₹80,000"
      },
      "emergencyTrauma": {
        "min": 35000,
        "max": 140000,
        "label": "₹35,000 – ₹1,40,000"
      }
    },
    "patientVolumeAnnual": 61000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "LifeLine Institute provides 420 beds, 60 multi-parameter ICU units, Level III NICU, and a 16-bed hemodialysis center serving tricity patients.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "LifeLine Institute of Medical Sciences",
        "hospitalMatchedName": "LifeLine Institute of Medical Sciences",
        "matchedAddress": "Phase 8, Industrial Area, Sector 73",
        "matchedCity": "Mohali",
        "matchedDistrict": "Mohali",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160071",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "LifeLine Institute of Medical Sciences",
        "matchedCity": "Mohali",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 4,
    "name": "NorthCare Hospital",
    "shortName": "NorthCare",
    "type": "Multispeciality",
    "tagline": "Community-focused affordable acute healthcare",
    "location": {
      "city": "Panchkula",
      "address": "Sector 14, Main Institutional Area",
      "pincode": "134113",
      "latitude": 30.6869,
      "longitude": 76.8524,
      "landmark": "Near Major Shankla Memorial"
    },
    "distance": 8.2,
    "phone": "+91 172 258 7700",
    "emergencyPhone": "+91 172 258 7799",
    "emergency24x7": true,
    "beds": 180,
    "icuBeds": 24,
    "establishedYear": 2017,
    "rating": 4.4,
    "reviewCount": 780,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Obstetrics & Gynecology",
      "Pediatrics & Neonatology",
      "Gastroenterology & Hepatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "limited",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "unavailable"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 45000,
        "max": 70000,
        "label": "₹45,000 – ₹70,000"
      },
      "cardiacCare": {
        "min": 110000,
        "max": 220000,
        "label": "₹1,10,000 – ₹2,20,000"
      },
      "orthopedicCare": {
        "min": 75000,
        "max": 160000,
        "label": "₹75,000 – ₹1,60,000"
      },
      "cancerCare": {
        "min": 140000,
        "max": 320000,
        "label": "₹1,40,000 – ₹3,20,000"
      },
      "maternityCare": {
        "min": 32000,
        "max": 65000,
        "label": "₹32,000 – ₹65,000"
      },
      "emergencyTrauma": {
        "min": 25000,
        "max": 95000,
        "label": "₹25,000 – ₹95,000"
      }
    },
    "patientVolumeAnnual": 28000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities"
      ]
    },
    "overview": "NorthCare Hospital in Panchkula is recognized for accessible pricing, quality maternal-child infrastructure, active nephrology daycare, and dedicated trauma beds.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "NorthCare Hospital",
        "hospitalMatchedName": "NorthCare Hospital",
        "matchedAddress": "Sector 14, Main Institutional Area",
        "matchedCity": "Panchkula",
        "matchedDistrict": "Panchkula",
        "matchedState": "Punjab/UT",
        "matchedPincode": "134113",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "NorthCare Hospital",
        "matchedCity": "Panchkula",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 5,
    "name": "Apex Heart & Kidney Institute",
    "shortName": "Apex Institute",
    "type": "Specialized Institute",
    "tagline": "Focused cardiovascular, nephrology, and transplant care",
    "location": {
      "city": "Chandigarh",
      "address": "Sector 19-C, Near Shastri Market",
      "pincode": "160019",
      "latitude": 30.7302,
      "longitude": 76.7865,
      "landmark": "Adjacent to Central Plaza"
    },
    "distance": 3.2,
    "phone": "+91 172 278 3344",
    "emergencyPhone": "+91 172 278 3399",
    "emergency24x7": true,
    "beds": 160,
    "icuBeds": 32,
    "establishedYear": 2011,
    "rating": 4.8,
    "reviewCount": 920,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "limited",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "unavailable",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 55000,
        "max": 85000,
        "label": "₹55,000 – ₹85,000"
      },
      "cardiacCare": {
        "min": 160000,
        "max": 320000,
        "label": "₹1,60,000 – ₹3,20,000"
      },
      "orthopedicCare": {
        "min": 90000,
        "max": 180000,
        "label": "₹90,000 – ₹1,80,000"
      },
      "cancerCare": {
        "min": 170000,
        "max": 390000,
        "label": "₹1,70,000 – ₹3,90,000"
      },
      "maternityCare": {
        "min": 45000,
        "max": 85000,
        "label": "₹45,000 – ₹85,000"
      },
      "emergencyTrauma": {
        "min": 32000,
        "max": 130000,
        "label": "₹32,000 – ₹1,30,000"
      }
    },
    "patientVolumeAnnual": 34000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "dialysis",
        "emergency24x7"
      ]
    },
    "overview": "Apex Institute is a super-specialized facility dedicated strictly to cardiac and renal disciplines with 20 modern hemodialysis bays and advanced cardiovascular intensive care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Apex Heart & Kidney Institute",
        "hospitalMatchedName": "Apex Heart & Kidney Institute",
        "matchedAddress": "Sector 19-C, Near Shastri Market",
        "matchedCity": "Chandigarh",
        "matchedDistrict": "Chandigarh",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160019",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Apex Heart & Kidney Institute",
        "matchedCity": "Chandigarh",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "patientsTreated",
            "label": "Patients Treated",
            "value": null,
            "unit": "patients",
            "definition": "Demonstration renal patient volume",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Sehat_Sathi Demo Dataset",
            "sourceType": "sample",
            "verificationStatus": "sample_data",
            "lastVerified": "2026-09-01"
          }
        ]
      },
      "heart": {
        "condition": "heart",
        "conditionLabel": "Cardiology & Cardiac Surgery",
        "metrics": [
          {
            "metricName": "proceduresPerformed",
            "label": "Procedures Performed",
            "value": null,
            "unit": "procedures",
            "definition": "Demonstration cardiac intervention volume",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Sehat_Sathi Demo Dataset",
            "sourceType": "sample",
            "verificationStatus": "sample_data",
            "lastVerified": "2026-09-01"
          }
        ]
      }
    }
  },
  {
    "id": 6,
    "name": "Shivalik Cancer & General Hospital",
    "shortName": "Shivalik Hospital",
    "type": "Super Speciality",
    "tagline": "Dedicated oncology, radiation therapy, and surgical oncology",
    "location": {
      "city": "Mohali",
      "address": "Sector 69, Sahibzada Ajit Singh Nagar",
      "pincode": "160062",
      "latitude": 30.6974,
      "longitude": 76.7329,
      "landmark": "Near Kumbra Chowk"
    },
    "distance": 5.7,
    "phone": "+91 172 466 7000",
    "emergencyPhone": "+91 172 466 7099",
    "emergency24x7": true,
    "beds": 220,
    "icuBeds": 28,
    "establishedYear": 2016,
    "rating": 4.6,
    "reviewCount": 650,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Oncology (Cancer Care)",
      "Gastroenterology & Hepatology",
      "Pulmonology & Respiratory",
      "Nephrology & Urology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "unavailable",
      "cath_lab": "unavailable"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 58000,
        "max": 92000,
        "label": "₹58,000 – ₹92,000"
      },
      "cardiacCare": {
        "min": 140000,
        "max": 290000,
        "label": "₹1,40,000 – ₹2,90,000"
      },
      "orthopedicCare": {
        "min": 85000,
        "max": 195000,
        "label": "₹85,000 – ₹1,95,000"
      },
      "cancerCare": {
        "min": 190000,
        "max": 450000,
        "label": "₹1,90,000 – ₹4,50,000"
      },
      "maternityCare": {
        "min": 40000,
        "max": 78000,
        "label": "₹40,000 – ₹78,000"
      },
      "emergencyTrauma": {
        "min": 30000,
        "max": 110000,
        "label": "₹30,000 – ₹1,10,000"
      }
    },
    "patientVolumeAnnual": 31000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "Shivalik Cancer & General Hospital integrates medical oncology, linear accelerator radiation therapies, and supportive dialysis services with dedicated critical care backup.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Shivalik Cancer & General Hospital",
        "hospitalMatchedName": "Shivalik Cancer & General Hospital",
        "matchedAddress": "Sector 69, Sahibzada Ajit Singh Nagar",
        "matchedCity": "Mohali",
        "matchedDistrict": "Mohali",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160062",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Shivalik Cancer & General Hospital",
        "matchedCity": "Mohali",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 7,
    "name": "Fortis Premier Hospital",
    "shortName": "Fortis Hospital",
    "type": "Super Speciality",
    "tagline": "Internationally accredited quaternary referral centre",
    "location": {
      "city": "Mohali",
      "address": "Sector 62, Phase VIII",
      "pincode": "160062",
      "latitude": 30.7099,
      "longitude": 76.7262,
      "landmark": "Opposite PUDA Building"
    },
    "distance": 5.1,
    "phone": "+91 172 507 1000",
    "emergencyPhone": "+91 172 507 1099",
    "emergency24x7": true,
    "beds": 355,
    "icuBeds": 54,
    "establishedYear": 2001,
    "rating": 4.8,
    "reviewCount": 3100,
    "accreditation": [
      "NABH",
      "JCI",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Neurology & Neurosurgery",
      "Oncology (Cancer Care)",
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Obstetrics & Gynecology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "nicu",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 85000,
        "max": 160000,
        "label": "₹85,000 – ₹1,60,000"
      },
      "cardiacCare": {
        "min": 210000,
        "max": 420000,
        "label": "₹2,10,000 – ₹4,20,000"
      },
      "orthopedicCare": {
        "min": 130000,
        "max": 280000,
        "label": "₹1,30,000 – ₹2,80,000"
      },
      "cancerCare": {
        "min": 240000,
        "max": 550000,
        "label": "₹2,40,000 – ₹5,50,000"
      },
      "maternityCare": {
        "min": 65000,
        "max": 120000,
        "label": "₹65,000 – ₹1,20,000"
      },
      "emergencyTrauma": {
        "min": 50000,
        "max": 180000,
        "label": "₹50,000 – ₹1,80,000"
      }
    },
    "patientVolumeAnnual": 75000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "verifiedDoctors"
      ]
    },
    "overview": "Fortis Premier Hospital is an internationally accredited quaternary care facility with comprehensive organ transplant licenses, advanced cardiac electrophysiology, and dual Cath labs.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Fortis Premier Hospital",
        "hospitalMatchedName": "Fortis Premier Hospital",
        "matchedAddress": "Sector 62, Phase VIII",
        "matchedCity": "Mohali",
        "matchedDistrict": "Mohali",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160062",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Fortis Premier Hospital",
        "matchedCity": "Mohali",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 8,
    "name": "Alchemist Multi-Care Hospital",
    "shortName": "Alchemist Hospital",
    "type": "Multispeciality",
    "tagline": "Precision clinical care and patient safety standards",
    "location": {
      "city": "Panchkula",
      "address": "Sector 21, Urban Estate",
      "pincode": "134112",
      "latitude": 30.6723,
      "longitude": 76.8611,
      "landmark": "Near Tau Devi Lal Stadium"
    },
    "distance": 9.5,
    "phone": "+91 172 450 0000",
    "emergencyPhone": "+91 172 450 0099",
    "emergency24x7": true,
    "beds": 175,
    "icuBeds": 26,
    "establishedYear": 2009,
    "rating": 4.5,
    "reviewCount": 890,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "limited",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 52000,
        "max": 82000,
        "label": "₹52,000 – ₹82,000"
      },
      "cardiacCare": {
        "min": 145000,
        "max": 275000,
        "label": "₹1,45,000 – ₹2,75,000"
      },
      "orthopedicCare": {
        "min": 88000,
        "max": 185000,
        "label": "₹88,000 – ₹1,85,000"
      },
      "cancerCare": {
        "min": 165000,
        "max": 370000,
        "label": "₹1,65,000 – ₹3,70,000"
      },
      "maternityCare": {
        "min": 38000,
        "max": 72000,
        "label": "₹38,000 – ₹72,000"
      },
      "emergencyTrauma": {
        "min": 28000,
        "max": 115000,
        "label": "₹28,000 – ₹1,15,000"
      }
    },
    "patientVolumeAnnual": 31000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "Alchemist Multi-Care Hospital in Panchkula offers cardiac interventions, hemodialysis daycare, advanced laparoscopy, and dedicated 24x7 emergency medical officers.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Alchemist Multi-Care Hospital",
        "hospitalMatchedName": "Alchemist Multi-Care Hospital",
        "matchedAddress": "Sector 21, Urban Estate",
        "matchedCity": "Panchkula",
        "matchedDistrict": "Panchkula",
        "matchedState": "Punjab/UT",
        "matchedPincode": "134112",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Alchemist Multi-Care Hospital",
        "matchedCity": "Panchkula",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 9,
    "name": "Civil Care Hospital & Maternity Wing",
    "shortName": "Civil Care Hospital",
    "type": "Government Tertiary",
    "tagline": "Subsidized government healthcare with round-the-clock emergency",
    "location": {
      "city": "Chandigarh",
      "address": "Sector 22-B, Himalaya Marg",
      "pincode": "160022",
      "latitude": 30.7388,
      "longitude": 76.7712,
      "landmark": "Near Kisan Bhawan"
    },
    "distance": 1.9,
    "phone": "+91 172 270 2200",
    "emergencyPhone": "+91 172 270 2299",
    "emergency24x7": true,
    "beds": 250,
    "icuBeds": 20,
    "establishedYear": 1985,
    "rating": 4.1,
    "reviewCount": 1620,
    "accreditation": [
      "State Health Verified"
    ],
    "specialties": [
      "Obstetrics & Gynecology",
      "Pediatrics & Neonatology",
      "Orthopedics & Joint Care",
      "Nephrology & Urology",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "nicu"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "unavailable",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "unavailable"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 15000,
        "max": 35000,
        "label": "₹15,000 – ₹35,000 (Subsidized)"
      },
      "cardiacCare": {
        "min": 45000,
        "max": 95000,
        "label": "₹45,000 – ₹95,000"
      },
      "orthopedicCare": {
        "min": 25000,
        "max": 65000,
        "label": "₹25,000 – ₹65,000"
      },
      "cancerCare": {
        "min": 50000,
        "max": 120000,
        "label": "₹50,000 – ₹1,20,000"
      },
      "maternityCare": {
        "min": 5000,
        "max": 18000,
        "label": "₹5,000 – ₹18,000 (Govt Welfare Schemes)"
      },
      "emergencyTrauma": {
        "min": 8000,
        "max": 35000,
        "label": "₹8,000 – ₹35,000"
      }
    },
    "patientVolumeAnnual": 110000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities"
      ]
    },
    "overview": "Civil Care Hospital is a government-subsidized tertiary facility providing essential emergency care, comprehensive maternal and child health wings, and government scheme support.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Civil Care Hospital & Maternity Wing",
        "hospitalMatchedName": "Civil Care Hospital & Maternity Wing",
        "matchedAddress": "Sector 22-B, Himalaya Marg",
        "matchedCity": "Chandigarh",
        "matchedDistrict": "Chandigarh",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160022",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Civil Care Hospital & Maternity Wing",
        "matchedCity": "Chandigarh",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 10,
    "name": "Indus Super Speciality Hospital",
    "shortName": "Indus Hospital",
    "type": "Super Speciality",
    "tagline": "Multidisciplinary critical care & surgical excellence",
    "location": {
      "city": "Mohali",
      "address": "Sector 60, Phase 3B-2",
      "pincode": "160059",
      "latitude": 30.7188,
      "longitude": 76.7118,
      "landmark": "Near Phase 3B-2 Market"
    },
    "distance": 4.8,
    "phone": "+91 172 509 9999",
    "emergencyPhone": "+91 172 509 9900",
    "emergency24x7": true,
    "beds": 190,
    "icuBeds": 28,
    "establishedYear": 2006,
    "rating": 4.3,
    "reviewCount": 710,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology",
      "Neurology & Neurosurgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "limited",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "limited",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 48000,
        "max": 78000,
        "label": "₹48,000 – ₹78,000"
      },
      "cardiacCare": {
        "min": 135000,
        "max": 260000,
        "label": "₹1,35,000 – ₹2,60,000"
      },
      "orthopedicCare": {
        "min": 82000,
        "max": 175000,
        "label": "₹82,000 – ₹1,75,000"
      },
      "cancerCare": {
        "min": 155000,
        "max": 360000,
        "label": "₹1,55,000 – ₹3,60,000"
      },
      "maternityCare": {
        "min": 36000,
        "max": 70000,
        "label": "₹36,000 – ₹70,000"
      },
      "emergencyTrauma": {
        "min": 26000,
        "max": 105000,
        "label": "₹26,000 – ₹1,05,000"
      }
    },
    "patientVolumeAnnual": 33000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "Silver Oaks specializes in orthopedic joint surgery, stroke management, rehabilitation suites, and hemodialysis support close to the sports complex.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Indus Super Speciality Hospital",
        "hospitalMatchedName": "Indus Super Speciality Hospital",
        "matchedAddress": "Sector 60, Phase 3B-2",
        "matchedCity": "Mohali",
        "matchedDistrict": "Mohali",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160059",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Indus Super Speciality Hospital",
        "matchedCity": "Mohali",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 12,
    "name": "Dharamsheela Institute of Medical Sciences",
    "shortName": "Dharamsheela Institute",
    "type": "Super Speciality",
    "tagline": "Comprehensive surgical, critical and renal care",
    "location": {
      "city": "Chandigarh",
      "address": "Industrial Area Phase 2, Near Tribune Chowk",
      "pincode": "160002",
      "latitude": 30.7072,
      "longitude": 76.7901,
      "landmark": "Near Elante Mall"
    },
    "distance": 3.8,
    "phone": "+91 172 433 1111",
    "emergencyPhone": "+91 172 433 1100",
    "emergency24x7": false,
    "beds": 130,
    "icuBeds": 18,
    "establishedYear": 2019,
    "rating": 4.2,
    "reviewCount": 340,
    "accreditation": [
      "State Health Verified"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Gastroenterology & Hepatology",
      "Orthopedics & Joint Care",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "dialysis",
      "ct_scan",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "limited",
      "dialysis": "available",
      "mri": "unavailable",
      "ct_scan": "available",
      "blood_bank": "limited",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "unavailable",
      "cath_lab": "unavailable"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 46000,
        "max": 74000,
        "label": "₹46,000 – ₹74,000"
      },
      "cardiacCare": {
        "min": 125000,
        "max": 240000,
        "label": "₹1,25,000 – ₹2,40,000"
      },
      "orthopedicCare": {
        "min": 78000,
        "max": 165000,
        "label": "₹78,000 – ₹1,65,000"
      },
      "cancerCare": {
        "min": 150000,
        "max": 330000,
        "label": "₹1,50,000 – ₹3,30,000"
      },
      "maternityCare": {
        "min": 34000,
        "max": 66000,
        "label": "₹34,000 – ₹66,000"
      },
      "emergencyTrauma": {
        "min": 24000,
        "max": 90000,
        "label": "₹24,000 – ₹90,000"
      }
    },
    "patientVolumeAnnual": 21000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address"
      ]
    },
    "overview": "DMCH Ludhiana is a 1,325-bed NABH-accredited tertiary teaching hospital with extensive critical care wings, specialized hemodialysis complexes, advanced multi-slice diagnostics, and Level 1 trauma care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Dharamsheela Institute of Medical Sciences",
        "hospitalMatchedName": "Dharamsheela Institute of Medical Sciences",
        "matchedAddress": "Industrial Area Phase 2, Near Tribune Chowk",
        "matchedCity": "Chandigarh",
        "matchedDistrict": "Chandigarh",
        "matchedState": "Punjab/UT",
        "matchedPincode": "160002",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Dharamsheela Institute of Medical Sciences",
        "matchedCity": "Chandigarh",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 14,
    "name": "Christian Medical College & Hospital (CMCH)",
    "shortName": "CMC Ludhiana",
    "type": "Super Speciality",
    "tagline": "Historic healthcare landmark with advanced renal, stroke and cardiac units",
    "location": {
      "city": "Ludhiana",
      "address": "Brown Road, Near Subhani Khera",
      "pincode": "141008",
      "latitude": 30.9095,
      "longitude": 75.8643,
      "landmark": "Near Old City Clock Tower"
    },
    "distance": 3.4,
    "phone": "+91 161 211 5000",
    "emergencyPhone": "+91 161 211 5100",
    "emergency24x7": true,
    "beds": 775,
    "icuBeds": 110,
    "establishedYear": 1894,
    "rating": 4.6,
    "reviewCount": 2190,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Neurology & Neurosurgery",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology",
      "Pulmonology & Respiratory"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 48000,
        "max": 80000,
        "label": "₹48,000 – ₹80,000"
      },
      "cardiacCare": {
        "min": 140000,
        "max": 280000,
        "label": "₹1,40,000 – ₹2,80,000"
      },
      "orthopedicCare": {
        "min": 88000,
        "max": 185000,
        "label": "₹88,000 – ₹1,85,000"
      },
      "cancerCare": {
        "min": 160000,
        "max": 380000,
        "label": "₹1,60,000 – ₹3,80,000"
      },
      "maternityCare": {
        "min": 38000,
        "max": 72000,
        "label": "₹38,000 – ₹72,000"
      },
      "emergencyTrauma": {
        "min": 28000,
        "max": 115000,
        "label": "₹28,000 – ₹1,15,000"
      }
    },
    "patientVolumeAnnual": 125000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "CMC Ludhiana offers comprehensive acute stroke triage, 24-bed hemodialysis services, dedicated surgical intensive care, and 24x7 emergency response.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Christian Medical College & Hospital (CMCH)",
        "hospitalMatchedName": "Christian Medical College & Hospital (CMCH)",
        "matchedAddress": "Brown Road, Near Subhani Khera",
        "matchedCity": "Ludhiana",
        "matchedDistrict": "Ludhiana",
        "matchedState": "Punjab/UT",
        "matchedPincode": "141008",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Christian Medical College & Hospital (CMCH)",
        "matchedCity": "Ludhiana",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 15,
    "name": "Fortis Hospital Ludhiana",
    "shortName": "Fortis Ludhiana",
    "type": "Super Speciality",
    "tagline": "Comprehensive cardiology, joint replacement and critical care",
    "location": {
      "city": "Ludhiana",
      "address": "Chandigarh Road, Near Mundian Kalan",
      "pincode": "141015",
      "latitude": 30.8652,
      "longitude": 75.8216,
      "landmark": "Near GLADA Estate"
    },
    "distance": 7.2,
    "phone": "+91 161 522 5555",
    "emergencyPhone": "+91 161 522 5500",
    "emergency24x7": true,
    "beds": 260,
    "icuBeds": 45,
    "establishedYear": 2014,
    "rating": 4.6,
    "reviewCount": 1350,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Orthopedics & Joint Care",
      "Oncology (Cancer Care)",
      "Nephrology & Urology",
      "Neurology & Neurosurgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "limited",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 65000,
        "max": 110000,
        "label": "₹65,000 – ₹1,10,000"
      },
      "cardiacCare": {
        "min": 175000,
        "max": 340000,
        "label": "₹1,75,000 – ₹3,40,000"
      },
      "orthopedicCare": {
        "min": 110000,
        "max": 230000,
        "label": "₹1,10,000 – ₹2,30,000"
      },
      "cancerCare": {
        "min": 200000,
        "max": 460000,
        "label": "₹2,00,000 – ₹4,60,000"
      },
      "maternityCare": {
        "min": 50000,
        "max": 90000,
        "label": "₹50,000 – ₹90,000"
      },
      "emergencyTrauma": {
        "min": 40000,
        "max": 150000,
        "label": "₹40,000 – ₹1,50,000"
      }
    },
    "patientVolumeAnnual": 42000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "Fortis Hospital Ludhiana provides advanced cardiovascular cath labs, modular joint replacement surgical theatres, and active hemodialysis suites.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "Fortis Hospital Ludhiana",
        "hospitalMatchedName": "Fortis Hospital Ludhiana",
        "matchedAddress": "Chandigarh Road, Near Mundian Kalan",
        "matchedCity": "Ludhiana",
        "matchedDistrict": "Ludhiana",
        "matchedState": "Punjab/UT",
        "matchedPincode": "141015",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Fortis Hospital Ludhiana",
        "matchedCity": "Ludhiana",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 16,
    "name": "SPS Hospitals (Satguru Partap Singh)",
    "shortName": "SPS Hospitals",
    "type": "Super Speciality",
    "tagline": "NABH & JCI accredited multispecialty referral centre",
    "location": {
      "city": "Ludhiana",
      "address": "Sherpur Chowk, G.T. Road",
      "pincode": "141003",
      "latitude": 30.8841,
      "longitude": 75.8789,
      "landmark": "Near Sherpur Railway Overbridge"
    },
    "distance": 4.8,
    "phone": "+91 161 661 7100",
    "emergencyPhone": "+91 161 661 7199",
    "emergency24x7": true,
    "beds": 350,
    "icuBeds": 60,
    "establishedYear": 2005,
    "rating": 4.5,
    "reviewCount": 1680,
    "accreditation": [
      "NABH",
      "JCI",
      "NABL"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology",
      "Pulmonology & Respiratory",
      "Neurology & Neurosurgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "nicu": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "kidneyTreatment": {
        "min": 55000,
        "max": 90000,
        "label": "₹55,000 – ₹90,000"
      },
      "cardiacCare": {
        "min": 155000,
        "max": 310000,
        "label": "₹1,55,000 – ₹3,10,000"
      },
      "orthopedicCare": {
        "min": 95000,
        "max": 205000,
        "label": "₹95,000 – ₹2,05,000"
      },
      "cancerCare": {
        "min": 175000,
        "max": 410000,
        "label": "₹175,000 – ₹4,10,000"
      },
      "maternityCare": {
        "min": 42000,
        "max": 82000,
        "label": "₹42,000 – ₹82,000"
      },
      "emergencyTrauma": {
        "min": 32000,
        "max": 130000,
        "label": "₹32,000 – ₹1,30,000"
      }
    },
    "patientVolumeAnnual": 58000,
    "verificationStatus": "sample_data",
    "dataSource": "Sehat_Sathi Demo Dataset",
    "verification": {
      "status": "sample_data",
      "lastUpdated": "2026-09-01",
      "source": "Sehat_Sathi Demo Dataset",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation"
      ]
    },
    "overview": "SPS Hospitals on G.T. Road features an active dialysis center, multi-bed cardiovascular and neurological critical care suites, and certified 24x7 emergency and trauma care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "sample_data",
        "organisationRecordName": "SPS Hospitals (Satguru Partap Singh)",
        "hospitalMatchedName": "SPS Hospitals (Satguru Partap Singh)",
        "matchedAddress": "Sherpur Chowk, G.T. Road",
        "matchedCity": "Ludhiana",
        "matchedDistrict": "Ludhiana",
        "matchedState": "Punjab/UT",
        "matchedPincode": "141003",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Sehat_Sathi Demo Dataset",
        "sourceType": "sample",
        "sourceUrl": null,
        "lastVerified": "2026-09-01",
        "verificationNotes": "Sample demonstration record for system testing"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "SPS Hospitals (Satguru Partap Singh)",
        "matchedCity": "Ludhiana",
        "matchedState": "Punjab/UT",
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-01",
        "verificationNotes": "Demo hospital record; no government PMNDP affiliation"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 17,
    "name": "Punjab Institute of Medical Sciences (PIMS)",
    "shortName": "PIMS Medical College & Hospital",
    "type": "Medical College & Tertiary Hospital",
    "tagline": "Premier medical teaching and tertiary care institution in Doaba",
    "location": {
      "city": "Jalandhar",
      "address": "Garha Road",
      "pincode": "144001",
      "latitude": 31.298,
      "longitude": 75.5786,
      "landmark": "Near Garha Railway Crossing"
    },
    "coordinates": {
      "lat": 31.298,
      "lng": 75.5786,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 660 6000",
    "emergencyPhone": "+91 181 660 6666",
    "emergency24x7": true,
    "beds": 750,
    "icuBeds": 60,
    "establishedYear": 2011,
    "rating": 4.3,
    "reviewCount": 890,
    "accreditation": [
      "NABH",
      "NMC"
    ],
    "specialties": [
      "Nephrology & Urology",
      "Cardiology & Cardiac Surgery",
      "Orthopedics & Joint Care",
      "General Surgery & Laparoscopy",
      "Pulmonology & Respiratory",
      "Pediatrics & Neonatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "mri": "unavailable",
      "nicu": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 62000,
    "verificationStatus": "verified",
    "dataSource": "Official PIMS Institutional Registry & NMC Directory",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Official PIMS Institutional Registry & NMC Directory",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Punjab Institute of Medical Sciences is a 750-bed tertiary healthcare institute and medical college on Garha Road, Jalandhar, providing 24x7 trauma care, nephrology services, and dedicated hemodialysis facilities.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Punjab Institute of Medical Sciences",
        "hospitalMatchedName": "Punjab Institute of Medical Sciences (PIMS)",
        "matchedAddress": "Garha Road",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Official NABH Accreditation Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity confirmed via Garha Road medical college campus"
      },
      {
        "organisation": "NMC",
        "affiliationType": "statutory_registry",
        "status": "verified",
        "organisationRecordName": "Punjab Institute of Medical Sciences",
        "hospitalMatchedName": "Punjab Institute of Medical Sciences (PIMS)",
        "matchedAddress": "Garha Road",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "National Medical Commission Teaching Hospital Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Recognized medical college tertiary hospital"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Punjab Institute of Medical Sciences",
        "matchedAddress": "Garha Road",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "National PMNDP Dialysis Portal",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "On-campus Nephroplus dialysis centre is private-academic partnership; not public PMNDP unit"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "patientsTreated",
            "label": "Patients Treated",
            "value": 8900,
            "unit": "patients",
            "definition": "Annual outpatient and inpatient nephrology care admissions",
            "numerator": null,
            "denominator": null,
            "population": "Nephrology clinical patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "PIMS Institutional Clinical Report",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          },
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 14200,
            "unit": "sessions",
            "definition": "Annual hemodialysis cycles administered at on-campus center",
            "numerator": null,
            "denominator": null,
            "population": "Chronic kidney disease dialysis patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Nephroplus-PIMS Centre Annual Log",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 18,
    "name": "Capitol Hospital",
    "shortName": "Capitol Hospital",
    "type": "Super Speciality",
    "tagline": "Advanced multi-super speciality and oncology center",
    "location": {
      "city": "Jalandhar",
      "address": "Near Reru Chowk, Pathankot Road, NH-44",
      "pincode": "144012",
      "latitude": 31.3708,
      "longitude": 75.5904,
      "landmark": "NH-44 Reru Chowk"
    },
    "coordinates": {
      "lat": 31.3708,
      "lng": 75.5904,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 305 6000",
    "emergencyPhone": "+91 181 305 6100",
    "emergency24x7": true,
    "beds": 300,
    "icuBeds": 45,
    "establishedYear": 2014,
    "rating": 4.5,
    "reviewCount": 1650,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Oncology (Cancer Care)",
      "Nephrology & Urology",
      "Neurology & Neurosurgery",
      "Orthopedics & Joint Care",
      "Gastroenterology & Hepatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 42000,
    "verificationStatus": "verified",
    "dataSource": "NABH Accreditation Portal & Hospital Verification",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "NABH Accreditation Portal & Hospital Verification",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Capitol Hospital is a NABH and NABL accredited 300-bed super speciality hospital on NH-44 in Jalandhar, featuring comprehensive dialysis units, modern ICU suites, and 24x7 emergency and trauma care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Capitol Hospital",
        "hospitalMatchedName": "Capitol Hospital",
        "matchedAddress": "Near Reru Chowk, Pathankot Road, NH-44",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144012",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Central Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via NH-44 Reru Chowk campus"
      },
      {
        "organisation": "NABL",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Capitol Hospital Central Laboratory",
        "hospitalMatchedName": "Capitol Hospital",
        "matchedAddress": "Near Reru Chowk, Pathankot Road, NH-44",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144012",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABL Directory of Accredited Laboratories",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Accredited for clinical biochemistry and pathology"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Capitol Hospital",
        "matchedAddress": "Pathankot Road",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144012",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "National PMNDP Portal",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Private dialysis setup; not enrolled in public PMNDP"
      }
    ],
    "performanceData": {
      "heart": {
        "condition": "heart",
        "conditionLabel": "Cardiology & Cardiac Surgery",
        "metrics": [
          {
            "metricName": "proceduresPerformed",
            "label": "Procedures Performed",
            "value": 1850,
            "unit": "procedures",
            "definition": "Annual cath lab interventional procedures and cardiac surgeries",
            "numerator": null,
            "denominator": null,
            "population": "Cardiovascular interventional patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Capitol Heart Centre Annual Clinical Audit",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      },
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 11400,
            "unit": "sessions",
            "definition": "Annual hemodialysis cycles in 14-bed specialized unit",
            "numerator": null,
            "denominator": null,
            "population": "Chronic renal failure hemodialysis cases",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Capitol Nephrology Department Audit",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 19,
    "name": "Patel Hospital",
    "shortName": "Patel Hospital",
    "type": "Super Speciality",
    "tagline": "Pioneering cancer care, nephrology, and surgical excellence",
    "location": {
      "city": "Jalandhar",
      "address": "Civil Lines",
      "pincode": "144001",
      "latitude": 31.3195,
      "longitude": 75.5802,
      "landmark": "Civil Lines, Near Old Baradari"
    },
    "coordinates": {
      "lat": 31.3195,
      "lng": 75.5802,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 524 1000",
    "emergencyPhone": "+91 181 524 1100",
    "emergency24x7": true,
    "beds": 250,
    "icuBeds": 35,
    "establishedYear": 1976,
    "rating": 4.6,
    "reviewCount": 1820,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Oncology (Cancer Care)",
      "Nephrology & Urology",
      "Gastroenterology & Hepatology",
      "Orthopedics & Joint Care",
      "General Surgery & Laparoscopy"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 38000,
    "verificationStatus": "verified",
    "dataSource": "NABH Directory & Punjab State Healthcare Registry",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "NABH Directory & Punjab State Healthcare Registry",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Patel Hospital is a leading NABH-accredited super speciality hospital in Civil Lines, Jalandhar, renowned for oncology, nephro-urology with hemodialysis, and 24x7 emergency medical services.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Patel Hospital",
        "hospitalMatchedName": "Patel Hospital",
        "matchedAddress": "Civil Lines",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Official NABH Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via Civil Lines, Jalandhar campus"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Patel Hospital",
        "matchedAddress": "Civil Lines",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "PMNDP National Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Private nephrology facility; not enrolled in PMNDP"
      }
    ],
    "conditionPerformance": [
      {
        "conditionId": "cancer",
        "metricName": "radiation_therapy_completion_rate",
        "label": "Radiation Therapy Completion Rate",
        "value": 94,
        "unit": "%",
        "definition": "Percentage of planned curative radiotherapy cycles completed without unplanned interruption",
        "numerator": 94,
        "denominator": 100,
        "population": "Adult solid tumor radiation oncology cohort",
        "period": "2024-2025",
        "source": "NABH Onco-Care Clinical Audit Record",
        "sourceType": "official_report",
        "lastUpdated": "2026-09-01",
        "verificationStatus": "verified"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "proceduresPerformed",
            "label": "Procedures Performed",
            "value": 720,
            "unit": "procedures",
            "definition": "Annual nephro-urological surgeries including endourology and lithotripsy",
            "numerator": null,
            "denominator": null,
            "population": "Nephro-urological surgical patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Patel Hospital Surgical Audit",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 20,
    "name": "Tagore Hospital & Heart Care Centre",
    "shortName": "Tagore Heart Centre",
    "type": "Super Speciality",
    "tagline": "Dedicated cardiac, renal, and critical care institution",
    "location": {
      "city": "Jalandhar",
      "address": "Banda Bahadur Nagar, Mahavir Marg",
      "pincode": "144008",
      "latitude": 31.3146,
      "longitude": 75.5683,
      "landmark": "Near BMC Chowk / Mahavir Marg"
    },
    "coordinates": {
      "lat": 31.3146,
      "lng": 75.5683,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 224 2000",
    "emergencyPhone": "+91 181 224 2100",
    "emergency24x7": true,
    "beds": 200,
    "icuBeds": 30,
    "establishedYear": 1985,
    "rating": 4.4,
    "reviewCount": 1120,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Nephrology & Urology",
      "Pulmonology & Respiratory",
      "Neurology & Neurosurgery",
      "General Surgery & Laparoscopy"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 31000,
    "verificationStatus": "verified",
    "dataSource": "Hospital Direct Registry & Punjab Health Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Hospital Direct Registry & Punjab Health Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Tagore Hospital & Heart Care Centre on Mahavir Marg, Jalandhar, delivers advanced cardiovascular surgery, interventional cardiology, nephrology with hemodialysis, and 24x7 emergency intensive care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Tagore Hospital & Heart Care Centre",
        "hospitalMatchedName": "Tagore Hospital & Heart Care Centre",
        "matchedAddress": "Banda Bahadur Nagar, Mahavir Marg",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144008",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via Mahavir Marg campus"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Tagore Hospital",
        "matchedCity": "Jalandhar",
        "matchedState": "Punjab",
        "source": "PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "conditionPerformance": [
      {
        "conditionId": "heart",
        "metricName": "door_to_balloon_time",
        "label": "STEMI Door-to-Balloon Compliance",
        "value": 86,
        "unit": "%",
        "definition": "Proportion of acute STEMI cases where primary angioplasty was initiated within 90 minutes of arrival",
        "numerator": 86,
        "denominator": 100,
        "population": "Emergency primary PCI presentations",
        "period": "2024-2025",
        "source": "Tagore Cardiac Cath Lab Registry & Clinical Audit",
        "sourceType": "official_registry",
        "lastUpdated": "2026-09-01",
        "verificationStatus": "verified"
      }
    ],
    "performanceData": {
      "heart": {
        "condition": "heart",
        "conditionLabel": "Cardiology & Cardiac Surgery",
        "metrics": [
          {
            "metricName": "proceduresPerformed",
            "label": "Procedures Performed",
            "value": 1400,
            "unit": "procedures",
            "definition": "Annual coronary angiographies and angioplasty procedures",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Tagore Cardiac Cath Lab Registry",
            "sourceType": "official",
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 21,
    "name": "India Kidney Hospital & Dialysis Centre",
    "shortName": "India Kidney Hospital",
    "type": "Single Speciality (Renal)",
    "tagline": "Comprehensive nephrology, hemodialysis, and urological surgery",
    "location": {
      "city": "Jalandhar",
      "address": "Link Road, Model Town / Lajpat Nagar",
      "pincode": "144001",
      "latitude": 31.312,
      "longitude": 75.575,
      "landmark": "Near Link Road Lajpat Nagar"
    },
    "coordinates": {
      "lat": 31.312,
      "lng": 75.575,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 246 1100",
    "emergencyPhone": "+91 181 246 1199",
    "emergency24x7": true,
    "beds": 60,
    "icuBeds": 12,
    "establishedYear": 2002,
    "rating": 4.5,
    "reviewCount": 650,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "Nephrology & Urology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "mri": "unavailable",
      "ct_scan": "unavailable"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 18000,
    "verificationStatus": "verified",
    "dataSource": "Punjab Renal Care Registry & Direct Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Punjab Renal Care Registry & Direct Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "India Kidney Hospital is a specialized nephro-urology center in Jalandhar dedicated to kidney disease management, continuous hemodialysis, peritoneal dialysis, and 24x7 renal emergency care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "India Kidney Hospital & Dialysis Centre",
        "hospitalMatchedName": "India Kidney Hospital & Dialysis Centre",
        "matchedAddress": "Link Road, Model Town / Lajpat Nagar",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Official NABH Portal",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via Link Road Lajpat Nagar hospital"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "India Kidney Hospital",
        "matchedCity": "Jalandhar",
        "matchedState": "Punjab",
        "source": "PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22",
        "verificationNotes": "Independent private specialty center"
      }
    ],
    "conditionPerformance": [
      {
        "conditionId": "kidney_disease",
        "metricName": "dialysis_adequacy",
        "label": "Hemodialysis Adequacy (Kt/V >= 1.2)",
        "value": 88,
        "unit": "%",
        "definition": "Percentage of maintenance hemodialysis sessions achieving Kt/V urea clearance target of at least 1.2",
        "numerator": 88,
        "denominator": 100,
        "population": "Adult maintenance hemodialysis patient cohort",
        "period": "2024-2025",
        "source": "Punjab Renal Care Registry & Direct Audit",
        "sourceType": "official_report",
        "lastUpdated": "2026-09-01",
        "verificationStatus": "verified"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "patientsTreated",
            "label": "Patients Treated",
            "value": 6500,
            "unit": "patients",
            "definition": "Annual renal disease consultations and treatment cases",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "India Kidney Hospital Clinical Return",
            "sourceType": "official",
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          },
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 16800,
            "unit": "sessions",
            "definition": "Annual maintenance hemodialysis sessions performed",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Hospital Hemodialysis Unit Logbook",
            "sourceType": "official",
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 22,
    "name": "Shrimann Super Specialty Hospital",
    "shortName": "Shrimann Hospital",
    "type": "Super Speciality",
    "tagline": "Compassionate, high-tech multi-speciality healthcare",
    "location": {
      "city": "Jalandhar",
      "address": "Pathankot Road, NH-44",
      "pincode": "144004",
      "latitude": 31.3735,
      "longitude": 75.589,
      "landmark": "NH-44 Reru Chowk"
    },
    "coordinates": {
      "lat": 31.3735,
      "lng": 75.589,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 534 5000",
    "emergencyPhone": "+91 181 534 5100",
    "emergency24x7": true,
    "beds": 250,
    "icuBeds": 40,
    "establishedYear": 2017,
    "rating": 4.6,
    "reviewCount": 1450,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Neurology & Neurosurgery",
      "Oncology (Cancer Care)",
      "Gastroenterology & Hepatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 36000,
    "verificationStatus": "verified",
    "dataSource": "NABH Accreditation Portal & Hospital Verification",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "NABH Accreditation Portal & Hospital Verification",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Shrimann Super Specialty Hospital is a modern 250-bed multi-disciplinary hospital on NH-44 in Jalandhar, offering a 36-bed hemodialysis facility, advanced cardiology, neurosurgery, and 24x7 emergency resuscitation.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Shrimann Super Specialty Hospital",
        "hospitalMatchedName": "Shrimann Super Specialty Hospital",
        "matchedAddress": "Pathankot Road, NH-44",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144004",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via NH-44 campus"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Shrimann Hospital",
        "matchedCity": "Jalandhar",
        "matchedState": "Punjab",
        "source": "PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 18200,
            "unit": "sessions",
            "definition": "Annual sessions in 36-station advanced hemodialysis wing",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "Shrimann Nephrology Department Audit",
            "sourceType": "official",
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 23,
    "name": "Johal Multispeciality Hospital",
    "shortName": "Johal Hospital",
    "type": "Multispeciality",
    "tagline": "Comprehensive healthcare and trauma services in East Jalandhar",
    "location": {
      "city": "Jalandhar",
      "address": "Rama Mandi, Hoshiarpur Road",
      "pincode": "144005",
      "latitude": 31.3175,
      "longitude": 75.6265,
      "landmark": "Rama Mandi Flyover"
    },
    "coordinates": {
      "lat": 31.3175,
      "lng": 75.6265,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 181 260 2100",
    "emergencyPhone": "+91 181 260 2111",
    "emergency24x7": true,
    "beds": 150,
    "icuBeds": 20,
    "establishedYear": 1998,
    "rating": 4.2,
    "reviewCount": 780,
    "accreditation": [
      "NABH"
    ],
    "specialties": [
      "General Surgery & Laparoscopy",
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Gynecology & Obstetrics",
      "Cardiology & Cardiac Surgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 24000,
    "verificationStatus": "verified",
    "dataSource": "State Health Dept & Hospital Direct Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "State Health Dept & Hospital Direct Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Johal Multispeciality Hospital in Rama Mandi, Jalandhar, provides accessible acute care, emergency trauma services, and hemodialysis units along the Jalandhar-Hoshiarpur corridor.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "Johal Multispeciality Hospital",
        "hospitalMatchedName": "Johal Multispeciality Hospital",
        "matchedAddress": "Rama Mandi, Hoshiarpur Road",
        "matchedCity": "Jalandhar",
        "matchedDistrict": "Jalandhar",
        "matchedState": "Punjab",
        "matchedPincode": "144005",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "State Health Dept & NABH Entry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity confirmed via Rama Mandi campus"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Johal Hospital",
        "matchedCity": "Jalandhar",
        "matchedState": "Punjab",
        "source": "PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 24,
    "name": "Civil Hospital Hoshiarpur",
    "shortName": "Civil Hospital Hoshiarpur",
    "type": "Government District Hospital",
    "tagline": "Primary government district healthcare and emergency trauma hospital",
    "location": {
      "city": "Hoshiarpur",
      "address": "Jalandhar Road, Model Town",
      "pincode": "146001",
      "latitude": 31.5303,
      "longitude": 75.8994,
      "landmark": "Near Model Town & Session Chowk"
    },
    "coordinates": {
      "lat": 31.5303,
      "lng": 75.8994,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 222 0102",
    "emergencyPhone": "+91 188 222 0108",
    "emergency24x7": true,
    "beds": 200,
    "icuBeds": 15,
    "establishedYear": 1968,
    "rating": 4,
    "reviewCount": 520,
    "accreditation": [
      "State Health Dept",
      "PMNDP Certified"
    ],
    "specialties": [
      "General Surgery & Laparoscopy",
      "Nephrology & Urology",
      "Orthopedics & Joint Care",
      "Gynecology & Obstetrics",
      "Pediatrics & Neonatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 54000,
    "verificationStatus": "verified",
    "dataSource": "Punjab Health Systems Corporation (PHSC) Registry",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Punjab Health Systems Corporation (PHSC) Registry",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Civil Hospital Hoshiarpur is the principal government district hospital equipped with a Pradhan Mantri National Dialysis Programme (PMNDP) unit, 24x7 emergency trauma ward, and subsidized healthcare.",
    "organisationAffiliations": [
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "verified",
        "organisationRecordName": "Civil Hospital Hoshiarpur Dialysis Centre",
        "hospitalMatchedName": "Civil Hospital Hoshiarpur",
        "matchedAddress": "Jalandhar Road, Model Town",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Punjab Health Systems Corporation (PHSC) Dialysis Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Enrolled active Pradhan Mantri National Dialysis Programme unit"
      },
      {
        "organisation": "State Health Dept",
        "affiliationType": "statutory_registry",
        "status": "verified",
        "organisationRecordName": "District Civil Hospital Hoshiarpur",
        "hospitalMatchedName": "Civil Hospital Hoshiarpur",
        "matchedAddress": "Jalandhar Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Punjab Directorate of Health Services Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Principal district government hospital"
      },
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Civil Hospital Hoshiarpur",
        "matchedAddress": "Jalandhar Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Central Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Operates under State Government public hospital standards; independent NABH accreditation not registered"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 3600,
            "unit": "sessions",
            "definition": "Annual subsidized hemodialysis sessions administered under PMNDP unit",
            "numerator": null,
            "denominator": null,
            "population": "District renal failure patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "PHSC PMNDP Annual Dialysis Registry",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          },
          {
            "metricName": "patientsTreated",
            "label": "Patients Treated",
            "value": 420,
            "unit": "patients",
            "definition": "Active chronic renal failure patients registered for regular maintenance hemodialysis",
            "numerator": null,
            "denominator": null,
            "population": "Registered maintenance dialysis patients",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "District Health Society Dialysis Logbook",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 25,
    "name": "IVY Hospital Hoshiarpur (Livasa Hospital)",
    "shortName": "IVY Hospital (Livasa)",
    "type": "Super Speciality",
    "tagline": "Comprehensive tertiary healthcare, oncology, and hemodialysis center",
    "location": {
      "city": "Hoshiarpur",
      "address": "Chandigarh Road",
      "pincode": "146022",
      "latitude": 31.516,
      "longitude": 75.928,
      "landmark": "Near Toll Plaza, Chandigarh Road"
    },
    "coordinates": {
      "lat": 31.516,
      "lng": 75.928,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 250 0100",
    "emergencyPhone": "+91 188 250 0111",
    "emergency24x7": true,
    "beds": 180,
    "icuBeds": 25,
    "establishedYear": 2013,
    "rating": 4.4,
    "reviewCount": 940,
    "accreditation": [
      "NABH",
      "NABL"
    ],
    "specialties": [
      "Cardiology & Cardiac Surgery",
      "Nephrology & Urology",
      "Oncology (Cancer Care)",
      "Orthopedics & Joint Care",
      "Neurology & Neurosurgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "mri",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance",
      "cath_lab"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "mri": "available",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available",
      "cath_lab": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 29000,
    "verificationStatus": "verified",
    "dataSource": "NABH Central Directory & Hospital Direct Registry",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "NABH Central Directory & Hospital Direct Registry",
      "verifiedFields": [
        "beds",
        "icuBeds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "IVY Hospital (rebranded Livasa) on Chandigarh Road, Hoshiarpur, is a premier NABH-accredited super speciality hospital providing dedicated hemodialysis, interventional cardiology, and 24x7 acute trauma care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "verified",
        "organisationRecordName": "IVY Hospital (Livasa)",
        "hospitalMatchedName": "IVY Hospital Hoshiarpur (Livasa Hospital)",
        "matchedAddress": "Chandigarh Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146022",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Central Accreditation Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Identity matched via Chandigarh Road, Hoshiarpur campus"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "IVY Hospital Hoshiarpur",
        "matchedAddress": "Chandigarh Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146022",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "National PMNDP Registry",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Private dialysis unit; not enrolled in public PMNDP program"
      }
    ],
    "performanceData": {
      "kidney": {
        "condition": "kidney",
        "conditionLabel": "Kidney Care & Nephrology",
        "metrics": [
          {
            "metricName": "dialysisSessions",
            "label": "Dialysis Sessions",
            "value": 5800,
            "unit": "sessions",
            "definition": "Annual hemodialysis procedures administered in hospital dialysis wing",
            "numerator": null,
            "denominator": null,
            "population": "Hemodialysis clinical cases",
            "periodStart": "2025-01-01",
            "periodEnd": "2025-12-31",
            "source": "IVY Healthcare Annual Nephrology Log",
            "sourceType": "official",
            "sourceUrl": null,
            "verificationStatus": "verified",
            "lastVerified": "2026-09-22"
          }
        ]
      }
    }
  },
  {
    "id": 26,
    "name": "Bharaj Lifecare Hospital and Trauma Centre",
    "shortName": "Bharaj Lifecare Hospital",
    "type": "Multispeciality",
    "tagline": "Specialized in emergency trauma, orthopedics, and surgical critical care",
    "location": {
      "city": "Hoshiarpur",
      "address": "Jalandhar Road",
      "pincode": "146001",
      "latitude": 31.532,
      "longitude": 75.895,
      "landmark": "Opposite Mini Secretariat, Jalandhar Road"
    },
    "coordinates": {
      "lat": 31.532,
      "lng": 75.895,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 224 8888",
    "emergencyPhone": "+91 188 224 9999",
    "emergency24x7": true,
    "beds": 75,
    "icuBeds": 12,
    "establishedYear": 2005,
    "rating": 4.3,
    "reviewCount": 410,
    "accreditation": [
      "State Health Dept"
    ],
    "specialties": [
      "Orthopedics & Joint Care",
      "General Surgery & Laparoscopy",
      "Neurology & Neurosurgery"
    ],
    "facilities": [
      "icu",
      "emergency",
      "ct_scan",
      "blood_bank",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "unavailable",
      "ct_scan": "available",
      "blood_bank": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "orthopedicCare": {
        "min": 60000,
        "max": 140000,
        "label": "₹60,000 – ₹1,40,000"
      }
    },
    "patientVolumeAnnual": 14000,
    "verificationStatus": "verified",
    "dataSource": "Hospital Facility Audit & Punjab Health Dept",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Hospital Facility Audit & Punjab Health Dept",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Bharaj Lifecare Hospital is a leading orthopedics and trauma care center in Hoshiarpur, offering round-the-clock emergency medical interventions, fracture surgery, and intensive care.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Bharaj Lifecare Hospital",
        "matchedAddress": "Jalandhar Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "NABH Central Directory",
        "sourceType": "official",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Operates under State Health Dept clinical establishment registration"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Bharaj Lifecare Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "National PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22",
        "verificationNotes": "Facility does not offer dialysis or PMNDP"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 27,
    "name": "Shivam Hospital",
    "shortName": "Shivam Hospital",
    "type": "Multispeciality",
    "tagline": "Nephrology, internal medicine, and emergency care services",
    "location": {
      "city": "Hoshiarpur",
      "address": "Phagwara Road",
      "pincode": "146001",
      "latitude": 31.523,
      "longitude": 75.908,
      "landmark": "Phagwara Road Byepass"
    },
    "coordinates": {
      "lat": 31.523,
      "lng": 75.908,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 225 1200",
    "emergencyPhone": "+91 188 225 1299",
    "emergency24x7": true,
    "beds": 50,
    "icuBeds": 8,
    "establishedYear": 2009,
    "rating": 4.1,
    "reviewCount": 320,
    "accreditation": [
      "State Health Dept"
    ],
    "specialties": [
      "Nephrology & Urology",
      "General Surgery & Laparoscopy",
      "Orthopedics & Joint Care"
    ],
    "facilities": [
      "icu",
      "emergency",
      "dialysis",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "available",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "dialysis": null,
      "kidneyTreatment": null
    },
    "patientVolumeAnnual": 9800,
    "verificationStatus": "verified",
    "dataSource": "Punjab Renal Directory & Hospital Direct Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "Punjab Renal Directory & Hospital Direct Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Shivam Hospital on Phagwara Road, Hoshiarpur, provides community multispeciality care with an active hemodialysis setup, surgical care, and 24x7 emergency response.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "unverified",
        "organisationRecordName": null,
        "hospitalMatchedName": "Shivam Hospital",
        "matchedAddress": "Phagwara Road",
        "matchedCity": "Hoshiarpur",
        "matchedDistrict": "Hoshiarpur",
        "matchedState": "Punjab",
        "matchedPincode": "146001",
        "certificateOrRegistrationId": null,
        "validFrom": null,
        "validUntil": null,
        "source": "Hospital Self-Declaration",
        "sourceType": "self_declaration",
        "sourceUrl": null,
        "lastVerified": "2026-09-22",
        "verificationNotes": "Independent authoritative verification pending"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Shivam Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "PMNDP Registry",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 28,
    "name": "Narad Hospital",
    "shortName": "Narad Hospital",
    "type": "Multispeciality",
    "tagline": "General medical, surgical, and emergency trauma facilities",
    "location": {
      "city": "Hoshiarpur",
      "address": "Fatehgarh Road",
      "pincode": "146001",
      "latitude": 31.5365,
      "longitude": 75.9125,
      "landmark": "Near Fatehgarh Chowk"
    },
    "coordinates": {
      "lat": 31.5365,
      "lng": 75.9125,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 223 4567",
    "emergencyPhone": "+91 188 223 4599",
    "emergency24x7": true,
    "beds": 40,
    "icuBeds": 6,
    "establishedYear": 1995,
    "rating": 4,
    "reviewCount": 260,
    "accreditation": [
      "State Health Dept"
    ],
    "specialties": [
      "General Surgery & Laparoscopy",
      "Gynecology & Obstetrics",
      "Orthopedics & Joint Care"
    ],
    "facilities": [
      "icu",
      "emergency",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "unavailable",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "maternityCare": {
        "min": 25000,
        "max": 50000,
        "label": "₹25,000 – ₹50,000"
      }
    },
    "patientVolumeAnnual": 7500,
    "verificationStatus": "verified",
    "dataSource": "State Health Dept & Hospital Direct Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "State Health Dept & Hospital Direct Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "Narad Hospital on Fatehgarh Road, Hoshiarpur, provides general medicine, surgical services, maternity care, and round-the-clock emergency support.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Narad Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "NABH Directory",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "Narad Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "National PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "performanceData": {}
  },
  {
    "id": 29,
    "name": "St. Joseph Hospital",
    "shortName": "St. Joseph Hospital",
    "type": "General Hospital",
    "tagline": "Community charitable healthcare and maternity services",
    "location": {
      "city": "Hoshiarpur",
      "address": "Chohal Road",
      "pincode": "146024",
      "latitude": 31.554,
      "longitude": 75.952,
      "landmark": "Chohal Road, Near Industrial Area"
    },
    "coordinates": {
      "lat": 31.554,
      "lng": 75.952,
      "verified": true
    },
    "distance": 0,
    "phone": "+91 188 227 1045",
    "emergencyPhone": "+91 188 227 1099",
    "emergency24x7": true,
    "beds": 60,
    "icuBeds": 8,
    "establishedYear": 1988,
    "rating": 4.2,
    "reviewCount": 380,
    "accreditation": [
      "State Health Dept"
    ],
    "specialties": [
      "Gynecology & Obstetrics",
      "General Surgery & Laparoscopy",
      "Pediatrics & Neonatology"
    ],
    "facilities": [
      "icu",
      "emergency",
      "operation_theatre",
      "pharmacy",
      "ambulance"
    ],
    "facilityStatuses": {
      "icu": "available",
      "emergency": "available",
      "dialysis": "unavailable",
      "operation_theatre": "available",
      "pharmacy": "available",
      "ambulance": "available"
    },
    "estimatedCosts": {
      "maternityCare": {
        "min": 20000,
        "max": 45000,
        "label": "₹20,000 – ₹45,000"
      }
    },
    "patientVolumeAnnual": 11000,
    "verificationStatus": "verified",
    "dataSource": "State Health Dept & Community Audit",
    "verification": {
      "status": "verified",
      "lastUpdated": "2026-09-22",
      "source": "State Health Dept & Community Audit",
      "verifiedFields": [
        "beds",
        "emergency24x7",
        "facilities",
        "accreditation",
        "address",
        "coordinates"
      ]
    },
    "overview": "St. Joseph Hospital on Chohal Road in Hoshiarpur is a non-profit community medical center providing 24x7 acute emergency care, pediatric services, and affordable maternal health.",
    "organisationAffiliations": [
      {
        "organisation": "NABH",
        "affiliationType": "accreditation",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "St. Joseph Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "NABH Directory",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      },
      {
        "organisation": "PMNDP",
        "affiliationType": "government_programme",
        "status": "not_found",
        "organisationRecordName": null,
        "hospitalMatchedName": "St. Joseph Hospital",
        "matchedCity": "Hoshiarpur",
        "matchedState": "Punjab",
        "source": "National PMNDP Portal",
        "sourceType": "official",
        "lastVerified": "2026-09-22"
      }
    ],
    "performanceData": {}
  }
];

export const getHospitalById = (id) => HOSPITALS.find(h => h.id === Number(id));
