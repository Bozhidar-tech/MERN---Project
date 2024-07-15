import express from "express";
import { register, login, googleLogin, logout } from "../controllers/authController.js";

const router = express.Router();

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Google login
router.post("/google", googleLogin);

// Logout
router.get("/logout", logout);

export default router;