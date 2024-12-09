import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import "./messagePage.scss";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import ChatItem from "../../components/message/ChatItem.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import Profile from "../../components/profile/Profile.jsx";
import MessageList from "../../components/messageList/MessageList.jsx";
import MessageInput from "../../components/message/MessageInput.jsx";
import {useNotificationStore} from "../../lib/notificationStore.js";

function MessagePage() {
    const data = useLoaderData();
    const {userId} = useParams(); //작성자 아이디
    const navigate = useNavigate();
    const chatListRef = useRef([]);
    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(); // 현재 누른
    const [messages, setMessages] = useState();
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(AuthContext);
    const [isUserOnline, setIsUserOnline] = useState(false);
    const decrease = useNotificationStore((state) => state.decrease);
    const increase = useNotificationStore((state) => state.increase);

    // 원하는 채팅창을 클릭한다.
    const clickChat = useCallback(async (currentChat) => {
        setCurrentChat(currentChat);
        //path variable 변경
        navigate('/messages/' + currentChat.receiver.id);

    }, [currentChat]);


    //messages를 상태변경해준다. (오늘 처음보낸거라면 날짜도 추가)
    const pushDataToMessages = useCallback((newMessage) => {
        // setMessages((prev) => [...prev, data]);

        // createdAt을 Date 객체로 변환 (이미 Date 객체라면 문제 X )
        const messageDate = new Date(newMessage.createdAt);

        // 새로운 메시지의 날짜 키 (YYYY-MM-DD)
        const dateKey = messageDate.toISOString().split("T")[0];

        // 메시지가 저장될 상태 객체 (messages)
        setMessages(prev => {
            // 이전 상태를 복사해서 새로운 객체로 반환
            const updatedMessages = {...prev};

            // 해당 날짜에 키가 존재하는지 확인
            if (updatedMessages[dateKey]) {
                // 날짜별로 이미 메시지가 있으면 배열에 새로운 메시지를 추가
                updatedMessages[dateKey] = [...updatedMessages[dateKey], newMessage];
            } else {
                // 날짜별로 메시지가 없으면 새 배열을 생성해서 추가
                updatedMessages[dateKey] = [newMessage];
            }
            // 업데이트된 상태 반환
            return updatedMessages;
        });
    },[messages]);


    const handleSubmit = async (message) => {
        const text = message;

        if (!text) return;

        try {
            const res = await apiRequest.post("/messages/" + currentChat.id, {text});

            //오늘 처음 보낸 메시지라면 날짜도 추가 필요
            pushDataToMessages(res.data.message);

            const updatedChat = res.data.chat;

            const emitData = res.data.message;

            //res의 chat의 Id가 가장 상단에 있어야 함
            reorderChatList(updatedChat.id, text);

            //방출한다.
            socket.emit("sendMessage", {
                receiverId: currentChat.receiver.id,
                data: emitData,
            });

        } catch (err) {
            console.log(err);
            toast.error((err).message);
        }
    };

    useEffect(() => {
        chatListRef.current = chatList; // 상태가 변경될 때 ref 업데이트
    }, [chatList]);

    useEffect(() => {
        const initializeChat = () => {
            const {resChatListResponse, resChatResponse} = data;
            const existedChatList = [...resChatListResponse.data];
            setMessages(resChatResponse?.data || undefined);
            chatListRef.current = resChatListResponse.data;

            if (!userId) {
                setCurrentChat(null);
            } else {
                setCurrentChat(existedChatList.find(chat => chat.receiver.id === userId)); //받는사람이 게시글쓴사람과 같은게 현재
            }

        };

        currentChat && decrease(currentChat?.id);

        initializeChat();

    }, [data, userId]);

    //targetId를 찾아서 해당하는 대화창을 1번째로 정렬 및 lastMessage 변경한다.
    const reorderChatList = (targetId, lastMessage) => {
        //chatList를 복사하여 새로운 배열을 생성한 후 정렬하면 React가 상태 변화를 감지가능

        const reorderedChatList = [...chatListRef.current].sort((a, b) => a.id === targetId ? -1 : b.id === targetId ? 1 : 0
        );

        reorderedChatList[0].lastMessage = lastMessage;

        //현재 사용자가 채팅방에 없다면 안읽음 +1
        if(!currentChat || (currentChat && currentChat?.id !== targetId)) {
            reorderedChatList[0].unreadMessagesCount += 1;
        }
        setChatList(reorderedChatList);
    };

    //비어있으면 서버에서 데이터 가져온다.
    const checkIfChatEmpty = async () => {
        if (chatList && chatList.length < 1) {
            // 빈칸이라면
            try {
                const res = await apiRequest.get("/chats");
                //receiver온라인 정보넣기
                setChatList(res.data);
                chatListRef.current = res.data;

            } catch (error) {
                console.error("Failed to fetch chats:", error);
                toast.error((error).message);
            }
        }
    };

    useEffect(() => {

        // 채팅목록에 있는 친구들 중에 한명이라도 로그인/로그아웃 행동 감지된다.
        const handleSocketGetReceiverStatus = async (data) => {
            await checkIfChatEmpty(); //반영이 바로 안된다 -> useRef 로 변경했더니 성공.

            console.log('handleSocketGetOnlinUsers', data); // 로그인하거나 로그아웃한 친구 정보가 온다.

            const chatListRefCurrent = [...chatListRef.current];

            // chatListRefCurrent 돌면서 receiver에서 찾고

            const newChatList = chatListRefCurrent.map((chat) => {
                if (chat.receiver.id === data.userId) {
                    return {...chat, receiver: {...chat.receiver, isOnline: data.online}};
                }else{
                    return {...chat, receiver: {...chat.receiver, isOnline: false}};
                }

            });



            setChatList(newChatList);


        }

        const handleSocketGetMessage = async (data) => {
            console.log('GetMessage', data);
            // chatlist 순서 첫번째로 변경 및 lastMessage 변경 및 안 읽은 메시지 카운트 변경
            reorderChatList(data.chatId, data.text);

            if (currentChat && currentChat?.id === data.chatId) {
                pushDataToMessages(data);
            }

            //받은 애가 현재 채팅방에 있다면 읽었다고 표시한다.
            if(currentChat && data.chatId === currentChat?.id ) {
                console.log('전 지금 현재 방에 있습니다');

                //읽었다고 db의 chatUser에 표시한다.
                try{
                    await apiRequest.put("/chats/readChatUser/" + currentChat?.id);
                } catch (err) {
                    console.log(err);
                    toast.error((err).message);
                }
            }


        };

        const checkIfChatListOnline = async () => {
            //문제 발생 --> 이 함수 실행 전에 setState로 chats 값을 넣어줬는데, 바로 반영이 안되는 문제
            // 해결 --> useRef 사용
            const chatListRefCurrent = chatListRef.current;

            //chat리스트들의 online상태 가져온다.
            if (chatListRefCurrent && chatListRefCurrent.length > 0) {
                const users = chatListRefCurrent.map((data) => {
                    return {
                        ...data.receiver,
                        chatId: data.id //추가했음
                    };
                });

                //왼쪽 유저리스트 온라인인지 확인한다.
                socket.emit("checkUserListOnline", {users}, (updatedUsers) => {
                    //이중포문 대신, updatedUsers를 Map으로 변환하여 검색을 빠르게
                    const updatedUsersMap = new Map(updatedUsers.map(user => [user.chatId, user]));

                    // chatList를 업데이트합
                    const updatedChatList = chatListRefCurrent.map(chat => {
                        const updatedUser = updatedUsersMap.get(chat.id); // chatId와 chat.id 매칭
                        if (updatedUser) {
                            return {
                                ...chat,
                                receiver: {
                                    ...chat.receiver,
                                    ...updatedUser, // updatedUser로 receiver 업데이트
                                },
                            };
                        }
                        return chat; // 매칭되는 updatedUser가 없으면 그대로 반환
                    });

                    // 하지만 의존성 배열에 chatList를 넣으면 무한루프돈다...
                    setChatList(updatedChatList); //현재 online상태인지까지 포함해서 chatList에 저장
                });
            }
        };

        //실행 시작 부분
        if (socket) {

            socket.on("getMessage", handleSocketGetMessage);
            socket.on("getReceiverStatus", handleSocketGetReceiverStatus);

            //현재 대화창의 유저가 온라인인지 표시한다.
            userId && socket.emit("checkUserOnline", {userId}, (isOnline) => {
                setIsUserOnline(isOnline);
            });

            //왼쪽 대화 리스트들의 유저들이 온라인 상태인지 표시한다.
           checkIfChatListOnline();

        }

        return () => {
            if (socket) {
                socket.off("getMessage", handleSocketGetMessage);
                socket.off("checkUserOnline");
                socket.off("checkUserListOnline"); // 왼쪽 chatList 의 유저들 온라인 상태인지 확인한다.
                socket.off("getReceiverStatus", handleSocketGetReceiverStatus); // 왼쪽 chatList 의 유저들 온라인 상태인지 확인한다.

            }
        };

    }, [socket, currentChat, userId, data]);

    return (
        <div className={`chat ${!userId ? "borderNone" : ""}`}>
            <div className={`chat__sidebar ${!userId ? "chat__sidebar--full" : ""}`}>

                <div className={`chat__sidebar-user ${!userId ? "chat__sidebar-user--none" : ""}`} onClick={()=>navigate("/messages")}>{currentUser.username}</div>
                <div className="chat__sidebar-menu">
                    {
                        chatList && chatList.length < 1 ?
                            <div>채팅 리스트가 없습니다.</div>
                            :
                            chatList.map((c, idx) => (
                                <ChatItem
                                    key={idx}
                                    chat={c}
                                    clickChat={clickChat}
                                />
                            ))
                    }
                </div>
            </div>

            <div className={`chat__main ${!userId ? "chat__main--none" : ""}`} >
                {
                    userId && <div className="chat__header">
                        {currentChat && (
                            <Profile receiver={currentChat.receiver} isOnline={isUserOnline}/>
                        )}
                    </div>
                }

                <div className="chat__wrapper">
                    {/*날짜별로 리스트*/}
                    {
                        currentChat ?
                            <MessageList messages={messages} currentUser={currentUser} currentChat={currentChat}/>
                            :
                            <span className={`chat__no-conversation ${!userId ? "chat__no-conversation--none" : ""}`}>채팅을 시작하기 위해서 대화상자를 열어주세요.</span>
                    }
                </div>

                {currentChat &&
                    <MessageInput handleSubmit={handleSubmit}/>
                    // <div className="chat__input">
                    //     <form onSubmit={handleSubmit} className="chat__form">
                    //                 <textarea
                    //                     name="text"
                    //                     className="chat__textarea"
                    //                     placeholder="메시지를 입력해주세요."
                    //                 ></textarea>
                    //         <Button>보내기</Button>
                    //     </form>
                    // </div>
                }
            </div>
        </div>

    );


}

export default MessagePage;