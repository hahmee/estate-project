import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import "./searchMapBar2.scss";
import React, {createRef, useContext, useEffect, useRef, useState} from "react";
import Map from "../map/Map.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import Button from "../../UI/Button.jsx";
import {Link, useNavigate, useSearchParams} from "react-router-dom";


function SearchMapBar2({getMapResult, searchOptions=[]}) {
    const {clearProgress, saveLocation} = useContext(UserProgressContext);

    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    // const [itemList, setItemList] = useState([]);
    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const [latLng, setLatLng] = useState({
        latitude: null,
        longitude: null
    });
    const [searchParams, setSearchParams] = useSearchParams();

    const [query, setQuery] = useState({
        type: searchParams.get("type") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.get("property") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedroom: searchParams.get("bedroom") || "",
    });


    const handleLocationChange = (location) => {
        setStatus("");
        setLocation(location);
        setSuggestionsVisible(true);
    };

    const handleSelect = (location, placeId, suggestions) => {
        setSuggestionsVisible(false);
        setLocation(location);
        geocodeByAddress(location)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                searchOptions && saveLocation({...latLng, address: location, city:''});
                setQuery((prev) => ({ ...prev, latitude: latLng.lat, longitude: latLng.lng }));

                getMapResult([{latitude: latLng.lat, longitude: latLng.lng, images: [], location}]);
                return setLatLng({latitude: latLng.lat, longitude: latLng.lng});
            })
            .catch((error) => console.error("Error", error));
    };

    const onError = (status, clearSuggestions) => {
        setStatus( status === "ZERO_RESULTS" ? '해당 장소를 찾을 수 없습니다.' : status);
        clearSuggestions();
    }

    const onMouseOver = (e) => {
        // console.log('e', e.target.children[0]?.textContent);

    };

    const handleFilter = () => {
        setSearchParams(query);
    };

    const searchClick = () => {
        setSearchParams(query);
        // navigate(`/list?type=${query.type}&latitude=${query.latitude}&longitude=${query.longitude}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`);
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
                    searchOptions={{types: searchOptions}}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div className="map-content">
                            <div className="map-item">
                                {/*<span className="material-symbols-outlined">location_on</span>*/}
                                <input
                                    {...getInputProps({
                                        placeholder: searchOptions ? '도시를 검색하세요.' : '주소를 입력하세요.',
                                        className: 'location-search-input',
                                    })}
                                />
                            </div>
                            {
                                suggestionsVisible && (<div className="autocomplete-dropdown-container">
                                    {loading && <div className="suggestion-item">검색중...</div>}
                                    {status && <div className="suggestion-item">{status}</div>}
                                    {suggestions.map((suggestion, index) => {
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

            <Button type='submit' className="searchButton" onClick={searchClick}><img src="/search.png" alt="search"/></Button>
        </div>
    );
}

export default SearchMapBar2;
