import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  ArrowUpDown,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Destructive Action Confirmation Modal state
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();
  const { adminUser, hasPermission } = useAdminAuth();

  const fetchHospitals = () => {
    setIsLoading(true);
    adminService.getAdminHospitals(search, statusFilter).then(data => {
      setHospitals(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchHospitals();
  }, [search, statusFilter]);

  const handleVerify = async (id, name) => {
    try {
      await adminService.updateHospitalStatus(id, 'verified', 'Direct verification by auditor', adminUser?.id || 'admin_session');
      addToast(`Verified audit status for ${name}`, 'success');
      fetchHospitals();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleReject = async (id, name) => {
    try {
      await adminService.updateHospitalStatus(id, 'pending', 'Moved to pending review', adminUser?.id || 'admin_session');
      addToast(`Set ${name} audit status to Pending Audit`, 'info');
      fetchHospitals();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!hospitalToDelete) return;
    setIsDeleting(true);
    try {
      const reason = deleteReason.trim() || 'Deactivated via admin console';
      await adminService.deleteHospital(
        hospitalToDelete.id, 
        reason, 
        adminUser?.id || 'admin_session',
        adminUser?.role || 'admin'
      );
      addToast(`Soft-deleted and deactivated "${hospitalToDelete.name}"`, 'success');
      setHospitalToDelete(null);
      setDeleteReason('');
      fetchHospitals();
    } catch (err) {
      addToast(`Failed to delete hospital: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Hospital Registry Management"
          subtitle="Audit records, update verification flags, and inspect facility declarations"
        />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
          
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital name, city, or specialty..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Filter by Status & Add Button */}
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 text-slate-700 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="estimated">Estimated Only</option>
                <option value="pending">Pending Audit Only</option>
              </select>

              <Link
                to="/admin/hospitals/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Hospital</span>
              </Link>
            </div>

          </div>

          {/* Hospitals Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Hospital Name & Type</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">Primary Specialties</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        Loading hospital registry...
                      </td>
                    </tr>
                  ) : hospitals.length > 0 ? (
                    hospitals.map(hospital => (
                      <tr key={hospital.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">
                            {hospital.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {hospital.type} · {hospital.beds} Beds ({hospital.icuBeds} ICU)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {hospital.location.city}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-600 block truncate max-w-[200px]">
                            {hospital.specialties.slice(0, 2).join(', ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <VerificationBadge status={hospital.verification.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {hospital.verification.lastUpdated}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* View details */}
                            <Link
                              to={`/hospitals/${hospital.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                              title="View Public Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {/* Verify Action */}
                            {hospital.verification.status !== 'verified' ? (
                              <button
                                type="button"
                                onClick={() => handleVerify(hospital.id, hospital.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-colors"
                                title="Approve Verification"
                              >
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Verify</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReject(hospital.id, hospital.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px] font-medium transition-colors"
                                title="Move to Pending Review"
                              >
                                <XCircle className="w-3 h-3 text-slate-400" />
                                <span>Pending</span>
                              </button>
                            )}

                            {/* Destructive Action: Delete (Requires admin role / delete_hospitals permission) */}
                            {hasPermission('delete_hospitals') ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setHospitalToDelete(hospital);
                                  setDeleteReason('');
                                }}
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Hospital (Requires Confirmation)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span 
                                className="p-1.5 text-slate-300 cursor-not-allowed inline-flex" 
                                title="Delete permission restricted to System Administrator role"
                              >
                                <Trash2 className="w-3.5 h-3.5 opacity-40" />
                              </span>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No hospital records found matching search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {hospitals.length} registered hospital facilities</span>
              <span>All changes update session state instantly</span>
            </div>
          </div>

        </div>
      </main>

      {/* Explicit Confirmation Modal for Destructive Delete Action */}
      {hospitalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-slate-200 space-y-4">
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Hospital Deactivation
                </h3>
                <p className="text-xs text-slate-500">
                  You are about to soft-delete and deactivate this hospital record.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Hospital Record
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {hospitalToDelete.name}
              </div>
              <div className="text-xs text-slate-600">
                {hospitalToDelete.location?.city} · {hospitalToDelete.type} (ID: #{hospitalToDelete.id})
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <label className="font-semibold block text-slate-700">
                Deactivation Reason / Audit Note:
              </label>
              <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Facility closed, duplicate entry, audit mismatch"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                This record will be marked as <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700 font-mono">isActive: false</code> and an immutable administrative audit log will be generated.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setHospitalToDelete(null);
                  setDeleteReason('');
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deactivating...' : 'Confirm Soft Delete'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
