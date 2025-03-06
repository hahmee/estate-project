import {MapContainer, useMapEvents} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useCallback, useContext, useState} from "react";
import {listPostStore} from "../../lib/listPostStore.js";
import {useSearchParams} from "react-router-dom";
import MapLoading from "../loading/MapLoading.jsx";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";
import {roomOption, typeOption} from "../../routes/newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../navbar/Navbar.jsx";

function Map({items}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoomLevel, setZoomLevel] = useState(10);
  const {searchValue, changeSearchValue} = useContext(SearchbarContext);
  const position = [searchParams.get("latitude"), searchParams.get("longitude")];
  const isLoading = listPostStore((state) => state.isLoading);
  const setIsLoading = listPostStore((state) => state.setIsLoading);
  const setIsFetch = listPostStore((state) => state.setIsFetch);
  const isFetch = listPostStore((state) => state.isFetch);
  const query = {
    type: searchParams.getAll("type").length < 1 ? typeOption.map((type) => type.value) : searchParams.getAll("type"),
    location: searchParams.get("location") || "",
    political: searchParams.get("political") || "",
    latitude: searchParams.get("latitude") || "",
    longitude: searchParams.get("longitude") || "",
    property: searchParams.getAll("property") < 1 ? roomOption.map((type) => type.value) : searchParams.getAll("property"),
    minPrice: searchParams.get("minPrice") || MIN_PRICE,
    maxPrice: searchParams.get("maxPrice") || MAX_PRICE,
    minSize: searchParams.get("minSize") || MIN_SIZE,
    maxSize: searchParams.get("maxSize") || MAX_SIZE,
    searchedLat: searchParams.get("searchedLat") || "",
    searchedLng: searchParams.get("searchedLng") || "",
    search_type: searchParams.get("search_type") || "",
  };


  //zoom, drag 이벤트
  const HandlerComponent = () => {
    const map = useMapEvents({
      zoomend: useCallback(async (e) => {
        if (!isFetch) { // 서칭창으로 검색했을 때 zoomend가 항상 실행됨 -> 맵에서 zoom 했을 때만 실행되도록 & 외부에서 url 쳐서 들어올때도 막아야함
          changeSearchValue({...searchValue, location: ''});
          await setIsLoading(true);
          //줌 중심 위치 찾기
          const center = e.target.getCenter(); //{lat,lng}
          const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결

          //현재 bounds 찾기
          const northEast = e.target.getBounds()._northEast;
          const southWest = e.target.getBounds()._southWest;

          const ne_lat = northEast.lat;
          const ne_lng = northEast.lng;
          const sw_lat = southWest.lat;
          const sw_lng = southWest.lng;


          await setSearchParams({...query,location: query.location, latitude: wrappedCenter.lat, longitude: wrappedCenter.lng, search_type:'user_map_move', ne_lat,ne_lng,sw_lat,sw_lng });
          await setIsLoading(false);

        }
        setIsFetch(false);
      }, [isFetch]),
      dragend: async (e) => {

        changeSearchValue({...searchValue, location: ''});
        await setIsLoading(true);
        const center = e.target.getCenter(); //{lat,lng}
        const wrappedCenter = e.target.wrapLatLng(center); //경도 180에서 나타나는 문제 해결

        const northEast = e.target.getBounds()._northEast;
        const southWest = e.target.getBounds()._southWest;

        const ne_lat = northEast.lat;
        const ne_lng = northEast.lng;
        const sw_lat = southWest.lat;
        const sw_lng = southWest.lng;

        //쿼리스트링 변경
        await setSearchParams({...query,location: query.location, latitude: wrappedCenter.lat, longitude: wrappedCenter.lng,search_type:'user_map_move', ne_lat,ne_lng,sw_lat,sw_lng });

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
            className="listPageMap"
            zoomAnimation={true}
            zoomControl={true}
            zoomSnap={0.25}
            zoomDelta={1}
            // maxZoom={30}
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
