import React, {useEffect, useState} from 'react';
import {Marker, TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";
import {divIcon} from "leaflet/src/layer/index.js";
import {useSearchParams} from "react-router-dom";


function FlyMapTo({items, listPageMap}) {
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

    //검색할때만
    useEffect(() => {
        map.flyTo(position);
    }, [searchParams]);


    useEffect(() => {
        if(listPageMap) {
            setPosition([parseFloat(query.latitude), parseFloat(query.longitude)]);
        }else {
            if (items && items.length < 1) {
                setPosition([37, 127]);
            }else{
                setPosition( [parseFloat(items[0].latitude), parseFloat(items[0].longitude)]);
            }
        }
    }, []);

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