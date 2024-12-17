import express from "express";
import { createServer } from "http"; // HTTP 서버 생성
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app); // Express 서버를 기반으로 HTTP 서버 생성
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// __dirname 대체 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware 설정
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(join(__dirname, "../client/dist")));

// 라우터 설정
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// SPA 라우팅 처리
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../client/dist/index.html"));
});

// Socket.IO 설정
let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUsers.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

//userIds 중에 로그인 안 되어있으면 삭제 ( = 중복되는애들만 고른다)
const getOnlineUsers = (userIds) => {
  // 중복되는 항목만 필터링
  return onlineUsers.filter(user => userIds.includes(user.userId));

};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId, receiverList) => { // (,chatFriends)
    addUser(userId, socket.id);

    socket.on("sendMessage", ({receiverId, data}) => {
      const receiver = getUser(receiverId);

      if(receiver) {
        io.to(receiver.socketId).emit("getMessage", data);
      }
    });    //그 중에서, 로그인 되어있는 친구들만 추린다.

    const onlineReceivers = getOnlineUsers(receiverList);
    //나와 채팅방이 만들어진 사람들에게 나의 온라인 정보를 송출한다.
    if (onlineReceivers && onlineReceivers.length > 0) {
      // 포문 돌면서 emit하기
      onlineReceivers.forEach((receiver) => {
        console.log('receiver.socketId', receiver);
        io.to(receiver.socketId).emit("getReceiverStatus", {userId: userId, online: true}); //나의 온라인 정보를 친구들에게 송출한다.
      })
    }
  });

  // 특정 userId가 온라인인지 확인하는 요청 처리
  socket.on("checkUserOnline", ({userId}, callback) => {
    if(!userId) {
      callback(false); // 안전하게 `false` 반환
      return;
    }
    const isOnline = !!getUser(userId); // getUser(userId) 결과를 boolean으로 변환
    callback(isOnline); // 결과를 callback으로 반환
  });

  // 특정 userId가 온라인인지 확인하는 요청 처리
  socket.on("checkUserListOnline", ({users}, callback) => {

    // 새로운 유저 리스트 생성 (isOnline 상태 추가)
    const updatedUsers = users.map((user) => {
      const onlineUserId = getUser(user.id); // 현재 온라인 여부 확인
      return { ...user, isOnline: !!onlineUserId }; // onlineUserId가 존재하면 true, 없으면 false
    });


    // 결과를 클라이언트로 반환
    callback(updatedUsers);

  });

  socket.on("logout", () => {
    removeUser(socket.id);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    removeUser(socket.id);
  });
});

// 서버 실행
const PORT = 8800;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
