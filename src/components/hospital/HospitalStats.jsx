import React from 'react';
import { Bed, Activity, Users, ShieldAlert, Award, Calendar } from 'lucide-react';

export const HospitalStats = ({ hospital }) => {
  const stats = [
    {
      label: "Total Bed Capacity",
      value: hospital.beds ? `${hospital.beds} Beds` : "Not reported",
      detail: "General & ward capacity",
      icon: Bed,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Critical Care (ICU)",
      value: (hospital.icuBeds !== undefined && hospital.icuBeds !== null) ? `${hospital.icuBeds} Beds` : "Not reported",
      detail: "Ventilator & monitor equipped",
      icon: Activity,
      color: "text-teal-600 bg-teal-50"
    },
    {
      label: "Annual Patient Inflow",
      value: (hospital.patientVolumeAnnual && hospital.patientVolumeAnnual > 0)
        ? `~${hospital.patientVolumeAnnual.toLocaleString('en-IN')}`
        : "Not reported",
      detail: "Estimated annual patient care",
      icon: Users,
      color: "text-purple-600 bg-purple-50"
    },
    {
      label: "Emergency Status",
      value: hospital.emergency24x7 ? "24x7 Active" : "Daytime Only",
      detail: "Triage & trauma availability",
      icon: ShieldAlert,
      color: hospital.emergency24x7 ? "text-rose-600 bg-rose-50" : "text-slate-600 bg-slate-50"
    },
    {
      label: "Accreditation",
      value: (hospital.accreditation && hospital.accreditation.length > 0)
        ? hospital.accreditation.join(', ')
        : "Not reported",
      detail: "National healthcare audit",
      icon: Award,
      color: "text-amber-600 bg-amber-50"
    },
    {
      label: "Established Year",
      value: hospital.establishedYear ? `${hospital.establishedYear}` : "Not reported",
      detail: hospital.establishedYear 
        ? `${new Date().getFullYear() - hospital.establishedYear} years in service`
        : "Year not reported",
      icon: Calendar,
      color: "text-emerald-600 bg-emerald-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-soft flex items-start gap-3.5"
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-slate-500 font-medium block">
                {stat.label}
              </span>
              <span className="text-base font-bold text-slate-900 block">
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {stat.detail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
