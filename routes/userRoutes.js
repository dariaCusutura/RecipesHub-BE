import express from "express";
import { allUsers, userData } from "../controllers/userControllers.js";
import { authorisateToken } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
const router = express.Router();

//Get all users
router.get("/users", admin, allUsers );
//Get user data
router.get("/userData", authorisateToken, userData);

export default router;
