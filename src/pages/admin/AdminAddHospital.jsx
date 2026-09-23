import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  IndianRupee,
  Plus,
  Trash2,
  Award,
  FileCheck
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { SPECIALTIES } from '../../data/specialties';
import { FACILITIES } from '../../data/facilities';
import { CITIES } from '../../context/LocationContext';

export const AdminAddHospital = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Multispeciality',
    tagline: 'Quality healthcare facility in tricity region',
    address: '',
    city: 'Chandigarh',
    pincode: '160022',
    latitude: '30.7333',
    longitude: '76.7794',
    landmark: '',
    phone: '',
    emergencyPhone: '',
    beds: '150',
    icuBeds: '20',
    emergency24x7: true,
    establishedYear: '2015',
    accreditation: ['NABH'],
    specialties: ['Nephrology & Urology', 'Cardiology & Cardiac Surgery'],
    facilities: ['icu', 'emergency', 'dialysis'],
    costMin: '50000',
    costMax: '95000',
    dataSource: 'Hospital Direct Administration Declaration',
    verificationStatus: 'verified',
    overview: ''
  });

  const [affiliations, setAffiliations] = useState([
    {
      organisation: 'NABH',
      type: 'accreditation',
      claim: 'Full NABH Hospital Accreditation',
      certificateNumber: '',
      validFrom: '',
      validThrough: '',
      status: 'verified',
      source: 'NABH Official Directory (nabh.co)',
      notes: ''
    }
  ]);

  const [perfMetrics, setPerfMetrics] = useState([
    {
      condition: 'kidney',
      metricName: 'Monthly Hemodialysis Sessions',
      value: '',
      unit: 'sessions/month',
      definition: 'Outpatient and inpatient hemodialysis sessions performed',
      reportingPeriod: 'FY 2023-24',
      source: 'Hospital Annual Clinical Audit Report',
      status: 'verified'
    }
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSpecialtyToggle = (specName) => {
    const list = formData.specialties || [];
    const updated = list.includes(specName)
      ? list.filter(s => s !== specName)
      : [...list, specName];
    setFormData(prev => ({ ...prev, specialties: updated }));
  };

  const handleFacilityToggle = (facId) => {
    const list = formData.facilities || [];
    const updated = list.includes(facId)
      ? list.filter(f => f !== facId)
      : [...list, facId];
    setFormData(prev => ({ ...prev, facilities: updated }));
  };

  const handleAddAffiliation = () => {
    setAffiliations(prev => [
      ...prev,
      {
        organisation: 'PMNDP',
        type: 'registry',
        claim: '',
        certificateNumber: '',
        validFrom: '',
        validThrough: '',
        status: 'unverified',
        source: '',
        notes: ''
      }
    ]);
  };

  const handleRemoveAffiliation = (index) => {
    setAffiliations(prev => prev.filter((_, i) => i !== index));
  };

  const handleAffiliationChange = (index, field, value) => {
    setAffiliations(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    if (errors[`affiliation_source_${index}`]) {
      setErrors(prev => ({ ...prev, [`affiliation_source_${index}`]: null }));
    }
  };

  const handleAddMetric = () => {
    setPerfMetrics(prev => [
      ...prev,
      {
        condition: 'kidney',
        metricName: '',
        value: '',
        unit: '',
        definition: '',
        reportingPeriod: '',
        source: '',
        status: 'unverified'
      }
    ]);
  };

  const handleRemoveMetric = (index) => {
    setPerfMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index, field, value) => {
    setPerfMetrics(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    if (errors[`metric_source_${index}`]) {
      setErrors(prev => ({ ...prev, [`metric_source_${index}`]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Hospital name is required.';
    if (!formData.address.trim()) newErrors.address = 'Street address is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Contact telephone is required.';
    if (!formData.beds || Number(formData.beds) <= 0) newErrors.beds = 'Valid bed count required.';
    if (formData.specialties.length === 0) newErrors.specialties = 'Select at least one medical specialty.';
    
    // Rule: An admin cannot set status to 'verified' without providing a non-empty Verification Source.
    if (formData.verificationStatus === 'verified' && (!formData.dataSource || !formData.dataSource.trim())) {
      newErrors.dataSource = 'Verification source is mandatory when hospital status is verified.';
    }

    affiliations.forEach((aff, idx) => {
      if (aff.status === 'verified' && (!aff.source || !aff.source.trim())) {
        newErrors[`affiliation_source_${idx}`] = 'Verification source is mandatory for verified affiliations.';
      }
    });

    perfMetrics.forEach((pm, idx) => {
      if (pm.status === 'verified' && (!pm.source || !pm.source.trim())) {
        newErrors[`metric_source_${idx}`] = 'Verification source is mandatory for verified performance metrics.';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please correct form validation errors before saving.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build performanceData by condition
      const performanceDataObj = {};
      perfMetrics.forEach(m => {
        if (!m.metricName || !m.value) return;
        const cond = m.condition || 'kidney';
        if (!performanceDataObj[cond]) {
          performanceDataObj[cond] = {
            condition: cond,
            conditionLabel: cond === 'kidney' ? 'Kidney Care' : cond === 'cardiac' ? 'Cardiac Care' : cond === 'oncology' ? 'Oncology Care' : 'General Care',
            metrics: []
          };
        }
        performanceDataObj[cond].metrics.push({
          name: m.metricName,
          value: isNaN(Number(m.value)) ? m.value : Number(m.value),
          unit: m.unit || '',
          clinicalDefinition: m.definition || '',
          reportingPeriod: m.reportingPeriod || '',
          source: m.source || '',
          status: m.status || 'unverified'
        });
      });

      const validAffiliations = affiliations.map(a => ({
        organisation: a.organisation,
        type: a.type,
        claim: a.claim,
        certificateNumber: a.certificateNumber || null,
        validFrom: a.validFrom || null,
        validThrough: a.validThrough || null,
        status: a.status || 'unverified',
        source: a.source || '',
        notes: a.notes || ''
      }));

      await adminService.addHospital({
        ...formData,
        estimatedCosts: {
          kidneyTreatment: {
            min: Number(formData.costMin) || 50000,
            max: Number(formData.costMax) || 90000,
            label: `₹${Number(formData.costMin || 50000).toLocaleString('en-IN')} – ₹${Number(formData.costMax || 90000).toLocaleString('en-IN')}`
          }
        },
        organisationAffiliations: validAffiliations,
        performanceData: performanceDataObj
      });
      addToast(`Successfully registered "${formData.name}"`, 'success');
      navigate('/admin/hospitals');
    } catch (err) {
      addToast('Failed to save hospital record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Register New Hospital Record"
          subtitle="Submit structured facility, accreditation, and capacity declarations into registry"
        />

        <div className="p-6 sm:p-8 max-w-4xl space-y-6">
          
          <div className="flex items-center gap-2">
            <Link
              to="/admin/hospitals"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Registry</span>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-8">
            
            {/* 1. Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>1. General Establishment Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Hospital Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. MaxCare Multispeciality Hospital"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:outline-none focus:border-teal-500`}
                  />
                  {errors.name && <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Hospital Classification
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="Multispeciality">Multispeciality</option>
                    <option value="Super Speciality">Super Speciality</option>
                    <option value="Government Tertiary">Government Tertiary</option>
                    <option value="Specialized Institute">Specialized Institute</option>
                    <option value="Charitable Trust">Charitable Trust</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tagline / Clinical Focus
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Location & Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>2. Location & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="e.g. Sector 44-B, Institutional Zone"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:outline-none focus:border-teal-500`}
                  />
                  {errors.address && <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.address}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  >
                    {CITIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone (OPD/Desk) *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 172 000 0000"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:outline-none focus:border-teal-500`}
                  />
                  {errors.phone && <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.phone}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    24x7 Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+91 172 000 9999"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Bed Capacity & Emergency */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>3. Capacity & Emergency Infrastructure</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Total Inpatient Beds *
                  </label>
                  <input
                    type="number"
                    value={formData.beds}
                    onChange={(e) => handleInputChange('beds', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Dedicated ICU Beds
                  </label>
                  <input
                    type="number"
                    value={formData.icuBeds}
                    onChange={(e) => handleInputChange('icuBeds', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-900">
                    <input
                      type="checkbox"
                      checked={formData.emergency24x7}
                      onChange={(e) => handleInputChange('emergency24x7', e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span>24x7 Active Emergency & Trauma</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Specialties (Chips Multi-select) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  4. Medical Specialties Offered *
                </label>
                <span className="text-[11px] text-slate-400">Click to toggle</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => {
                  const isChecked = formData.specialties.includes(s.name) || formData.specialties.includes(s.shortName);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSpecialtyToggle(s.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 inline mr-1 text-teal-600" />}
                      {s.shortName}
                    </button>
                  );
                })}
              </div>
              {errors.specialties && <span className="text-[11px] text-rose-600 block">{errors.specialties}</span>}
            </div>

            {/* 5. Facilities (Checkboxes) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                5. On-Site Diagnostics & Facilities
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FACILITIES.map(fac => {
                  const isChecked = formData.facilities.includes(fac.id);
                  return (
                    <label
                      key={fac.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-teal-50/70 border-teal-300 text-teal-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFacilityToggle(fac.id)}
                        className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                      />
                      <span>{fac.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 6. Baseline Costs & Audit Source */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>6. Baseline Procedure Cost & Audit Metadata</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Baseline Procedure Min (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.costMin}
                    onChange={(e) => handleInputChange('costMin', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Baseline Procedure Max (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.costMax}
                    onChange={(e) => handleInputChange('costMax', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Data Source / Filing
                  </label>
                  <input
                    type="text"
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                      errors.dataSource ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    } focus:outline-none focus:border-teal-500`}
                  />
                  {errors.dataSource && <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.dataSource}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Initial Verification Status
                  </label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => handleInputChange('verificationStatus', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="verified">Verified (Audited)</option>
                    <option value="estimated">Estimated (Public Filings)</option>
                    <option value="pending">Pending Verification Queue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 7. Disease-Specific Performance Data */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>7. Disease-Specific Performance Data & Clinical Audits</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddMetric}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Record condition-specific, source-verified clinical metrics (patient volumes, dedicated specialists, procedure counts). Never fabricate recovery rates or cure percentages.
              </p>

              {perfMetrics.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xl">
                  No disease-specific performance metrics added. Click &quot;Add Metric&quot; to define verified indicators.
                </div>
              ) : (
                <div className="space-y-3">
                  {perfMetrics.map((pm, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Metric #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMetric(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Medical Condition</label>
                          <select
                            value={pm.condition}
                            onChange={(e) => handleMetricChange(idx, 'condition', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="kidney">Kidney Care</option>
                            <option value="cardiac">Cardiac Sciences</option>
                            <option value="oncology">Oncology Care</option>
                            <option value="general">General Care</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Metric Name</label>
                          <input
                            type="text"
                            value={pm.metricName}
                            onChange={(e) => handleMetricChange(idx, 'metricName', e.target.value)}
                            placeholder="e.g. Monthly Hemodialysis Sessions"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Value & Unit</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={pm.value}
                              onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                              placeholder="250"
                              className="w-1/2 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                            <input
                              type="text"
                              value={pm.unit}
                              onChange={(e) => handleMetricChange(idx, 'unit', e.target.value)}
                              placeholder="sessions/mo"
                              className="w-1/2 px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Clinical Definition</label>
                          <input
                            type="text"
                            value={pm.definition}
                            onChange={(e) => handleMetricChange(idx, 'definition', e.target.value)}
                            placeholder="Outpatient and inpatient hemodialysis sessions performed"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Reporting Period</label>
                          <input
                            type="text"
                            value={pm.reportingPeriod}
                            onChange={(e) => handleMetricChange(idx, 'reportingPeriod', e.target.value)}
                            placeholder="FY 2023-24"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Status</label>
                          <select
                            value={pm.status}
                            onChange={(e) => handleMetricChange(idx, 'status', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                          >
                            <option value="verified">Verified (Audited)</option>
                            <option value="unverified">Unverified (Self-Reported)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Verification Source {pm.status === 'verified' && <span className="text-rose-500">* (Mandatory for verified)</span>}
                        </label>
                        <input
                          type="text"
                          value={pm.source}
                          onChange={(e) => handleMetricChange(idx, 'source', e.target.value)}
                          placeholder="e.g. Hospital Annual Clinical Audit Report / PHSC Registry"
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                            errors[`metric_source_${idx}`] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          } bg-white`}
                        />
                        {errors[`metric_source_${idx}`] && (
                          <span className="text-[11px] text-rose-600 mt-0.5 block">{errors[`metric_source_${idx}`]}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 8. Independent Organisation & Programme Verification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>8. Independent Organisation & Programme Verification</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddAffiliation}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Affiliation</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Document accreditations (NABH, NABL) and statutory schemes (PMNDP, PMJAY, CGHS). Affiliation cannot be marked verified without an authoritative external source.
              </p>

              {affiliations.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xl">
                  No organisation affiliations added. Click &quot;Add Affiliation&quot; to configure.
                </div>
              ) : (
                <div className="space-y-3">
                  {affiliations.map((aff, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Affiliation #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAffiliation(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Organisation</label>
                          <select
                            value={aff.organisation}
                            onChange={(e) => handleAffiliationChange(idx, 'organisation', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="NABH">NABH (National Accreditation Board)</option>
                            <option value="NABL">NABL (Laboratories)</option>
                            <option value="PMNDP">PMNDP (National Dialysis Programme)</option>
                            <option value="Ayushman Bharat / PMJAY">Ayushman Bharat / PMJAY</option>
                            <option value="CGHS">CGHS</option>
                            <option value="ECHS">ECHS</option>
                            <option value="PHSC">PHSC (Punjab Health Systems Corp)</option>
                            <option value="State Health Authority">State Health Authority</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Affiliation Type</label>
                          <select
                            value={aff.type}
                            onChange={(e) => handleAffiliationChange(idx, 'type', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="accreditation">Accreditation</option>
                            <option value="registry">Registry</option>
                            <option value="empanelment">Empanelment</option>
                            <option value="scheme">Scheme</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Status</label>
                          <select
                            value={aff.status}
                            onChange={(e) => handleAffiliationChange(idx, 'status', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
                          >
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                            <option value="not_found">Not Found</option>
                            <option value="expired">Expired</option>
                            <option value="conflicting">Conflicting</option>
                            <option value="pending_review">Pending Review</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Specific Claim</label>
                          <input
                            type="text"
                            value={aff.claim}
                            onChange={(e) => handleAffiliationChange(idx, 'claim', e.target.value)}
                            placeholder="e.g. Full NABH Hospital Accreditation"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Certificate / Ref Number</label>
                          <input
                            type="text"
                            value={aff.certificateNumber}
                            onChange={(e) => handleAffiliationChange(idx, 'certificateNumber', e.target.value)}
                            placeholder="e.g. NABH-H-2023-1092"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Valid From</label>
                          <input
                            type="date"
                            value={aff.validFrom}
                            onChange={(e) => handleAffiliationChange(idx, 'validFrom', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Valid Through</label>
                          <input
                            type="date"
                            value={aff.validThrough}
                            onChange={(e) => handleAffiliationChange(idx, 'validThrough', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Verification Source URL / Document {aff.status === 'verified' && <span className="text-rose-500">* (Mandatory for verified)</span>}
                        </label>
                        <input
                          type="text"
                          value={aff.source}
                          onChange={(e) => handleAffiliationChange(idx, 'source', e.target.value)}
                          placeholder="e.g. Official Registry Portal (https://nabh.co/...)"
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${
                            errors[`affiliation_source_${idx}`] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          } bg-white`}
                        />
                        {errors[`affiliation_source_${idx}`] && (
                          <span className="text-[11px] text-rose-600 mt-0.5 block">{errors[`affiliation_source_${idx}`]}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Verification Notes</label>
                        <input
                          type="text"
                          value={aff.notes}
                          onChange={(e) => handleAffiliationChange(idx, 'notes', e.target.value)}
                          placeholder="e.g. Confirmed on state portal March 2024"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/admin/hospitals"
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Hospital Record'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
};
