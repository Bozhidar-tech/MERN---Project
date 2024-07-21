import express from "express";
import { register, login, googleLogin, logout, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Google login
router.post("/google", googleLogin);

// Logout
router.get("/logout", logout);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

export default router;