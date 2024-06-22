import React, {useEffect} from 'react';
import {TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";

function FlyMapTo({items}) {
    const map = useMap();
    const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];

    useEffect(() => {
        map.flyTo(position)
    }, [position]);

    return (
        <>
            <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {items.map((item) => (
              <Pin item={item} key={item.id} />
            ))}
        </>
    );
}

export default FlyMapTo;