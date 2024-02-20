import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import Joi from "joi";

mongoose
  .connect("mongodb://localhost/Recipe-hub")
  .then(() => console.log("connected to mongoose succesfully"))
  .catch((error) => console.log("could not connect to mongoose"));

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  category: String,
});
const Recipe = mongoose.model("recipe", recipeSchema);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/recipes", async (req, res) => {
  const result = await Recipe.find();
  res.send(result);
});
app.get("/recipes/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe)
    return res.status(404).send("The recipe with the given id was not found");
  res.send(recipe);
});

app.post("/recipes", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
