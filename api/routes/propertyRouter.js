import express from "express";
import { addProperty, deleteProperty, editProperty, getProperty, getProperties } from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Add new property
router.post('/add', verifyToken, addProperty);

// Delete property by ID
router.delete('/delete/:id', verifyToken, deleteProperty);

// Edit property by ID
router.post('/edit/:id', verifyToken, editProperty);

// Get a property by ID
router.get('/get/:id', getProperty);

// Seatch 
router.get('/get', getProperties);

export default router; 