import React from 'react';
import "./message2.scss";
import {format} from "timeago.js";

function Message({message, own, avatar}) {
    // console.log('message', message);
    return (
        <div className={own ? "messageDiv own" : "messageDiv"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={avatar || "/noavatar.jpg"}
                    alt="프로필 이미지"
                />
                <p className="messageText">{message.text}</p>
                <p className="messageRead">1</p>

            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    );
}

export default Message;