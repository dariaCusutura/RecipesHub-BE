import "dotenv/config.js";
import jwt from "jsonwebtoken";

export const admin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Access denied.");
  } else {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedToken) => {
        if (error) {
          return res.status(400).send("Invalid token");
        } else {
          if (decodedToken.isAdmin) {
            req.user = decodedToken;
            return next();
          }
          return res.status(401).send("Access denied.");
        }
      }
    );
  }
};
