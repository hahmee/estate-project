import React from 'react';
import "./conversation.scss";
import {useParams} from "react-router-dom";

function Conversation({conversation, clickConversation}) {

    const {userId} = useParams(); //작성자 아이디

    console.log('conversation', conversation);
    // console.log('conversation', conversation);

    return (
        <div className={`conversation${userId === conversation.receiver.id ? ' --current' : ''}`}
             onClick={() => clickConversation(conversation)}>
            <img
                className="conversationImg"
                src={conversation.receiver.avatar || "/noavatar.jpg"}
                alt="프로필 이미지"/>
            <div>{conversation.receiver.username}</div>
        </div>
    );
}

export default Conversation;