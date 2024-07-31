import prisma from "../lib/prisma.js";


export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};
//
// export const getChatByUserId = async (req, res) => {
//   const tokenUserId = req.userId; //현재 접속자 아이디
//
//   try {
//
//     const chat = await prisma.chat.findUnique({
//       where: {
//         getByUserId:{
//           user1Id: tokenUserId,
//           user2Id: req.query.receiver
//         }
//       },
//       include: {
//         messages: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });
//
//     if(chat) {
//       const receiver = await prisma.user.findUnique({
//         where: {
//           id: req.query.receiver,
//         },
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       });
//       chat.receiver = receiver;
//
//
//       await prisma.chat.update({
//         where: {
//           getByUserId: {
//             user1Id: tokenUserId,
//             user2Id: req.query.receiver
//           }
//         },
//         data: {
//           seenBy: {
//             push: [tokenUserId],
//           },
//         },
//       });
//     }
//
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };


export const getChatByUserId = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  console.log('tokenUserId', tokenUserId);
  console.log('req.params.id', req.params.userId); // 받는사람 ID
  const userIDs = [tokenUserId, req.params.userId].sort();

  try {
    // await prisma.chat.update({
    //   where: {
    //     userIDs: userIDs,
    //   },
    //   data: {
    //     seenBy: {
    //       push: [tokenUserId],
    //     },
    //   },
    // });

    const chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: userIDs, //Every value exists in the list.
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json(chat);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


//Chat 모델에 내역이 있는지 확인
export const getCheckByUser = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  const userIDs = [tokenUserId, req.params.userId].sort();

  try {

    const chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: userIDs, //Every value exists in the list.
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json(chat);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

//chat ID로 조회한다.
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    //여기 이상  Cannot set headers after they are sent to the client 에러 ->
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


  export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const userIDs = [tokenUserId, req.body.receiverId].sort();
    console.log('tokenUserId', tokenUserId);
    console.log('userIDs', userIDs);

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: userIDs,
      },
    });

    const receiverId = req.body.receiverId;

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    newChat.receiver = receiver;

    console.log('newChat', newChat);

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
