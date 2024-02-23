import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  category: String,
  // favourite: Boolean,
});
const Recipe = mongoose.model("recipe", recipeSchema);

export default Recipe;
