import express from "express";
import {
  allUsers,
  deleteUser,
  updatePassword,
  userData,
} from "../controllers/userControllers.js";
import { authorisateToken } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
const router = express.Router();

//Get all users
router.get("/", admin, allUsers);
//Get user data
router.get("/userData", authorisateToken, userData);
//Delete user
router.delete("/:id", authorisateToken, deleteUser);
//update password
router.put("/updatePassword", authorisateToken, updatePassword);

export default router;
