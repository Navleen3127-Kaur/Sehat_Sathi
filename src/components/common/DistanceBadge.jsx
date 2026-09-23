import React from 'react';
import { MapPin } from 'lucide-react';

export const DistanceBadge = ({ distance, city, size = 'sm' }) => {
  const displayDistance = distance != null ? `${distance} km away` : 'Distance unavailable';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100/90 text-slate-700 border border-slate-200/80 ${
        size === 'xs' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
      <span>{displayDistance}</span>
      {city && <span className="text-slate-500 font-normal">· {city}</span>}
    </span>
  );
};
