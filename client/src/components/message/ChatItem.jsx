import React, {useContext, useEffect, useState} from 'react';
import "./chatItem.scss";
import {useParams} from "react-router-dom";
import {SocketContext} from "../../context/SocketContext.jsx";

function ChatItem({conversation, clickConversation}) {

    const {userId} = useParams(); //작성자 아이디
    const {socket} = useContext(SocketContext);
    const [isUserOnline, setIsUserOnline] = useState(false);

    useEffect(() => {
        console.log("Setting up socket listeners...");
        if (socket && userId) {
            socket.emit("checkUserOnline", {userId}, (isOnline) => {
                console.log("User is online:", isOnline);
                setIsUserOnline(isOnline);
            });
        }

        return () => {
            if (socket) {
                console.log("Cleaning up socket listeners...");
                socket.off("checkUserOnline");
            }
        };

    }, [socket, userId]);

    return (
        <div className={`conversation${userId === conversation.receiver.id ? ' --current' : ''}`}
             onClick={() => clickConversation(conversation)}>
            <div className="conversation__writer">
                <img
                    className="conversation__image"
                    src={conversation.receiver.avatar || "/noavatar.jpg"}
                    alt="프로필 이미지"/>
                <span className={`conversation__status${isUserOnline ? ' --online' : ' --offline'}`}></span>
            </div>
            <div className="conversation__content">
                <div className="conversation__username">{conversation.receiver.username}</div>
                <div className="conversation__message">{conversation.lastMessage}</div>
            </div>
            <span className="conversation__count"></span>
        </div>
    );
}

export default ChatItem;