import express from "express";
import { updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Update user details
router.post('/update/:id', verifyToken, updateUser);

export default router;