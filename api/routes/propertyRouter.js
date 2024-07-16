import express from "express";
import { addProperty, deleteProperty, editProperty } from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Add new property
router.post('/add', verifyToken, addProperty);

// Delete property by ID
router.delete('/delete/:id', verifyToken, deleteProperty);

// Edit property by ID
router.post('/edit/:id', verifyToken, editProperty);

export default router; 