import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const coordinatesMapping = {
  'West Bengal_North 24 Parganas_Bidhannagar': { lat: 22.5726, lng: 88.3639 },
  'West Bengal_North 24 Parganas_Rajarhat': { lat: 22.5804, lng: 88.4682 },
  'West Bengal_Kolkata_Ballygunge': { lat: 22.5280, lng: 88.3659 },
  'West Bengal_Kolkata_Salt Lake': { lat: 22.5835, lng: 88.4149 },
  'Maharashtra_Pune_Aundh': { lat: 18.5596, lng: 73.8062 },
  'Maharashtra_Pune_Hinjawadi': { lat: 18.5913, lng: 73.7389 },
  'Maharashtra_Mumbai City_Colaba': { lat: 18.9220, lng: 72.8286 },
  'Delhi_New Delhi_Connaught Place': { lat: 28.6304, lng: 77.2177 },
  'Delhi_West Delhi_Dwarka': { lat: 28.5812, lng: 77.0594 },
  'Karnataka_Bangalore Urban_Indiranagar': { lat: 12.9784, lng: 77.6408 },
  'Karnataka_Bangalore Urban_Electronic City': { lat: 12.8452, lng: 77.6761 }
};

export const getFallbackCoords = (state) => {
  if (state === 'West Bengal') return { lat: 22.5726, lng: 88.3639 };
  if (state === 'Maharashtra') return { lat: 18.5596, lng: 73.8062 };
  if (state === 'Delhi') return { lat: 28.6304, lng: 77.2177 };
  if (state === 'Karnataka') return { lat: 12.9784, lng: 77.6408 };
  return { lat: 28.6273, lng: 77.3725 };
};

export const getDisplayNameFromCoords = (lat, lng) => {
  if (!lat || !lng) return '';
  const targetLat = parseFloat(lat);
  const targetLng = parseFloat(lng);
  for (const [key, coords] of Object.entries(coordinatesMapping)) {
    if (Math.abs(coords.lat - targetLat) < 0.005 && Math.abs(coords.lng - targetLng) < 0.005) {
      const parts = key.split('_'); // [state, district, city]
      return `${parts[2]}, ${parts[1]}`;
    }
  }
  // If Noida fallback or close to Noida
  if (Math.abs(28.6273 - targetLat) < 0.005 && Math.abs(77.3725 - targetLng) < 0.005) {
    return 'Noida, Uttar Pradesh';
  }
  return `${targetLat.toFixed(4)}, ${targetLng.toFixed(4)}`;
};

