import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import {Await, Navigate, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import {Suspense, useContext, useEffect, useRef, useState} from "react";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useNotificationStore} from "../../lib/notificationStore.js";
import {listPostStore} from "../../lib/listPostStore.js";
import {useMapEvents} from "react-leaflet";


function ListPage() {
    // const data = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const {currentUser} = useContext(AuthContext);
    const query = {
        type: searchParams.get("type") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.get("property") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedroom: searchParams.get("bedroom") || "",
    }


    const fetch = listPostStore((state) => state.fetch);
    const posts = listPostStore((state) => state.posts);
    const savedPosts = savedPostStore((state) => state.savedPosts);


    useEffect(() => {
        const getPostList = () => {
            setSearchParams(query);
        }
        if (currentUser) {
            getPostList();
        }
    }, [savedPosts]);


    useEffect(() => {
        fetch(searchParams);
    }, []);


    if (!currentUser) return <Navigate to="/login"/>;

    else {
        return (
            <div className="listPage">
                <div className="listContainer">
                    <div className="wrapper">
                        <Filter/>
                        {posts.map((post, idx) => (
                            <Card key={idx} card={post}/>
                        ))}
                    </div>
                </div>
                <div className="mapContainer">
                    {
                        <Map items={posts}/>
                    }
                </div>
            </div>
        );
    }

}

export default ListPage;
