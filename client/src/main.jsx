import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import {UserProgressContextProvider} from "./context/UserProgressContext.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {NavbarContextProvider} from "./context/NavbarContext.jsx";
import {SearchbarContextProvider} from "./context/SearchbarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <SearchbarContextProvider>
        <NavbarContextProvider>
            <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID}>
                <UserProgressContextProvider>
                    <AuthContextProvider>
                        <SocketContextProvider>
                            <App/>
                            <ToastContainer
                                position="top-right"
                                autoClose={2500}
                                hideProgressBar={true}
                                closeOnClick={true}
                                pauseOnHover={false}
                            />
                        </SocketContextProvider>
                    </AuthContextProvider>
                </UserProgressContextProvider>
            </GoogleOAuthProvider>
        </NavbarContextProvider>
    </SearchbarContextProvider>
    // </React.StrictMode>
);
