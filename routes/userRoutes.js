import express from "express";
import { userData } from "../controllers/userControllers.js";
const router = express.Router();

//Get user email
router.get("/userData", userData);

export default router;
