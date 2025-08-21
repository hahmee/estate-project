import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import "./messagePage.scss";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import ChatItem from "../../components/message/ChatItem.jsx";
import apiRequest from "../../lib/apiRequest.js";
import { SocketContext } from "../../context/SocketContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Profile from "../../components/profile/Profile.jsx";
import MessageList from "../../components/messageList/MessageList.jsx";
import MessageInput from "../../components/message/MessageInput.jsx";
import { useNotificationStore } from "../../lib/notificationStore.js";

function MessagePage() {
    const data = useLoaderData();
    const { userId } = useParams(); // 문자열
    const navigate = useNavigate();

    const { socket } = useContext(SocketContext);
    const { currentUser } = useContext(AuthContext);
    const decrease = useNotificationStore((state) => state.decrease);

    const [chatList, setChatList] = useState([]);                 // 좌측 리스트
    const [currentChat, setCurrentChat] = useState(null);         // 선택된 채팅방
    const [messages, setMessages] = useState({});                 // { 'YYYY-MM-DD': Message[] }
    const [isUserOnline, setIsUserOnline] = useState(false);
    const [message, setMessage] = useState('');

    // 날짜 키 생성(UTC)
    const dateKeyFrom = (d) => new Date(d).toISOString().slice(0, 10);

    // 메시지 상태에 안전하게 푸시
    const pushDataToMessages = useCallback((newMessage) => {
        const key = dateKeyFrom(newMessage.createdAt);
        setMessages(prev => {
            const base = { ...(prev ?? {}) };
            base[key] = base[key] ? [...base[key], newMessage] : [newMessage];
            return base;
        });
    }, []);

    // 채팅 클릭
    const clickChat = useCallback((chat) => {
        setCurrentChat(chat);
        navigate('/messages/' + chat.receiver.id);
    }, [navigate]);

    // 서버 데이터 로드시 초기화
    useEffect(() => {
        const initializeChat = () => {
            const { resChatListResponse, resChatResponse } = data || {};
            const existedChatList = [...(resChatListResponse?.data ?? [])];

            setChatList(existedChatList);
            setMessages(resChatResponse?.data ?? {}); // 객체로 통일

            if (!userId) {
                setCurrentChat(null);
            } else {
                const found = existedChatList.find(chat => String(chat.receiver.id) === String(userId));
                setCurrentChat(found ?? null);
            }
        };

        initializeChat();
        setMessage("");
    }, [data, userId]);

    // 현재 채팅방 바뀌면 알림 카운트 감소
    useEffect(() => {
        if (currentChat) decrease(currentChat.id);
    }, [currentChat, decrease]);

    // 채팅 리스트가 비어있으면 서버에서 가져오기 (UI 반영)
    const ensureChatListLoaded = useCallback(async () => {
        if (!chatList || chatList.length < 1) {
            try {
                const res = await apiRequest.get("/chats");
                setChatList(res.data ?? []);
            } catch (error) {
                console.error("채팅리스트를 가져오는데 실패했습니다.", error);
                toast.error(error?.message || "채팅리스트를 가져오는데 실패했습니다.");
            }
        }
    }, [chatList]);

    // 리스트 정렬 + lastMessage + (필요시) unread 증가
    // 증가 여부는 호출자가 명시적으로 넘김
    const reorderChatList = useCallback(
      (targetId, lastMessage, opts = { incUnread: true }) => {
          setChatList(prev => {
              const list = [...(prev ?? [])];
              const idx = list.findIndex(c => String(c.id) === String(targetId));
              if (idx === -1) return prev;

              const t = list[idx];
              const updated = {
                  ...t,
                  lastMessage,
                  unreadMessagesCount: opts.incUnread
                    ? (t.unreadMessagesCount ?? 0) + 1
                    : (t.unreadMessagesCount ?? 0),
              };

              list.splice(idx, 1);
              list.unshift(updated);
              return list;
          });
      },
      []
    );

    // 메시지 전송
    const handleSubmit = useCallback(async (value) => {
        const text = value?.trim();
        if (!text || !currentChat) return;

        try {
            const res = await apiRequest.post("/messages/" + currentChat.id, { text });

            // 오늘 처음이면 날짜키 자동 생성되어 들어감
            pushDataToMessages(res.data.message);

            // 내가 보낸 메시지는 unread 증가 금지
            reorderChatList(res.data.chat.id, text, { incUnread: false });

            // 소켓 전파
            socket?.emit("sendMessage", {
                receiverId: currentChat.receiver.id,
                data: res.data.message,
            });
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "메시지 보내기 실패했습니다.");
        }
    }, [currentChat, pushDataToMessages, reorderChatList, socket]);

    // 최신 현재방 id를 ref로 (리스너는 재등록하지 않음)
    const currentChatIdRef = useRef(null);

    useEffect(() => {
        currentChatIdRef.current = currentChat?.id ?? null;
    }, [currentChat?.id]);

    // (옵션) 중복 메시지 id 방지 가드
    // 이미 처리한 메시지의 ID들을 모아두는 집합(Set)
    const processedMsgIdsRef = useRef(new Set());

    // 메시지 수신 리스너: 한 번만 등록 + 최신 방은 ref로 판단
    useEffect(() => {
        if (!socket) return;

        const handleSocketGetMessage = async (m) => {
            console.log('handleSocketGetMessage',m)
            console.log('processedMsgIdsRef.current',processedMsgIdsRef.current)

            // 중복 이벤트 가드
            if (m.id && processedMsgIdsRef.current.has(m.id)) return;
            if (m.id) processedMsgIdsRef.current.add(m.id); // 메시지의 id 넣기

            // 현재 내가 열어둔 채팅방으로 온 메시지인지 판단
            const isCurrent = String(currentChatIdRef.current) === String(m.chatId);
            //해당 메시지 내가 보냈는지 판단
            const isSelf = m.senderId && String(m.senderId) === String(currentUser?.id);

            // 수신 기준으로 증가 여부 명시(현재방/내가 보낸 건 증가 X)
            reorderChatList(m.chatId, m.text, { incUnread: !isCurrent && !isSelf });

            //현재 방이면 메시지 바로 붙이고 읽음 처리
            if (isCurrent) {
                pushDataToMessages(m);
                try {
                    await apiRequest.put(`/chats/readChatUser/${currentChatIdRef.current}`);
                } catch (err) {
                    console.log(err);
                    toast.error(err?.message || "읽음 처리하기 실패");
                }
            }
        };

        // 혹시 남아 있던 리스너 제거 후 단일 등록
        socket.off("getMessage");
        socket.on("getMessage", handleSocketGetMessage);

        return () => {
            socket.off("getMessage", handleSocketGetMessage);
        };
    }, [socket, currentUser?.id, reorderChatList, pushDataToMessages]);

    // 개별 상대 온라인 여부 조회(현재 path의 userId 기준)
    useEffect(() => {
        if (!socket) return;
        if (!userId) return;
        socket.emit("checkUserOnline", { userId }, (isOnline) => {
            setIsUserOnline(!!isOnline);
        });
    }, [socket, userId]);

    // 좌측 리스트 유저들 온라인 동기화 (여긴 chatList 의존 OK)
    useEffect(() => {
        if (!socket) return;
        if (!chatList?.length) return;

        const users = chatList.map(c => ({ ...c.receiver, chatId: c.id }));
        socket.emit("checkUserListOnline", { users }, (updatedUsers) => {
            const map = new Map(updatedUsers.map(u => [u.chatId, u]));
            setChatList(prev => (prev ?? []).map(chat => {
                const u = map.get(chat.id);
                return u ? { ...chat, receiver: { ...chat.receiver, ...u } } : chat;
            }));
        });
    }, [socket, chatList]);

    // 상대 로그인/로그아웃 개별 푸시 수신
    useEffect(() => {
        if (!socket) return;

        const handleReceiverStatus = async (payload) => {
            await ensureChatListLoaded();
            setChatList(prev => {
                if (!prev?.length) return prev ?? [];
                let changed = false;
                const next = prev.map(chat => {
                    if (String(chat.receiver.id) === String(payload.userId)) {
                        const nextChat = { ...chat, receiver: { ...chat.receiver, isOnline: payload.online } };
                        if (chat.receiver.isOnline !== nextChat.receiver.isOnline) changed = true;
                        return nextChat;
                    }
                    return chat;
                });
                return changed ? next : prev;
            });
        };

        socket.off("getReceiverStatus");
        socket.on("getReceiverStatus", handleReceiverStatus);

        return () => {
            socket.off("getReceiverStatus", handleReceiverStatus);
        };
    }, [socket, ensureChatListLoaded]);

    return (
      <div className={`chat ${!userId ? "borderNone" : ""}`}>
          <div className={`chat__sidebar ${!userId ? "chat__sidebar--full" : ""}`}>
              <div
                className={`chat__sidebar-user ${!userId ? "chat__sidebar-user--none" : ""}`}
                onClick={() => navigate("/messages")}
              >
                  {currentUser.username}
              </div>

              <div className="chat__sidebar-menu">
                  {(!chatList || chatList.length < 1)
                    ? <div className="chat__sidebar-menu--noChatting">채팅 리스트가 없습니다.</div>
                    : chatList.map((c) => (
                      <ChatItem
                        key={c.id}     // 고유키 사용
                        chat={c}
                        clickChat={clickChat}
                      />
                    ))
                  }
              </div>
          </div>

          <div className={`chat__main ${!userId ? "chat__main--none" : ""}`}>
              {userId && (
                <div className="chat__header">
                    {currentChat && (
                      <Profile receiver={currentChat.receiver} isOnline={isUserOnline} onlineStatus={true} />
                    )}
                </div>
              )}

              {currentChat ? (
                <div className="chat__wrapper">
                    <MessageList messages={messages} currentUser={currentUser} currentChat={currentChat} />
                </div>
              ) : (
                <div className="chat__noWrapper">
            <span className={`chat__no-conversation ${!userId ? "chat__no-conversation--none" : ""}`}>
              채팅을 시작하기 위해서 대화상자를 열어주세요.
            </span>
                </div>
              )}

              {currentChat && (
                <MessageInput handleSubmit={handleSubmit} message={message} setMessage={setMessage} />
              )}
          </div>
      </div>
    );
}

export default MessagePage;
