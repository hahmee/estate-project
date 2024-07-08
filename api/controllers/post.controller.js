import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";


function arePointsNear(checkPoint, centerPoint, km) {
  var ky = 40000 / 360;

  var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
  var dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;
  var dy = Math.abs(centerPoint.latitude - checkPoint.latitude) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

function getRadians(degree) {
  const radians = (parseFloat(degree) * Math.PI) / 180;
  return radians;
}
// function cosineDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
//   const R = 6371e3;
//   const p1 = lat1 * Math.PI/180;
//   const p2 = lat2 * Math.PI/180;
//   const deltaP = p2 - p1;
//   const deltaLon = lon2 - lon1;
//   const deltaLambda = (deltaLon * Math.PI) / 180;
//   const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
//   const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
//   return d;
// }

export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    //반경 3 km 까지 검색 (위도 경도 반경 계산)
    const xprisma = prisma.$extends({
      result: {
        post: {
          distance: {
            // the dependencies
            needs: {latitude: true, longitude: true},
            compute(post) {
              // the computation logic
              return (6371 * Math.acos(Math.cos(getRadians(query.latitude)) * Math.cos(getRadians(post.latitude)) * Math.cos(getRadians(post.longitude) - getRadians(query.longitude)) + Math.sin(getRadians(query.latitude)) * Math.sin(getRadians(post.latitude))));
            },
          },
        },
      },
    });
    const post = await xprisma.post.findMany();
    console.log('xprisma.rectsddddrectrect', post);


    const posts = await prisma.post.findMany({
      where: {
        // distance: {
        //   lte: 3 //3km
        // },
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

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

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
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
      where: {id: postId},
      data: {
        ...body.postData,
        postDetail: {
          update: body.postDetail,
        },
      },
    });
    res.status(200).json(updatedPost.id);
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
