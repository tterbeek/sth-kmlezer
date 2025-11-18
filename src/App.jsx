
import React, { useState, useRef, useCallback, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, Autocomplete } from "@react-google-maps/api";

const GOOGLE_API_KEY = "AIzaSyCRhrRARRTYZomKTLeKJlQHnf0cBMSF-7o";  // replace

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 51.505, lng: -0.09 };

export default function App() {
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const [center, setCenter] = useState(defaultCenter);
  const [radiusKm, setRadiusKm] = useState(5);

  const onPlaceChanged = useCallback((autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
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
      // any other logic you want (e.g., update radius/circle)
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
    className="w-full p-3 border rounded-lg"
  />
</Autocomplete>

        <input
          type="number"
          min="0.1"
          step="0.1"
          value={radiusKm}
          onChange={(e) => setRadiusKm(parseFloat(e.target.value) || 0.1)}
          className="w-32 p-3 border rounded-lg"
        />
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
        <Circle
          center={center}
          radius={radiusKm * 1000}
          options={{
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            strokeColor: "blue",
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
}
