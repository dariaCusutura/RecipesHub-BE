import { User, validatePassword } from "../models/users.js";
import bcrypt from "bcrypt";

const PAGE_SIZE = 5;

//get all users
export const allUsers = async (req, res) => {
  const { page = 0 } = req.query;
  const skip = parseInt(page) * PAGE_SIZE;
  const users = await User.find()
    .select(["-password", "-favorites"])
    .skip(skip)
    .limit(PAGE_SIZE)
    .catch((err) => {
      return res.status(500).send(err.message);
    });
  const totalUsersCount = await User.countDocuments();
  res.send({ users, totalUsersCount });
};

//get user data
export const userData = async (req, res) => {
  res.send({
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin,
  });
};

//delete user
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id).catch((err) => {
    return response.status(400).send(err);
  });
  //allow only the author/admin to delete the user
  if (req.user.name === user.name || req.user.isAdmin === true)
    await User.findByIdAndDelete(req.params.id)
      .catch((err) => res.status(404).send(err))
      .then(() => res.send("User deleted"));
  else return res.status(401).send("Access denied.");
};

//change password
export const updatePassword = async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("Invalid token");

  let validPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid password");
  else {
    const password = await bcrypt.hash(req.body.newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: password })
      .catch((err) => res.status(404).send(err))
      .then(() => res.send("Password updated"));
  }
};

//Search user
export const searchUser = async (req, res) => {
  let searchTerm = req.query.search;
  let users =
    searchTerm !== "" &&
    (await User.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .select(["-password", "-favorites"])
      .limit(5) // Limit the number of recipes returned to 5
      .exec()
      .catch((err) => {
        res.status(404).send(err.message);
      }));
  if (users?.length === 0)
    return res.status(404).send("No user matched your search");
  res.status(200).send(users);
};
