import "dotenv/config.js";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Acces denies. No token provided");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403);
    req.user = user;
    next();
  });
};
