import React from 'react';

export const HospitalCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded-md w-2/3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
      </div>

      <div className="flex gap-2">
        <div className="h-5 w-20 bg-slate-100 rounded-md"></div>
        <div className="h-5 w-24 bg-slate-100 rounded-md"></div>
        <div className="h-5 w-16 bg-slate-100 rounded-md"></div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-4/5"></div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-100 rounded-xl"></div>
          <div className="h-9 w-28 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingGrid = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <HospitalCardSkeleton key={idx} />
      ))}
    </div>
  );
};
