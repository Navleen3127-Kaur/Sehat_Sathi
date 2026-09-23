import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  MapPin, 
  IndianRupee, 
  ChevronRight, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Activity, 
  AlertTriangle,
  Building2,
  CalendarCheck,
  Navigation,
  Loader2,
  Compass,
  Check
} from 'lucide-react';
import { AiSearchBar } from '../components/search/AiSearchBar';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { hospitalDiscoveryService } from '../services/hospitalDiscoveryService';
import { useLocation } from '../context/LocationContext';
import { SPECIALTIES } from '../data/specialties';
import { FACILITIES } from '../data/facilities';

export const HomePage = () => {
  const navigate = useNavigate();
  const { 
    latitude, 
    longitude, 
    city, 
    selectedCity, 
    permissionStatus, 
    isManual, 
    loading: locationLoading, 
    error: locationError, 
    requestLocation, 
    openLocationPicker 
  } = useLocation();

  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [showTraditionalFilters, setShowTraditionalFilters] = useState(false);

  // Traditional quick-filter state
  const currentCityName = city || selectedCity || 'Chandigarh';
  const isGpsActive = permissionStatus === 'granted' && !isManual;

  const [quickCondition, setQuickCondition] = useState('');
  const [quickLocation, setQuickLocation] = useState(currentCityName);
  const [quickBudget, setQuickBudget] = useState('');
  const [quickDistance, setQuickDistance] = useState(10);
  const [quickSpecialty, setQuickSpecialty] = useState('all');
  const [quickFacility, setQuickFacility] = useState('all');

  useEffect(() => {
    setQuickLocation(currentCityName);
  }, [currentCityName]);

  // Load nearby hospitals dynamically based on current coordinates
  useEffect(() => {
    setIsLoadingNearby(true);
    hospitalDiscoveryService.findNearbyHospitals({
      latitude,
      longitude,
      radiusKm: 25,
      city: currentCityName
    }).then(res => {
      // Pick top matches for home display
      const topPicks = [
        ...(res.sections.bestMatches || []),
        ...(res.sections.moreNearby || [])
      ].slice(0, 4);
      setNearbyHospitals(topPicks);
      setIsLoadingNearby(false);
    }).catch(err => {
      console.error(err);
      setIsLoadingNearby(false);
    });
  }, [latitude, longitude, currentCityName]);

  const handleAiSearch = (query) => {
    navigate(`/hospitals?q=${encodeURIComponent(query)}`);
  };

  const handleQuickFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickCondition) params.set('condition', quickCondition);
    if (quickLocation) params.set('location', quickLocation);
    if (quickBudget) params.set('budget', quickBudget);
    if (quickDistance) params.set('radius', quickDistance);
    if (quickSpecialty !== 'all') params.set('specialty', quickSpecialty);
    if (quickFacility !== 'all') params.set('facilities', quickFacility);

    navigate(`/hospitals?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-12 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Heading & Subtitle */}
          <div className="space-y-3 max-w-3xl mx-auto pt-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find the right hospital for your healthcare needs.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover hospitals based on condition, location, budget, facilities and verified information.
            </p>
          </div>

          {/* Main AI-Style Search Box */}
          <div className="pt-4">
            <AiSearchBar onSearch={handleAiSearch} />
          </div>

          {/* Toggle Traditional Filter Option */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setShowTraditionalFilters(!showTraditionalFilters)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>{showTraditionalFilters ? 'Hide detailed filters' : 'Or search using filters'}</span>
            </button>
          </div>

          {/* Expandable Traditional Filter Form */}
          {showTraditionalFilters && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card text-left max-w-4xl mx-auto animate-fade-in mt-4">
              <form onSubmit={handleQuickFilterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Condition */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Disease / Medical Condition
                    </label>
                    <input
                      type="text"
                      value={quickCondition}
                      onChange={(e) => setQuickCondition(e.target.value)}
                      placeholder="e.g. Dialysis, Cardiology, Orthopedics"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={quickLocation}
                      onChange={(e) => setQuickLocation(e.target.value)}
                      placeholder="e.g. Chandigarh, Mohali"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Budget Ceiling (INR)
                    </label>
                    <select
                      value={quickBudget}
                      onChange={(e) => setQuickBudget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="">Any Budget</option>
                      <option value="50000">Under ₹50,000</option>
                      <option value="100000">Under ₹1,00,000</option>
                      <option value="200000">Under ₹2,00,000</option>
                      <option value="350000">Under ₹3,50,000</option>
                      <option value="500000">Under ₹5,00,000</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Distance */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Maximum Distance
                    </label>
                    <select
                      value={quickDistance}
                      onChange={(e) => setQuickDistance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="5">Within 5 km</option>
                      <option value="10">Within 10 km</option>
                      <option value="25">Within 25 km</option>
                      <option value="50">Within 50 km</option>
                    </select>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Medical Specialty
                    </label>
                    <select
                      value={quickSpecialty}
                      onChange={(e) => setQuickSpecialty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="all">All Specialties</option>
                      {SPECIALTIES.map(s => (
                        <option key={s.id} value={s.shortName}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Required Facility */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Required Facility
                    </label>
                    <select
                      value={quickFacility}
                      onChange={(e) => setQuickFacility(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 bg-white"
                    >
                      <option value="all">Any Facilities</option>
                      {FACILITIES.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Find Hospitals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>

      {/* 2. LOCATION PROMPT & DISCOVERY BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isGpsActive ? (
          <div className="rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50/90 via-white to-teal-50/60 p-5 sm:p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">
                  <Compass className="w-4 h-4 text-teal-700" />
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Find hospitals near you
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Allow Sehat_Sathi to use your current location to calculate live travel distances and display closest medical options first.
              </p>
              <p className="text-[11px] text-slate-400">
                Privacy guarantee: Your coordinates stay in your browser and are never transmitted externally.
              </p>
              {locationError && (
                <p className="text-xs text-amber-700 font-medium pt-1">
                  {locationError}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={requestLocation}
                disabled={locationLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-70"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Detecting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Use My Location</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={openLocationPicker}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Select City Manually</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Healthcare near {currentCityName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    Live GPS Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distances and recommendations are dynamically resolved from your coordinates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openLocationPicker}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 px-3 py-1.5 rounded-lg bg-white border border-teal-200 hover:bg-teal-50 shrink-0"
            >
              Change Location
            </button>
          </div>
        )}
      </section>

      {/* 3. TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Why patients trust Sehat_Sathi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A responsible discovery ecosystem designed for medical transparency, not advertising.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Verified Information */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Verified Information
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hospital records include verified status badges, audit timestamps, and regulatory sources.
            </p>
          </div>

          {/* Card 2: Transparent Comparison */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Transparent Comparison
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare up to 4 hospitals side-by-side using clearly displayed infrastructure metrics.
            </p>
          </div>

          {/* Card 3: Location Based */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Location Based
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover reachable hospitals based on verified distance and regional travel perimeters.
            </p>
          </div>

          {/* Card 4: Budget Aware */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Budget Aware
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              View estimated procedure baseline ranges with explicit disclaimers for informed decisions.
            </p>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-slate-50/80 py-14 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Streamlined Discovery Workflow
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              How Sehat_Sathi Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Tell us what you need
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe your medical condition or type an AI query like kidney treatment with dialysis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Set your preferences
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your maximum distance, estimated budget ceiling, and required facilities like ICU or MRI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Compare matching hospitals
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review side-by-side matrices of beds, ICU capacity, costs, and verified credentials.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Choose based on criteria
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Call the hospital directly, review travel directions, or verify facility status.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOSPITALS NEAR YOU SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Proximity & Criteria Matches
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isGpsActive ? `Hospitals Near You` : `Hospitals Near ${currentCityName}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Accredited tertiary and super-speciality facilities sorted by proximity and criteria alignment.
            </p>
          </div>

          <Link
            to="/hospitals"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Nearby Hospitals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoadingNearby ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Finding nearby accredited hospitals...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {nearbyHospitals.map(hospital => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}
      </section>

      {/* 6. RESPONSIBLE HEALTHCARE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-teal-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Recommendation Guarantee</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              We never promote hospitals as medically "the best".
            </h3>
            <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
              Our recommendation scores reflect how closely hospital facilities, distance, and baseline costs match your specified criteria. We never claim clinical cure rates or accept paid ranking placements.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-teal-950 font-bold text-xs hover:bg-teal-50 transition-colors shrink-0 shadow-sm"
          >
            <span>Learn About Our Methodology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
