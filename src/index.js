import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import recipes from "./routes/recipesRoutes.js";
import auth from "./routes/authRoutes.js";
import user from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("connected to mongoose succesfully"))
  .catch((error) => console.log("could not connect to mongoose"));

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/recipes", recipes);
app.use("/", auth);
app.use("/users", user);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
