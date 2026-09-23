import React from 'react';
import { 
  Activity, 
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
  Check,
  MinusCircle
} from 'lucide-react';
import { getFacilityById } from '../../data/facilities';

const iconMap = {
  icu: Activity,
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

export const FacilityBadge = ({ facilityId, status = 'available', size = 'sm' }) => {
  const facility = getFacilityById(facilityId) || { name: facilityId, shortName: facilityId };
  const IconComponent = iconMap[facilityId] || Activity;

  let badgeStyle = 'bg-slate-50 text-slate-700 border-slate-200';
  let indicator = <Check className="w-3 h-3 text-brand-600" />;

  if (status === 'available') {
    badgeStyle = 'bg-teal-50/80 text-teal-800 border-teal-200/60';
    indicator = <Check className="w-3 h-3 text-teal-600" />;
  } else if (status === 'limited') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200/60';
    indicator = <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>;
  } else if (status === 'unavailable') {
    badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
    indicator = <MinusCircle className="w-3 h-3 text-slate-400" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors ${badgeStyle} ${
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={`${facility.name} (${status})`}
    >
      <IconComponent className="w-3.5 h-3.5 text-slate-500" />
      <span>{facility.shortName || facility.name}</span>
      {indicator}
    </span>
  );
};
