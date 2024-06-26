import "dotenv/config.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.send({ status: false });
  } else {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedToken) => {
        if (error) {
          return res.send({ status: false });
        } else {
          const user = User.findById(decodedToken._id);
          if (user) {
            res.send({ status: true });
            next();
          } else return res.send({ status: false });
        }
      }
    );
  }
};

export const authorisateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Access denied.");
  } else {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedToken) => {
        if (error) {
          res.status(400).send("Invalid token");
        } else {
          req.user = decodedToken;
          next();
        }
      }
    );
  }
};
