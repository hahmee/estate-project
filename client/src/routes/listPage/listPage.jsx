import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import {Navigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {listPostStore} from "../../lib/listPostStore.js";
import ListLoading from "../../components/loading/ListLoading.jsx";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {NavbarContext} from "../../context/NavbarContext.jsx";


function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {currentUser} = useContext(AuthContext);
    const isLoading = listPostStore((state) => state.isLoading);
    const setIsLoading = listPostStore((state) => state.setIsLoading);
    const query = {
        type: searchParams.get("type") || "",
        location: searchParams.get("location") || "",
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
    const {scrollTop, changeScrollTop, changeFixedNavbar} = useContext(NavbarContext);

    useEffect(() => {
        if (currentUser && Object.keys(currentSavedPost).length > 0) {
            fetch(`type=&latitude=${currentSavedPost.latitude}&longitude=${currentSavedPost.longitude}&property=&minPrice=&maxPrice=&bedroom=`);
        }
    }, [savedPosts]);


    useEffect(() => {
        changeScrollTop(false);
        changeFixedNavbar(true);
        return () => {
            changeFixedNavbar(false);
        };

    }, []);

    if (!currentUser) return <Navigate to="/login"/>;

    else {
        return (
            <div className="listPage">
                <div className="listContainer">
                    <div className="wrapperList">
                        {/*<Filter/>*/}
                        {
                            isLoading ? <ListLoading/> :
                                (posts.length < 1) ? (
                                        <div>
                                            검색결과가 없습니다.
                                        </div>) :
                                    posts.map((post, idx) => (
                                        <Card key={idx} card={post}/>
                                    ))
                        }
                        {
                            isLoading ? <ListLoading/> :
                                (posts.length < 1) ? (
                                        <div>
                                            검색결과가 없습니다.
                                        </div>) :
                                    posts.map((post, idx) => (
                                        <Card key={idx} card={post}/>
                                    ))
                        }
                        {
                            isLoading ? <ListLoading/> :
                                (posts.length < 1) ? (
                                        <div>
                                            검색결과가 없습니다.
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
