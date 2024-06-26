import {
  validateAuthUser,
  validateRegisterUser,
  User,
} from "../models/users.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};

// Logging in
export const login = async (req, res) => {
  const { error } = validateAuthUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const accessToken = createToken(user);
  res
    .cookie("jwt", accessToken, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    })
    .send({ isAdmin: user.isAdmin });
};

//Registering
export const register = async (req, res) => {
  try {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    //verify if name is unique
    let userName = await User.findOne({ name: req.body.name });
    if (userName)
      return res
        .status(400)
        .send("This name is already used. Try another name.");

    //verify if email is already used
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(
      _.pick(req.body, ["password", "favorites", "email", "name"])
    );
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();

    const accessToken = createToken(user);
    res
      .cookie("jwt", accessToken, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      })
      .send("Registered successfully");
  } catch {
    res.status(500).send();
  }
};
