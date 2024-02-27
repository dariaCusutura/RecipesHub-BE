import { User, validateUser } from "../models/users.js";
import express from "express";
import _ from "lodash";
import bcrypt from "bcrypt";

const router = express.Router();

// to create a new user
router.post("/", async (req, res) => {
  const result = validateUser(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let user = new User(_.pick(req.body, ["password", "favorites", "email"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(user);
});

export default router;
