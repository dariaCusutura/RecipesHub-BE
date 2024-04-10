import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  category: String,
  author: String,
  image: String,
  date: Date
});
const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;
