import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, color = 'teal' }) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 block">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.teal}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-500">{subtext}</span>}
          {trend && (
            <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-[11px]">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
