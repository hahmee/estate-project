import React, {useEffect, useRef, useState} from "react";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useAdvancedMarkerRef,
  useMapsLibrary,
  useMap
} from "@vis.gl/react-google-maps";
import "./searchMapBar.scss";


function SearchMapBar() {

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
      <div id="map">
        <APIProvider
            apiKey={process.env.VITE_GOOGLE_API_KEY}
            solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        >
          <Map
              mapId={"bf51a910020fa25a"}
              defaultZoom={3}
              defaultCenter={{ lat: 22.54992, lng: 0 }}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
          >
            <AdvancedMarker ref={markerRef} position={null} />
          </Map>
          <MapControl position={ControlPosition.TOP} className="map-control">
            <div className="aaa">
              <div className="autocomplete-control">
                <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
              </div>
            </div>
          </MapControl>
          <MapHandler place={selectedPlace} marker={marker} />
        </APIProvider>
      </div>
  );
}

const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
      <div className="autocomplete-container">
        <span className="material-symbols-outlined">location_on</span>
        <input ref={inputRef} placeholder="주소를 입력하세요."/>
      </div>
  );
};

export default SearchMapBar;
