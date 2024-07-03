import express from "express";
import {googleLoginAccessToken, login, logout, register} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/googleLoginAccessToken",  googleLoginAccessToken);

export default router;
