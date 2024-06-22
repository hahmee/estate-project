import {MapContainer} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";



function Map({ items }) {
  const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];
  return (
    <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={false}
        className="map"
    >
      <FlyMapTo items={items}/>
    </MapContainer>
  );
}

export default Map;
