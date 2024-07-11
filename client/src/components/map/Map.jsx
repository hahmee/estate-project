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

  //zoom, drag 이벤트
  const HandlerComponent = () => {
    const map = useMapEvents({
      zoomend: (e) => {
        //줌 중심 위치 찾기
        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결

        fetch(`type=&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
      },
      dragend: (e) => {
        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결
        fetch(`type=&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
      }
    });
    return null;
  }
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
          worldCopyJump={true}

      >
        <FlyMapTo items={items}/>
        <HandlerComponent/>
      </MapContainer>
  );

}

// const ZoomEventHandlers = ({ handleZoomEnd }) => {
//   useMapEvent('zoomend', handleZoomEnd);
//   return null;
// };
// const DragEventHandlers = ({ handleDragEnd }) => {
//   useMapEvent('dragend', handleDragEnd);
//   return null;
// };


export default Map;
