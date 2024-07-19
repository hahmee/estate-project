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

  const postFetch = listPostStore((state) => state.fetch);
  const isLoading = listPostStore((state) => state.isLoading);
  const setIsLoading = listPostStore((state) => state.setIsLoading);
  const setIsFetch = listPostStore((state) => state.setIsFetch);
  const isFetch = listPostStore((state) => state.isFetch);
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


  //zoom, drag 이벤트
  const HandlerComponent = () => {
    const map = useMapEvents({
      zoomend: useCallback(async (e) => {
        if (!isFetch) {
          console.log('zoomend');

          await setIsLoading(true);
          //줌 중심 위치 찾기
          const center = e.target.getCenter(); //{lat,lng}
          const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결
          // await fetch(`type=year_pay&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
          // await postFetch(`type=${query.type}&location=${query.location}&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=${query.property}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}`);
          await postFetch(`latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}`);

          await setIsLoading(false);
        }
        setIsFetch(false);
      }, [isFetch]),
      dragend: async (e) => {
        console.log('dragend');

        await setIsLoading(true);
        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결
        // await postFetch(`type=&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=&minPrice=&maxPrice=&bedroom=`);
        // await postFetch(`type=${query.type}&location=${query.location}&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=${query.property}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}`);
        await postFetch(`latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}`);

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
