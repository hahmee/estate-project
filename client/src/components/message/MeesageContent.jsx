import React, {useRef} from 'react';
import {format} from "timeago.js";

function MeesageContent({chat, currentUser}) {
    const messageEndRef = useRef();

    if(Object.keys(chat).length <1){
        return <div>아직 대화 내용이 없습니다.</div>
    }
    return (
        <div>
                <div className="chatBox">
                    <div className="center">
                        {chat.messages.map((message) => (
                            <div
                                className="chatMessage"
                                style={{
                                    alignSelf:
                                        message.userId === currentUser.id
                                            ? "flex-end"
                                            : "flex-start",
                                    textAlign:
                                        message.userId === currentUser.id ? "right" : "left",
                                }}
                                key={message.id}
                            >
                                <p>{message.text}</p>
                                <span>{format(message.createdAt)}</span>
                            </div>
                        ))}
                        <div ref={messageEndRef}></div>
                    </div>

                </div>

        </div>
    );
}

export default MeesageContent;