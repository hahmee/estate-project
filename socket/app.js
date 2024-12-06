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
    console.log('send', data);
    const receiver = getUser(receiverId);

    if(receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
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
    console.log('checkUserListOnline', users);

    // const updatedUsers = users.map((user) => {
    //   console.log('user.receiver.id', user.receiver.id);
    //   const onlineUserId = getUser(user.receiver.id); // 현재 온라인 여부 확인
    //
    //   console.log('onlineUserId', onlineUserId);
    //   return {...user, receiver: {...user.receiver, isOnline: !!onlineUserId}}; // onlineUserId가 존재하면 true, 없으면 false
    // });
    //
    // // 결과를 클라이언트로 반환
    // callback(updatedUsers);


    // 새로운 유저 리스트 생성 (isOnline 상태 추가)
    const updatedUsers = users.map((user) => {
      const onlineUserId = getUser(user.id); // 현재 온라인 여부 확인
      return { ...user, isOnline: !!onlineUserId }; // onlineUserId가 존재하면 true, 없으면 false
    });

    console.log("Updated Users List:", updatedUsers);

    // 결과를 클라이언트로 반환
    callback(updatedUsers);

  });


  socket.on("logout", () => {
    removeUser(socket.id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

});

io.listen("4000");
