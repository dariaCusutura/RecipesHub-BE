import { validateUser, User } from "../models/users";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

module.exports.register = async (req, res, next) => {};

//Creating a new user (logging in)
module.exports.login = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["password", "favorites", "email"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(user);
};
