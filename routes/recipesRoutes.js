import express from "express";
const router = express.Router();
import {
  allRecipes,
  favoriteRecipes,
  favoritesArray,
  newRecipe,
} from "../controllers/recipesControllers.js";

// Get all recipes
router.get("/", allRecipes);
//Get favorite recipes
router.get("/favorites/list", favoriteRecipes);
//Get favorites array
router.get("/favorites/array", favoritesArray);
// Post a new recipe
router.post("/", newRecipe);

export default router;
