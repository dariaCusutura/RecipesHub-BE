import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

//get user data
export const userData = async (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decodedToken) => {
      if (error) return res.status(404).send("User not found");
      const user = await User.findById(decodedToken._id).catch((err) =>
        res.status(404).send("User not found")
      );
      res.send({ email: decodedToken.email, name: user.name });
    }
  );
};
