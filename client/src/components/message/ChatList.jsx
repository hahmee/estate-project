import React from 'react';
import "./chatList.scss";
import {useParams} from "react-router-dom";

function ChatList({conversation, clickConversation, lastMessage}) {

    const {userId} = useParams(); //작성자 아이디
     return (
        <div className={`conversation${userId === conversation.receiver.id ? ' --current' : ''}`} onClick={() => clickConversation(conversation)}>
            <img
                className="conversation__image"
                src={conversation.receiver.avatar || "/noavatar.jpg"}
                alt="프로필 이미지"/>
            <div className="conversation__content">
                <div className="conversation__username">{conversation.receiver.username}</div>
                <div className="conversation__message">{conversation.lastMessage}</div>
            </div>

            <span className="conversation__count"></span>
        </div>
     );
}

export default ChatList;