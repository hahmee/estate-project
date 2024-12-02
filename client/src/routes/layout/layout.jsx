import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useRef} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import Footer from "../../components/footer/Footer.jsx";

function CommonLayout({ children, isSearchBar }) {

    const layoutRef = useRef();
    const { changeScrollTop,  changeFixedNavbar,  changeIsDropDown} = useContext(NavbarContext);

    const handleScroll = useCallback(() => {
        if (layoutRef.current) {
            const currentScrollTop = layoutRef.current.scrollTop;
            // 스크롤이 최상단인지 여부를 설정
            changeScrollTop(currentScrollTop === 0);

            //스크롤이 움직이면 무조건
            changeIsDropDown(false);

            // 스크롤이 내려가면 Navbar 고정 해제, 올라가면 고정
            if (currentScrollTop > 10) {
                changeFixedNavbar(false); // 스크롤 내려가면 해제
            } else {
                changeFixedNavbar(true); // 스크롤 올라가면 고정
            }
        }
    }, [changeScrollTop, changeFixedNavbar]);

    useEffect(() => {

        const currentRef = layoutRef.current;

        if (currentRef) {
            currentRef.addEventListener("scroll", handleScroll, true);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", handleScroll, true);
            }
        };
    }, [handleScroll]);


    return (
        <div className="common-layout" ref={layoutRef}>
            <Navbar isSearchBar={isSearchBar}/>
            {children}
        </div>
    );
}
//isSearchBar 가 true
function Layout() {


    return (
        <div className="app" >
            <div className="layoutUpper">
                <div className="layout">
                    <div className="content">
                        <Outlet/>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
}

function RequireAuth() {
    const {currentUser} = useContext(AuthContext);

    if (!currentUser) return <Navigate to="/login"/>;

    else {

        return (
            <div className="app">
                <div className="layoutUpper">
                    <div className="layout">
                        <div className="content">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function CreateProcess() {
    const {currentUser} = useContext(AuthContext);
    const {progress} = useContext(UserProgressContext);

    const navigate = useNavigate();

    if (!currentUser) return <Navigate to="/login" />;

    else {
        return (
            <div className="app">
                <div className="layoutUpper">
                    <div className="layout">
                        <div className="content">
                            <Outlet/>
                        </div>
                    </div>
                </div>
                <div className="processDiv">
                    <Button outlined onClick={() => navigate(-1)}>이전</Button>
                    <Button form={progress.form} disabled={progress.disabled} onClick={() => progress.url ? navigate(progress.url) : undefined} type="submit" loading={progress.loading}>{progress.text}</Button>
                </div>

            </div>
        );
    }

}

export { CommonLayout, Layout, RequireAuth, CreateProcess};
