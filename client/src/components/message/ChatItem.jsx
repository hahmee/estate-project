import React, {useEffect} from 'react';
import "./chatItem.scss";


function ChatItem({chat, clickChat}) {

    return (
        // <div className={`conversation${userId === chat.receiver.id ? ' --current' : ''}`} onClick={() => clickChat(chat)}>
        <div className={`conversation`} onClick={() => clickChat(chat)}>
            <div className="conversation__writer">
                <img
                    className="conversation__image"
                    src={chat.receiver?.avatar || "/noavatar.jpg"}
                    alt="프로필 이미지"/>
                <span className={`conversation__status${chat.receiver?.isOnline ? ' --online' : ' --offline'}`}>
                </span>
            </div>
            <div className="conversation__content">
                <div className="conversation__username">{chat.receiver?.username}</div>
                <div className="conversation__message">{chat.lastMessage}</div>
            </div>
            <span className="conversation__count">{chat.unreadMessagesCount}</span>
        </div>
    );
}

export default ChatItem;