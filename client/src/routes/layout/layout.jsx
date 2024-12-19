import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import Footer from "../../components/footer/Footer.jsx";
import MobileMenu from "../../components/mobile-menu/MobileMenu.jsx";

function CommonLayout({ children, isSearchBar, isLoginCheck }) {

    const {currentUser} = useContext(AuthContext);
    const [mobileMenuHidden, setMobileMenuHidden] = useState(false);

    if (!currentUser && isLoginCheck) return <Navigate to="/login"/>;

    return (
        <div>
            <Navbar isSearchBar={isSearchBar}/>
                {children}
            <MobileMenu isHidden={mobileMenuHidden}/>
        </div>
    );
}

//isSearchBar 가 true
function Layout() {
    return (
        <div className="app">
            <div className="layout">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

function RequireAuth() {
    return (
        <div className="app">
            <div className="layout">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
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

export { CommonLayout, Layout, RequireAuth, CreateProcess};
