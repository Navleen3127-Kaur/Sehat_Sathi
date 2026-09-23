import React from 'react';
import { Sparkles } from 'lucide-react';

export const SUGGESTED_QUESTIONS = [
  "Find the best hospital for kidney disease",
  "Find hospitals near me",
  "Which hospital is good for cancer?",
  "Explain dialysis",
  "Compare AIIMS and PGIMER"
];

export const SuggestedQuestions = ({ onSelectQuestion, disabled = false }) => {
  return (
    <div className="p-3 bg-slate-50 border-t border-slate-200">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
        <span>Suggested Questions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuestion(q)}
            className="text-left text-xs bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
