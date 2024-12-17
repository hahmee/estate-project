import "./listPage.scss";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import {useSearchParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {listPostStore} from "../../lib/listPostStore.js";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";
import {roomOption, typeOption} from "../newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../../components/navbar/Navbar.jsx";
import {numberFormatter} from "../../util/formatting.js";


function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {currentUser} = useContext(AuthContext);
    const {changeSearchValue, searchValue, clearSearchValue} = useContext(SearchbarContext);
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
        ne_lat: searchParams.get("ne_lat") || "",
        ne_lng: searchParams.get("ne_lng") || "",
        sw_lat: searchParams.get("sw_lat") || "",
        sw_lng: searchParams.get("sw_lng") || "",
    };
    const setIsFetch = listPostStore((state) => state.setIsFetch);
    const postFetch = listPostStore((state) => state.fetch);
    const posts = listPostStore((state) => state.posts);
    const savedPosts = savedPostStore((state) => state.savedPosts);
    const currentSavedPost = savedPostStore((state) => state.currentSavedPost);
    const {changeScrollTop, changeFixedNavbar, fixedNavbar} = useContext(NavbarContext);

    useEffect(() => {//좋아요 눌렀을 때 실행

        const sendTypes = query.type.join('&type=');
        const sendProperties = query.property.join('&property=');

        if (currentUser && Object.keys(currentSavedPost).length > 0) {
            postFetch(`type=${sendTypes}&location=${query.location}&political=${query.political}&latitude=${currentSavedPost.latitude}&longitude=${currentSavedPost.longitude}&property=${sendProperties}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}&search_type=${query.search_type}&ne_lat=${query.ne_lat}&ne_lng=${query.ne_lng}&sw_lat=${query.sw_lat}&sw_lng=${query.sw_lng}`);
        }
    }, [savedPosts]);


    //searchParams 가 변경될때마다 fetch 실행
    useEffect(() => {
        const sendTypes = query.type.join('&type=');//searchValue.payType.join('&type='); // //
        const sendProperties = query.property.join('&property=');//searchParams.propertyType.join('&property=');////

        postFetch(`type=${sendTypes}&location=${query.location}&political=${query.political}&latitude=${query.latitude}&longitude=${query.longitude}&property=${sendProperties}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&minSize=${query.minSize}&maxSize=${query.maxSize}&search_type=${query.search_type}&ne_lat=${query.ne_lat}&ne_lng=${query.ne_lng}&sw_lat=${query.sw_lat}&sw_lng=${query.sw_lng}`);


    }, [searchParams]);


    useEffect(() => {
        changeScrollTop(false);
        changeFixedNavbar(true);
        setIsFetch(true);
        //searchbar context에 url 값 넣기 -> 외부 url 을 통해서 들어온 사람들을 위해
        changeSearchValue({
            location: query.location,
            payType: query.type,
            propertyType: query.property,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            minSize: query.minSize,
            maxSize: query.maxSize,
            latitude: query.latitude,
            longitude: query.longitude,
            search_type: query.search_type,
        });

        return () => {
            changeFixedNavbar(false);
            //정리
            clearSearchValue();
        };

    }, []);

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapperList">
                    <div>
                            <span>{
                                query.search_type !== 'user_map_move' ? query.political : '지도 표시 지역'}의 매물</span>
                        <span>&nbsp;{numberFormatter.format(posts.length)}개</span>
                    </div>
                    {
                        // isLoading ? <ListLoading/> :
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

export default ListPage;
