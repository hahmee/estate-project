import {Marker, Popup} from "react-leaflet";
import "./pin.scss";
import {useNavigate} from "react-router-dom";
import {divIcon} from "leaflet/src/layer/index.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {savedPostStore} from "../../lib/savedPostStore.js";
import {currencyFormatter} from "../../util/formatting.js";
import Button from "../../UI/Button.jsx";
import {typeOption} from "../../routes/newPostPage/newPostPage.jsx";

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

function Pin({item}) {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [saved, setSaved] = useState(item.isSaved);
    const [savedCnt, setSavedCnt] = useState(item.savedPostList.length);
    const setCurrentSavedPost = savedPostStore((state) => state.setCurrentSavedPost);
    const save = savedPostStore((state) => state.save);
    const savedPostFetch = savedPostStore((state) => state.fetch);
    const popup = useRef();

    const customMarkerIcon = divIcon({
        html: `<div class=${saved ? "saved-pin" : "marker"}><div>${currencyFormatter.format(item.price)}</div></div>`
    });

    const closePopup = () => {
        popup.current._closeButton.click();
    }
    //좋아요
    const handleSave = async () => {
        if (!currentUser) {
            navigate("/login");
        }
        // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
        setSaved((prev) => !prev);
        try {
            await save( item._id?.$oid || item.id);// await apiRequest.post("/users/save", { postId: item.id });
            setCurrentSavedPost(item);
            await savedPostFetch();

        } catch (err) {
            console.log(err);
            setSaved((prev) => !prev);
        }
    }

    useEffect(() => {
        setSaved(item.isSaved);
        setSavedCnt(item.savedPostList.length);
    }, [item]);

    if(!item._id?.$oid && !item.id ) {
        return (
            <Marker position={[item.latitude, item.longitude]}></Marker>
        );
    }
    else {
        return (
            <Marker position={[item.latitude, item.longitude]} icon={customMarkerIcon}>
                <Popup className="popup" ref={popup}>
                    <div className="popupContainer">
                        <div className="icons">
                            <Button round onClick={handleSave} className="pinButton">
                                {
                                    saved ? <span className="material-symbols-outlined clickedHeart">favorite</span> :
                                        <span className="material-symbols-outlined">favorite</span>
                                }
                            </Button>
                            <Button round onClick={closePopup} className="pinRightButton">
                                <span className="material-symbols-outlined">close</span>
                            </Button>
                        </div>
                        <Slider {...settings} className="slick-slider">
                            {
                                item.images.map((image, index) => {
                                    return <img key={index} src={image} alt="image"/>
                                })
                            }
                        </Slider>
                        <div className="textContainer">
                            <div>
                                <div onClick={() => navigate(`/read/${item._id.$oid}`)} className="pinCursor">{item.title}</div>
                                <div className="savedCnt">
                                    <span className="material-symbols-outlined pinCursor" style={{fontSize: '18px'}} >favorite</span>
                                    <span>{savedCnt}</span>
                                </div>
                            </div>
                            <div>{item.size}평</div>
                            <div>
                                <span>침실 {item.bedroom}개, </span>
                                <span>욕실 {item.bathroom}개</span>
                            </div>
                            <div>
                                <span>{currencyFormatter.format(item.price)}</span>
                                <span>&nbsp;/{typeOption.find((option) => option.value ===item.type).label}</span>
                            </div>
                        </div>
                    </div>
                </Popup>
            </Marker>
        );
    }
}

export default Pin;
