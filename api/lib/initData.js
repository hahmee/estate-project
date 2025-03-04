// initUserData.js
import prisma from "./prisma.js";
import 'dotenv/config';
import bcrypt from "bcrypt";

async function seedUserData() {
    try {
        // 기존 User 데이터 모두 삭제
        // await prisma.user.deleteMany({});

        const users = [];
        // 기본 생성일: (밀리초 단위)
        const baseTime = new Date("2024-07-25T02:03:39.452Z").getTime();
        // 모든 사용자에 동일한 bcrypt 해시 사용
        const password = "123";
        const hashedPassword = password && await bcrypt.hash(password, 10);

        for (let i = 1; i <= 10; i++) {
            // 생성일은 기본 날짜에 i시간씩 추가한 값 (변경은 자유롭게)
            const createdAt = new Date(baseTime + i * 3600000);

            users.push({
                createdAt,
                email: `user${i}@test.com`,
                externalType: "native",  // 외부 로그인 없이 native 타입만 사용
                password: hashedPassword,
                username: `user${i}`,
            });
        }

        await prisma.user.createMany({
            data: users,
        });

        console.log("10개의 User 데이터 삽입 완료.");

    } catch (error) {
        console.error("User 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedUserData();
