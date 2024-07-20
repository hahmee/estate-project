import {MapContainer, useMapEvents} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import FlyMapTo from "./FlyMapTo.jsx";
import {useCallback, useContext, useEffect, useState} from "react";
import {listPostStore} from "../../lib/listPostStore.js";
import {useSearchParams} from "react-router-dom";
import MapLoading from "../loading/MapLoading.jsx";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";
import FlyMapTo2 from "./FlyMapTo2.jsx";

function Map2({items, listPageMap = false}) {
    console.log('items', items);
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

    // //items(변경했을때만 position 변경함) // 굳이 안해도 실행됨
    // useEffect(() => {
    //     if(items && items.length >0 ) {
    //         setPosition([items[0]?.latitude, items[0]?.longitude]);
    //     }
    // }, [items]);

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
                <FlyMapTo2 items={items} listPageMap={listPageMap}/>
            </MapContainer>
        </>
    );



}


export default Map2;
