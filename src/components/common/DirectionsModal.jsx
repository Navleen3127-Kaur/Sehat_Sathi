import React from 'react';
import { MapPin, Navigation, ExternalLink, X, Clock, Car, Bus } from 'lucide-react';

export const DirectionsModal = ({ isOpen, onClose, hospital }) => {
  if (!isOpen || !hospital) return null;

  const approxDrivingMinutes = Math.max(5, Math.round(hospital.distance * 3.2));
  const approxTransitMinutes = Math.max(10, Math.round(hospital.distance * 5.5));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-elevated border border-slate-200 max-w-lg w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="directions-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 id="directions-title" className="font-semibold text-slate-900 text-sm">
                Directions Preview
              </h3>
              <p className="text-xs text-slate-500">Route guidance & transit estimate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Hospital destination info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h4 className="font-semibold text-slate-900">{hospital.name}</h4>
            <div className="flex items-start gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
              <span>{hospital.location.address}, {hospital.location.city} ({hospital.location.pincode})</span>
            </div>
            {hospital.location.landmark && (
              <p className="text-[11px] text-slate-500 italic pl-5">
                Landmark: {hospital.location.landmark}
              </p>
            )}
          </div>

          {/* Travel time estimation */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">By Car / Taxi</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <span>~{approxDrivingMinutes} mins</span>
                  <span className="text-xs font-normal text-slate-500">({hospital.distance} km)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Public Transit</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <span>~{approxTransitMinutes} mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Map Canvas */}
          <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            {/* Stylized vector map pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-sm border border-slate-200 text-xs text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Coordinates: {hospital.location.latitude}° N, {hospital.location.longitude}° E</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                Interactive Leaflet / Mapbox tile service will connect here during backend API deployment.
              </p>
            </div>
          </div>

          {/* Notice & Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Mock GPS radius: 10 km
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.location.address + ' ' + hospital.location.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                <span>Open External Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
