import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, Filter, Sparkles, MapPin, Compass, Scale } from 'lucide-react';
import { AiSearchBar } from '../components/search/AiSearchBar';
import { UnderstoodRequestCard } from '../components/search/UnderstoodRequestCard';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { SortSelector } from '../components/search/SortSelector';
import { HospitalGrid } from '../components/hospital/HospitalGrid';
import { searchService } from '../services/searchService';
import { aiService } from '../services/aiService';
import { sortHospitals } from '../services/recommendationService';
import { useLocation } from '../context/LocationContext';
import { useComparison } from '../context/ComparisonContext';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setDynamicTopTwo, clearDynamicTopTwo, applyTopTwoComparison } = useComparison();
  const { latitude, longitude, city, selectedCity, isManual, source, openLocationPicker, setManualLocation } = useLocation();

  const urlQuery = searchParams.get('q') || '';
  const urlCondition = searchParams.get('condition') || '';
  const urlLocation = searchParams.get('location') || '';
  const urlBudget = searchParams.get('budget') ? Number(searchParams.get('budget')) : '';
  const urlRadius = searchParams.get('radius') || 'auto';
  const urlSpecialty = searchParams.get('specialty') || 'all';
  const urlEmergency = searchParams.get('emergency') === 'true';
  const urlFacilities = searchParams.get('facilities') ? searchParams.get('facilities').split(',').filter(Boolean) : [];

  // Helper to build canonical state from search query
  const buildStateFromQuery = useCallback((queryText) => {
    const clean = (queryText || '').trim();
    if (!clean) return null;
    const parsed = aiService.parseSearchIntent(clean);
    if (!parsed) return null;

    const canonicalFilters = {
      condition: parsed.condition || '',
      conditionLabel: parsed.condition ? (parsed.conditionLabel || parsed.condition) : 'No specific condition',
      specialty: parsed.specialty || 'all',
      location: parsed.location || '',
      budget: parsed.budgetMax !== null && parsed.budgetMax !== undefined ? parsed.budgetMax : '',
      facilities: parsed.facilities || [],
      emergencyOnly: !!parsed.emergencyRequired,
      radius: 'auto',
      accreditation: 'all',
      minBeds: 0
    };

    const appliedFields = {
      condition: !!parsed.condition,
      location: !!parsed.location,
      budget: parsed.budgetMax !== null && parsed.budgetMax !== undefined,
      facilities: (parsed.facilities || []).length > 0,
      emergency: !!parsed.emergencyRequired
    };

    return { parsed, canonicalFilters, appliedFields };
  }, []);

  // SYNCHRONOUS INITIAL STATE: If urlQuery exists on mount, immediately parse into canonical state!
  const initialData = useMemo(() => {
    if (urlQuery && urlQuery.trim()) {
      return buildStateFromQuery(urlQuery);
    }
    return null;
  }, []); // Run on initial creation

  // SINGLE SOURCE OF TRUTH: Shared canonical filter and search state
  const [filters, setFilters] = useState(() => {
    if (initialData?.canonicalFilters) {
      return initialData.canonicalFilters;
    }
    return {
      condition: urlCondition || '',
      conditionLabel: urlCondition || 'No specific condition',
      location: urlLocation || '',
      radius: urlRadius,
      budget: urlBudget,
      specialty: urlSpecialty,
      emergencyOnly: urlEmergency,
      facilities: urlFacilities,
      accreditation: 'all',
      minBeds: 0
    };
  });

  // Track which criteria were auto-populated by AI Search
  const [aiAppliedFields, setAiAppliedFields] = useState(() => {
    if (initialData?.appliedFields) {
      return initialData.appliedFields;
    }
    return {
      condition: false,
      location: false,
      budget: false,
      facilities: false,
      emergency: false
    };
  });

  const [sort, setSort] = useState('highest_rating');
  const [hospitals, setHospitals] = useState([]);
  const [sections, setSections] = useState(null);
  const [expansionNotice, setExpansionNotice] = useState(null);
  const [activeAutoRadius, setActiveAutoRadius] = useState(5);
  const [wasExpanded, setWasExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [parsedAiRequest, setParsedAiRequest] = useState(() => initialData?.parsed || null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [coverageInfo, setCoverageInfo] = useState({
    isOutsideCoverage: false,
    coveredCities: [],
    minHospitalDistance: 0
  });

  // DERIVED SORTED HOSPITALS: Synchronously sorted based on active sort dropdown selection
  const sortedHospitals = useMemo(() => {
    return sortHospitals(hospitals, sort, {
      condition: filters.condition,
      procedure: parsedAiRequest?.procedure || initialData?.parsed?.procedure || '',
      query: urlQuery
    });
  }, [hospitals, sort, filters.condition, parsedAiRequest, initialData, urlQuery]);

  // Keep dynamic top two comparison synchronized with currently sorted top matches
  useEffect(() => {
    if (sortedHospitals.length >= 2) {
      setDynamicTopTwo(sortedHospitals, filters.condition);
    } else {
      clearDynamicTopTwo();
    }
  }, [sortedHospitals, filters.condition, setDynamicTopTwo, clearDynamicTopTwo]);

  // Refs to eliminate race conditions and avoid stale closures
  const activeRequestIdRef = useRef(0);
  const sortRef = useRef(sort);
  const filtersRef = useRef(filters);
  const urlQueryRef = useRef(urlQuery);
  const lastHandledQueryRef = useRef(urlQuery);
  const hasExecutedInitialRef = useRef(false);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    urlQueryRef.current = urlQuery;
  }, [urlQuery]);

  // Synchronized search runner
  const executeSearch = useCallback(async (canonicalFilters, queryText, requestId) => {
    setIsLoading(true);
    const isAutoRadius = canonicalFilters.radius === 'auto' || !canonicalFilters.radius;
    const initialRadius = isAutoRadius ? 'auto' : Number(canonicalFilters.radius);

    const locSource = source || (isManual ? 'manual' : 'current');
    console.log('[QUERY]', queryText || '');
    console.log('[SEARCH LOCATION]', {
      latitude,
      longitude,
      source: locSource
    });
    console.log('[PARSED INTENT]', {
      condition: canonicalFilters.condition || null,
      requiredFacilities: canonicalFilters.facilities || [],
      budgetMax: canonicalFilters.budget !== '' && canonicalFilters.budget !== null && canonicalFilters.budget !== undefined ? Number(canonicalFilters.budget) : null
    });
    console.log('[FILTER STATE]', {
      condition: canonicalFilters.condition || null,
      budgetMax: canonicalFilters.budget !== '' && canonicalFilters.budget !== null && canonicalFilters.budget !== undefined ? Number(canonicalFilters.budget) : null,
      requiredFacilities: canonicalFilters.facilities || []
    });

    try {
      const res = await searchService.searchHospitals({
        query: queryText,
        condition: canonicalFilters.condition || '',
        location: canonicalFilters.location,
        radius: initialRadius,
        budget: canonicalFilters.budget,
        specialty: canonicalFilters.specialty,
        facilities: canonicalFilters.facilities,
        emergencyOnly: canonicalFilters.emergencyOnly,
        accreditation: canonicalFilters.accreditation,
        minBeds: canonicalFilters.minBeds,
        sort: sortRef.current,
        latitude,
        longitude
      });

      // Ignore stale responses from earlier queries
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      setHospitals(res.results);
      setSections(res.sections);
      setExpansionNotice(res.expansionMessage);
      setWasExpanded(res.wasExpanded);
      setActiveAutoRadius(res.activeRadius || 5);
      setCoverageInfo({
        isOutsideCoverage: !!res.isOutsideCoverage,
        coveredCities: res.coveredCities || [],
        minHospitalDistance: res.minHospitalDistance || 0
      });
      setIsLoading(false);
    } catch (err) {
      if (requestId === activeRequestIdRef.current) {
        console.error("Search execution error:", err);
        setIsLoading(false);
      }
    }
  }, [latitude, longitude, source, isManual, setDynamicTopTwo]);

  // Coordinate change effect: When user location / GPS changes, re-run search with updated coordinates
  const prevCoordsRef = useRef({ latitude, longitude });
  useEffect(() => {
    if (prevCoordsRef.current.latitude === latitude && prevCoordsRef.current.longitude === longitude) {
      return;
    }
    prevCoordsRef.current = { latitude, longitude };
    clearDynamicTopTwo();

    const locSource = source || (isManual ? 'manual' : 'current');
    console.log('[SEARCH LOCATION]', {
      latitude,
      longitude,
      source: locSource
    });

    const requestId = ++activeRequestIdRef.current;
    executeSearch(filtersRef.current, urlQueryRef.current, requestId);
  }, [latitude, longitude, source, isManual, executeSearch]);

  // 1. Initial Mount & URL Query Change Handler
  useEffect(() => {
    // If on initial mount and query was pre-parsed:
    if (!hasExecutedInitialRef.current) {
      hasExecutedInitialRef.current = true;
      const requestId = ++activeRequestIdRef.current;
      if (initialData) {
        console.log('[SEARCH RAW]', urlQuery);
        console.log('[SEARCH PARSED INTENT]', {
          condition: initialData.parsed.condition || null,
          requiredFacilities: initialData.parsed.facilities || [],
          budgetMax: initialData.parsed.budgetMax !== undefined ? initialData.parsed.budgetMax : null
        });
        console.log('[SEARCH CANONICAL STATE]', {
          condition: initialData.canonicalFilters.condition || null,
          budgetMax: initialData.canonicalFilters.budget !== '' ? initialData.canonicalFilters.budget : null,
          requiredFacilities: initialData.canonicalFilters.facilities
        });
        console.log('[FILTER STATE]', {
          condition: initialData.canonicalFilters.condition || null,
          budgetMax: initialData.canonicalFilters.budget !== '' ? initialData.canonicalFilters.budget : null,
          requiredFacilities: initialData.canonicalFilters.facilities
        });
        executeSearch(initialData.canonicalFilters, urlQuery, requestId);
      } else {
        executeSearch(filtersRef.current, urlQuery, requestId);
      }
      return;
    }

    // On subsequent query changes from URL navigation:
    if (urlQuery === lastHandledQueryRef.current) {
      return;
    }
    lastHandledQueryRef.current = urlQuery;

    const requestId = ++activeRequestIdRef.current;

    if (urlQuery && urlQuery.trim() !== '') {
      const state = buildStateFromQuery(urlQuery);
      if (!state) return;

      console.log('[SEARCH RAW]', urlQuery);
      console.log('[SEARCH PARSED INTENT]', {
        condition: state.parsed.condition || null,
        requiredFacilities: state.parsed.facilities || [],
        budgetMax: state.parsed.budgetMax !== undefined ? state.parsed.budgetMax : null
      });
      console.log('[SEARCH CANONICAL STATE]', {
        condition: state.canonicalFilters.condition || null,
        budgetMax: state.canonicalFilters.budget !== '' ? state.canonicalFilters.budget : null,
        requiredFacilities: state.canonicalFilters.facilities
      });
      console.log('[FILTER STATE]', {
        condition: state.canonicalFilters.condition || null,
        budgetMax: state.canonicalFilters.budget !== '' ? state.canonicalFilters.budget : null,
        requiredFacilities: state.canonicalFilters.facilities
      });

      setParsedAiRequest(state.parsed);
      setAiAppliedFields(state.appliedFields);
      setFilters(state.canonicalFilters);
      executeSearch(state.canonicalFilters, urlQuery, requestId);
    } else {
      setParsedAiRequest(null);
      setAiAppliedFields({
        condition: false,
        location: false,
        budget: false,
        facilities: false,
        emergency: false
      });
      executeSearch(filtersRef.current, '', requestId);
    }
  }, [urlQuery, buildStateFromQuery, executeSearch, initialData]);

  // When sorting changes, re-execute search with current canonical filters ONLY
  const prevSortRef = useRef(sort);
  useEffect(() => {
    if (prevSortRef.current === sort) {
      return;
    }
    prevSortRef.current = sort;
    const requestId = ++activeRequestIdRef.current;
    executeSearch(filtersRef.current, urlQueryRef.current, requestId);
  }, [sort, executeSearch]);

  // New query submitted via AI Search Bar
  const handleAiSearch = (newQuery) => {
    const cleanQuery = (newQuery || '').trim();
    if (!cleanQuery) return;

    console.log('[SEARCH RAW]', cleanQuery);

    const state = buildStateFromQuery(cleanQuery);
    if (!state) return;

    console.log('[SEARCH PARSED INTENT]', {
      condition: state.parsed.condition || null,
      requiredFacilities: state.parsed.facilities || [],
      budgetMax: state.parsed.budgetMax !== undefined ? state.parsed.budgetMax : null
    });

    console.log('[SEARCH CANONICAL STATE]', {
      condition: state.canonicalFilters.condition || null,
      budgetMax: state.canonicalFilters.budget !== '' ? state.canonicalFilters.budget : null,
      requiredFacilities: state.canonicalFilters.facilities
    });

    console.log('[FILTER STATE]', {
      condition: state.canonicalFilters.condition || null,
      budgetMax: state.canonicalFilters.budget !== '' ? state.canonicalFilters.budget : null,
      requiredFacilities: state.canonicalFilters.facilities
    });

    lastHandledQueryRef.current = cleanQuery;
    const requestId = ++activeRequestIdRef.current;

    clearDynamicTopTwo();
    setParsedAiRequest(state.parsed);
    setAiAppliedFields(state.appliedFields);
    setFilters(state.canonicalFilters);
    setSearchParams({ q: cleanQuery });

    executeSearch(state.canonicalFilters, cleanQuery, requestId);
  };

  // Manual filter change by user in FilterSidebar
  const handleFilterChange = (updatedFilters) => {
    const requestId = ++activeRequestIdRef.current;
    clearDynamicTopTwo();

    // Track manual modifications to AI applied fields
    const isBudgetModified = updatedFilters.budget !== filters.budget;
    const isConditionModified = updatedFilters.condition !== filters.condition;
    const isLocationModified = updatedFilters.location !== filters.location;
    const isFacilitiesModified = (updatedFilters.facilities?.length || 0) !== (filters.facilities?.length || 0);

    setAiAppliedFields(prev => ({
      condition: isConditionModified ? false : prev.condition,
      location: isLocationModified ? false : prev.location,
      budget: isBudgetModified ? false : prev.budget,
      facilities: isFacilitiesModified ? false : prev.facilities,
      emergency: updatedFilters.emergencyOnly === filters.emergencyOnly ? prev.emergency : false
    }));

    // Synchronize parsed AI card so both components agree
    if (parsedAiRequest) {
      const updatedFacs = updatedFilters.facilities || [];
      const updatedFacLabels = updatedFacs.map(f => {
        if (f === 'dialysis') return 'Dialysis Unit';
        if (f === 'icu') return 'ICU';
        if (f === 'mri') return 'MRI Imaging';
        if (f === 'ct_scan') return 'CT Scan';
        if (f === 'blood_bank') return 'Blood Bank';
        return f.replace('_', ' ').toUpperCase();
      });

      setParsedAiRequest(prev => prev ? ({
        ...prev,
        budgetMax: updatedFilters.budget ? Number(updatedFilters.budget) : null,
        budgetLabel: updatedFilters.budget ? `Up to ₹${Number(updatedFilters.budget).toLocaleString('en-IN')}` : 'Any Budget',
        condition: updatedFilters.condition !== undefined ? updatedFilters.condition : prev.condition,
        conditionLabel: updatedFilters.condition ? updatedFilters.condition : 'No specific condition',
        location: updatedFilters.location !== undefined ? updatedFilters.location : prev.location,
        facilities: updatedFacs,
        facilityLabels: updatedFacLabels,
        isBudgetManuallyModified: isBudgetModified || prev.isBudgetManuallyModified
      }) : null);
    }

    setFilters(updatedFilters);
    executeSearch(updatedFilters, urlQueryRef.current, requestId);
  };

  // Reset all filters and search state to initial defaults
  const handleResetFilters = (defaults) => {
    const requestId = ++activeRequestIdRef.current;
    const freshDefaults = defaults || {
      condition: '',
      conditionLabel: 'No specific condition',
      location: '',
      radius: 'auto',
      budget: '',
      specialty: 'all',
      emergencyOnly: false,
      facilities: [],
      accreditation: 'all',
      minBeds: 0
    };

    lastHandledQueryRef.current = '';
    clearDynamicTopTwo();
    setFilters(freshDefaults);
    setParsedAiRequest(null);
    setAiAppliedFields({
      condition: false,
      location: false,
      budget: false,
      facilities: false,
      emergency: false
    });
    setSearchParams({});
    executeSearch(freshDefaults, '', requestId);
  };

  const handleRelaxFilter = (field, val) => {
    handleFilterChange({ ...filters, [field]: val });
  };

  // Quick edit update from UnderstoodRequestCard
  const handleUpdateParsedAi = (updated) => {
    const updatedFilters = {
      ...filters,
      condition: updated.condition || '',
      conditionLabel: updated.conditionLabel || updated.condition || '',
      location: updated.location || '',
      budget: updated.budgetMax || '',
      facilities: updated.facilities || []
    };
    handleFilterChange(updatedFilters);
  };

  const isRadiusAuto = filters.radius === 'auto' || !filters.radius;
  const verifiedCount = sortedHospitals.filter(h => h.verification?.status === 'verified').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top AI Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-soft">
        <AiSearchBar 
          onSearch={handleAiSearch} 
          initialValue={urlQuery} 
          placeholder="Describe your healthcare need in English, हिन्दी, or ਪੰਜਾਬੀ..."
          isCompact={true}
        />
      </div>

      {/* Mobile Filter Action Button */}
      <div className="flex md:hidden items-center justify-between">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-soft cursor-pointer"
        >
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filters & Criteria</span>
          {(filters.facilities?.length > 0 || filters.budget || filters.specialty !== 'all' || filters.condition) && (
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          )}
        </button>
        <span className="text-xs text-slate-500 font-medium">
          {sortedHospitals.length} {sortedHospitals.length === 1 ? 'hospital' : 'hospitals'} found
        </span>
      </div>

      {/* Main Grid: Left Filter Sidebar + Right Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Left Filter Sidebar */}
        <div className="hidden md:block md:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResultsCount={sortedHospitals.length}
            activeAutoRadius={activeAutoRadius}
            isRadiusAuto={isRadiusAuto}
            aiAppliedFields={aiAppliedFields}
          />
        </div>

        {/* Right Main Results Column */}
        <div className="md:col-span-3 space-y-4">
          
          {/* Sorting Header */}
          <SortSelector
            currentSort={sort}
            onSortChange={setSort}
            totalCount={sortedHospitals.length}
            costUnavailableCount={sections?.costUnavailable?.length || 0}
            budgetContext={filters.budget}
            verifiedCount={verifiedCount}
            conditionContext={filters.condition}
            facilitiesContext={filters.facilities}
          />

          {/* Dynamic Top-2 Compare CTA Banner */}
          {!isLoading && sortedHospitals.length >= 2 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-navy-950 text-white shadow-elevated border border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-[11px] uppercase tracking-wider border border-teal-400/30">
                    Dynamic Match Comparison
                  </span>
                  <span className="text-xs text-slate-300">
                    Derived from your active search criteria
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Compare Top 2 Matches: {sortedHospitals[0].shortName || sortedHospitals[0].name} vs {sortedHospitals[1].shortName || sortedHospitals[1].name}
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Neutral side-by-side evaluation of facilities, verified accreditations, distance ({sortedHospitals[0].distance != null ? `${sortedHospitals[0].distance} km` : (sortedHospitals[0].city || 'Reference Centre')} vs {sortedHospitals[1].distance != null ? `${sortedHospitals[1].distance} km` : (sortedHospitals[1].city || 'Reference Centre')}), and published performance metrics.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    applyTopTwoComparison([sortedHospitals[0], sortedHospitals[1]]);
                    navigate(`/compare?ids=${sortedHospitals[0].id},${sortedHospitals[1].id}&condition=${encodeURIComponent(filters.condition || '')}`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-navy-950" />
                  <span>Compare Top 2 Matches</span>
                </button>
              </div>
            </div>
          )}

          {/* Single Match Notification (At least 2 required for comparison) */}
          {!isLoading && sortedHospitals.length === 1 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-bold">
                  Only 1 matching hospital found for your criteria ({sortedHospitals[0].name}).
                </p>
                <p className="text-amber-700">
                  At least 2 matches required for comparison. Consider expanding your search radius to discover additional facilities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRelaxFilter('radius', '50')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold text-xs transition-colors shrink-0"
              >
                Expand Radius to 50 km
              </button>
            </div>
          )}

          {/* Hospital Results Grid with section layout and expansion banners */}
          <HospitalGrid
            hospitals={sortedHospitals}
            sections={sort === 'recommended' ? sections : null}
            sort={sort}
            expansionNotice={expansionNotice}
            wasExpanded={wasExpanded}
            activeAutoRadius={activeAutoRadius}
            activeFilters={filters}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
            onRelaxFilter={handleRelaxFilter}
            conditionContext={filters.condition}
            procedureContext={parsedAiRequest?.procedure || initialData?.parsed?.procedure || ''}
            query={urlQuery}
            isOutsideCoverage={coverageInfo.isOutsideCoverage}
            coveredCities={coverageInfo.coveredCities}
            minHospitalDistance={coverageInfo.minHospitalDistance}
            onSelectCity={(cityName) => setManualLocation({ city: cityName })}
            onOpenPicker={openLocationPicker}
          />

        </div>

      </div>

      {/* Mobile Filters Slide-in Bottom Sheet / Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-navy-950/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-elevated border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filters & Criteria</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onApplyFilters={() => setIsMobileDrawerOpen(false)}
              totalResultsCount={sortedHospitals.length}
              activeAutoRadius={activeAutoRadius}
              isRadiusAuto={isRadiusAuto}
              aiAppliedFields={aiAppliedFields}
            />
          </div>
        </div>
      )}

    </div>
  );
};
