import User from "../models/users.js";
import Joi from "joi";
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    hashedPassword: Joi.string().required(),
    favorites: Joi.array().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let user = new User({
    name: req.body.name,
    session: req.body.session,
    favorites: req.body.favorites,
  });
  //   user = await user.save();
  //   res.send(user);
});

export default router;
