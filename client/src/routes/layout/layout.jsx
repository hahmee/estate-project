import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import React, {useCallback, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";

function Layout() {
    const layoutRef = useRef();

    const [scrollTop, setScrollTop] = useState(false);


    const handleScroll = useCallback((e) => {
        console.log('scrollTop값',scrollTop, e.target.scrollTop);
        if (e.target.scrollTop === 0) {
            setScrollTop(true);
        }
        else {
            setScrollTop(false);
        }

    }, [scrollTop]);

    useEffect(() => {
        setScrollTop(true);
        if (layoutRef.current) {
            layoutRef.current.addEventListener('scroll', handleScroll, false);
            return () => layoutRef.current.removeEventListener('scroll', handleScroll, false);
        }
    }, []);

    return (
        <div className="app" ref={layoutRef}>
            <Navbar scrollTop={scrollTop} setScrollTop={setScrollTop}/>
            <div className="layout">
                <div className="content">
                    <Outlet/>
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
                <div className="layout">
                    <div className="navbar">
                        <Navbar/>
                    </div>
                    <div>
                        <Outlet/>
                    </div>
                </div>
                <div className="processDiv">
                    <Button outlined onClick={() => navigate(-1)}>이전</Button>
                    <Button form={progress.form} disabled={progress.disabled} onClick={()=>progress.url ? navigate(progress.url) : undefined } type="submit" loading={progress.loading}>{progress.text}</Button>
                </div>

            </div>
        );
    }
}

export {Layout, RequireAuth, CreateProcess};
