import Recipe from "../models/recipes.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { User } from "../models/users.js";
import Joi from "joi";

//Get all recipes
export const allRecipes = async (req, res) => {
  const result = await Recipe.find();
  res.send(result);
};

//Get recipe by category
export const byCategory = async (req, res) => {
  const recipes = await Recipe.find({ category: req.params.category }).catch(
    () => {
      return res
        .status(404)
        .send("The recipe with the given category was not found");
    }
  );
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
};
