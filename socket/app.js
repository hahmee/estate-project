import { Server } from "socket.io";

const io = new Server({
  cors: {
    // origin: "http://localhost:5173",
    // origin: "*", //전체 접속 가능
    origin: "http://3.38.208.101:5713", // 프론트엔드 주소
    credentials: true, // 인증 정보 포함
  },
});

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

  socket.on("newUser", (userId, receiverList) => { // (,chatFriends)
    addUser(userId, socket.id);

    //그 중에서, 로그인 되어있는 친구들만 추린다.
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

  socket.on("sendMessage", ({receiverId, data}) => {
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
    removeUser(socket.id);
  });

});

io.listen("4000");
