import Recipe from "../models/recipes.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { User } from "../models/users.js";
import Joi from "joi";

//Get all recipes
export const allRecipes = async (req, res) => {
  const recipes = await Recipe.find({ ...req.query }).catch((err) => {
    return res.status(500).json(err.message);
  });
  if (!recipes.length) return res.status(404).json("No recipe found");
  res.send(recipes);
};

//Get favorite recipes
export const favoriteRecipes = async (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decodedToken) => {
      if (error) return res.status(404).send(error.message);
      const user = await User.findById(decodedToken._id).catch((err) => {
        return res.send(err.message);
      });
      if (user.favorites.length === 0)
        return res.status(404).send("Your favorites list is empty.");

      const recipes = await Recipe.find({
        _id: user.favorites,
      });
      res.send(recipes);
    }
  );
};

//Get favorites array
export const favoritesArray = async (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decodedToken) => {
      if (error) return res.status(404).send(error.message);
      const user = await User.findById(decodedToken._id).catch((err) => {
        return res.send(err.message);
      });
      res.send(user.favorites);
    }
  );
};

//Post a new recipe
export const newRecipe = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
    ingredients: Joi.array()
      .required()
      .messages({ "array.base": "Add some ingredients to the recipe." }),
    category: Joi.string().required().messages({
      "string.empty": "Select a category.",
    }),
    author: Joi.string().required(),
    image: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let recipe = new Recipe({
    name: req.body.name,
    ingredients: req.body.ingredients,
    category: req.body.category,
    author: req.body.author,
    image: req.body.image,
  });
  recipe = await recipe.save();
  res.send(recipe);
};

//Delete a recipe
export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id)
    .catch((err) => res.status(404).send(err))
    .then(() => res.send("Recipe deleted"));
};
