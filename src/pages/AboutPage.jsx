import React from 'react';
import { 
  Cross, 
  ShieldCheck, 
  Scale, 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  HeartHandshake,
  Layers
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      
      {/* 1. HERO HEADER: ABOUT SEHAT_SATHI */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
          <span>About Sehat_Sathi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Your Trusted Healthcare Companion
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Find the right healthcare, closer to you. Sehat_Sathi is an independent, non-commercial healthcare discovery and hospital comparison platform built to bridge the critical information asymmetry faced by patients and caregivers.
        </p>
      </div>

      {/* 2. HOW RECOMMENDATIONS WORK */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Algorithmic Transparency
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How Recommendations Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Unlike commercial platforms that sell sponsored ranks, Sehat_Sathi's recommendation scores are purely deterministic and calculated directly against your chosen constraints.
          </p>
        </div>

        {/* Formula Diagram */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-slate-800">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">Medical Condition</span>
            <span className="text-teal-600">+</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">Location Perimeter</span>
            <span className="text-teal-600">+</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">Budget Ceiling</span>
            <span className="text-teal-600">+</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">Required Facilities</span>
            <span className="text-teal-600">+</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">Distance Radius</span>
          </div>

          <div className="flex items-center justify-center text-teal-600">
            <div className="w-0.5 h-6 bg-teal-500"></div>
          </div>

          <div className="inline-block px-6 py-2.5 rounded-2xl bg-teal-700 text-white font-bold text-sm shadow-sm">
            Matching Hospitals (Ranked by Selected Criteria Alignment)
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The result percentage (e.g. 92% criteria match) quantifies how well the facility meets your distance radius, requested equipment (like ICU or Dialysis), and estimated treatment budget. It never evaluates medical skill or doctor competency.
        </p>
      </div>

      {/* 3. DATA TRANSPARENCY: VERIFIED, ESTIMATED, UNAVAILABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-soft space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Truth in Data
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Data Transparency Standards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Every critical medical parameter in Sehat_Sathi is tagged with one of three transparent validation labels:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Verified */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🟢</span>
              <h3 className="font-bold text-emerald-900 text-sm">Verified</h3>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Information audited directly from state health regulatory registrations, AERB certifications, and NABH accreditation portals.
            </p>
          </div>

          {/* Estimated */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <h3 className="font-bold text-amber-900 text-sm">Estimated</h3>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Calculated from public room tariffs, government scheme rate packages, and regional insurance claim medians.
            </p>
          </div>

          {/* Unavailable */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚪</span>
              <h3 className="font-bold text-slate-700 text-sm">Unavailable</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data fields withheld, unverified, or currently undergoing audit review. We never fabricate missing data points.
            </p>
          </div>
        </div>
      </div>

      {/* 4. RESPONSIBLE HEALTHCARE AI CHARTER */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-card border border-navy-900 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Healthcare Charter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Responsible AI & Clinical Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            How Sehat_Sathi implements responsible AI boundaries:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-teal-300 text-sm">No Medical Diagnosis</h4>
            <p className="text-slate-300 leading-relaxed">
              Sehat_Sathi never analyzes clinical symptoms or claims that a user has a specific disease. AI strictly parses intent keywords (e.g. mapping "kidney" to "Nephrology") to configure search filters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-teal-300 text-sm">No Absolute "Best" Hospital Claims</h4>
            <p className="text-slate-300 leading-relaxed">
              Different medical circumstances demand different specialties. We never label one establishment as universally "the best", but recommend facilities that match your concrete requirements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-teal-300 text-sm">Transparent Cost Ranges</h4>
            <p className="text-slate-300 leading-relaxed">
              Treatment estimates are broad baseline guidelines. Because surgical complexity and clinical courses vary, we display disclaimers on every cost module.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-teal-300 text-sm">Future AI Integration Architecture</h4>
            <p className="text-slate-300 leading-relaxed">
              The platform is architected to safely connect local on-premise LLMs (Ollama / Llama 3) via FastAPI to parse conversational requests into verified SQL query parameters without hallucination risk.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-200 leading-relaxed">
            <strong>Emergency Reminder:</strong> In life-threatening emergencies, do not spend time reading online recommendations. Contact national ambulance services directly at <strong>108</strong> or <strong>112</strong>.
          </p>
        </div>
      </div>

    </div>
  );
};
