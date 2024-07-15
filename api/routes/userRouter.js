import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Update user details
router.post('/update/:id', verifyToken, updateUser);

// Delete user
router.delete('/delete/:id', verifyToken, deleteUser);


export default router;