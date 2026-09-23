import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Info, Sparkles } from 'lucide-react';

export const WhyThisResult = ({ 
  reasons = [], 
  matchScore = 85, 
  matchTier = 'Good Match',
  isNationalReference = false,
  referenceRank = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reasons || reasons.length === 0) return null;

  const getTierColor = (score) => {
    if (score >= 80) return 'bg-teal-50 text-teal-800 border-teal-200';
    if (score >= 60) return 'bg-blue-50 text-blue-800 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="rounded-xl border border-teal-100 bg-teal-50/40 overflow-hidden text-xs transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-teal-900 font-medium hover:bg-teal-50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Why this result?</span>
          </div>

          {isNationalReference ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-900 border-amber-300">
              <span>National Reference</span>
              <span>·</span>
              <span>Position #{referenceRank || 1}</span>
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${getTierColor(matchScore)}`}>
              <span>{matchTier || (matchScore >= 80 ? 'Strong Match' : matchScore >= 60 ? 'Good Match' : 'Option')}</span>
              <span>·</span>
              <span>{matchScore}% match</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-teal-700 shrink-0">
          <span>{isExpanded ? 'Hide details' : 'View factors'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-teal-100/60 space-y-2 animate-fade-in bg-white/80">
          <ul className="space-y-1.5 pt-1 text-slate-700">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 italic">
            * Match scores strictly reflect alignment with your specified search criteria and do not rank or endorse clinical outcomes or medical superiority.
          </p>
        </div>
      )}
    </div>
  );
};
