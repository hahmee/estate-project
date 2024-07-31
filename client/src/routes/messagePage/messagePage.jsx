import React, {Suspense, useCallback, useContext, useEffect, useRef, useState} from 'react';
import "./messagePage.scss";
import {Await, useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Conversation from "../../components/message/Conversation.jsx";
import Message from "../../components/message/Message.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../UI/Button.jsx";
import {ca} from "timeago.js/lib/lang/index.js";
import {toast} from "react-toastify";

function MessagePage() {
    const data = useLoaderData();
    const {userId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null); // 현재 누른
    const [receiver, setReceiver] = useState(null);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(AuthContext);

    const clickConversation = useCallback(async (currentConversation) => {
        console.log('currentConversation', currentConversation);
        setCurrentConversation(currentConversation);
        //path variable 변경
        navigate('/messages/' + currentConversation.receiver.id);

        // const res = await apiRequest.get("/chats/" + currentConversation?.id);


    }, []);

    useEffect(() => {
        console.log('currentConversation');
        const getMessages = async () => {
            try {
                // const res = await apiRequest.get("/chats/" + currentConversation?.id);
                const res = await apiRequest.get("/chats/userId/" + userId);
                setMessages(res.data?.messages);
            } catch (err) {
                console.log(err);
            }
        };
        currentConversation && getMessages();
    }, [currentConversation]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (!text) return;

        try {


            if(!currentConversation.id) { //완전 처음
                console.log('채팅 내역 없음')

                //chat 추가
                const chatRes = await apiRequest.post("/chats", {
                    receiverId: currentConversation.receiver.id
                });
                const res = await apiRequest.post("/messages/" + chatRes.data.id, {text});
                setMessages([res.data]);
                console.log('chatRes.data입니다.',chatRes.data)
                setCurrentConversation(chatRes.data);

            } else { //채팅 내역 있음
                console.log('채팅 내역 있음')
                const res = await apiRequest.post("/messages/" + currentConversation.id, {text});
                setMessages([...messages, res.data]);
            }

            e.target.reset();
            //이거 해야함 (왜?)
            // socket.emit("sendMessage", {
            //     receiverId: chat.receiver.id,
            //     data: res.data,
            // });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {

        const requestData = async () => {
            try {



                //받는사람 정보
                const resUser = userId && await apiRequest.get("/users/search/" + userId);
                setReceiver(resUser?.data || null);

                //왼쪽 컨버세이션 리스트
                //원래 있던 대화상자들 ..
                const resChats = await apiRequest.get("/chats");


                //이 사람이랑 대화했던 내역이 있는지?
                const isChatExist = await apiRequest.get("/chats/checkUserId/" + resUser.data.id);

                //이 사람이랑 대화했던 내역 있음
                if (isChatExist.data) {
                    console.log('sdfd', resChats.data);
                    setConversations(resChats.data);
                    setCurrentConversation(resChats.data.find(chat => chat.receiver.id === userId));

                } else { //처음임
                    //대화상자 추가
                    console.log('sdfdddd');

                    setConversations([...resChats.data, {
                        receiver: {
                            id: resUser.data.id,
                            username: resUser.data.username,
                            avatar: resUser.data.avatar,
                        }
                    }]);

                    setCurrentConversation({
                        receiver: {
                            id: resUser.data.id,
                            username: resUser.data.username,
                            avatar: resUser.data.avatar,
                        }});
                }



            }catch(err) {

                toast.error(err.message);
                // console.log(err);
            }

        }

        requestData();


    }, []);


    return (
        <div className="messagePage">
            <div className="messenger">
                <div className="chatMenuWrapper">
                    {
                        conversations.map((c, idx) => {
                            return (<Conversation key={idx}
                                                  conversation={c}
                                                  clickConversation={clickConversation}
                            />);
                        })
                    }

                </div>
            </div>

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        currentConversation && (
                            <div className="chatBoxUpper">
                                <img src={currentConversation.receiver.avatar || "/noavatar.jpg"} alt="avatar"/>
                                <div>
                                    {currentConversation.receiver.username}
                                </div>
                            </div>
                        )
                    }

                    {
                        currentConversation ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((m) => (
                                        <div ref={scrollRef} key={m.id}>
                                            <Message message={m} own={m.userId === currentUser.id}
                                                     avatar={m.userId === currentUser.id ? currentUser.avatar : currentConversation.receiver.avatar}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <form onSubmit={handleSubmit} className="chatBoxForm">
                                            <textarea name="text" className="chatMessageInput"
                                                      placeholder="메시지를 입력해주세요."></textarea>
                                        <Button>보내기</Button>
                                    </form>
                                </div>
                            </>
                        ) : (<span className="noConversationText">채팅을 시작하기 위해서 대화상자를 열어주세요.</span>)}
                </div>
            </div>
        </div>
    );


}

export default MessagePage;