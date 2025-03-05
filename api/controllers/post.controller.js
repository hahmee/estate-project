import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const roomType = ['apartment', 'condo', 'officetel', 'one_room', 'two_room', 'land'];
export const payType = ['month_pay', 'year_pay', 'sell'];
export const MAX_PRICE = 1000000000;
export const MIN_PRICE = 0;
export const MAX_SIZE = 60;
export const MIN_SIZE = 0;

function getRadians(degree) {
  const radians = (Number(degree) * Math.PI) / 180;
  return radians;
}

//좋아요 많이 받은 8개 가져오기
export const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await prisma.savedPost.groupBy({
      by: ['postId'], // 게시물 별로 그룹화
      _count: {
        postId: true, // postId별로 카운트
      },
      orderBy: {
        _count: {
          postId: 'desc', // 좋아요 수를 내림차순으로 정렬
        },
      },
      take: 8, // 상위 8개 게시물만 가져오기
    });

    // 가져온 게시물에 대한 상세 정보를 가져오기 (포스트 정보)
    const featuredPosts = await prisma.post.findMany({
      where: {
        id: {
          in: posts.map(post => post.postId), // 좋아요 수가 많은 상위 6개 게시물
        },
      },
      include: {
        savedPosts:true,
      },
    });

    return res.status(200).json(featuredPosts); // 결과 반환

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "포스트를 가져오는데 실패했습니다." });
  }
};

export const getPosts = async (req, res) => {
  const query = req.query;
  try {

    let queryType = [];
    let queryProperty = [];

    if (typeof query.type === 'string' || query.type instanceof String) { // 한개 선택했을 때 string으로 받음
      queryType = [query.type]; //리스트로 만들어주기
    } else {
      queryType = query.type;
    }
    if (typeof query.property === 'string' || query.property instanceof String) {
      queryProperty = [query.property];
    } else {
      queryProperty = query.property;
    }

    //minPrice 값 없을 때
    const minPriceQuery = (query.minPrice === null || query.minPrice === undefined || query.minPrice === "") ? {$gte: MIN_PRICE} : {$gte: Number(query.minPrice)};
    //maxPrice 값 없을 때
    const maxPriceQuery = (query.maxPrice === null || query.maxPrice === undefined || Number(query.maxPrice) >= MAX_PRICE || query.maxPrice === "") ? {} : {$lte: Number(query.maxPrice)};

    //minSize 값 없을 때
    const minSizeQuery = (query.minSize === null || query.minSize === undefined || query.minSize === "") ? {$gte: MIN_SIZE} : {$gte: Number(query.minSize)};
    //maxSize 값 없을 때 (60이상 값이 들어오면 사이즈 무한대로 보여줌)
    const maxSizeQuery = (query.maxSize === null || query.maxSize === undefined || Number(query.maxSize) >= MAX_SIZE || query.maxSize === "") ? {} : {$lte: Number(query.maxSize)};

    let searchTypeQuery = {};

    //ne_lat, ne_lng, sw_lat, sw_lng 바운더리 안에 있는 매물들 검색
    searchTypeQuery = {
      $match: {
        location: {
          $geoWithin: {
            $box: [
              [Number(query.sw_lng), Number(query.sw_lat)], // bottomLeft,
              [Number(query.ne_lng), Number(query.ne_lat)]  // upperRight
            ]
          },
        },
        price: {...minPriceQuery, ...maxPriceQuery},
        type: {$in: (query.type === undefined || query.type === null || query.type === "") ? payType : queryType},
        property: {$in: (query.property === undefined || query.property === null || query.property === "") ? roomType : queryProperty},
        size: {...minSizeQuery, ...maxSizeQuery},
      }
    };

    // 완벽하게 지역명 매칠될 때 사용
    // else { //autocomplete_click일 때 -> 이렇게하면 DB에 politicalList가 영어로 저장될 때문제임 (매치 정확히 안 됨)
    //   searchTypeQuery = {
    //     $match: {
    //       politicalList: {$in: [query.political]},
    //       price: {...minPriceQuery, ...maxPriceQuery},
    //       type: {$in: (query.type === undefined || query.type === null || query.type === "") ? payType : queryType},
    //       property: {$in: (query.property === undefined || query.property === null || query.property === "") ? roomType : queryProperty},
    //       size: {...minSizeQuery, ...maxSizeQuery},
    //     }
    //   };
    // }

    //mongodb Atlas에 create Index {location:2dsphere} 작업 필요
    const posts = await prisma.post.aggregateRaw({
      pipeline: [
        searchTypeQuery,
        {
          $lookup: {
            from: "SavedPost",
            localField: "_id",
            foreignField: "postId",
            as: "savedPostList"
          }
        },
        {
          $sort: {
            _id: 1,
          }
        }
      ],
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
        if (post._id.$oid === savedId) {
          post.isSaved = true;
        }
      })
    });

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
        location: { type: "Point", coordinates: [ Number(body.postData.longitude), Number(body.postData.latitude)]},
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
      where: {id: postId},
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({message: "권한이 없습니다."});
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

    //setTimeout(() => {
    res.status(200).json(updatedPost.id);
    //}, 3000);

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