import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useRef} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import Footer from "../../components/footer/Footer.jsx";

function CommonLayout({ children, isSearchBar }) {
    return (
        <>
            <Navbar isSearchBar={isSearchBar}/>
            {children}
        </>
    );
}
function Layout() {
    const layoutRef = useRef();

    const {scrollTop, changeScrollTop, fixedNavbar, changeOutsideClick, outsideClick} = useContext(NavbarContext);
    const location = useLocation(); // 현재 URL 경로를 추적

    const handleScroll = useCallback((e) => {
        if (e.target.scrollTop === 0) {
            changeScrollTop(true);
        } else { //0 아닐때
            changeScrollTop(false);
        }
    }, [scrollTop]);

    // useEffect(() => {
    //     if(fixedNavbar) { //Navbar 상단에 고정시킨다면
    //         changeScrollTop(false); //scroll값이 top에 가는 값 거짓
    //     }
    // }, [scrollTop, fixedNavbar]);

    useEffect(() => {
        if (layoutRef.current) {
            changeScrollTop(true);
            layoutRef.current.addEventListener('scroll', handleScroll, true);
            // if (!fixedNavbar) { //고정 아니라면
            //     console.log('gg');
            //     changeScrollTop(true);
            //     layoutRef.current.addEventListener('scroll', handleScroll, true);
            // } else { // 고정
            //     console.log('kk');
            //     changeScrollTop(false);
            //     layoutRef.current.removeEventListener('scroll', handleScroll, true);
            // }

            // return () => layoutRef.current.removeEventListener('scroll', handleScroll, true); // 안하면 location페이지에서 에러남
        }

        // console.log('fixedNavbar', fixedNavbar);

    }, []);

    return (
        <div className="app" ref={layoutRef}>
            <div className="layoutUpper">
                <div className="layout">
                    <div className="content">
                        <Outlet/>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <Footer/>
            </footer>
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
                    <Button form={progress.form} disabled={progress.disabled}
                            onClick={() => progress.url ? navigate(progress.url) : undefined} type="submit"
                            loading={progress.loading}>{progress.text}</Button>
                </div>

            </div>
        );
    }

}

export { CommonLayout, Layout, RequireAuth, CreateProcess};
