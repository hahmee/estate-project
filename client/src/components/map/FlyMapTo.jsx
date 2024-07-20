import React, {useEffect, useState} from 'react';
import {Marker, TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";
import {divIcon} from "leaflet/src/layer/index.js";
import {useSearchParams} from "react-router-dom";


function FlyMapTo({items}) {
    const map = useMap();

    const [searchParams, setSearchParams] = useSearchParams();
    const [position, setPosition] = useState([37, 127]);

    const query = {
        type: searchParams.getAll("type") || "",
        location: searchParams.get("location") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.getAll("property") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        minSize: searchParams.get("minSize") || "",
        maxSize: searchParams.get("maxSize") || "",
    }

    //검정색 점
    const customMarkerIcon = divIcon({
        html: `<div class="searchLocation"><div class="searchLocationIn"></div></div>`
    });

    //검색 위치가 변경될때만
    useEffect(() => {
        setPosition([parseFloat(query.latitude), parseFloat(query.longitude)]);
        map.flyTo([parseFloat(query.latitude), parseFloat(query.longitude)]);
    }, [query.latitude, query.longitude]);

    useEffect(() => {
        setPosition([parseFloat(query.latitude), parseFloat(query.longitude)]);
    }, []);


    return (
        <div>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customMarkerIcon}></Marker>
            {items.map((item, idx) => (
                <Pin item={item} key={idx}/>
            ))}
        </div>
    );


}

export default FlyMapTo;