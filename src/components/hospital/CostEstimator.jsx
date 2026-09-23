import React, { useState } from 'react';
import { IndianRupee, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { VerificationBadge } from '../common/VerificationBadge';

export const CostEstimator = ({ estimatedCosts = {}, hospitalName }) => {
  const treatmentEntries = [
    { key: 'kidneyTreatment', label: 'Kidney Dialysis & Renal Care', code: 'NEPH-01' },
    { key: 'cardiacCare', label: 'Cardiology Interventions & Angiography', code: 'CARD-02' },
    { key: 'orthopedicCare', label: 'Orthopedic / Joint Replacement', code: 'ORTH-03' },
    { key: 'cancerCare', label: 'Oncology Chemotherapy Cycle', code: 'ONCO-04' },
    { key: 'maternityCare', label: 'Maternity Care & Delivery', code: 'MAT-05' },
    { key: 'emergencyTrauma', label: 'Acute Trauma & ICU Stabilization', code: 'EMRG-06' }
  ];

  return (
    <div className="space-y-4">
      {/* Disclaimer Header Card */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Important Cost Estimation Disclaimer
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Treatment costs shown are estimates compiled from public hospital tariff charts and historical room tier benchmarks. Actual medical invoices depend on specific surgeon fees, length of ICU stay, medications, co-morbidities, and chosen room category.
          </p>
        </div>
      </div>

      {/* Cost Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Care Pathway / Procedure</th>
              <th className="py-3 px-4">Estimated Range (INR)</th>
              <th className="py-3 px-4">Data Status</th>
              <th className="py-3 px-4 text-right">Coverage Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {treatmentEntries.map(entry => {
              const cost = estimatedCosts[entry.key];
              const hasData = !!cost;

              return (
                <tr key={entry.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">
                      {entry.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Standard general ward package
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {hasData ? (
                      <span className="text-sm text-teal-800">
                        {cost.label || `₹${cost.min?.toLocaleString('en-IN')} – ₹${cost.max?.toLocaleString('en-IN')}`}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Custom Quote on Admission</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {hasData ? (
                      <VerificationBadge status="estimated" size="sm" />
                    ) : (
                      <VerificationBadge status="unavailable" size="sm" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                      Cash / TPA Insurance
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
