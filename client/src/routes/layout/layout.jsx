import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useRef} from "react";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {NavbarContext} from "../../context/NavbarContext.jsx";

function Layout() {
    const layoutRef = useRef();

    const {scrollTop, changeScrollTop, fixedNavbar, changeOutsideClick, outsideClick} = useContext(NavbarContext);

    const handleScroll = useCallback((e) => {
        if (e.target.scrollTop === 0) {
            changeScrollTop(true);
        } else { //0 아닐때
            changeScrollTop(false);
        }
    }, [scrollTop]);


    useEffect(() => {
        if (layoutRef.current) {
            if (!fixedNavbar) { //고정 아니라면
                changeScrollTop(true);
                layoutRef.current.addEventListener('scroll', handleScroll, false);
            } else { // 고정
                changeScrollTop(false);
                layoutRef.current.removeEventListener('scroll', handleScroll, false);
            }
            // return () => layoutRef.current.removeEventListener('scroll', handleScroll, false); // 안하면 location페이지에서 에러남
        }
    }, [fixedNavbar, outsideClick]);


    return (
        <div className="app" ref={layoutRef}>
            <Navbar isSearchBar={true}/>
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

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) return <Navigate to="/login" />;

  else {
    return (
        <div className="app">
            <div className="layout">
                <div className="navbar">
                    <Navbar/>
                </div>
                <div className="content">
                    <Outlet/>
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
                <Navbar isSearchBar={false}/>
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

export {Layout, RequireAuth, CreateProcess};
