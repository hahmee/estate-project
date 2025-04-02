import React from 'react';
import "./chatItem.scss";
import {useParams} from "react-router-dom";


function ChatItem({chat, clickChat}) {
    const {userId} = useParams(); //작성자 아이디

    return (
        <div className={`conversation${userId && (userId === chat.receiver.id) ? ' --current' : ''}`}
             onClick={() => clickChat(chat)}>
            <div className="conversation__writer">
                <img
                    className="conversation__image"
                    src={chat.receiver?.avatar || "/noavatar.jpg"}
                    alt="프로필 이미지"/>
                <span className={`conversation__status${chat.receiver?.isOnline ? ' --online' : ' --offline'}`}></span>
            </div>
            <div className="conversation__content">
                <div className="conversation__username">{chat.receiver?.username}</div>
                <div className="conversation__message">{chat.lastMessage}</div>
            </div>
            {chat.unreadMessagesCount > 0 &&
                <span className="conversation__count">{chat.unreadMessagesCount}</span>
            }
        </div>
    )

}

export default ChatItem;