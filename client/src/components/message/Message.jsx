import React from 'react';
import "./message2.scss";
import { format } from "timeago.js";

function Message({ message, own, avatar }) {
    return (
        <div className="message">
            <div className={`message__container ${own ? "message__container--own" : ""}`}>
                <div className="message__top">
                    <img
                        className="message__avatar"
                        src={avatar || "/noavatar.jpg"}
                        alt="프로필 이미지"
                    />
                    <p className="message__text">{message.text}</p>
                    {/*<p className="message__read-status">1</p>*/}
                </div>
                <div className="message__timestamp">{format(message.createdAt)}</div>
            </div>
        </div>
    );
}

export default Message;
