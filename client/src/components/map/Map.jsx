import {MapContainer, useMapEvent, useMapEvents} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useCallback, useState} from "react";
import apiRequest from "../../lib/apiRequest.js";
import {listPostStore} from "../../lib/listPostStore.js";
import {useSearchParams} from "react-router-dom";

function Map({items}) {
  const [zoomLevel, setZoomLevel] = useState(5);
  const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];
  const fetch = listPostStore((state) => state.fetch);
  const posts = listPostStore((state) => state.posts);
  const setPosts = listPostStore((state) => state.setPosts);
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

  const handleZoomEnd = useCallback(async (e) => {
    // console.log('Map zoom level:', e.target.getZoom());

    //줌 중심 위치 찾기
    const zoomPosition = e.target._lastCenter; //{lat,lng}
    // console.log('eeee', zoomPosition);
    // const res = await apiRequest.get(`/posts?type=&latitude=${zoomPosition.lat}&longitude=${zoomPosition.lng}&property=&minPrice=&maxPrice=&bedroom=`);
    // setSearchParams({...searchParams, latitude: zoomPosition.lat, longitude: zoomPosition.lng});
    fetch(`type=&latitude=${zoomPosition.lat}&longitude=${zoomPosition.lng}&property=&minPrice=&maxPrice=&bedroom=`);
  }, [fetch]);


  return (
      <MapContainer
          center={position}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="map"
          zoomAnimation={true}
          zoomControl={true}
          zoomSnap={0.25}
          zoomDelta={0}
          maxZoom={10}
          minZoom={3}
      >
        <FlyMapTo items={items}/>
        <ZoomEventHandlers handleZoomEnd={handleZoomEnd}/>
      </MapContainer>
  );

}

const ZoomEventHandlers = ({ handleZoomEnd }) => {
  useMapEvent('zoomend', handleZoomEnd);
  return null;
};

export default Map;
