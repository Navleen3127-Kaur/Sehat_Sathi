import React, { useState } from 'react';
import { Link, NavLink, useLocation as useRouterLocation } from 'react-router-dom';
import { 
  Cross, 
  MapPin, 
  ShieldCheck, 
  Scale, 
  PhoneCall, 
  Menu, 
  X, 
  ChevronDown,
  Info,
  Search,
  Check,
  Navigation,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';
import { useLocation } from '../../context/LocationContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: compareCount } = useComparison();
  const { 
    city, 
    selectedCity, 
    permissionStatus, 
    isManual, 
    loading: locationLoading, 
    error: locationError, 
    requestLocation, 
    setManualLocation, 
    availableCities, 
    isPickerOpen, 
    openLocationPicker, 
    closeLocationPicker,
    clearLocationError
  } = useLocation();
  const routerLocation = useRouterLocation();

  const currentCityName = city || selectedCity || 'Chandigarh';
  const isGpsActive = permissionStatus === 'granted' && !isManual;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Hospitals', path: '/hospitals' },
    { 
      name: 'Compare', 
      path: '/compare',
      badge: compareCount > 0 ? compareCount : null 
    },
    { 
      name: 'Emergency', 
      path: '/emergency',
      isEmergency: true
    },
    { name: 'About', path: '/about' }
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleUseGps = async () => {
    const success = await requestLocation();
    if (success) {
      closeLocationPicker();
    }
  };

  const handleSelectCity = (c) => {
    setManualLocation(c);
    closeLocationPicker();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 py-1">
            
            {/* Left: Brand Logo + Product Name */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3.5 group">
                <img
                  src="/logo.jpg"
                  alt="Sehat_Sathi Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-2xl bg-white p-1 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                      Sehat_Sathi
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      Discovery
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:block font-medium mt-0.5">
                    Your Trusted Healthcare Companion
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center/Right Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-teal-700 bg-teal-50/80 font-semibold'
                        : link.isEmergency
                        ? 'text-rose-700 hover:text-rose-800 hover:bg-rose-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.isEmergency && (
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1.5 align-middle" />
                  )}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold rounded-full bg-teal-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Location Trigger + Admin Button */}
            <div className="hidden md:flex items-center gap-3">
              {/* Location Button */}
              <button
                type="button"
                onClick={openLocationPicker}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isGpsActive
                    ? 'border-teal-300 bg-teal-50/80 text-teal-800 hover:bg-teal-100/80'
                    : 'border-slate-200 bg-slate-50/90 text-slate-700 hover:bg-slate-100'
                }`}
                title="Change or detect location"
              >
                <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-teal-600' : 'text-slate-500'}`} />
                <span>{isGpsActive ? `Near ${currentCityName}` : currentCityName}</span>
                <span className="text-[10px] text-teal-700 font-bold bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/50">
                  {isGpsActive ? 'GPS' : 'Change'}
                </span>
              </button>

              {/* Admin Portal Button */}
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={openLocationPicker}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
              >
                <MapPin className="w-3 h-3 text-teal-600" />
                <span className="truncate max-w-[80px]">{currentCityName}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-lg">
            <div className="space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-semibold'
                        : link.isEmergency
                        ? 'text-rose-700 bg-rose-50/50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {link.isEmergency && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-1" />
                    )}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openLocationPicker();
                }}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Location: {currentCityName}</span>
                </span>
                <span className="text-teal-600 font-bold">Change</span>
              </button>

              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Location Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Your Healthcare Location</h3>
                  <p className="text-xs text-slate-500">Used to find and recommend nearby hospitals</p>
                </div>
              </div>
              <button
                onClick={closeLocationPicker}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Trigger Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleUseGps}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-70 cursor-pointer"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Detecting current location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-1.5">
                Requires browser permission. We never share your live coordinates.
              </p>
            </div>

            {/* Error / Denial banner */}
            {locationError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">Notice</p>
                  <p>{locationError}</p>
                </div>
              </div>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                  Or select city manually
                </span>
              </div>
            </div>

            {/* City Selection List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {availableCities.map(cityObj => {
                const name = cityObj.city || cityObj.name;
                const state = cityObj.state;
                const isSelected = currentCityName.toLowerCase() === name.toLowerCase();

                return (
                  <button
                    key={name}
                    onClick={() => handleSelectCity(cityObj)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span>{name}</span>
                      {state && <span className="text-[10px] text-slate-400">({state})</span>}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Privacy: Coordinates stay in browser.
              </span>
              <button
                onClick={closeLocationPicker}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
