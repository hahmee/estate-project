import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

function getRadians(degree) {
  const radians = (parseFloat(degree) * Math.PI) / 180;
  return radians;
}

export const getPosts = async (req, res) => {
  const query = req.query;

  try {

    // 반경 3 km 까지 검색 (위도 경도 반경 계산)
    // const xprisma = prisma.$extends({
    //   result: {
    //     post: {
    //       distance: {
    //         // the dependencies
    //         needs: {latitude: true, longitude: true},
    //         compute(post) {
    //           // the computation logic
    //           return (6371 * Math.acos(Math.cos(getRadians(query.latitude)) * Math.cos(getRadians(post.latitude)) * Math.cos(getRadians(post.longitude) - getRadians(query.longitude)) + Math.sin(getRadians(query.latitude)) * Math.sin(getRadians(post.latitude))));
    //         },
    //       },
    //       isSaved: {
    //         compute() {
    //           return false;
    //         }
    //       },
    //     },
    //   },
    //   query: {
    //     post: {
    //       async findMany({model, operation, args, query}) {
    //         // take incoming `where` and set `age`
    //         args.where = {...args.where, price: {gt: 10}}
    //
    //         return query(args)
    //       },
    //     },
    //   },
    // });
    // const posts = await xprisma.post.findMany({});


    const posts = await prisma.post.aggregateRaw({
      pipeline: [
        {
          $geoNear: {
            near: {type: "Point", coordinates: [parseFloat(query.longitude), parseFloat(query.latitude)]},
            distanceField: "dist.calculated",
            maxDistance: 6000, //6km이내
            query: {},
            spherical: true
          },
        }
      ],
    });

    console.log('posts_ori', posts);



    const savedPosts = await prisma.user.findUnique({
      where: {
        id: req.userId
      },
      include: {
        savedPosts: true,
      }
    });

    const savedPostIds = savedPosts.savedPosts.map((save) => {
      return save.postId;
    });


    posts.forEach((post) => {
      post.isSaved = false;
      savedPostIds.forEach((savedId) => {
        if(post.id === savedId) {
          post.isSaved = true;
        }
      })
    })

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "포스트를 가져오는데 실패했습니다." });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        savedPosts:true,
      },
    });

    const token = req.cookies?.token;

    const savedCount = post.savedPosts.length;

    if (token) {

      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {

          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({ ...post, isSaved: saved ? true : false, savedCount });
        }
      });
    }else {
      return res.status(200).json({ ...post, isSaved: false, savedCount });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "포스트를 가져오는데 실패했습니다." });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "포스트를 저장하는데 실패했습니다." });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;

  try {

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...body.postData,
        postDetail: {
          update: body.postDetail,
        },
      },
    });

    setTimeout(() => {
      res.status(200).json(updatedPost.id);
    }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "포스트 수정하는데 실패했습니다." });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "권한이 없습니다." });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "포스트가 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "포스트를 삭제하는데 실패했습니다." });
  }
};