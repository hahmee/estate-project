import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import "./searchMapBar2.scss";
import React, {createRef, useContext, useEffect, useRef, useState} from "react";
import Map from "../map/Map.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";


function SearchMapBar2({getMapResult}) {
    const {progress, goToAddPage,clearProgress, saveLocation,clearLocation} = useContext(UserProgressContext);

    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");

    // const [itemList, setItemList] = useState([]);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const [latLng, setLatLng] = useState({
        latitude:null,
        longitude:null
    })

    const handleLocationChange = (location) => {
        setStatus("");
        setLocation(location);
        setSuggestionsVisible(true);
        clearProgress();
    };

    const handleSelect = (location,e,d) => {
        console.log('??', e);
        console.log('dd', d);
        setSuggestionsVisible(false);
        setLocation(location);
        geocodeByAddress(location)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                console.log('!!!',latLng,'.ssss',location);
                saveLocation({...latLng, address: location, city:''});
                getMapResult([{latitude: latLng.lat, longitude: latLng.lng, images: []}]);
                return setLatLng({latitude: latLng.lat, longitude: latLng.lng});
            })
            // .then((latLng) => setLatLng({latitude: latLng.lat, longitude: latLng.lng}))
            .catch((error) => console.error("Error", error));

    };

    const onError = (status, clearSuggestions) => {
        console.log('status', status);
        setStatus( status === "ZERO_RESULTS" ? '해당 장소를 찾을 수 없습니다.' : status);
        clearSuggestions();
    }

    const onMouseOver = (e) => {
        console.log('e', e.target.children[0]?.textContent);
        // setInputValue(e.target.children[0]?.textContent);

    };

    useEffect(() => {
        clearProgress();

    }, []);

    return (
        <div className="main">
            <div className="map-search">
                <PlacesAutocomplete
                    value={location}
                    onChange={handleLocationChange}
                    onSelect={handleSelect}
                    onError={onError}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div className="map-content">
                            <div className="map-item">
                                {/*<span className="material-symbols-outlined">location_on</span>*/}
                                <input
                                    {...getInputProps({
                                        placeholder: '주소를 입력하세요.',
                                        className: 'location-search-input',
                                    })}
                                />
                            </div>
                            {
                                suggestionsVisible && (<div className="autocomplete-dropdown-container">
                                    {loading && <div className="suggestion-item">Loading...</div>}
                                    {status && <div className="suggestion-item">{status}</div>}
                                    {suggestions.map((suggestion, index) => {
                                        console.log('asdf', suggestion);
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        return (
                                            <div
                                                key={suggestion.placeId}
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                })}
                                                onMouseOver={onMouseOver}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>)
                            }

                        </div>
                    )}
                </PlacesAutocomplete>

            </div>

        </div>
    );
}

export default SearchMapBar2;
