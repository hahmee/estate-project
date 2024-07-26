import React, {useEffect, useState} from 'react';
import "./conversation.scss";
function Conversation({conversations, clickConversation, userId}) {
    console.log(conversations)
    const [chatList, setChatList] = useState(conversations);

    // useEffect(() => {
    //     console.log('userId', userId);
    //     if (userId) {
    //
    //         setChatList([...chatList, {id: 'dd', receiver: {username: 'sadf', id: userId, avatar: 'asdfasdf'}}]);
    //
    //
    //     }
    //
    // }, [userId]);


    // setChatList([...chatList ]);
    // if (userId) {
    //     //대화내역 중에 있다면
    //     if (chatList.find(chat => chat.receiver.id === userId)) {
    //         //맨 앞으로
    //
    //     }else { //처음 대화하는 거
    //         setChatList([...chatList ]);
    //     }
    //
    // }


    return (
        <div>
            {
                chatList.map((c) => {
                    return <div key={c.id} onClick={() => clickConversation(c)}  className="conversation">
                        <img
                            className="conversationImg"
                            src={c.receiver.avatar || "/noavatar.jpg"}
                            alt="프로필 이미지"/>
                        <div>{c.receiver.username}</div>
                    </div>;
                })

            }

        </div>
    );
}

export default Conversation;