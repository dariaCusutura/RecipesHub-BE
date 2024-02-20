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
const app = express();

app.use(cors());
app.use(express.json());

const recipes = [
  { id: 1, name: "Bread" },
  { id: 2, name: "Cake" },
  { id: 3, name: "Soup" },
];

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/recipes", (req, res) => {
  res.send(recipes);
});
app.get("/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (!recipe)
    return res.status(404).send("The recipe with the given id was not found");
  res.send(recipe);
});

app.post("/recipes", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const recipe = {
    id: recipes.length + 1,
    name: req.body.name,
  };
  recipes.push(recipe);
  res.send(recipe);
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
