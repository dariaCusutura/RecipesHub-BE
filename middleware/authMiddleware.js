import "dotenv/config.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedToken) => {
        if (error) {
          res.json({ status: false });
          next();
        } else {
          const user = User.findById(decodedToken._id);
          if (user) res.json({ status: true });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};
