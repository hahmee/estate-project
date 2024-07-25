import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chatList, setChatList] = useState(chats || []);
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const closeChat = async () => {
    setChat(null);
    const res = await apiRequest.get("/chats");
    setChatList(res.data);
  }

  //여기 문제
  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest.get("/chats/" + id);
      if (res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });


    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      console.log('res', res.data);
      console.log('chat', chat.receiver);
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //채팅 내역 클릭할시 여기 문제
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
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);


  return (
      <div className="chat">
        <div className="messages">
          {
            chatList.length > 0 ?
                chatList?.map((c) => (
                    <div
                        className="message"
                        key={c.id}
                        style={{
                          backgroundColor:
                              c.seenBy.includes(currentUser.id) || chat?.id === c.id
                                  ? "rgba(0, 0, 0, 0.04)"
                                  : "green",
                        }}
                        onClick={() => handleOpenChat(c.id, c.receiver)}
                    >
                      <img src={c.receiver.avatar || "/noavatar.jpg"} alt="avatar"/>
                      <span>{c.receiver.username}</span>
                      <p>{c.lastMessage}</p>
                    </div>
                )) : <div>채팅 내역이 없습니다.</div>

          }
        </div>
        {chat && (
            <div className="chatBox">
              <div className="top">
                <div className="user">
                  <img src={chat.receiver.avatar || "noavatar.jpg"} alt="avatar"/>
                  {chat.receiver.username}
                </div>
                <span className="close" onClick={closeChat}>X</span>
              </div>
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
              <form onSubmit={handleSubmit} className="bottom">
                <textarea name="text"></textarea>
                <button>보내기</button>
              </form>
            </div>
        )}

      </div>
  );
}

export default Chat;