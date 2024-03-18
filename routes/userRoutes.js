import express from "express";
import { userEmail } from "../controllers/userControllers.js";
const router = express.Router();

//Get user email
router.get("/userEmail", userEmail);

export default router;