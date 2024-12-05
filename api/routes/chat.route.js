import express from "express";
import {
    addChat,
    getChat,
    getChatByUserId, getChatUUID,
    getChats,
    getChatOrMakeChat,
    readChat,
} from "../controllers/chat.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/userId/:userId", verifyToken, getChatByUserId);
router.get("/getChatOrMakeChat/:userId", verifyToken, getChatOrMakeChat);
router.get("/chatUUID/:userId", verifyToken, getChatUUID);

router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
