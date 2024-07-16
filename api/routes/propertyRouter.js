import express from "express";
import { addProperty } from "../controllers/propertyController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post('/add-property', verifyToken, addProperty);

export default router; 