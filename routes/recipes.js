import express from "express";
import Recipe from "../models/recipes.js";
import Joi from "joi";
const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  const result = await Recipe.find();
  res.send(result);
});
// Get recipes by category
router.get("/:category", async (req, res) => {
  const recipes = await Recipe.find({ category: req.params.category }).catch(
    () => {
      return res
        .status(404)
        .send("The recipe with the given category was not found");
    }
  );
  res.send(recipes);
});

//Get favourite recipes
// router.get("/?favourite", async (req, res) => {
//   const recipes = await Recipe.find({ favourite: true }).catch(() => {
//     return res.status(404).send("There are no favourite recipes");
//   });
//   recipes.length !== 0
//     ? res.send(recipes)
//     : res.status(404).send("There are no favourite recipes");
// });
// Post a new recipe
router.post("/", async (req, res) => {
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
