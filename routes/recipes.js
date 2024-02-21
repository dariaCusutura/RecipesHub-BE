import express from "express";
import Recipe from "../models/recipes.js";
import Joi from "joi";
const router = express.Router();

// Get all recipes
router.get("/recipes", async (req, res) => {
  const result = await Recipe.find();
  res.send(result);
});
// Get one recipe by id
router.get("/recipes/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with the given id was not found");
  res.send(recipe);
});
// Post a new recipe
router.post("/recipes", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.array().required(),
    category: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let recipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    category: req.body.category,
  });
  recipe = await recipe.save();
  res.send(recipe);
});

export default router;
