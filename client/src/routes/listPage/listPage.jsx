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
    const currentSavedPost = savedPostStore((state) => state.currentSavedPost);

    useEffect(() => {
        const getPostList = () => {
            //MAP색칠 현재 누른아이의 lat, lng
            fetch(`type=&latitude=${currentSavedPost.latitude}&longitude=${currentSavedPost.longitude}&property=&minPrice=&maxPrice=&bedroom=`);
        }
        if (currentUser) {
            getPostList();
        }
    }, [savedPosts]);


    useEffect(() => {
        fetch(searchParams);
    }, []);

    console.log('posts', posts);


    if (!currentUser) return <Navigate to="/login"/>;

    else {
        return (
            <div className="listPage">
                <div className="listContainer">
                    <div className="wrapper">
                        <Filter/>
                        {
                            (posts.length < 1) ? (<div className="loadingDiv">
                                    <div className="imgElement loading"/>
                                    <div className="textElement">
                                        <div className="loading"/>
                                        <div className="loading"/>
                                        <div className="loading"/>
                                        <div className="loading"/>
                                    </div>
                                </div>) :
                                posts.map((post, idx) => (
                                    <Card key={idx} card={post}/>
                                ))
                        }

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
