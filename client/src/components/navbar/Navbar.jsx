import React, {useContext, useState} from "react";
import "./navbar.scss";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useNotificationStore} from "../../lib/notificationStore";
import Button from "../../UI/Button.jsx";

function Navbar() {
    const [open, setOpen] = useState(false);

    const {currentUser} = useContext(AuthContext);

    const fetch = useNotificationStore((state) => state.fetch);

    const number = useNotificationStore((state) => state.number);

    const navigate = useNavigate();


    if (currentUser) fetch();

    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <span className="material-symbols-outlined">
                    apartment
                    </span>
                    <span>Estate</span>
                </a>
            </div>


            <div className="middle">
                {/*<SearchMainBar getMapResult={getMapResult} searchOptions={['geocode']}/>*/}
            </div>

            <div className="right">
                {currentUser ? (
                    <div className="user">
                        <Button onClick={() => navigate("/location")}>포스팅하기</Button>
                        <Link to="/profile" className="profile">
                            {number > 0 && <div className="notification">{number}</div>}
                            <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar"/>
                            <span>{currentUser.username}</span>
                        </Link>

                    </div>
                ) : (
                    <>
                        <a href="/login">로그인</a>
                        <a href="/register" className="register">
                            회원가입
                        </a>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="/">메인페이지</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
