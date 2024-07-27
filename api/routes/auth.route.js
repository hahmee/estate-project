import express from "express";
import {
    googleLoginAccessToken,
    login,
    logout,
    naverLoginAccessToken,
    register
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/googleLoginAccessToken",  googleLoginAccessToken);
router.get("/naverLoginAccessToken",  naverLoginAccessToken);

export default router;
