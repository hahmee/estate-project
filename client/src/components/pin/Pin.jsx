import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import {Link, useNavigate} from "react-router-dom";
import {divIcon, Icon} from "leaflet/src/layer/index.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useContext, useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleXmark, faFontAwesome, faHeart} from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../../lib/apiRequest.js";
import {AuthContext} from "../../context/AuthContext.jsx";

const customIcon = new Icon ({
  iconUrl : 'https://img.icons8.com/doodle/48/apple.png',
  // iconSize : [35, 35],
  // iconAnchor : [22, 94],
  // popupAnchor : [-3, -76]
})


const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
};


function Pin({item}) {
    const customMarkerIcon = divIcon({
        html: `<div class="marker"><div>₩${item.price}</div></div>`
    });

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [saved, setSaved] = useState(item.isSaved);

    const popup = useRef();

    const closePopup = () => {
        popup.current._closeButton.click()
    }
    const handleSave = async () => {
        if (!currentUser) {
            navigate("/login");
        }
        // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
        setSaved((prev) => !prev);
        try {
            await apiRequest.post("/users/save", { postId: item.id });
            // callback();

        } catch (err) {
            console.log(err);
            setSaved((prev) => !prev);
        }
    }
    return (
    <Marker position={[item.latitude, item.longitude]} icon={customMarkerIcon}>
        <Popup className="popup" ref={popup}>
            <div className="popupContainer">
                <div className="icons">
                    <div className="icon" onClick={handleSave}>
                        {
                            saved ? <FontAwesomeIcon icon={faHeart} style={{backgroundColor: 'red'}}/> :
                                <FontAwesomeIcon icon={faHeart}/>
                        }
                    </div>
                    <div className="icon" onClick={closePopup}>
                        <FontAwesomeIcon icon={faCircleXmark}/>
                    </div>

                </div>
                <Slider {...settings} className="slick-slider">
                    {
                        item.images.map((image, index) => {
                            return <img key={index} src={image} alt="image"/>
                        })
                    }
                </Slider>

                <div className="textContainer">
                    <Link to={`/read/${item.id}`}>{item.title}</Link>
                    <span>{item.bedroom} bedroom</span>
                    <b>$ {item.price}</b>
                </div>
            </div>
        </Popup>
    </Marker>
    );
}

export default Pin;
