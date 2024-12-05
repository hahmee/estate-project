import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  console.log('addUser', userId);
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

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({receiverId, data}) => {
    const receiver = getUser(receiverId);

    if(receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // 특정 userId가 온라인인지 확인하는 요청 처리
  socket.on("checkUserOnline", ({userId}, callback) => {
    console.log('checkUserOnline')
    if(!userId) {
      callback(false); // 안전하게 `false` 반환
      return;
    }
    console.log('userId', userId);

    const onlineUserId = getUser(userId);

    if(onlineUserId) {
      callback(true);
    }else{
      callback(false);

    }
    //
    // console.log('onlineUserId', onlineUserId);
    // console.log(`Checking online status for user: ${userId} - ${onlineUserId}`);
    // callback(onlineUserId); // 클라이언트로 결과 반환
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

});

io.listen("4000");
