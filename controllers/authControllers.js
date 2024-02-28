import { validateUser, User } from "../models/users.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// Logging in
export const login = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const accessToken = createToken(user);
  res.cookie("jwt", accessToken, {
    withCredentials: true,
    httpOnly: false,
    maxAge: maxAge * 1000,
  });
};

//Creating a new user
export const register = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["password", "favorites", "email"]));
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    const accessToken = createToken(user);
    res
      .cookie("jwt", accessToken, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      })
      .send("registered successfully");
  } catch {
    res.status(500).send();
  }
};
