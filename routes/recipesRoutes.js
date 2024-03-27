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
} from "../controllers/recipesControllers.js";

// Get all recipes
router.get("/", allRecipes);
//Get favorite recipes
router.get("/favorites/list", favoriteRecipes);
//Get favorites array
router.get("/favorites/array", favoritesArray);
// Post a new recipe
router.post("/", newRecipe);
//Delete recipe
router.delete("/:id", deleteRecipe);
//Edit recipe
router.put("/:id", editRecipe);
//Like or dislike recipe
router.put("/liked/:id", addFavorite);

export default router;
