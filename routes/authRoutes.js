import express from "express";
import { login, register } from "../controllers/authControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken);
router.post("/register", register);
router.post("/login", login);

export default router;
