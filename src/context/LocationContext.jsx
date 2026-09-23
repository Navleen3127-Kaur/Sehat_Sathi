import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { locationService } from '../services/locationService';

const LocationContext = createContext(null);

export const CITIES = locationService.getRegionalCities();

export const LocationProvider = ({ children }) => {
  // Default to central Chandigarh anchor until user requests GPS
  const [locationState, setLocationState] = useState({
    latitude: 30.7333,
    longitude: 76.7794,
    accuracy: null,
    city: "Chandigarh",
    state: "UT",
    country: "India",
    area: "",
    pincode: "",
    permissionStatus: "unknown", // 'unknown' | 'requesting' | 'granted' | 'denied' | 'unavailable'
    loading: false,
    error: null,
    isManual: true, // true until user explicitly grants GPS
    source: "manual" // 'manual' | 'current'
  });

  const [radius, setRadius] = useState(10); // km
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Check existing browser permission status on mount silently without prompting
  useEffect(() => {
    let isMounted = true;
    locationService.getLocationPermissionStatus().then(status => {
      if (!isMounted) return;
      if (status === 'granted') {
        // If already granted in browser settings from earlier session, user already approved
        setLocationState(prev => ({ ...prev, permissionStatus: 'granted', isManual: false, source: 'current' }));
      } else if (status === 'denied') {
        setLocationState(prev => ({ ...prev, permissionStatus: 'denied' }));
      }
    });
    return () => { isMounted = false; };
  }, []);

  /**
   * Explicit user-triggered location request.
   * Invoked when user clicks "Use My Location".
   */
  const requestLocation = useCallback(async () => {
    setLocationState(prev => ({
      ...prev,
      loading: true,
      error: null,
      permissionStatus: 'requesting'
    }));

    try {
      const coords = await locationService.getCurrentLocation();
      const geoInfo = await locationService.reverseGeocode(coords.latitude, coords.longitude);

      console.log('[LOCATION]', {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        permissionStatus: 'granted',
        city: geoInfo.city,
        source: 'current'
      });

      setLocationState({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        city: geoInfo.city,
        state: geoInfo.state,
        country: geoInfo.country,
        area: "",
        pincode: "",
        permissionStatus: 'granted',
        loading: false,
        error: null,
        isManual: false,
        source: 'current'
      });
      setIsPickerOpen(false);
      return true;
    } catch (err) {
      let status = 'unavailable';
      let friendlyError = "We couldn't determine your current location.";

      if (err.message === 'PERMISSION_DENIED') {
        status = 'denied';
        friendlyError = "Location access was denied. You can enter your location manually.";
      } else if (err.message === 'TIMEOUT') {
        status = 'unavailable';
        friendlyError = "Location request timed out. Please try again or select a city manually.";
      } else if (err.message === 'GEOLOCATION_UNSUPPORTED') {
        status = 'unavailable';
        friendlyError = "Geolocation is not supported by your browser.";
      }

      setLocationState(prev => ({
        ...prev,
        permissionStatus: status,
        loading: false,
        error: friendlyError
      }));
      return false;
    }
  }, []);

  /**
   * Manual fallback selection for city / area / pincode.
   */
  const setManualLocation = useCallback((manualData) => {
    const cityName = typeof manualData === 'string' ? manualData : manualData?.city;
    const matchingCity = CITIES.find(c => c.city.toLowerCase() === (cityName || '').toLowerCase()) || CITIES[0];
    const targetLat = (manualData && typeof manualData === 'object' && manualData.latitude) || matchingCity.lat;
    const targetLng = (manualData && typeof manualData === 'object' && manualData.longitude) || matchingCity.lng;

    console.log('[LOCATION]', {
      latitude: targetLat,
      longitude: targetLng,
      accuracy: null,
      permissionStatus: 'manual',
      city: matchingCity.city,
      source: 'manual'
    });

    setLocationState(prev => ({
      ...prev,
      latitude: targetLat,
      longitude: targetLng,
      accuracy: null,
      city: matchingCity.city,
      state: matchingCity.state,
      country: matchingCity.country,
      area: (manualData && typeof manualData === 'object' && manualData.area) || "",
      pincode: (manualData && typeof manualData === 'object' && manualData.pincode) || "",
      permissionStatus: prev.permissionStatus === 'granted' ? 'granted' : 'unknown',
      loading: false,
      error: null,
      isManual: true,
      source: 'manual'
    }));
    setIsPickerOpen(false);
  }, []);

  const clearLocationError = useCallback(() => {
    setLocationState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <LocationContext.Provider
      value={{
        ...locationState,
        selectedCity: locationState.city, // backward compatibility
        radius,
        setRadius,
        availableCities: CITIES,
        requestLocation,
        setManualLocation,
        changeCity: (name) => setManualLocation({ city: name }), // backward compatibility
        clearLocationError,
        isPickerOpen,
        openLocationPicker: () => setIsPickerOpen(true),
        closeLocationPicker: () => setIsPickerOpen(false)
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
