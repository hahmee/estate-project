import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";

const prisma = new PrismaClient();

//Post 모델에 자동으로 location: 2dsphere 인덱스 설정함
async function init() {
    const uri = process.env.DATABASE_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db();
        const collection = database.collection("Post");

        await collection.createIndex({ location: "2dsphere" });
        console.log("2dsphere index ensured on startup.");
    } catch (error) {
        console.error("Error creating 2dsphere index:", error);
    } finally {
        await client.close();
    }
}

init();


export default prisma;
