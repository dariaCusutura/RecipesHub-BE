import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import recipes from "./routes/recipes.js";
import users from "./routes/users.js";
import auth from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

mongoose
  .connect("mongodb://localhost/Recipe-hub")
  .then(() => console.log("connected to mongoose succesfully"))
  .catch((error) => console.log("could not connect to mongoose"));

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/recipes", recipes);
app.use("/users", users);
app.use("/", auth);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
