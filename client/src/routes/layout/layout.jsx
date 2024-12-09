import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import Footer from "../../components/footer/Footer.jsx";
import MobileMenu from "../../components/mobile-menu/MobileMenu.jsx";

function CommonLayout({ children, isSearchBar, isLoginCheck }) {

    const { changeScrollTop,  changeFixedNavbar,  changeIsDropDown} = useContext(NavbarContext);
    const {currentUser} = useContext(AuthContext);
    const [mobileMenuHidden, setMobileMenuHidden] = useState(false);
    const lastScrollTop = useRef(0); // 이전 스크롤 위치를 저장

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (window !== undefined) {
            let currentScrollTop = window.scrollY;

            // 스크롤이 최상단인지 여부를 설정
            changeScrollTop(currentScrollTop === 0);
            //스크롤이 움직이면 무조건 드롭다운 닫기
            changeIsDropDown(false);

            // 스크롤 방향에 따라 상태 변경
            if (currentScrollTop > lastScrollTop.current && currentScrollTop > 800) {
                // 스크롤 다운
                setMobileMenuHidden(true);
            } else {
                // 스크롤 업
                setMobileMenuHidden(false);
            }

            // 현재 스크롤 위치 저장
            lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;

        }
    };


    if (!currentUser && isLoginCheck) return <Navigate to="/login"/>;

    return (
        <div className="common-layout">
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


function CreateProcess() {
    const {progress} = useContext(UserProgressContext);
    const navigate = useNavigate();

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

export { CommonLayout, Layout, RequireAuth, CreateProcess};
