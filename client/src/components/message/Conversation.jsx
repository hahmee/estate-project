import React from 'react';
import "./conversation.scss";

function Conversation({conversation, clickConversation}) {


    // console.log('conversation', conversation);

    return (
        <div className="conversation" onClick={()=>clickConversation(conversation)}>
            <img
                className="conversationImg"
                src={conversation.receiver.avatar || "/noavatar.jpg"}
                alt="프로필 이미지"/>
            <div>{conversation.receiver.username}</div>
        </div>
    );
}

export default Conversation;