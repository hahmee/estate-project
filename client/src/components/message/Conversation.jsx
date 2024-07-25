import React from 'react';
import "./conversation.scss";
function Conversation({conversations, clickConversation}) {

    return (
        <div>
            {
                conversations.map((c) => {
                    return <div key={c.id} onClick={() => clickConversation(c)}  className="conversation">
                        <img
                            className="conversationImg"
                            src={c.receiver.avatar || "noavatar.jpg"}
                            alt="프로필 이미지"/>
                        <div>{c.receiver.username}</div>
                    </div>;
                })

            }

        </div>
    );
}

export default Conversation;