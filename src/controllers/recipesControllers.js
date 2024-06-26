import Recipe from "../models/recipes.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { User } from "../models/users.js";
import Joi from "joi";
import { response } from "express";

const PAGE_SIZE = 5;

//Get all recipes
export const allRecipes = async (req, res) => {
  const { page = 0, ingredients, ...otherQuery } = req.query;
  const skip = parseInt(page) * PAGE_SIZE;
  const query = { ...otherQuery };
  if (ingredients) {
    query.ingredients = { $all: ingredients };
  }
  const recipes = await Recipe.find(query, null, {
    skip,
    limit: PAGE_SIZE,
    sort: { date: -1 },
  }).catch((err) => {
    return res.status(500).send(err.message);
  });
  if (!recipes.length) return res.status(404).send("No recipes found");
  //for pagination restrictions
  const totalRecipesCount = await Recipe.countDocuments(query);
  res.send({ recipes, totalRecipesCount });
};

//Get favorite recipes array
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
      const { page = 0 } = req.query;
      const skip = parseInt(page) * PAGE_SIZE;
      const recipes = await Recipe.find(
        {
          _id: user.favorites,
        },
        null,
        {
          skip,
          limit: PAGE_SIZE,
        }
      );
      const totalRecipesCount = await Recipe.countDocuments({
        _id: user.favorites,
      });
      res.send({ recipes, totalRecipesCount });
    }
  );
};

//Get favorite recipes ids array (to display full heart button for liked recipes
// and empty heart for the rest)
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
  const { error } = recipeSchema.validate(req.body);
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
    date: req.body.date,
  });
  recipe = await recipe.save();
  res.send(recipe);
};

//Delete a recipe
export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).catch((err) => {
    return response.status(400).send(err);
  });
  //allow only the author/admin to delete the recipe
  if (req.user.name === recipe.author || req.user.isAdmin === true)
    await Recipe.findByIdAndDelete(req.params.id)
      .catch((err) => res.status(404).send(err))
      .then(() => res.send("Recipe deleted"));
  else return res.status(401).send("Access denied.");
};

//Edit recipe
export const editRecipe = async (req, res) => {
  //allow only the author/admin to edit the recipe
  if (req.user.name === req.body.author || req.user.isAdmin === true) {
    const { error } = recipeSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    await Recipe.findByIdAndUpdate(req.params.id, { ...req.body })
      .catch((err) => res.status(404).send(err))
      .then(() => res.send("Recipe updated"));
  } else return res.status(401).send("Access denied.");
};

//Like or dislike recipe
export const addFavorite = async (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decodedToken) => {
      if (error) return res.status(403).send(error.message);
      await User.findByIdAndUpdate(
        decodedToken._id,
        !req.body.liked
          ? { $push: { favorites: req.params.id } }
          : { $pull: { favorites: req.params.id } },
        { new: true }
      )
        .then(() => {
          !req.body.liked
            ? res.send("liked successfully")
            : res.send("disliked successfully");
        })
        .catch((err) => res.status(404).send(err));
    }
  );
};

//Search a recipe
export const searchRecipe = async (req, res) => {
  let searchTerm = req.query.search;
  let recipes =
    searchTerm !== "" &&
    (await Recipe.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .limit(5) // Limit the number of recipes returned to 5
      .exec()
      .catch((err) => {
        res.status(404).send(err.message);
      }));
  if (recipes?.length === 0)
    return res.status(404).send("No recipe matched your search");
  res.status(200).send(recipes);
};

const recipeSchema = Joi.object({
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
  date: Joi.date().required(),
});
