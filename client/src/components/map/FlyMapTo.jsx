import React, {useEffect, useState} from 'react';
import {Marker, TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";
import {divIcon} from "leaflet/src/layer/index.js";
import {useSearchParams} from "react-router-dom";
import {roomOption, typeOption} from "../../routes/newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../navbar/Navbar.jsx";


function FlyMapTo({items}) {
    const map = useMap();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = {
        type: searchParams.getAll("type").length < 1 ? typeOption.map((type) => type.value) : searchParams.getAll("type"),
        location: searchParams.get("location") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.getAll("property") < 1 ? roomOption.map((type) => type.value) : searchParams.getAll("property"),
        minPrice: searchParams.get("minPrice") || MIN_PRICE,
        maxPrice: searchParams.get("maxPrice") || MAX_PRICE,
        minSize: searchParams.get("minSize") || MIN_SIZE,
        maxSize: searchParams.get("maxSize") || MAX_SIZE,
        searchedLat: searchParams.get("searchedLat") || "",
        searchedLng:  searchParams.get("searchedLng") || "",
    };

    const position = [query.latitude, query.longitude];
    const searchedPostion = [query.searchedLat, query.searchedLng];

    //검정색 점
    const customMarkerIcon = divIcon({
        html: `<div class="searchLocation"><div class="searchLocationIn"></div></div>`
    });

    //검색 위치가 변경될때만
    useEffect(() => {
        map.flyTo(position);
        // map.flyTo(position, 18, {
        //     animate: true,
        //     duration: 2.2
        // });

    }, [query.latitude, query.longitude]);


    return (
        <div>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={searchedPostion} icon={customMarkerIcon}></Marker>
            {items.map((item, idx) => (
                <Pin item={item} key={idx}/>
            ))}
        </div>
    );


}

export default FlyMapTo;