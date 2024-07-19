import React, {useEffect} from 'react';
import {Marker, TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";
import {divIcon} from "leaflet/src/layer/index.js";
import {useSearchParams} from "react-router-dom";


function FlyMapTo({items, listPageMap}) {
    const map = useMap();

    const [searchParams, setSearchParams] = useSearchParams();

    const query = {
        type: searchParams.get("type") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.get("property") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedroom: searchParams.get("bedroom") || "",
    }

    const position = listPageMap ? [query.latitude, query.longitude] : [parseFloat(items[0].latitude), parseFloat(items[0].longitude)];

    //검정색 점
    const customMarkerIcon = divIcon({
        html: `<div class="searchLocation"><div class="searchLocationIn"></div></div>`
    });

    //검색할때만
    useEffect(() => {
        map.flyTo(position);
    }, [searchParams]);

    if (listPageMap) {
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
    } else {
        return (
            <div>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}></Marker>
            </div>
        );

    }

}

export default FlyMapTo;