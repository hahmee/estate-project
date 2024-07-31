import PlacesAutocomplete, {geocodeByAddress, getLatLng,} from 'react-places-autocomplete';
import React, {useContext, useEffect, useRef, useState} from "react";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import Button from "../../UI/Button.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {listPostStore} from "../../lib/listPostStore.js";
import "./searchMainBar.scss";

function SearchMainBar({searchOptions=[]}) {
    const {clearProgress, saveLocation, location:userLocation} = useContext(UserProgressContext);
    const [location, setLocation] = useState(userLocation.address);
    const [status, setStatus] = useState("");
    const setIsLoading = listPostStore((state) => state.setIsLoading);
    const setIsFetch = listPostStore((state) => state.setIsFetch);
    const inputRef = useRef();

    const navigate = useNavigate();

    const [suggestionsVisible, setSuggestionsVisible] = useState(true);
    const [latLng, setLatLng] = useState({
        latitude: null,
        longitude: null
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const fetch = listPostStore((state) => state.fetch);

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
                searchOptions && saveLocation({...latLng, address: location, politicalList:[]});
                setQuery((prev) => ({ ...prev, latitude: latLng.lat, longitude: latLng.lng }));

                return setLatLng({latitude: latLng.lat, longitude: latLng.lng});
            })
            .catch((error) => console.error("Error", error));
    };

    const onError = (status, clearSuggestions) => {
        setStatus( status === "ZERO_RESULTS" ? '해당 장소를 찾을 수 없습니다.' : status);
        clearSuggestions();
    }

    const searchClick = async () => {
        setIsLoading(true);
        await fetch(`type=&location=${userLocation.address}&latitude=${userLocation.lat}&longitude=${userLocation.lng}&property=&minPrice=&maxPrice=&bedroom=`);
        setIsLoading(false);
        setIsFetch(true);
        navigate(`/list?type=&${query.type}&location=${userLocation.address}&latitude=${query.latitude}&longitude=${query.longitude}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`);
    };

    useEffect(() => {
        clearProgress();
    }, []);

    return (
        <div className="mainBar">
            <div>
                <PlacesAutocomplete
                    value={location}
                    onChange={handleLocationChange}
                    onSelect={handleSelect}
                    onError={onError}
                    searchOptions={{types: searchOptions}}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="bar">
                                <div className="location">
                                    <p>위치</p>
                                    <input type="text"
                                           placeholder="Where are you going?"
                                           {...getInputProps({
                                               placeholder: searchOptions ? '도시를 검색하세요.' : '주소를 입력하세요.',
                                               className: 'location-search-input',
                                           })}/>
                                </div>
                                <div className="check-in">
                                    <p>유형</p>
                                    <input type="text" placeholder="Add dates"/>
                                </div>
                                <div className="check-out">
                                    <p>금액</p>
                                    <input type="text" placeholder="Add dates"/>
                                </div>
                                <div className="guests">
                                    <p>크기</p>
                                    <input type="text" placeholder="Add guests"/>
                                    <span className="material-symbols-outlined" onClick={searchClick}>search</span>
                                </div>
                            </div>
                            {
                                suggestionsVisible && (<div className="autocomplete-dropdown-container">
                                    {loading && <div className="suggestion-item">검색중...</div>}
                                    {status && <div className="suggestion-item">{status}</div>}
                                    {suggestions.map((suggestion) => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        return (
                                            <div
                                                key={suggestion.placeId}
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                })}
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

export default SearchMainBar;
