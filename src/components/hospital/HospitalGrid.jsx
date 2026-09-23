import React from 'react';
import { HospitalCard } from './HospitalCard';
import { LoadingGrid } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { Sparkles, MapPin, Compass, AlertCircle, Building2 } from 'lucide-react';

export const HospitalGrid = ({ 
  hospitals = [], 
  sections = null,
  sort = 'highest_rating',
  expansionNotice = null,
  wasExpanded = false,
  activeAutoRadius = 5,
  activeFilters = {},
  isLoading = false, 
  onResetFilters,
  onRelaxFilter,
  conditionContext = '',
  procedureContext = '',
  query = '',
  isOutsideCoverage = false,
  coveredCities = [],
  minHospitalDistance = 0,
  onSelectCity,
  onOpenPicker
}) => {
  if (isLoading) {
    return <LoadingGrid count={3} />;
  }

  const nationalRefMatches = sections?.nationalReferenceMatches?.length > 0 
    ? sections.nationalReferenceMatches 
    : (hospitals.filter(h => h.isNationalReference));
  const isNational = nationalRefMatches.length > 0;

  const nearYouHospitals = sections?.nearYou?.length > 0 ? sections.nearYou : (sections?.bestMatches || []);
  const moreNearbyHospitals = sections?.moreNearby || [];
  const nearbyAreasHospitals = sections?.nearbyAreas?.length > 0 ? sections.nearbyAreas : (sections?.expandedArea || []);
  const upTo50kmHospitals = sections?.upTo50km || [];
  const costUnavailableHospitals = sections?.costUnavailable || [];

  const hasSectionData = sections && (
    nearYouHospitals.length > 0 ||
    moreNearbyHospitals.length > 0 ||
    nearbyAreasHospitals.length > 0 ||
    upTo50kmHospitals.length > 0 ||
    costUnavailableHospitals.length > 0
  );

  const isCustomSort = sort && sort !== 'recommended';

  const totalPrimaryCount = isCustomSort
    ? (hospitals?.length || 0)
    : (isNational
      ? nationalRefMatches.length
      : (hasSectionData 
        ? (nearYouHospitals.length + moreNearbyHospitals.length + nearbyAreasHospitals.length + upTo50kmHospitals.length + costUnavailableHospitals.length)
        : (hospitals?.length || 0)));

  if (totalPrimaryCount === 0) {
    return (
      <EmptyState 
        onReset={onResetFilters} 
        onRelaxFilter={onRelaxFilter}
        activeFilters={activeFilters}
        activeRadius={activeAutoRadius}
        isOutsideCoverage={isOutsideCoverage}
        coveredCities={coveredCities}
        minHospitalDistance={minHospitalDistance}
        onSelectCity={onSelectCity}
        onOpenPicker={onOpenPicker}
      />
    );
  }

  // Active custom sort (Rating, Distance, or Cost):
  // Render hospitals in the exact computed sorted order.
  if (isCustomSort) {
    return (
      <div className="space-y-4">


        {hospitals.map(hospital => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            conditionContext={conditionContext}
            procedureContext={procedureContext}
            query={query}
          />
        ))}
      </div>
    );
  }

  // Curated National Reference Layout Rendering
  if (isNational) {
    return (
      <div className="space-y-4">
        {/* Reference Hospital Cards in Deterministic Order */}
        {nationalRefMatches.map(hospital => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            conditionContext={conditionContext}
            procedureContext={procedureContext}
            query={query}
          />
        ))}
      </div>
    );
  }

  // Sectioned layout rendering
  if (hasSectionData) {
    return (
      <div className="space-y-8">


        {/* Section 1: Matching Hospitals Near You (0–5 km) */}
        {nearYouHospitals.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Matching Hospitals Near You (0–5 km)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Immediate local options strictly matching your medical needs
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                {nearYouHospitals.length} {nearYouHospitals.length === 1 ? 'Hospital' : 'Hospitals'}
              </span>
            </div>

            <div className="space-y-4">
              {nearYouHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  conditionContext={conditionContext}
                  procedureContext={procedureContext}
                  query={query}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: More Matching Hospitals Nearby (>5–10 km) */}
        {moreNearbyHospitals.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-blue-700" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    More Matching Hospitals Nearby (&gt;5–10 km)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Healthcare facilities matching your requirements within 10 km
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                {moreNearbyHospitals.length} {moreNearbyHospitals.length === 1 ? 'Hospital' : 'Hospitals'}
              </span>
            </div>

            <div className="space-y-4">
              {moreNearbyHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  conditionContext={conditionContext}
                  procedureContext={procedureContext}
                  query={query}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Matching Hospitals in Nearby Areas (>10–25 km) */}
        {nearbyAreasHospitals.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
                  <Compass className="w-4 h-4 text-amber-700" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Matching Hospitals in Nearby Areas (&gt;10–25 km)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Healthcare facilities matching your requirements in adjacent regional clusters
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                {nearbyAreasHospitals.length} {nearbyAreasHospitals.length === 1 ? 'Hospital' : 'Hospitals'}
              </span>
            </div>

            <div className="space-y-4">
              {nearbyAreasHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  conditionContext={conditionContext}
                  procedureContext={procedureContext}
                  query={query}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Matching Hospitals Up to 50 km (>25–50 km) */}
        {upTo50kmHospitals.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-800 font-bold text-xs">
                  <Compass className="w-4 h-4 text-purple-700" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Matching Hospitals Up to 50 km (&gt;25–50 km)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Expanded regional facilities strictly satisfying your clinical requirements
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                {upTo50kmHospitals.length} {upTo50kmHospitals.length === 1 ? 'Hospital' : 'Hospitals'}
              </span>
            </div>

            <div className="space-y-4">
              {upTo50kmHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  conditionContext={conditionContext}
                  procedureContext={procedureContext}
                  query={query}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Relevant Options — Cost Data Not Available */}
        {costUnavailableHospitals.length > 0 && (
          <div className="space-y-4 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Relevant Options — Cost Data Not Available</h3>
                <p className="text-xs opacity-90 mt-0.5">
                  These hospitals match your medical condition, but specific treatment cost data is currently unrecorded or unpublished. They are separated here and not marked as satisfying your specific budget limit.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {costUnavailableHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  conditionContext={conditionContext}
                  procedureContext={procedureContext}
                  query={query}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // Standard flat fallback
  return (
    <div className="space-y-4">
      {hospitals.map(hospital => (
        <HospitalCard
          key={hospital.id}
          hospital={hospital}
          conditionContext={conditionContext}
          procedureContext={procedureContext}
          query={query}
        />
      ))}
    </div>
  );
};
