import express from "express";
const router = express.Router();
import {
  allRecipes,
  byCategory,
  favoriteRecipes,
  newRecipe,
} from "../controllers/recipesControllers.js";

// Get all recipes
router.get("/", allRecipes);
// Get recipes by category
router.get("/:category", byCategory);
//Get favorite recipes
router.get("/favorites/list", favoriteRecipes);
// Post a new recipe
router.post("/", newRecipe);

export default router;
