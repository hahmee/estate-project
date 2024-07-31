import express from "express";
import {
    addChat,
    getChat,
    getChatByUserId,
    getChats,
    getCheckByUser,
    readChat,
} from "../controllers/chat.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/userId/:userId", verifyToken, getChatByUserId);
router.get("/checkUserId/:userId", verifyToken, getCheckByUser);

router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
