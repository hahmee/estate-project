import React, {useEffect, useState} from 'react';
import {Marker, TileLayer, useMap} from "react-leaflet";


function FlyMapToSingle({items}) {
    const map = useMap();
    const [position, setPosition] = useState([37, 127]);

    //items 변경될때만 flyto
    useEffect(() => {
        if (items && items.length > 0) {
            setPosition([items[0].latitude, items[0].longitude]);
            map.flyTo([items[0].latitude, items[0].longitude]);
        }
    }, [items]);

    useEffect(() => {
        if (items && items.length < 1) {
            setPosition([37, 127]);
        } else {
            setPosition([Number(items[0].latitude), Number(items[0].longitude)]);
        }

    }, []);


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

export default FlyMapToSingle;