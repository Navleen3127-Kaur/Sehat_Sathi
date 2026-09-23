import React from 'react';
import { FACILITIES } from '../../data/facilities';
import { 
  ActivitySquare, 
  AlertCircle, 
  Repeat, 
  Scan, 
  Layers, 
  Droplet, 
  Scissors, 
  Pill, 
  Truck, 
  Baby, 
  Zap,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

const iconMap = {
  icu: ActivitySquare,
  emergency: AlertCircle,
  dialysis: Repeat,
  mri: Scan,
  ct_scan: Layers,
  blood_bank: Droplet,
  operation_theatre: Scissors,
  pharmacy: Pill,
  ambulance: Truck,
  nicu: Baby,
  cath_lab: Zap
};

export const FacilityGrid = ({ facilityStatuses = {}, activeFacilities = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {FACILITIES.map(facility => {
        const IconComponent = iconMap[facility.id] || ActivitySquare;
        
        // Determine status
        let status = facilityStatuses[facility.id];
        if (!status) {
          status = activeFacilities.includes(facility.id) ? 'available' : 'unavailable';
        }

        let badgeClass = 'bg-slate-100 text-slate-500 border-slate-200';
        let statusText = 'Unavailable';
        let StatusIcon = XCircle;

        if (status === 'available') {
          badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          statusText = 'Available';
          StatusIcon = CheckCircle2;
        } else if (status === 'limited') {
          badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
          statusText = 'Limited / On-call';
          StatusIcon = Clock;
        }

        return (
          <div
            key={facility.id}
            className={`p-4 rounded-xl border transition-all ${
              status === 'available'
                ? 'bg-white border-slate-200 shadow-soft'
                : status === 'limited'
                ? 'bg-white border-amber-100 shadow-soft'
                : 'bg-slate-50/70 border-slate-200/60 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                  status === 'available' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {facility.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {facility.category}
                  </span>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusText}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {facility.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
