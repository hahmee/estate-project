import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import Footer from "../../components/footer/Footer.jsx";
import MobileMenu from "../../components/mobile-menu/MobileMenu.jsx";

function CommonLayout({ children, isSearchBar, isLoginCheck, isLoginLayout=false }) {

    const {currentUser} = useContext(AuthContext);
    const [mobileMenuHidden, setMobileMenuHidden] = useState(false);

    //로그인이 안되어있으면 login 페이지로 돌려보낸다.
    if (!currentUser && isLoginCheck) return <Navigate to="/login"/>;

    //로그인이 되어있으면 register, login 페이지에 접근하지 못한다.
    if (currentUser && isLoginLayout) return <Navigate to="/"/>;

    return (
        <div>
            <Navbar isSearchBar={isSearchBar}/>
                {children}
            <MobileMenu isHidden={mobileMenuHidden}/>
        </div>
    );
}


function Layout({isFooter = false}) {
    return (
        <div className="app">
            <div className="layout">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
            {isFooter && <Footer/>}
        </div>
    );
}

function CreateProcess() {
    const {progress} = useContext(UserProgressContext);
    const navigate = useNavigate();

    return (
        <div className="app">
            <div className="layout">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
            <div className="processDiv">
                <Button outlined onClick={() => navigate(-1)}>이전</Button>
                <Button form={progress.form} disabled={progress.disabled} onClick={() => progress.url ? navigate(progress.url) : undefined} type="submit" loading={progress.loading}>{progress.text}</Button>
            </div>

        </div>
    );

}

export {CommonLayout, Layout, CreateProcess};
