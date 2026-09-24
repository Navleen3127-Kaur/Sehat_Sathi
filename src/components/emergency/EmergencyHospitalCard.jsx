import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, 
  MapPin, 
  Activity, 
  Building2, 
  Navigation, 
  ExternalLink,
  ShieldCheck,
  Clock,
  PhoneOff
} from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';

/**
 * EmergencyHospitalCard Component
 * Displays a hospital card specifically designed for quick-action emergency situations:
 * - Distance clearly formatted (or "Distance unavailable — location permission required")
 * - Emergency facilities badges (Emergency care, ICU, Ambulance)
 * - Large Call Hospital button (tel: scheme) or disabled fallback
 * - View Details link to main hospital page
 */
export const EmergencyHospitalCard = ({ hospital, hasGps = false, onGetDirections }) => {
  const distance = hospital.distance;
  const hasValidDistance = hasGps && distance != null && Number.isFinite(Number(distance));
  const directPhone = hospital.phone || hospital.emergencyPhone || hospital.generalPhone;

  const caps = hospital.emergencyCapabilities || {
    emergencyCare: hospital.emergency || hospital.emergency24x7,
    ambulance: hospital.ambulance,
    icu: hospital.icu,
    icuBedsCount: hospital.icuBeds
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-400 p-5 sm:p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Left Column: Hospital details */}
      <div className="space-y-3 flex-1 min-w-0">
        
        {/* Name and Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {hospital.name}
          </h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>24x7 Emergency</span>
          </span>
          {hospital.verification?.status && (
            <VerificationBadge status={hospital.verification.status} size="sm" />
          )}
        </div>

        {/* Distance Display (PART 6) */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            {hasValidDistance ? (
              <span>📍 {distance < 10 ? distance.toFixed(1) : Math.round(distance)} km from your current location</span>
            ) : (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                📍 Distance unavailable — location permission required
              </span>
            )}
          </span>
          {hospital.location?.address && (
            <>
              <span className="text-slate-300">·</span>
              <span className="truncate">{hospital.location.address}, {hospital.location.city}</span>
            </>
          )}
        </div>

        {/* Emergency Facilities Badges (PART 5 & PART 11) */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {caps.emergencyCare && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              <span className="text-sm">🚑</span>
              <span>Emergency Care ✓ Available</span>
            </span>
          )}

          {caps.icu && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              <span className="text-sm">🏥</span>
              <span>ICU ✓ Available {caps.icuBedsCount ? `(${caps.icuBedsCount} Beds)` : ''}</span>
            </span>
          )}

          {caps.ambulance && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
              <span className="text-sm">🚑</span>
              <span>Ambulance ✓ Available</span>
            </span>
          )}

          {caps.trauma && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
              <span className="text-sm">🚨</span>
              <span>Trauma Resuscitation</span>
            </span>
          )}

          {caps.bloodBank && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
              <span>🩸 Blood Bank</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Large Action Buttons (PART 7 & PART 14) */}
      <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2.5 shrink-0 pt-2 md:pt-0">
        
        {/* Call Hospital button */}
        {directPhone ? (
          <a
            href={`tel:${directPhone}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-rose-600/30 min-w-[200px]"
            title={`Call ${hospital.name} directly`}
          >
            <PhoneCall className="w-5 h-5 shrink-0" />
            <span>📞 Call Hospital</span>
          </a>
        ) : (
          <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-500 font-medium text-xs border border-slate-200 min-w-[200px]">
            <PhoneOff className="w-4 h-4 shrink-0" />
            <span>📞 Phone number unavailable</span>
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onGetDirections && (
            <button
              type="button"
              onClick={() => onGetDirections(hospital)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              <Navigation className="w-4 h-4 text-brand-600" />
              <span>Directions</span>
            </button>
          )}

          <Link
            to={`/hospitals/${hospital.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
