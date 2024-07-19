import {MapContainer, useMapEvents} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useCallback, useContext, useEffect, useState} from "react";
import {listPostStore} from "../../lib/listPostStore.js";
import {useSearchParams} from "react-router-dom";
import MapLoading from "../loading/MapLoading.jsx";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";

function Map({items, listPageMap = false}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoomLevel, setZoomLevel] = useState(5);
  const {searchValue, changeSearchValue} = useContext(SearchbarContext);
  const [position, setPosition] = useState([37,127]);
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
  };

  console.log('itemsasdfasdfasdfasafasdfasfasdf', items);

  useEffect(() => {

    if(listPageMap) {
      setPosition([parseFloat(searchParams.get("latitude")), parseFloat(searchParams.get("longitude"))]);
    }else {
      if ( items && items.length < 1) {
        setPosition([37, 127]);
      }else{
        setPosition([parseFloat(items[0]?.latitude), parseFloat(items[0]?.longitude)]);
      }
    }

  }, []);

  useEffect(() => {
    console.log('itemszzz', items);
    setPosition([items[0]?.latitude, items[0]?.longitude]);

  }, [items]);

  //zoom, drag 이벤트
  const HandlerComponent = () => {
    const map = useMapEvents({
      zoomend: useCallback(async (e) => {
        if (!isFetch) {
          changeSearchValue({...searchValue, location: '지도 표시 지역'});
          await setIsLoading(true);
          //줌 중심 위치 찾기
          const center = e.target.getCenter(); //{lat,lng}
          const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결

          const sendTypes = query.type.join('&type=');
          const sendProperties = query.property.join('&property=');

          await postFetch(`type=${sendTypes}&location=${query.location}&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=${sendProperties}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}`);


          await setIsLoading(false);
        }
        setIsFetch(false);
      }, [isFetch]),
      dragend: async (e) => {

        changeSearchValue({...searchValue, location: '지도 표시 지역'});

        await setIsLoading(true);
        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결

        const sendTypes = query.type.join('&type=');
        const sendProperties = query.property.join('&property=');
        await postFetch(`type=${sendTypes}&location=${query.location}&latitude=${wrappedCenter.lat}&longitude=${wrappedCenter.lng}&property=${sendProperties}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}`);

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
            className={listPageMap ? "listPageMap" : "map"}
            zoomAnimation={true}
            zoomControl={true}
            zoomSnap={0.25}
            zoomDelta={1}
            maxZoom={10}
            minZoom={3}
            worldCopyJump={true}
        >
          <FlyMapTo items={items} listPageMap={listPageMap}/>
          {
            listPageMap && <HandlerComponent/>
          }
        </MapContainer>
      </>
  );



}


export default Map;
