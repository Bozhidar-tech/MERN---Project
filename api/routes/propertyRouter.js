import express from "express";
import { addProperty, deleteProperty } from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/add-property', verifyToken, addProperty);
router.delete('/delete-property/:id', verifyToken, deleteProperty);

export default router; 