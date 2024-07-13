import {MapContainer, useMapEvents} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useCallback, useState} from "react";
import {listPostStore} from "../../lib/listPostStore.js";
import {useSearchParams} from "react-router-dom";
import MapLoading from "../loading/MapLoading.jsx";

function Map({items}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [zoomLevel, setZoomLevel] = useState(5);
  // const position = items.length === 1 ? [parseFloat(items[0].latitude), parseFloat(items[0].longitude)] : [37, 127];
  const position = [parseFloat(searchParams.get("latitude")), parseFloat(searchParams.get("longitude"))];

  const fetch = listPostStore((state) => state.fetch);
  const isLoading = listPostStore((state) => state.isLoading);
  const setIsLoading = listPostStore((state) => state.setIsLoading);
  const setIsFetch = listPostStore((state) => state.setIsFetch);
  const isFetch = listPostStore((state) => state.isFetch);

  //zoom, drag 이벤트
  const HandlerComponent = () => {
    const map = useMapEvents({
      zoomend: useCallback(async (e) => {
        if (!isFetch) {
          await setIsLoading(true);
          //줌 중심 위치 찾기
          const center = e.target.getCenter(); //{lat,lng}
          const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결
          await fetch(`type=&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
          await setIsLoading(false);
        }
        setIsFetch(false);
      }, [isFetch]),
      dragend: async (e) => {
        await setIsLoading(true);

        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결
        await fetch(`type=&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
        await setIsLoading(false);
      }
    });
    return null;
  }
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
      </>
  );
}


export default Map;
