import express from "express";
import { updateUser, deleteUser, getUserProperties, getUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Update user details
router.post('/update/:id', verifyToken, updateUser);

// Delete user
router.delete('/delete/:id', verifyToken, deleteUser);

// Get user properties
router.get('/properties/:id', verifyToken, getUserProperties);

// 
router.get('/:id', verifyToken, getUser);

export default router;