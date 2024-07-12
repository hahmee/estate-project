import React, {useContext, useEffect, useState} from 'react';
import {Marker, Popup, TileLayer, useMap, useMapEvents} from "react-leaflet";
import Pin from "../pin/Pin.jsx";
import {divIcon} from "leaflet/src/layer/index.js";
import {currencyFormatter} from "../../util/formatting.js";
import {useSearchParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";


function FlyMapTo({items}) {
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

    // const position =  [query.latitude, query.longitude];
    // const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];


    const customMarkerIcon = divIcon({
        html: `<div class="searchLocation"><div class="searchLocationIn"></div></div>`
    });

    //검색할때만
    useEffect(() => {
        // map.flyTo(position)
        map.flyTo([query.latitude, query.longitude]);

    }, [searchParams]);

    return (
        <div>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[query.latitude, query.longitude]} icon={customMarkerIcon}></Marker>
            {items.map((item,idx) => (
              <Pin item={item} key={idx}/>
            ))}
        </div>
    );
}

export default FlyMapTo;