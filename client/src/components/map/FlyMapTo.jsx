import React, {useEffect} from 'react';
import {Marker, Popup, TileLayer, useMap} from "react-leaflet";
import Pin from "../pin/Pin.jsx";


function FlyMapTo({items}) {
    const map = useMap();
    const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];
    useEffect(() => {
        map.flyTo(position)
    }, [position]);

    return (
        <div>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {items.map((item,idx) => (
              <Pin item={item} key={idx}/>
            ))}
        </div>
    );


}

export default FlyMapTo;