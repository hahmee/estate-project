import "./homePage.scss";
import "leaflet/dist/leaflet.css";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import Button from "../../UI/Button.jsx";
import {currencyFormatter} from "../../util/formatting.js";
import {roomOption, typeOption} from "../newPostPage/newPostPage.jsx";

const categories = [
    {
        title: '아파트',
        description: '모든 가격대의 아파트를 찾아보세요.',
        img: "apartment",
        url: `list?type=month_pay&type=year_pay&type=sell&location=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&political=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&latitude=35.907757&longitude=127.766922&property=apartment&minPrice=0&maxPrice=1000000000&minSize=0&maxSize=60&searchedLat=35.907757&searchedLng=127.766922&search_type=autocomplete_click&ne_lat=33.0041&ne_lng=124.5863&sw_lat=38.63400000000001&sw_lng=131.1603`
    },
    {
        title: '주택',
        description: '편안한 주택을 찾으세요.',
        img:'house',
        url: `list?type=month_pay&type=year_pay&type=sell&location=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&political=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&latitude=35.907757&longitude=127.766922&property=condo&minPrice=0&maxPrice=1000000000&minSize=0&maxSize=60&searchedLat=35.907757&searchedLng=127.766922&search_type=autocomplete_click&ne_lat=33.0041&ne_lng=124.5863&sw_lat=38.63400000000001&sw_lng=131.1603`
    },
    {
        title: '오피스텔',
        description: '비즈니스를 위한 상업용 오피스텔을 찾으세요.',
        img: "home_work",
        url: `list?type=month_pay&type=year_pay&type=sell&location=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&political=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&latitude=35.907757&longitude=127.766922&property=apartment&property=condo&property=officetel&minPrice=0&maxPrice=1000000000&minSize=0&maxSize=60&searchedLat=35.907757&searchedLng=127.766922&search_type=autocomplete_click&ne_lat=33.0041&ne_lng=124.5863&sw_lat=38.63400000000001&sw_lng=131.1603`
    }
];

function HomePage() {
    const {featuredResponse} = useLoaderData();
    const featuredPosts = featuredResponse.data;
    const navigate = useNavigate();

    return (
        <div className="main-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__content">
                    <h1>당신의 꿈의 집을 찾으세요</h1>
                    <p>다양한 매물을 확인하고 원하는 집을 찾아보세요.</p>
                    <Button className="btn-primary" onClick={() => navigate("/list?type=month_pay&type=year_pay&type=sell&location=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&political=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD&latitude=35.907757&longitude=127.766922&property=apartment&property=condo&property=officetel&property=one_room&property=two_room&property=land&minPrice=0&maxPrice=1000000000&minSize=0&maxSize=60&searchedLat=35.907757&searchedLng=127.766922&search_type=autocomplete_click&ne_lat=33.0041&ne_lng=124.5863&sw_lat=38.63400000000001&sw_lng=131.1603")}>매물 보기</Button>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories">
                <h2 className="section-title">매물 종류</h2>
                <div className="categories__list">
                    {
                        categories.map((category, key) => {
                            return <Link key={key} className="category" to={category.url}>
                                <span className="material-symbols-outlined icon-main">
                                    {category.img}
                                </span>
                                <h3>{category.title}</h3>
                                <p>{category.description}</p>
                            </Link>;
                        })
                    }

                </div>
            </section>

            {/* Featured Listings Section */}
            <section className="featured-listings">
                <h2 className="section-title">추천 매물</h2>
                <div className="listings">
                    {
                        featuredPosts.map((post) => {
                            return <div className="listing" key={post.id} onClick={() => navigate("/read/" + post.id)}>
                                <img src={post.images[0]} alt="Property"/>
                                <span className="titleAndCounts">
                                     <h3>{post.title}</h3>
                                    <span>
                                        <span className={`material-symbols-outlined`}>favorite</span>
                                        <span>{post.savedPosts.length}</span>
                                    </span>
                                </span>
                                <p>{(post.address)}</p>
                                <p>
                                    {
                                        roomOption.filter((option) => option.value === post.property)[0].label
                                    }/
                                    {
                                        typeOption.filter((option) => option.value === post.type)[0].label
                                    }
                                </p>
                                <h3>{currencyFormatter.format(post.price)}</h3>
                            </div>;
                        })
                    }
                </div>
            </section>

        </div>
    );
}

export default HomePage;
