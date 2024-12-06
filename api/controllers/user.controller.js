import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {``
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 가져오는데 실패했습니다." });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 가져오는데 실패했습니다." });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 수정하는데 실패했습니다." });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "사용자 정보가 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 삭제하는데 실패했습니다." });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "저장된 리스트에서 게시물이 삭제되었습니다." });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "게시물이 저장되었습니다." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "게시물을 저장하는데 실패했습니다." });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {

    //좋아요 누른 거
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    let savedIdList = [];

    const savedPosts = saved.map((item) =>
    {
      item.post.isSaved = true;
      savedIdList = [...savedIdList, item.postId];
      return item.post;
    });

    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });


    userPosts.forEach((post) => {
      post.isSaved = false;
      savedIdList.forEach((savedId) => {
        if(post.id === savedId) {
          post.isSaved = true;
        }
      })
    })

    res.status(200).json({ userPosts, savedPosts });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "프로필 정보를 가져오는데 실패했습니다." });
  }
};

//아직 읽히지 않은 채팅방의 개수
export const getUnreadChatNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // const number = await prisma.chat.count({
    //   where: {
    //     chatId: "chatId", // 채팅방 ID
    //     userIDs: {
    //       hasSome: [tokenUserId],
    //     },
    //     NOT: {
    //       seenBy: {
    //         hasSome: [tokenUserId],
    //       },
    //     },
    //   },
    // });
    //
    // console.log('number..임니다', number);
    return res.status(200).json(0);
  } catch (err) {
    res.status(500).json({ message: "프로필 정보를 가져오는데 실패했습니다." });
  }
};


export const getSavedPosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    return res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: "저장된 포스트를 가져오는데 실패했습니다." });
  }

}