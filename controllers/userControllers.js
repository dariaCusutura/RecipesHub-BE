import jwt from "jsonwebtoken";

//get user email
export const userEmail = async (req, res) => {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    async (error, decodedToken) => {
      if (error) res.status(404).send("User not found");
      res.send(decodedToken.email);
    }
  );
};
