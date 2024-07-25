import "./listPage.scss";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import {Navigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {listPostStore} from "../../lib/listPostStore.js";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";
import {roomOption, typeOption} from "../newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../../components/navbar/Navbar.jsx";


function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {currentUser} = useContext(AuthContext);
    const {clearSearchValue, changeSearchValue} = useContext(SearchbarContext);
    const query = {
        type: searchParams.getAll("type").length < 1 ? typeOption.map((type) => type.value) : searchParams.getAll("type"),
        location: searchParams.get("location") || "",
        latitude: searchParams.get("latitude") || "",
        longitude: searchParams.get("longitude") || "",
        property: searchParams.getAll("property") < 1 ? roomOption.map((type) => type.value) : searchParams.getAll("property"),
        minPrice: searchParams.get("minPrice") || MIN_PRICE,
        maxPrice: searchParams.get("maxPrice") || MAX_PRICE,
        minSize: searchParams.get("minSize") || MIN_SIZE,
        maxSize: searchParams.get("maxSize") || MAX_SIZE,
        searchedLat: searchParams.get("searchedLat") || "",
        searchedLng:  searchParams.get("searchedLng") || "",
    };
    const setIsFetch = listPostStore((state) => state.setIsFetch);
    const postFetch = listPostStore((state) => state.fetch);
    const posts = listPostStore((state) => state.posts);
    const savedPosts = savedPostStore((state) => state.savedPosts);
    const currentSavedPost = savedPostStore((state) => state.currentSavedPost);
    const {changeScrollTop, changeFixedNavbar} = useContext(NavbarContext);

    useEffect(() => {
        if (currentUser && Object.keys(currentSavedPost).length > 0) {
            postFetch(`latitude=${currentSavedPost.latitude}&longitude=${currentSavedPost.longitude}`);
        }
    }, [savedPosts]);


    //searchParams 가 변경될때마다 fetch 실행
    useEffect(() => {
        const sendTypes = query.type.join('&type=');//searchValue.payType.join('&type='); // //
        const sendProperties = query.property.join('&property=');//searchParams.propertyType.join('&property=');////

        postFetch(`type=${sendTypes}&location=${query.location}&latitude=${query.latitude}&longitude=${query.longitude}&property=${sendProperties}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}`);

        //searchbar context에 url 값 넣기
        changeSearchValue({
            location: query.location,
            payType: query.type,
            propertyType: query.property,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            minSize: query.minSize,
            maxSize: query.maxSize,
            latitude: query.latitude,
            longitude: query.longitude
        });

    }, [searchParams]);


    useEffect(() => {
        changeScrollTop(false);
        changeFixedNavbar(true);
        setIsFetch(true);
        return () => {
            changeFixedNavbar(false);
            //정리
            // clearSearchValue(); //error
        };

    }, []);

    if (!currentUser) return <Navigate to="/login"/>;

    else {
        return (
            <div className="listPage">
                <div className="listContainer">
                    <div className="wrapperList">
                        {
                           // isLoading ? <ListLoading/> :
                                (posts.length < 1) ? (
                                        <div className="noFinding">
                                            검색 결과가 없습니다.
                                        </div>) :
                                    posts.map((post, idx) => (
                                        <Card key={idx} card={post}/>
                                    ))
                        }
                        {
                            // isLoading ? <ListLoading/> :
                            (posts.length < 1) ? (
                                    <div className="noFinding">
                                        검색 결과가 없습니다.
                                    </div>) :
                                posts.map((post, idx) => (
                                    <Card key={idx} card={post}/>
                                ))
                        }
                        {
                            // isLoading ? <ListLoading/> :
                            (posts.length < 1) ? (
                                    <div className="noFinding">
                                        검색 결과가 없습니다.
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
