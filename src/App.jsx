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
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(10);  // default zoom value
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

              if (place.geometry.viewport) {
                // tell map to fit these bounds
                mapRef.current.fitBounds(place.geometry.viewport);
              } else {
                // fallback: setZoom to a default for country
                setZoom(defaultCountryZoom);
              }
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

<div className="relative w-40">
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
    className="w-full px-4 pr-10 py-3 border rounded-lg text-lg"
  />
  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">
    km
  </span>
</div>
        </div>
      </header>

      <main className="flex-grow">
<GoogleMap
  mapContainerStyle={{ width: "100%", height: "100%" }}
  center={center}
  zoom={zoom}   
  onLoad={(map) => { mapRef.current = map; }}  // if you’re capturing ref
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
