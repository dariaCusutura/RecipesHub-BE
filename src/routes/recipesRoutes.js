import express from "express";
const router = express.Router();
import {
  allRecipes,
  favoriteRecipes,
  favoritesArray,
  newRecipe,
  deleteRecipe,
  editRecipe,
  addFavorite,
  searchRecipe,
} from "../controllers/recipesControllers.js";
import { authorisateToken } from "../middleware/authMiddleware.js";

// Get all recipes
router.get("/", authorisateToken, allRecipes);
//Get favorite recipes
router.get("/favorites/list", favoriteRecipes);
//Get favorites array
router.get("/favorites/array", favoritesArray);
// Post a new recipe
router.post("/", authorisateToken, newRecipe);
//Delete recipe
router.delete("/:id", authorisateToken, deleteRecipe);
//Edit recipe
router.put("/:id", authorisateToken, editRecipe);
//Like or dislike recipe
router.put("/liked/:id", addFavorite);
//Search recipe
router.get("/search", searchRecipe);

export default router;
