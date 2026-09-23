import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminVerification = () => {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const loadQueue = () => {
    setIsLoading(true);
    adminService.getVerificationQueue().then(data => {
      setQueue(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (itemId, action, hospName) => {
    try {
      await adminService.processQueueItem(itemId, action, `Processed by Health Auditor on ${new Date().toLocaleDateString()}`);
      if (action === 'verify') {
        addToast(`Approved & verified declaration for ${hospName}`, 'success');
      } else if (action === 'reject') {
        addToast(`Rejected update submission for ${hospName}`, 'info');
      } else {
        addToast(`Requested audit clarification from ${hospName}`, 'warning');
      }
      loadQueue();
    } catch (err) {
      addToast('Failed to update queue item', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Data Verification & Audit Queue"
          subtitle="Inspect pending equipment claims, cost tariff updates, and regulatory audit submissions"
        />

        <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
          
          {/* Top Summary Banner */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between text-xs text-teal-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>
                <strong>Verification Governance:</strong> Every hospital data change requires auditor review before earning the 🟢 Verified badge.
              </span>
            </div>
            <span className="font-bold text-teal-800">
              {queue.filter(q => q.verificationStatus === 'pending').length} Pending Tasks
            </span>
          </div>

          {/* Queue Items List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">Loading audit queue...</div>
            ) : queue.length > 0 ? (
              queue.map(item => {
                const isPending = item.verificationStatus === 'pending';
                const isVerified = item.verificationStatus === 'verified';
                const isRejected = item.verificationStatus === 'rejected';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-5 transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {item.hospitalName}
                          </h3>
                          <span className="text-xs text-slate-400">({item.city})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Claim Type: <span className="font-semibold text-slate-700">{item.type}</span> · Submitted by {item.submittedBy} on {item.submissionDate}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div>
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isVerified && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified & Approved</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Side-by-side comparison: Submitted Data vs Current Record */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Submitted New Data */}
                      <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-100 space-y-2 text-xs">
                        <span className="font-bold text-teal-900 uppercase tracking-wider block">
                          Submitted Data (Proposed Declaration)
                        </span>
                        <pre className="bg-white p-3 rounded-lg border border-teal-200 text-teal-950 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(item.submittedData, null, 2)}
                        </pre>
                      </div>

                      {/* Current Existing Record */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider block">
                          Current Registered Data (Prior Audit)
                        </span>
                        <pre className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(item.currentData, null, 2)}
                        </pre>
                      </div>

                    </div>

                    {/* Metadata strip: Proof Document & Source */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Proof Doc: <strong className="text-slate-700">{item.proofDocument}</strong></span>
                        </span>
                        <span>Source: <strong className="text-slate-700">{item.source}</strong></span>
                      </div>

                      {/* Action buttons */}
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'reject', item.hospitalName)}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'request_update', item.hospitalName)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                          >
                            Request Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item.id, 'verify', item.hospitalName)}
                            className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
                          >
                            Verify & Publish
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Task resolved {item.resolvedDate ? `on ${item.resolvedDate}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-xs">All verification items have been resolved.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
