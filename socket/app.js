import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];
console.log('onlineUser', onlineUser);

const addUser = (userId, socketId) => {
  console.log('addUser', userId);
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
  console.log('onlineUser',onlineUser)
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log('getUser', userId);
  console.log('onlineUser', onlineUser);
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    console.log('newUser',userId)
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({receiverId, data}) => {
    console.log('receiverId', receiverId);
    console.log('data', data);
    const receiver = getUser(receiverId);
    console.log('receiver', receiver);

    if(receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");
