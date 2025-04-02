import express from "express";
import {
    getChatOrMakeChat,
    getChats,
    getChatUUID,
    getReceiverUnreadCount,
    readChatUser,
} from "../controllers/chat.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/getChatOrMakeChat/:userId", verifyToken, getChatOrMakeChat);
router.put("/readChatUser/:chatId", verifyToken, readChatUser);
router.get("/chatUUID/:userId", verifyToken, getChatUUID);
router.get("/getReceiverUnreadCount", verifyToken, getReceiverUnreadCount);


// router.get("/:id", verifyToken, getChat);
// router.put("/read/:id", verifyToken, readChat);

export default router;