export default function LocationModal({ isOpen, onClose, language, selectedLocation, setSelectedLocation }) {
  const manualLocationData = {
    'West Bengal': {
      'North 24 Parganas': ['Bidhannagar', 'Rajarhat', 'Barasat', 'Barrackpore'],
      'South 24 Parganas': ['Alipore', 'Garia', 'Sonarpur'],
      'Kolkata': ['Salt Lake', 'Lake Town', 'Park Street', 'Kolkata'],
      'Howrah': ['Howrah', 'Shibpur', 'Liluah']
    },
    'Maharashtra': {
      'Pune': ['Aundh', 'Hinjawadi', 'Kothrud', 'Viman Nagar'],
      'Mumbai City': ['Colaba', 'Dadar', 'Chembur', 'Nariman Point'],
      'Nagpur': ['Dharampeth', 'Sadar'],
      'Thane': ['Thane West', 'Kalyan']
    },
    'Delhi': {
      'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Vasant Kunj'],
      'South Delhi': ['Saket', 'Hauz Khas', 'Greater Kailash'],
      'North Delhi': ['Civil Lines', 'Model Town'],
      'West Delhi': ['Dwarka', 'Janakpuri']
    },
    'Karnataka': {
      'Bangalore Urban': ['Indiranagar', 'Yelahanka', 'Electronic City', 'Koramangala'],
      'Mysore': ['Gokulam', 'Jayalakshmipuram']
    }
  };

  // Manual location form states
  const [manualState, setManualState] = useState('');
  const [manualDistrict, setManualDistrict] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualHouse, setManualHouse] = useState('');
  const [manualPin, setManualPin] = useState('');

  // UI Flow modes: 'empty' | 'gps_detecting' | 'manual_form' | 'success'
  const [locationMode, setLocationMode] = useState(selectedLocation ? 'success' : 'empty');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    if (selectedLocation) {
      setLocationMode('success');
    } else {
      setLocationMode('empty');
    }
  }, [selectedLocation]);

  const changeMode = (newMode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLocationMode(newMode);
      setIsTransitioning(false);
    }, 150);
  };

  const handleGpsDetect = () => {
    changeMode('gps_detecting');
    setGpsError('');

    if (!navigator.geolocation) {
      // Graceful fallback if geolocation API is completely missing
      setTimeout(() => {
        setSelectedLocation({
          source: 'GPS',
          address: 'National Pollution Telemetry Node GPS-N62,\nSector 62, Noida Area,\nGautam Buddha Nagar,\nUttar Pradesh - 201301',
          latitude: '28.6273',
          longitude: '77.3725',
          accuracy: '± 12 meters (Simulated Fallback GPS)',
          lastUpdated: 'Just Now',
          displayName: 'Noida, Uttar Pradesh',
          city: 'Noida',
          district: 'Gautam Buddha Nagar',
          state: 'Uttar Pradesh'
        });
      }, 1200);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const latStr = latitude.toFixed(4);
        const lngStr = longitude.toFixed(4);

        let address = `GPS Telemetry Node Node-${Math.floor(latitude * 100)},\nDetected Coordinates: [${latStr}° N, ${lngStr}° E],\nIndia`;

        let city = '';
        let district = '';
        let state = '';
        for (const [key, coords] of Object.entries(coordinatesMapping)) {
          if (Math.abs(coords.lat - latitude) < 0.005 && Math.abs(coords.lng - longitude) < 0.005) {
            const parts = key.split('_'); // [state, district, city]
            state = parts[0];
            district = parts[1];
            city = parts[2];
            break;
          }
        }
        if (!city && Math.abs(28.6273 - latitude) < 0.005 && Math.abs(77.3725 - longitude) < 0.005) {
          city = 'Noida';
          district = 'Gautam Buddha Nagar';
          state = 'Uttar Pradesh';
        }

        setSelectedLocation({
          source: 'GPS',
          address,
          latitude: latStr,
          longitude: lngStr,
          accuracy: `± ${Math.round(accuracy)} meters (Browser GPS)`,
          lastUpdated: 'Just Now',
          displayName: getDisplayNameFromCoords(latitude, longitude),
          city: city || 'GPS Location',
          district: district || '',
          state: state || 'India'
        });
      },
      (error) => {
        // Fallback automatically to Noida GPS coordinates on permission denial / timeout
        setTimeout(() => {
          setSelectedLocation({
            source: 'GPS',
            address: 'National Pollution Telemetry Node GPS-N62,\nSector 62, Noida Area,\nGautam Buddha Nagar,\nUttar Pradesh - 201301',
            latitude: '28.6273',
            longitude: '77.3725',
            accuracy: '± 12 meters (Simulated GPS Node)',
            lastUpdated: 'Just Now',
            displayName: 'Noida, Uttar Pradesh',
            city: 'Noida',
            district: 'Gautam Buddha Nagar',
            state: 'Uttar Pradesh'
          });
        }, 1200);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };

  const handleManualApply = (e) => {
    e.preventDefault();
    if (!manualState || !manualDistrict || !manualCity || !manualHouse.trim()) return;

    // Split house address by comma and format with newlines
    const houseLines = manualHouse
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join(',\n');

    const pinSuffix = manualPin ? ` - ${manualPin.trim()}` : '';
    const compiledAddress = `${houseLines},\n${manualCity},\n${manualDistrict},\n${manualState}${pinSuffix}`;

    const key = `${manualState}_${manualDistrict}_${manualCity}`;
    const coords = coordinatesMapping[key] || getFallbackCoords(manualState);

    setSelectedLocation({
      source: 'Manual',
      address: compiledAddress,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
      accuracy: 'Approximate (Derived from selected address)',
      lastUpdated: 'Just Now',
      displayName: `${manualCity}, ${manualDistrict}`,
      city: manualCity,
      district: manualDistrict,
      state: manualState
    });
  };

  const handleResetLocation = () => {
    setSelectedLocation(null);
    setManualState('');
    setManualDistrict('');
    setManualCity('');
    setManualHouse('');
    setManualPin('');
    changeMode('empty');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn text-left flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#15803D] text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📍</span>
            <span className="font-bold text-[16px]">Configure Live Location</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-100 hover:text-white rounded hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-[20px] font-bold text-slate-900 flex items-center space-x-2">
              <span className="text-xl">📍</span>
              <span>Live Location</span>
            </h3>
            <p className="text-[14.5px] text-slate-500 font-medium mt-1">
              Choose how you want to provide your location for hyperlocal pollution analysis.
            </p>
          </div>

          <div className={`transition-all duration-150 transform ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>

            {/* 1. EMPTY STATE */}
            {locationMode === 'empty' && (
              <div className="space-y-6 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3 text-slate-600 font-semibold text-[14.5px]">
                  <span className="text-lg">📍</span>
                  <span>No location selected.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OPTION 1 */}
                  <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-350 transition-colors">
                    <div className="space-y-1.5">
                      <h4 className="text-[15px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                        <span>📍</span>
                        <span>Detect My Current Location</span>
                      </h4>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        Automatically detect your current GPS location using the browser Geolocation API.
                      </p>
                    </div>
                    <button
                      onClick={handleGpsDetect}
                      type="button"
                      className="w-full text-center text-[13.5px] font-bold text-white bg-[#15803D] hover:bg-[#166534] py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-sm hover:shadow cursor-pointer"
                    >
                      <Compass className="w-4 h-4 animate-pulse" />
                      <span>Detect My Location</span>
                    </button>
                  </div>

                  {/* OPTION 2 */}
                  <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-350 transition-colors">
                    <div className="space-y-1.5">
                      <h4 className="text-[15px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                        <span>📌</span>
                        <span>Enter Location Manually</span>
                      </h4>
                      <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                        Input your address details manually to select a pollution telemetry node near your ward.
                      </p>
                    </div>
                    <button
                      onClick={() => changeMode('manual_form')}
                      type="button"
                      className="w-full text-center text-[13.5px] font-bold text-slate-700 bg-slate-50 border border-slate-300 hover:bg-slate-100 py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>Enter Location Manually</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. GPS DETECTING STATE */}
            {locationMode === 'gps_detecting' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <Compass className="w-10 h-10 text-[#15803D] animate-spin" />
                <span className="text-[14.5px] text-slate-600 font-bold">Requesting GPS Satellite Telemetry...</span>
                <p className="text-[12.5px] text-slate-400 font-medium max-w-xs text-center">
                  Please approve the location prompt in your browser. If coordinates cannot be retrieved, we will load default Noida telemetry.
                </p>
              </div>
            )}

            {/* 3. MANUAL LOCATION FORM */}
            {locationMode === 'manual_form' && (
              <form onSubmit={handleManualApply} className="space-y-4 pt-2">
                <h4 className="text-[15.5px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <span>📌</span>
                  <span>Enter Location Manually</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* State Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">State</label>
                    <select
                      required
                      value={manualState}
                      onChange={(e) => {
                        setManualState(e.target.value);
                        setManualDistrict('');
                        setManualCity('');
                      }}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[13.5px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-semibold"
                    >
                      <option value="">Select State</option>
                      {Object.keys(manualLocationData).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">District</label>
                    <select
                      required
                      disabled={!manualState}
                      value={manualDistrict}
                      onChange={(e) => {
                        setManualDistrict(e.target.value);
                        setManualCity('');
                      }}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[13.5px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{manualState ? 'Select District' : 'Select State first'}</option>
                      {manualState && Object.keys(manualLocationData[manualState] || {}).map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">City / Town / Village</label>
                    <select
                      required
                      disabled={!manualDistrict}
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[13.5px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{manualDistrict ? 'Select City / Town / Village' : 'Select District first'}</option>
                      {manualDistrict && (manualLocationData[manualState]?.[manualDistrict] || []).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* House No. / Landmark */}
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">House No. / Landmark</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House No. 25, Near City Centre 1, Sector V"
                      value={manualHouse}
                      onChange={(e) => setManualHouse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[13.5px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-medium"
                    />
                  </div>

                  {/* PIN Code */}
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">PIN Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 700091"
                      value={manualPin}
                      onChange={(e) => setManualPin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#15803D] focus:outline-none text-[13.5px] text-slate-800 rounded-lg px-3 py-2.5 transition-colors font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => changeMode(selectedLocation ? 'success' : 'empty')}
                    className="text-[13.5px] font-semibold text-slate-700 hover:bg-slate-100 border border-slate-350 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-[13.5px] font-bold text-white bg-[#15803D] hover:bg-[#166534] px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-colors cursor-pointer"
                  >
                    Apply Location
                  </button>
                </div>
              </form>
            )}

            {/* 4. SUCCESS STATE: DISPLAY COMPILING LOCATION CARD */}
            {locationMode === 'success' && selectedLocation && (
              <div className="space-y-5">

                {/* Header status bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3.5 gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-5 h-5 ${selectedLocation.source === 'GPS' ? 'text-[#15803D]' : 'text-blue-600'}`} />
                    <span className="font-extrabold text-slate-900 text-[15.5px]">
                      {selectedLocation.source === 'GPS' ? '✓ GPS Location Detected' : '✓ Manual Location Selected'}
                    </span>
                  </div>

                  <div>
                    {selectedLocation.source === 'GPS' ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#15803D] border border-emerald-200">
                        🟢 GPS
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        🔵 Manual
                      </span>
                    )}
                  </div>
                </div>

                {/* Info layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13.5px]">

                  {/* Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-extrabold">Current Address</span>
                    <p className="text-slate-800 font-bold whitespace-pre-line leading-relaxed text-[14px]">
                      {selectedLocation.address}
                    </p>
                  </div>

                  {/* Source details */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-extrabold">Location Source</span>
                      <span className="text-slate-800 font-bold text-[14px]">
                        {selectedLocation.source === 'GPS' ? 'Location Source: GPS' : 'Location Source: Manual Entry'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-extrabold">Accuracy</span>
                      <span className="text-slate-800 font-bold text-[14px]">{selectedLocation.accuracy}</span>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="space-y-4 border-l border-slate-100 pl-0 md:pl-6">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-extrabold">Latitude</span>
                      <span className="text-slate-800 font-mono font-extrabold text-[14.5px] block">{selectedLocation.latitude}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-extrabold">Longitude</span>
                      <span className="text-slate-800 font-mono font-extrabold text-[14.5px] block">{selectedLocation.longitude}</span>
                    </div>
                  </div>

                </div>

                {/* Footer buttons row */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 pt-4 text-[12px] text-slate-400 font-medium gap-3">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Last Updated: {selectedLocation.lastUpdated}</span>
                  </span>

                  <button
                    onClick={handleResetLocation}
                    type="button"
                    className="text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1.5 border border-slate-300 rounded-lg px-3.5 py-2 hover:bg-slate-50 transition-colors shadow-sm bg-white cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Provide Different Location</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
