import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  WifiOff, 
  Compass, 
  RotateCw, 
  CheckCircle2,
  Navigation,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { emergencyService } from '../../services/emergencyService';
import { offlineService } from '../../services/offlineService';
import { locationService } from '../../services/locationService';
import { EmergencyHospitalCard } from './EmergencyHospitalCard';
import { DirectionsModal } from '../common/DirectionsModal';

export const EmergencyMode = () => {
  // GPS state
  const [gpsStatus, setGpsStatus] = useState('requesting'); // 'requesting' | 'active' | 'unavailable' | 'denied'
  const [gpsCoords, setGpsCoords] = useState(null); // { latitude, longitude }
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  // Online / Offline state
  const [isOnline, setIsOnline] = useState(offlineService.isOnline());
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Data & radius state
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [radius, setRadius] = useState(null); // null means all / closest
  const [selectedHospitalForDirections, setSelectedHospitalForDirections] = useState(null);

  // 1. Listen for network online / offline events
  useEffect(() => {
    const unsubscribe = offlineService.subscribeNetworkStatus(({ isOnline: online }) => {
      setIsOnline(online);
      if (online) {
        // Automatically sync fresh data when connection recovers
        offlineService.syncEmergencyHospitals().then(res => {
          setLastSyncTime(res.lastSync);
        });
      }
    });
    return unsubscribe;
  }, []);

  // 2. Request GPS location on mount (PART 3: Request location permission only when Emergency Mode is opened)
  const requestGps = async () => {
    setGpsStatus('requesting');
    setGpsErrorMsg('');
    try {
      const pos = await locationService.getCurrentLocation();
      if (pos && pos.latitude && pos.longitude) {
        setGpsCoords({ latitude: pos.latitude, longitude: pos.longitude });
        setGpsStatus('active');
      } else {
        setGpsStatus('unavailable');
        setGpsErrorMsg('Location permission is required to calculate nearby hospitals.');
      }
    } catch (err) {
      setGpsStatus('unavailable');
      setGpsErrorMsg('Location permission is required to calculate nearby hospitals.');
    }
  };

  useEffect(() => {
    requestGps();
  }, []);

  // 3. Load hospitals whenever GPS coordinates change or radius changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const lat = gpsCoords?.latitude ?? null;
    const lng = gpsCoords?.longitude ?? null;

    emergencyService.getNearbyEmergencyHospitals(lat, lng, radius)
      .then(res => {
        if (!isCancelled) {
          setHospitals(res.hospitals);
          setLastSyncTime(res.lastSync);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('[EmergencyMode] load error:', err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [gpsCoords, radius]);

  const emergencyHelplines = [
    { label: "National Ambulance", number: "108", sub: "Toll-free 24/7 medical dispatch", primary: true },
    { label: "Unified Emergency", number: "112", sub: "Police, Fire & Medical rescue", primary: false },
    { label: "Maternal & Child Transport", number: "102", sub: "Dedicated Janani Shishu dispatch", primary: false }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* 1. TOP HEADER & TELEMETRY STRIP (PART 1) */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-navy-950 text-white p-6 sm:p-8 shadow-elevated border border-rose-800/80 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>🚨 EMERGENCY MODE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Emergency Healthcare Access
            </h1>
            <p className="text-sm text-rose-100/90 leading-relaxed">
              Fast, proximity-based access to nearest emergency-capable hospitals. Operates offline using cached hospital directory.
            </p>
          </div>

          {/* Quick SOS Call 108 */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg hover:shadow-rose-500/30 hover:scale-105"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call 108 Ambulance</span>
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              <span>Dial 112 Rescue</span>
            </a>
          </div>
        </div>

        {/* System Telemetry Status (GPS & Internet Status) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rose-800/60">
          {/* GPS Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5">
              <Compass className={`w-5 h-5 ${gpsStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <span className="text-[11px] text-rose-200 block font-medium">Device GPS</span>
                <span className="text-sm font-bold text-white">
                  {gpsStatus === 'active' && '📍 GPS: Active'}
                  {gpsStatus === 'requesting' && '📍 GPS: Detecting...'}
                  {gpsStatus === 'unavailable' && '📍 Location unavailable'}
                </span>
              </div>
            </div>
            {gpsStatus !== 'active' && (
              <button
                type="button"
                onClick={requestGps}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Enable GPS
              </button>
            )}
          </div>

          {/* Internet Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-emerald-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-amber-400 animate-pulse" />
              )}
              <div>
                <span className="text-[11px] text-rose-200 block font-medium">Network Connectivity</span>
                <span className="text-sm font-bold text-white">
                  {isOnline ? '🌐 Internet: Online' : '🌐 Internet: Offline'}
                </span>
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {isOnline ? 'Live Network' : 'Offline Cache'}
            </span>
          </div>
        </div>

        {/* National Emergency Helplines Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-rose-800/60">
          {emergencyHelplines.map((sos, idx) => (
            <a
              key={idx}
              href={`tel:${sos.number}`}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="text-[11px] text-rose-200 block">{sos.label}</span>
                <span className="text-lg font-black text-white">{sos.number}</span>
                <span className="text-[10px] text-rose-300/70 block">{sos.sub}</span>
              </div>
              <Phone className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      {/* 2. GPS UNAVAILABLE WARNING (PART 3) */}
      {gpsStatus === 'unavailable' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-soft">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-950">📍 Location permission is required to calculate nearby hospitals.</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Without location access, distances cannot be calculated from your position. Hospitals are displayed based on emergency capability and facilities.
            </p>
            <button
              type="button"
              onClick={requestGps}
              className="mt-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Allow Location Access
            </button>
          </div>
        </div>
      )}

      {/* 3. OFFLINE WARNING BANNER (PART 8) */}
      {!isOnline && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-800 flex items-start gap-3.5 shadow-soft animate-fade-in">
          <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              ⚠️ You are offline.
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Emergency hospital information is based on locally cached data from the last available sync.
            </p>
            {lastSyncTime && (
              <p className="text-slate-500 text-xs font-semibold pt-0.5">
                Last updated: {offlineService.formatLastSync(lastSyncTime)}
              </p>
            )}
            <p className="text-[11px] text-slate-500 pt-1">
              Notice: Offline cached data shows directory capabilities. Ambulance availability, ICU beds, and doctor on-duty status are not live. If both cellular and internet connectivity are absent, placing direct phone calls may fail.
            </p>
          </div>
        </div>
      )}

      {/* 4. DATASET HONESTY DISCLAIMER (PART 13) */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Emergency information is based on the Sehat_Sathi prototype dataset and may not reflect current hospital availability.
        </span>
      </div>

      {/* 5. SEARCH & FILTER CONTROLS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>🚨 Nearby Emergency Hospitals</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {gpsStatus === 'active'
              ? 'Sorted by travel distance from your device GPS coordinates.'
              : 'Sorted by emergency facilities and capabilities.'}
          </p>
        </div>

        {/* Radius Filter */}
        {gpsStatus === 'active' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Radius:</span>
            <div className="flex gap-1.5">
              {[
                { label: 'All', value: null },
                { label: '5 km', value: 5 },
                { label: '10 km', value: 10 },
                { label: '25 km', value: 25 },
                { label: '50 km', value: 50 }
              ].map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setRadius(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    radius === opt.value
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. EMERGENCY HOSPITAL CARDS LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading emergency facilities from local directory...
          </div>
        ) : hospitals.length > 0 ? (
          hospitals.map(hospital => (
            <EmergencyHospitalCard
              key={hospital.id}
              hospital={hospital}
              hasGps={gpsStatus === 'active'}
              onGetDirections={(h) => setSelectedHospitalForDirections(h)}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-600 text-sm font-semibold">
              No emergency hospitals found within {radius} km radius.
            </p>
            <button
              type="button"
              onClick={() => setRadius(null)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Show All Emergency Hospitals
            </button>
          </div>
        )}
      </div>

      {/* Directions Modal */}
      {selectedHospitalForDirections && (
        <DirectionsModal
          isOpen={true}
          onClose={() => setSelectedHospitalForDirections(null)}
          hospital={selectedHospitalForDirections}
        />
      )}

    </div>
  );
};
