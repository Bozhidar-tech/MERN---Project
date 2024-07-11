import express from "express";
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "This is the test route for the UserRouter" });
})

export default router;