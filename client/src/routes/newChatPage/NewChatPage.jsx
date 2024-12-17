import React, {Suspense, useContext, useEffect, useState} from 'react';
import {Await, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import "./newChatPage.scss";

import MeesageContent from "../../components/message/MeesageContent.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {SocketContext} from "../../context/SocketContext.jsx";
import {useNotificationStore} from "../../lib/notificationStore.js";
import MessageInput from "../../components/message/MessageInput.jsx";
import MessageProfile from "../../components/message/MessageProfile.jsx";

function NewChatPage() {

    const data = useLoaderData();
    const [chat, setChat] = useState({});
    const {currentUser} = useContext(AuthContext);
    const {socket} = useContext(SocketContext);
    const decrease = useNotificationStore((state) => state.decrease);
    const [searchParams, setSearchParams] = useSearchParams();
    const [profile, setProfile] = useState({});
    const receiverId = searchParams.get('receiver');
    const navigate = useNavigate();

    if (receiverId === currentUser.id) {
        navigate("/login");
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");
        let chatRes= {};
        let res = null;
        if (!text) return;

        try {
            if (Object.keys(chat).length === 0) {
                chatRes = await apiRequest.post("/chats", {
                    userId: currentUser.userId,
                    receiverId: receiverId
                });
                res = await apiRequest.post("/messages/" + chatRes.data.id, { text });
                setChat((prev) => ({...prev, id: chatRes.data.id, messages: [res.data]}));

            }else {
                res = await apiRequest.post("/messages/" + chat.id, { text });
                setChat((prev) => ({...prev, messages: [...prev.messages, res.data]}));
            }

            e.target.reset();
            socket.emit("sendMessage", {
                receiverId: chat.receiver.id,
                data: res.data,
            });

        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {

        data.chatByUserIdResponse.then((chat) => {
            if (chat.data) { // 전 대화내용 있으면
                if (!chat.data.seenBy.includes(currentUser.id)) {
                    decrease();
                }
                setChat({...chat.data});
            }
        })

        setProfile({});

    }, []);

    useEffect(() => {

        const read = async () => {
            try {
                await apiRequest.put("/chats/read/" + chat.id);
            } catch (err) {
                console.log(err);
            }
        };

        if (chat && socket) {
            socket.on("getMessage", (data) => {
                if (chat.id === data.chatId) {
                    setChat((prev) => ({...prev, messages: [...prev.messages, data]}));
                    read();
                }
            });
        }
        return () => {
            socket.off("getMessage");
        };
    }, [socket, chat]);


    return (
        <div className="profilePage">
            <div className="chatContainer">
                <div className="wrapper">
                    {/*<MessageProfile profile={profile}/>*/}
                    <Suspense fallback={<p>Loading...</p>}>
                        <Await
                            resolve={data.userDataResponse}
                            errorElement={<p>Error loading chats!</p>}
                        >
                            {(userResponse) => <MessageProfile profile={userResponse.data}/>}
                        </Await>
                    </Suspense>
                </div>
            </div>

            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <MeesageContent chat={chat} currentUser={currentUser}/>
                    </div>
                    <MessageInput handleSubmit={handleSubmit}/>

                </div>
            </div>

        </div>
    );
}

export default NewChatPage;