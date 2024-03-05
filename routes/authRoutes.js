import express  from "express";
import { addFavorite, login, register } from "../controllers/authControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken);
router.post("/register", register);
router.post("/login", login);
router.put("/liked", addFavorite);

export default router;