import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CompareFloatingBar } from './components/compare/CompareFloatingBar';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { ComparePage } from './pages/ComparePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHospitals } from './pages/admin/AdminHospitals';
import { AdminAddHospital } from './pages/admin/AdminAddHospital';
import { AdminDataUpload } from './pages/admin/AdminDataUpload';
import { AdminVerification } from './pages/admin/AdminVerification';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for public consumer pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <CompareFloatingBar />
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <ToastProvider>
      <LocationProvider>
        <ComparisonProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/hospitals" element={<PublicLayout><SearchResultsPage /></PublicLayout>} />
                <Route path="/hospitals/:id" element={<PublicLayout><HospitalDetailPage /></PublicLayout>} />
                <Route path="/compare" element={<PublicLayout><ComparePage /></PublicLayout>} />
                <Route path="/emergency" element={<PublicLayout><EmergencyPage /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

                {/* Admin Authentication */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Portal Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/hospitals" 
                  element={
                    <AdminProtectedRoute>
                      <AdminHospitals />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/hospitals/add" 
                  element={
                    <AdminProtectedRoute>
                      <AdminAddHospital />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/upload" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDataUpload />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/verification" 
                  element={
                    <AdminProtectedRoute>
                      <AdminVerification />
                    </AdminProtectedRoute>
                  } 
                />

                {/* 404 Fallback */}
                <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </ComparisonProvider>
      </LocationProvider>
    </ToastProvider>
  );
};

export default App;
