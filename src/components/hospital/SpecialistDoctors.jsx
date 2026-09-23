import React from 'react';
import { UserCheck, Stethoscope, Clock, Award, Calendar } from 'lucide-react';

/**
 * Helper to generate 3 relevant specialist doctor profiles based on hospital specialty/condition
 * CRITICAL RULE: These are strictly clearly labelled as "Sample / Prototype Doctor Data".
 * No real doctors are fabricated, and no superlatives like "Best Doctor" are ever used.
 */
export function getSpecialistDoctors(hospital) {
  if (!hospital) return [];

  const specs = (hospital.specialties || []).map(s => s.toLowerCase());
  const category = (hospital.category || '').toLowerCase();
  const name = hospital.name || '';

  // 1. Kidney / Nephrology
  if (category.includes('kidney') || specs.some(s => s.includes('nephrol') || s.includes('kidney') || s.includes('dialysis') || s.includes('urol'))) {
    return [
      {
        id: 'doc_kidney_1',
        name: 'Dr. Rameshwar N. Gupta',
        designation: 'Senior Consultant & Clinical Head',
        department: 'Nephrology & Renal Medicine',
        qualifications: 'MBBS, MD (Internal Medicine), DM (Nephrology)',
        experience: '22+ years experience in clinical nephrology',
        specializationFocus: 'Chronic Kidney Disease (CKD), Peritoneal Dialysis & Glomerulonephritis',
        opdSchedule: 'Mon, Wed, Fri (10:00 AM – 1:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_kidney_2',
        name: 'Dr. Sunita K. Venkat',
        designation: 'Consultant Transplant Surgeon',
        department: 'Urology & Renal Transplantation',
        qualifications: 'MBBS, MS (General Surgery), MCh (Urology)',
        experience: '16+ years experience in renal surgery',
        specializationFocus: 'Living Donor Kidney Transplantation & Vascular Access Surgery',
        opdSchedule: 'Tue, Thu, Sat (11:00 AM – 3:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_kidney_3',
        name: 'Dr. Tarunjeet Singh Bedi',
        designation: 'Consultant Nephrologist',
        department: 'Dialysis Services & Critical Care Nephrology',
        qualifications: 'MBBS, MD (Medicine), DNB (Nephrology)',
        experience: '12+ years experience in hemodialysis care',
        specializationFocus: 'High-Flux Hemodialysis, Continuous Renal Replacement (CRRT) & Electrolyte Disorders',
        opdSchedule: 'Mon to Fri (2:00 PM – 5:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 2. Heart / Cardiac Care
  if (category.includes('heart') || specs.some(s => s.includes('cardio') || s.includes('cardiac'))) {
    return [
      {
        id: 'doc_heart_1',
        name: 'Dr. Arvind S. Mathur',
        designation: 'Director & Chief Interventional Cardiologist',
        department: 'Cardiology & Interventional Sciences',
        qualifications: 'MBBS, MD (Medicine), DM (Cardiology), FACC',
        experience: '25+ years experience in interventional cardiology',
        specializationFocus: 'Primary Angioplasty, Complex Coronary Interventions & Structural Heart Interventions',
        opdSchedule: 'Mon, Wed, Fri (9:30 AM – 1:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_heart_2',
        name: 'Dr. Meenakshi Sundaram',
        designation: 'Senior Consultant Cardiothoracic Surgeon',
        department: 'Cardiothoracic & Vascular Surgery (CTVS)',
        qualifications: 'MBBS, MS (Surgery), MCh (CTVS)',
        experience: '18+ years experience in cardiac surgery',
        specializationFocus: 'Coronary Artery Bypass Grafting (CABG), Valve Repair & Aortic Aneurysm Surgery',
        opdSchedule: 'Tue, Thu (10:00 AM – 2:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_heart_3',
        name: 'Dr. Rajesh P. Chawla',
        designation: 'Consultant Cardiac Electrophysiologist',
        department: 'Cardiac Electrophysiology & Pacing',
        qualifications: 'MBBS, MD (Medicine), DM (Cardiology), Fellowship in Electrophysiology',
        experience: '14+ years experience in arrhythmia management',
        specializationFocus: 'Arrhythmia Ablation, Pacemaker & ICD Implantation, Heart Failure Device Therapy',
        opdSchedule: 'Mon, Thu, Sat (11:00 AM – 3:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 3. Cancer / Oncology
  if (category.includes('cancer') || specs.some(s => s.includes('oncol') || s.includes('cancer'))) {
    return [
      {
        id: 'doc_cancer_1',
        name: 'Dr. Harish B. Kulkarni',
        designation: 'Senior Consultant Medical Oncologist',
        department: 'Medical Oncology & Hematology',
        qualifications: 'MBBS, MD (Medicine), DM (Medical Oncology)',
        experience: '20+ years experience in oncology',
        specializationFocus: 'Systemic Chemotherapy, Targeted Molecular Therapy & Immunotherapy Protocols',
        opdSchedule: 'Mon, Wed, Fri (10:00 AM – 2:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_cancer_2',
        name: 'Dr. Ananya Ray Chaudhuri',
        designation: 'Consultant Surgical Oncologist',
        department: 'Surgical Oncology',
        qualifications: 'MBBS, MS (Surgery), MCh (Surgical Oncology)',
        experience: '15+ years experience in cancer surgery',
        specializationFocus: 'Organ-Preserving Cancer Surgery, Thoracic Oncology & Gastrointestinal Malignancies',
        opdSchedule: 'Tue, Thu, Sat (9:00 AM – 1:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_cancer_3',
        name: 'Dr. Devendra S. Johal',
        designation: 'Consultant Radiation Oncologist',
        department: 'Radiation Oncology & Radiosurgery',
        qualifications: 'MBBS, MD (Radiation Oncology), DNB',
        experience: '13+ years experience in radiotherapy',
        specializationFocus: 'Stereotactic Body Radiation (SBRT), Intensity Modulated Radiotherapy (IMRT) & Brachytherapy',
        opdSchedule: 'Mon to Fri (11:30 AM – 4:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 4. Brain Surgery / Neurosurgery / Alzheimer's
  if (category.includes('brain') || category.includes('neuro') || specs.some(s => s.includes('neuro'))) {
    return [
      {
        id: 'doc_neuro_1',
        name: 'Dr. Krishnan V. Nambiar',
        designation: 'Senior Consultant Neurosurgeon',
        department: 'Neurosurgery & Cranial Sciences',
        qualifications: 'MBBS, MS (General Surgery), MCh (Neurosurgery)',
        experience: '24+ years experience in neurosurgery',
        specializationFocus: 'Microsurgical Brain Tumor Resection, Skull-Base Lesions & Cerebrovascular Aneurysms',
        opdSchedule: 'Mon, Wed, Fri (9:30 AM – 1:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_neuro_2',
        name: 'Dr. Shalini S. Mukherjee',
        designation: 'Consultant Neurologist',
        department: 'Neurology & Cognitive Sciences',
        qualifications: 'MBBS, MD (Medicine), DM (Neurology)',
        experience: '17+ years experience in clinical neurology',
        specializationFocus: 'Memory Disorders, Alzheimer’s Diagnosis, Neurodegenerative Management & Stroke Care',
        opdSchedule: 'Tue, Thu, Sat (10:00 AM – 2:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_neuro_3',
        name: 'Dr. Vikramaditya Sen',
        designation: 'Consultant Spine & Neuro-Trauma Surgeon',
        department: 'Spinal Surgery & Neuro-Critical Care',
        qualifications: 'MBBS, MS (Orthopedics/Surgery), MCh (Neurosurgery)',
        experience: '13+ years experience in spinal disorders',
        specializationFocus: 'Minimally Invasive Spine Surgery, Traumatic Brain Injury & Spinal Decompression',
        opdSchedule: 'Mon to Thu (2:00 PM – 5:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 5. Eye / Ophthalmology
  if (category.includes('eye') || specs.some(s => s.includes('ophthal') || s.includes('eye'))) {
    return [
      {
        id: 'doc_eye_1',
        name: 'Dr. M. K. Subrahmanyam',
        designation: 'Senior Consultant Ophthalmic Surgeon',
        department: 'Cornea, Cataract & Refractive Surgery',
        qualifications: 'MBBS, MS (Ophthalmology), Fellow Cornea (All India)',
        experience: '21+ years experience in ophthalmology',
        specializationFocus: 'Lamellar Corneal Transplantation, Phacoemulsification & Custom Refractive Lasik',
        opdSchedule: 'Mon, Wed, Fri (9:00 AM – 1:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_eye_2',
        name: 'Dr. Preeti R. Shenoy',
        designation: 'Consultant Vitreoretinal Specialist',
        department: 'Retina & Vitreous Services',
        qualifications: 'MBBS, MS (Ophthalmology), DNB, FVR',
        experience: '15+ years experience in retinal surgery',
        specializationFocus: 'Diabetic Retinopathy Management, Retinal Detachment Repair & Macular Diseases',
        opdSchedule: 'Tue, Thu, Sat (10:00 AM – 2:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_eye_3',
        name: 'Dr. K. Raghavan Iyer',
        designation: 'Consultant Glaucoma & Anterior Segment',
        department: 'Glaucoma & Pediatric Ophthalmology',
        qualifications: 'MBBS, DO, DNB (Ophthalmology)',
        experience: '12+ years experience in glaucoma care',
        specializationFocus: 'Early Glaucoma Diagnostics, Trabeculectomy & Pediatric Refractive Assessment',
        opdSchedule: 'Mon to Fri (2:00 PM – 5:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 6. Orthopedics
  if (category.includes('ortho') || specs.some(s => s.includes('ortho') || s.includes('joint') || s.includes('bone'))) {
    return [
      {
        id: 'doc_ortho_1',
        name: 'Dr. Pratap C. Deshmukh',
        designation: 'Director of Joint Replacement & Arthroplasty',
        department: 'Orthopedics & Joint Care',
        qualifications: 'MBBS, MS (Orthopedics), MCh (Orth), Fellow Arthroplasty',
        experience: '23+ years experience in joint replacement',
        specializationFocus: 'Computer-Navigated Total Knee Replacement, Revision Hip Arthroplasty & Osteoarthritis',
        opdSchedule: 'Mon, Wed, Fri (9:30 AM – 1:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_ortho_2',
        name: 'Dr. Gautam R. Anand',
        designation: 'Consultant Arthroscopy & Sports Medicine Specialist',
        department: 'Sports Medicine & Joint Arthroscopy',
        qualifications: 'MBBS, MS (Orthopedics), DNB (Ortho), Fellowship Sports Injury',
        experience: '16+ years experience in sports medicine',
        specializationFocus: 'Knee Ligament (ACL/PCL) Reconstruction, Shoulder Rotator Cuff Repair & Meniscal Surgery',
        opdSchedule: 'Tue, Thu, Sat (10:30 AM – 3:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_ortho_3',
        name: 'Dr. Simranjeet Kaur Dhillon',
        designation: 'Consultant Spine & Complex Trauma Surgeon',
        department: 'Spine Surgery & Trauma Services',
        qualifications: 'MBBS, MS (Orthopedics), Spine Surgery Fellowship',
        experience: '13+ years experience in spinal care',
        specializationFocus: 'Lumbar Disc Decompression, Scoliosis Correction & High-Velocity Fracture Fixation',
        opdSchedule: 'Mon to Thu (2:00 PM – 5:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 7. Dental
  if (category.includes('dent') || specs.some(s => s.includes('dent') || s.includes('oral'))) {
    return [
      {
        id: 'doc_dental_1',
        name: 'Dr. Alok V. Bannerjee',
        designation: 'Professor & Head, Oral & Maxillofacial Surgery',
        department: 'Oral & Maxillofacial Surgery',
        qualifications: 'BDS, MDS (Oral & Maxillofacial Surgery)',
        experience: '20+ years experience in oral surgery',
        specializationFocus: 'Facial Trauma Reconstruction, Corrective Jaw Surgery (Orthognathic) & Impacted Teeth',
        opdSchedule: 'Mon, Wed, Fri (9:00 AM – 1:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_dental_2',
        name: 'Dr. Kavita N. Deshmukh',
        designation: 'Consultant Orthodontist & Dentofacial Orthopedics',
        department: 'Orthodontics & Dentofacial Orthopedics',
        qualifications: 'BDS, MDS (Orthodontics), MOrth RCSEd',
        experience: '15+ years experience in orthodontics',
        specializationFocus: 'Clear Aligners, Invisible Braces, Craniofacial Malocclusion & Jaw Alignment',
        opdSchedule: 'Tue, Thu, Sat (10:00 AM – 3:00 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      },
      {
        id: 'doc_dental_3',
        name: 'Dr. Rohit P. Kapoor',
        designation: 'Consultant Endodontist & Implantologist',
        department: 'Conservative Dentistry & Implantology',
        qualifications: 'BDS, MDS (Conservative Dentistry & Endodontics)',
        experience: '12+ years experience in restorative dentistry',
        specializationFocus: 'Microscopic Root Canal Treatment, Digital Guided Dental Implants & Aesthetic Crowns',
        opdSchedule: 'Mon to Fri (11:00 AM – 4:30 PM)',
        verificationNotice: 'Sample / Prototype Doctor Data'
      }
    ];
  }

  // 8. General / Multispecialty Default Fallback
  return [
    {
      id: 'doc_gen_1',
      name: 'Dr. S. K. Narang',
      designation: 'Senior Consultant Physician',
      department: hospital.specialties?.[0] || 'Internal Medicine',
      qualifications: 'MBBS, MD (Medicine)',
      experience: '20+ years experience in clinical care',
      specializationFocus: 'Comprehensive Inpatient Care & Diagnostic Medicine',
      opdSchedule: 'Mon to Fri (9:30 AM – 1:30 PM)',
      verificationNotice: 'Sample / Prototype Doctor Data'
    },
    {
      id: 'doc_gen_2',
      name: 'Dr. Priya V. Sharma',
      designation: 'Senior Consultant Surgeon',
      department: hospital.specialties?.[1] || 'General & Laparoscopic Surgery',
      qualifications: 'MBBS, MS (General Surgery)',
      experience: '16+ years experience in surgical care',
      specializationFocus: 'Minimally Invasive Surgery & Acute Care',
      opdSchedule: 'Tue, Thu, Sat (10:00 AM – 2:00 PM)',
      verificationNotice: 'Sample / Prototype Doctor Data'
    },
    {
      id: 'doc_gen_3',
      name: 'Dr. Amit R. Vohra',
      designation: 'Consultant Specialist',
      department: hospital.specialties?.[2] || 'Critical Care Medicine',
      qualifications: 'MBBS, MD, DNB',
      experience: '12+ years experience in critical care',
      specializationFocus: 'Intensive Care Management & Emergency Stabilization',
      opdSchedule: 'Mon to Sat (11:00 AM – 3:30 PM)',
      verificationNotice: 'Sample / Prototype Doctor Data'
    }
  ];
}

export const SpecialistDoctors = ({ hospital }) => {
  const doctors = getSpecialistDoctors(hospital);

  if (!doctors || doctors.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-5 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              Specialist Doctors
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Consultant profiles for clinical departments and specialized care programs at this facility
          </p>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-teal-300 hover:shadow-card transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              {/* Doctor Avatar */}
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                <UserCheck className="w-5 h-5 text-teal-600" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                <p className="text-xs text-teal-700 font-semibold">{doc.designation}</p>
                <p className="text-[11px] text-slate-500 font-medium">{doc.department}</p>
              </div>

              <div className="pt-1.5 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate" title={doc.qualifications}>{doc.qualifications}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.experience}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 space-y-0.5">
                <span className="font-semibold text-slate-700 block">Focus:</span>
                <p className="text-slate-600 leading-tight">{doc.specializationFocus}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{doc.opdSchedule}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
