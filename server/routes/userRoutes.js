import express from "express";

import { getUserProfile, loginUser } from "../controllers/userControllers.js";
import { protectMiddleware, registerUserMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.route('/signup')
    .post(registerUserMiddleware, loginUser)

router.route('/login')
    .post(loginUser)

router.route('/profile')
    .get(protectMiddleware, getUserProfile)

export default router