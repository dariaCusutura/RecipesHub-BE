import { User } from "../models/users.js";

//get all users
export const allUsers = async (req, res) => {
  const users = await User.find()
    .select(["-password", "-favorites"])
    .catch((err) => {
      return res.status(500).send(err.message);
    });
  res.send(users);
};

//get user data
export const userData = async (req, res) => {
  res.send({
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin,
  });
};
