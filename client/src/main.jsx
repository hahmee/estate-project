import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import {UserProgressContextProvider} from "./context/UserProgressContext.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProgressContextProvider>
            <AuthContextProvider>
                <SocketContextProvider>
                    <App/>
                </SocketContextProvider>
            </AuthContextProvider>
        </UserProgressContextProvider>
    </GoogleOAuthProvider>
    // </React.StrictMode>
);
