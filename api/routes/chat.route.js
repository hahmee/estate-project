import express from "express";
import {getChat, getChatOrMakeChat, getChats, getChatUUID,} from "../controllers/chat.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/getChatOrMakeChat/:userId", verifyToken, getChatOrMakeChat);
router.get("/chatUUID/:userId", verifyToken, getChatUUID);
router.get("/:id", verifyToken, getChat);

// router.put("/read/:id", verifyToken, readChat);

export default router;
