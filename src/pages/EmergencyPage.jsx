import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Phone, 
  Navigation, 
  MapPin, 
  AlertCircle, 
  Activity, 
  Bed, 
  Clock, 
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { hospitalDiscoveryService } from '../services/hospitalDiscoveryService';
import { useLocation } from '../context/LocationContext';
import { DirectionsModal } from '../components/common/DirectionsModal';
import { VerificationBadge } from '../components/common/VerificationBadge';

export const EmergencyPage = () => {
  const { latitude, longitude, city, selectedCity } = useLocation();
  const currentCity = city || selectedCity || 'Chandigarh';
  const [radius, setRadius] = useState(25);
  const [emergencyHospitals, setEmergencyHospitals] = useState([]);
  const [selectedHospitalForDirections, setSelectedHospitalForDirections] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    hospitalDiscoveryService.getEmergencyNearby(latitude, longitude, radius).then(data => {
      setEmergencyHospitals(data);
      setIsLoading(false);
    });
  }, [latitude, longitude, radius]);

  const emergencyNumbers = [
    { label: "National Ambulance", number: "108", sub: "Toll-free 24/7 medical dispatch", primary: true },
    { label: "Unified Emergency", number: "112", sub: "Police, Fire & Medical rescue", primary: false },
    { label: "Maternal & Child Transport", number: "102", sub: "Dedicated Janani Shishu dispatch", primary: false }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* 1. TOP URGENT MEDICAL WARNING SECTION */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-navy-950 text-white p-6 sm:p-8 shadow-elevated border border-rose-800/80 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>URGENT MEDICAL NOTICE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Need urgent medical care?
            </h1>
            <p className="text-sm text-rose-100/90 leading-relaxed">
              If you or someone with you may be experiencing a medical emergency, seek immediate medical attention or contact local emergency services immediately.
            </p>
          </div>

          {/* Quick SOS Call 108 */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg hover:shadow-rose-500/30 hover:scale-105"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call 108 Ambulance</span>
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              <span>Dial 112 Rescue</span>
            </a>
          </div>
        </div>

        {/* National Emergency Helplines Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-rose-800/60">
          {emergencyNumbers.map((sos, idx) => (
            <a
              key={idx}
              href={`tel:${sos.number}`}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="text-[11px] text-rose-200 block">{sos.label}</span>
                <span className="text-lg font-black text-white">{sos.number}</span>
                <span className="text-[10px] text-rose-300/70 block">{sos.sub}</span>
              </div>
              <Phone className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      {/* 2. FIND NEARBY EMERGENCY HOSPITALS FILTER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Find Nearby 24x7 Emergency Hospitals</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing active emergency facilities near {currentCity} sorted by travel distance.
            </p>
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Search Radius:</span>
            <div className="flex gap-1.5">
              {[5, 10, 25, 50].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    radius === r
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. EMERGENCY HOSPITAL CARDS */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading nearest emergency facilities...</div>
        ) : emergencyHospitals.length > 0 ? (
          emergencyHospitals.map(hospital => (
            <div
              key={hospital.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-300 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Column: Hospital Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {hospital.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                    <span>24x7 Emergency Active</span>
                  </span>
                  <VerificationBadge status={hospital.verification.status} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{hospital.distance} km away</span>
                  </span>
                  <span>·</span>
                  <span>{hospital.location.address}, {hospital.location.city}</span>
                </div>

                {/* Critical Infrastructure Badges */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                    <Activity className="w-3 h-3 text-teal-600" />
                    <span>ICU Available ({hospital.icuBeds} Critical Beds)</span>
                  </span>

                  {hospital.facilities.includes('blood_bank') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      <span>Blood Bank 24/7</span>
                    </span>
                  )}

                  {hospital.facilities.includes('ct_scan') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                      <span>CT Scan / Trauma Diagnostics</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Urgent Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                <a
                  href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Emergency: {hospital.emergencyPhone || hospital.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedHospitalForDirections(hospital)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-brand-600" />
                  <span>Get Directions ({hospital.distance} km)</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              No emergency hospitals located within {radius} km radius.
            </p>
            <button
              onClick={() => setRadius(50)}
              className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
            >
              Expand Search Radius to 50 km
            </button>
          </div>
        )}
      </div>

      {/* Directions Modal */}
      {selectedHospitalForDirections && (
        <DirectionsModal
          isOpen={true}
          onClose={() => setSelectedHospitalForDirections(null)}
          hospital={selectedHospitalForDirections}
        />
      )}

    </div>
  );
};
