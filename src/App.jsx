// src/App.jsx
import React, { useState, useRef, useCallback, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, Autocomplete } from "@react-google-maps/api";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

console.log("Using GOOGLE_API_KEY:", GOOGLE_API_KEY);

const libraries = ["places"];
const defaultCenter = { lat: 50.850, lng: 4.349 };

export default function App() {
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [radiusKm, setRadiusKm] = useState(5);

  const radiusMeters = useMemo(() => radiusKm * 1000, [radiusKm]);

  if (loadError) return <div>Error loading Maps</div>;
  if (!isLoaded) return <div>Loading Maps…</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 bg-white shadow border-b">
        <div className="w-full flex justify-center gap-2">
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={() => {
              const place = autocompleteRef.current?.getPlace();
              if (place?.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setCenter({ lat, lng });
              }
            }}
          >
            <input
              type="text"
              placeholder="Search location"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const place = autocompleteRef.current?.getPlace();
                  if (place?.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    setCenter({ lat, lng });
                  }
                }
              }}
              className="w-full max-w-lg p-3 border rounded-lg"
            />
          </Autocomplete>

  <input
  type="text"
  placeholder="Distance"
  value={radiusKm}
  onChange={(e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      setRadiusKm(v);
    } else {
      setRadiusKm(0);
    }
  }}
  className="w-28 p-3 border rounded-lg"
/>
<span className="ml-2 text-sm text-gray-600">km</span>
        </div>
      </header>

      <main className="flex-grow">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={10}
        >
          <Marker
            position={center}
            draggable={true}
            onDragEnd={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setCenter({ lat, lng });
            }}
          />
          {radiusKm > 0 && (
            <Circle
              center={center}
              radius={radiusMeters}
              options={{
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
                strokeColor: "blue",
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </main>
    </div>
  );
}
