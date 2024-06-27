import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import {UserProgressContextProvider} from "./context/UserProgressContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <UserProgressContextProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
    </UserProgressContextProvider>
  // </React.StrictMode>
);
