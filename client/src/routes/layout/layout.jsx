import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../UI/Button.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";

function Layout() {
  return (
      <div className="app">
        <div className="layout">
          <div className="navbar">
            <Navbar />
          </div>
          <div className="content">
            <Outlet />
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

    console.log('progress', progress);

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
                <div className="processDiv">
                    <Button outlined>이전</Button>
                    <Button inactive={!progress ? true : false}>다음</Button>
                </div>
            </div>
        );
    }
}

export {Layout, RequireAuth,CreateProcess};
