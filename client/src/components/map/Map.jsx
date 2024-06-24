import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useEffect} from "react";
import {savedPostStore} from "../../lib/savedPostStore.js";


function Map({ items }) {
  const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];

  return (
    <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        className="map"
    >
      <FlyMapTo items={items}/>
    </MapContainer>
  );

}

export default Map;
