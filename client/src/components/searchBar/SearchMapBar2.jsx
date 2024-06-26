import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import "./searchMapBar2.scss";
import React, {useEffect, useState} from "react";
import Map from "../map/Map.jsx";


function SearchMapBar2() {
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [itemList, setItemList] = useState([]);
    const [latLng, setLatLng] = useState({
        latitude:0,
        longitude:0
    })

    const handleLocationChange = (location) => {
        setStatus("");
        setLocation(location);
    };

    const handleSelect = (location) => {
        setLocation(location);
        setAddress(location);
        geocodeByAddress(location)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                setItemList([{latitude: latLng.lat, longitude: latLng.lng, images: []}]);
                return setLatLng({latitude: latLng.lat, longitude: latLng.lng});
            })
            .catch((error) => console.error("Error", error));


    };

    const onError = (status, clearSuggestions) => {
        setStatus( status ==="ZERO_RESULTS" ? '해당 장소를 찾을 수 없습니다.' : status);
        clearSuggestions();
    }

    return (
        <div className="main">
            <div className="map-search">
                <PlacesAutocomplete
                      value={location}
                      onChange={handleLocationChange}
                      onSelect={handleSelect}
                      onError={onError}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="map-content">
                            <div className="map-item">
                            <span className="material-symbols-outlined">location_on</span>
                            <input
                                {...getInputProps({
                                    placeholder: '주소를 입력하세요.',
                                    className: 'location-search-input',
                                })}
                            />
                            </div>
                            <div className="autocomplete-dropdown-container">
                                {loading && <div className="suggestion-item">Loading...</div>}
                                {status && <div className="suggestion-item">{status}</div>}

                                {suggestions.map((suggestion, index) => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    return (
                                        <div
                                            key={index}
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                // style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </div>
            <div className="mapContainer">
                <Map items={itemList}/>
            </div>
        </div>
  );
}
export default SearchMapBar2;
