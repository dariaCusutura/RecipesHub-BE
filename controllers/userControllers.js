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

//delete user
export const deleteUser = async ( req, res) => {
  const user = await User.findById(req.params.id).catch((err) => {
    return response.status(400).send(err);
  });
  //allow only the author/admin to delete the user
  if (req.user.name === user.name || req.user.isAdmin === true)
    await User.findByIdAndDelete(req.params.id)
      .catch((err) => res.status(404).send(err))
      .then(() => res.send("User deleted"));
  else return res.status(401).send("Access denied.");
}
