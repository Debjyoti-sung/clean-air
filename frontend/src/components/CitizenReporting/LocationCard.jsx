import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Layers } from 'lucide-react';
import { GeolocationService } from '../../services/geolocation.service';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function LocationCard({ onLocationSelected, language = 'EN' }) {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [mapMode, setMapMode] = useState("terrain"); // 'terrain' -> light-standard, 'satellite' -> satellite

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const olaApiKey = import.meta.env.VITE_OLA_MAPS_API_KEY || "";

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const styleName = mapMode === 'satellite' ? 'default-satellite' : 'default-light-standard';
    const styleUrl = `https://api.olamaps.io/tiles/vector/v1/styles/${styleName}/style.json`;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [coords.lng ? parseFloat(coords.lng) : 77.2177, coords.lat ? parseFloat(coords.lat) : 28.6304],
      zoom: coords.lat ? 14 : 11,
      transformRequest: (url, resourceType) => {
        if (url.includes("api.olamaps.io")) {
          // Inject Ola Maps key
          const separator = url.includes("?") ? "&" : "?";
          return {
            url: `${url}${separator}api_key=${olaApiKey}`
          };
        }
        return { url };
      }
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Create marker if coords exist
    if (coords.lat && coords.lng) {
      const latNum = parseFloat(coords.lat);
      const lngNum = parseFloat(coords.lng);
      
      const marker = new maplibregl.Marker({ draggable: true })
        .setLngLat([lngNum, latNum])
        .addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        updateLocationFromMap(lngLat.lat, lngLat.lng);
      });

      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [mapMode]);

  // Center Map & Move Marker when Coords change externally
  useEffect(() => {
    if (!mapRef.current || !coords.lat || !coords.lng) return;

    const latNum = parseFloat(coords.lat);
    const lngNum = parseFloat(coords.lng);

    mapRef.current.flyTo({
      center: [lngNum, latNum],
      zoom: 14
    });

    if (markerRef.current) {
      markerRef.current.setLngLat([lngNum, latNum]);
    } else {
      const marker = new maplibregl.Marker({ draggable: true })
        .setLngLat([lngNum, latNum])
        .addTo(mapRef.current);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        updateLocationFromMap(lngLat.lat, lngLat.lng);
      });

      markerRef.current = marker;
    }
  }, [coords.lat, coords.lng]);

  const updateLocationFromMap = async (lat, lng) => {
    const latFixed = lat.toFixed(4);
    const lngFixed = lng.toFixed(4);
    setCoords({ lat: latFixed, lng: lngFixed });
    
    try {
      const reverseGeo = await GeolocationService.reverseGeocode(lat, lng);
      setAddress(reverseGeo.formattedAddress);
      onLocationSelected({
        lat,
        lng,
        address: reverseGeo.formattedAddress
      });
    } catch (error) {
      setAddress(`Lat: ${latFixed}, Lng: ${lngFixed}`);
      onLocationSelected({
        lat,
        lng,
        address: `Lat: ${latFixed}, Lng: ${lngFixed}`
      });
    }
  };

  const handleGPSDetect = async () => {
    setIsDetectingGPS(true);
    try {
      const position = await GeolocationService.getCurrentPosition();
      const latVal = position.lat;
      const lngVal = position.lng;
      setCoords({ lat: latVal.toFixed(4), lng: lngVal.toFixed(4) });
      
      const reverseGeo = await GeolocationService.reverseGeocode(latVal, lngVal);
      setAddress(reverseGeo.formattedAddress);

      onLocationSelected({
        lat: latVal,
        lng: lngVal,
        address: reverseGeo.formattedAddress
      });
    } catch (error) {
      alert("Could not detect GPS or Reverse Geocode failed. Using fallback location.");
      const fallback = { lat: 28.6304, lng: 77.2177, address: "Connaught Place, New Delhi, Delhi, 110001" };
      setCoords({ lat: "28.6304", lng: "77.2177" });
      setAddress(fallback.address);
      onLocationSelected(fallback);
    }
    setIsDetectingGPS(false);
  };

  const setDemoRegion = (city) => {
    const demos = {
      Delhi: { lat: 28.6304, lng: 77.2177, addr: "Connaught Place, New Delhi, Delhi, 110001" },
      Pune: { lat: 18.5596, lng: 73.8062, addr: "Aundh Road, Pune, Maharashtra, 411007" },
      Bangalore: { lat: 12.9784, lng: 77.6408, addr: "Indiranagar 100 Feet Rd, Bengaluru, Karnataka, 560038" },
      Kolkata: { lat: 22.5726, lng: 88.3639, addr: "Salt Lake Sector 5, Kolkata, West Bengal, 700091" }
    };
    const c = demos[city];
    setCoords({ lat: c.lat.toFixed(4), lng: c.lng.toFixed(4) });
    setAddress(c.addr);
    onLocationSelected({
      lat: c.lat,
      lng: c.lng,
      address: c.addr
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Step 2: Region Geolocation</h2>
        <p className="text-sm text-slate-500">
          Pinpoint coords to fetch satellite, weather, and AQI grids.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
              Location Address
            </label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="2"
              className="w-full neu-pressed border-transparent focus:border-emerald-500/40 rounded-2xl p-3 text-slate-700 font-bold text-sm focus:outline-none focus:ring-0 resize-none transition"
              placeholder="Enter incident address manually or use GPS..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10.5px] font-extrabold uppercase text-slate-500">Latitude</span>
              <div className="neu-pressed border-transparent rounded-xl p-3 text-sm font-mono text-emerald-600 font-bold h-12 flex items-center">
                {coords.lat ? `${coords.lat}° N` : '--'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10.5px] font-extrabold uppercase text-slate-500">Longitude</span>
              <div className="neu-pressed border-transparent rounded-xl p-3 text-sm font-mono text-emerald-600 font-bold h-12 flex items-center">
                {coords.lng ? `${coords.lng}° E` : '--'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={handleGPSDetect}
              disabled={isDetectingGPS}
              className="px-4 py-2.5 text-xs font-black text-emerald-700 neu-button rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isDetectingGPS ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
              <span>Use My GPS Location</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider block">
              Quick Select Indian Regions:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Delhi', 'Pune', 'Bangalore', 'Kolkata'].map((city) => (
                <button
                  key={city}
                  onClick={() => setDemoRegion(city)}
                  className="px-3.5 py-2 neu-button text-xs font-bold text-slate-700 rounded-xl transition cursor-pointer"
                >
                  🇮🇳 {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="neu-flat rounded-3xl p-5 relative overflow-hidden h-[340px]">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 px-2 py-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ola / Satellite Map Layer</span>
            </span>
            <div className="flex neu-pressed p-0.5 rounded-lg border border-transparent">
              <button 
                onClick={() => setMapMode('terrain')} 
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${mapMode === 'terrain' ? 'neu-flat text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Terrain
              </button>
              <button 
                onClick={() => setMapMode('satellite')} 
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${mapMode === 'satellite' ? 'neu-flat text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Satellite
              </button>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-slate-100 mt-14 overflow-hidden rounded-b-2xl border-t border-slate-200">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
