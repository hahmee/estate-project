// initSavedPostData.js
import prisma from "./prisma.js";
import 'dotenv/config';

async function seedSavedPostData() {
    try {
        // 기존 SavedPost 데이터 삭제
        await prisma.savedPost.deleteMany({});
        console.log("기존 SavedPost 데이터 삭제 완료.");

        // 모든 유저와 포스트 데이터 조회
        const users = await prisma.user.findMany({ select: { id: true } });
        const posts = await prisma.post.findMany({ select: { id: true } });

        if (!users.length || !posts.length) {
            throw new Error("유저 혹은 포스트 데이터가 없습니다. 먼저 seedUserData와 seedPostData를 실행하세요.");
        }

        const savedPostsData = [];

        // 각 유저별로 랜덤한 40개의 포스트를 저장
        for (const user of users) {
            // posts 배열을 복사한 후 섞어서 앞에서 40개 선택
            const shuffledPosts = posts.slice().sort(() => Math.random() - 0.5);
            const selectedPosts = shuffledPosts.slice(0, 40);
            for (const post of selectedPosts) {
                savedPostsData.push({
                    userId: user.id,
                    postId: post.id,
                    createdAt: new Date(),  // 현재 시간 사용 (스키마의 기본값과 동일)
                });
            }
        }

        // 생성한 데이터를 한 번에 삽입
        await prisma.savedPost.createMany({
            data: savedPostsData,
        });

        console.log("모든 SavedPost 데이터 삽입 완료.");
    } catch (error) {
        console.error("SavedPost 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSavedPostData();
