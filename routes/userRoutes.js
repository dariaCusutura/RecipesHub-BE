import express from "express";
import { userData } from "../controllers/userControllers.js";
import { authorisateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

//Get user email
router.get("/userData", authorisateToken, userData);

export default router;
