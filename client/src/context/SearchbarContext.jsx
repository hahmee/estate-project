import {createContext, useState} from "react";
import {roomOption, typeOption} from "../routes/newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../components/navbar/Navbar.jsx";

export const SearchbarContext = createContext();


export const SearchbarContextProvider = ({children}) => {
    const initialViewPort = {};

    //searchbar 값 보여주는 용도
    const initialState = {
        location: '',
        payType: typeOption.map((type) => type.value),
        propertyType: roomOption.map((type) => type.value),
        minPrice: MIN_PRICE,
        maxPrice: MAX_PRICE,
        minSize: MIN_SIZE,
        maxSize: MAX_SIZE,
        latitude: '',
        longitude: '',
        search_type: 'autocomplete_click', //autocomplete_click || user_map_move
        ne_lat: '',
        ne_lng: '',
        sw_lat: '',
        sw_lng: '',
    };

    const [searchValue, setSearchValue] = useState(initialState);
    // const [viewPort, setViewPort] = useState(initialViewPort);

    const changeSearchValue = (value) => {
        setSearchValue(value);
    }

    // const changeViewPort = (value) => {
    //     setViewPort(value);
    // }

    const clearSearchValue = () => {
        setSearchValue(initialState);
    }

    // const clearViewPort = () => {
    //     setViewPort(initialViewPort);
    // }

    const searchbarCtx = {
        searchValue,
        changeSearchValue,
        clearSearchValue,
        // viewPort,
        // changeViewPort,
        // clearViewPort
    }

    // console.log('searchValue------', searchValue);
    // console.log('viewPort------', viewPort);


    return (
        <SearchbarContext.Provider value={searchbarCtx}>
            {children}
        </SearchbarContext.Provider>
    );
};
