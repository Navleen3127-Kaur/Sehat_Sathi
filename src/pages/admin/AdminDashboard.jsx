import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  UploadCloud, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Activity,
  IndianRupee
} from 'lucide-react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatCard } from '../../components/admin/StatCard';
import { adminService } from '../../services/adminService';

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardData().then(data => {
      setDashboardData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 p-8 text-slate-400">Loading admin analytics...</div>
      </div>
    );
  }

  const { stats, cityDistribution, specialtyDistribution, verificationBreakdown, treatmentCosts } = dashboardData;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Hospital Discovery Analytics & Governance"
          subtitle="Real-time registry statistics, audit pipeline, and regional healthcare coverage"
        />

        <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
          
          {/* 1. TOP STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Hospitals"
              value={stats.totalHospitals}
              subtext="Registered facilities"
              icon={Building2}
              trend="+2 new this month"
              color="teal"
            />
            <StatCard
              title="Verified Hospitals"
              value={stats.verifiedHospitals}
              subtext="Regulatory audited"
              icon={ShieldCheck}
              trend="92% audit pass"
              color="blue"
            />
            <StatCard
              title="Pending Verification"
              value={stats.pendingVerification}
              subtext="Action required in queue"
              icon={Clock}
              trend="2 urgent reviews"
              color="amber"
            />
            <StatCard
              title="Recently Updated"
              value={stats.recentlyUpdatedCount}
              subtext="Updated in last 30 days"
              icon={TrendingUp}
              trend="Data fresh"
              color="purple"
            />
          </div>

          {/* 2. QUICK ACTIONS BAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Auditor Quick Actions</h3>
              <p className="text-xs text-slate-500">Fast workflows to maintain data accuracy</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/admin/hospitals/add"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Hospital</span>
              </Link>
              <Link
                to="/admin/upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-slate-500" />
                <span>Upload CSV Dataset</span>
              </Link>
              <Link
                to="/admin/verification"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition-colors"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Review Pending Queue ({stats.pendingVerification})</span>
              </Link>
            </div>
          </div>

          {/* 3. VISUAL MOCK CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Hospitals by City */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Hospitals by City Coverage</h3>
                </div>
                <span className="text-xs text-slate-400">Tricity Region</span>
              </div>

              <div className="space-y-3 pt-2">
                {cityDistribution.map(item => {
                  const percentage = Math.round((item.count / stats.totalHospitals) * 100);
                  return (
                    <div key={item.city} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item.city}</span>
                        <span className="text-slate-500">{item.count} hospitals ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Verification Status Pipeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Verification Status Pipeline</h3>
                </div>
                <span className="text-xs text-slate-400">Audit Health</span>
              </div>

              <div className="space-y-3 pt-2">
                {verificationBreakdown.map(item => {
                  const percentage = Math.round((item.count / stats.totalHospitals) * 100);
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item.status}</span>
                        <span className="text-slate-500">{item.count} facilities ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 3: Hospitals by Specialty Offering */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Active Specialty Distribution</h3>
                </div>
                <span className="text-xs text-slate-400">Departments</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {specialtyDistribution.map(item => (
                  <div key={item.specialty} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.specialty}</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Average Estimated Baseline Cost */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Average Estimated Treatment Cost</h3>
                </div>
                <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Baseline Tiers</span>
              </div>

              <div className="space-y-2.5 pt-2">
                {treatmentCosts.map(item => (
                  <div key={item.treatment} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-700">{item.treatment}</span>
                    <span className="font-bold text-slate-900">₹{item.avgCost.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
