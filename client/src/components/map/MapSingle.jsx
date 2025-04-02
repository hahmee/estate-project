import {MapContainer} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import {useEffect, useState} from "react";
import {listPostStore} from "../../lib/listPostStore.js";
import MapLoading from "../loading/MapLoading.jsx";
import FlyMapToSingle from "./FlyMapToSingle.jsx";

function MapSingle({items}) {
    const [zoomLevel, setZoomLevel] = useState(5);
    const [position, setPosition] = useState([37,127]);
    const isLoading = listPostStore((state) => state.isLoading);

    useEffect(() => {
        if (items && items.length < 1) {
            setPosition([37, 127]);
        } else {
            setPosition([Number(items[0]?.latitude), Number(items[0]?.longitude)]);
        }

    }, []);

    return (
        <>
            {
                isLoading && <MapLoading/>
            }
            <MapContainer
                center={position}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                className="map"
                zoomAnimation={true}
                zoomControl={false}
                zoomSnap={0.25}
                zoomDelta={1}
                maxZoom={10}
                minZoom={3}
                worldCopyJump={true}
            >
                <FlyMapToSingle items={items}/>
            </MapContainer>
        </>
    );



}


export default MapSingle;
