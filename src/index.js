import mongoose from "mongoose";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {});
app.get("/recipes", (req, res) => {});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
