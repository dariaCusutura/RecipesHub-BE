import mongoose from "mongoose";
import Joi from "joi";
import { ObjectId } from "mongodb";

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  favorites: [{ type: ObjectId, ref: "recipe" }],
  name: { type: String, required: [true, "Name is required"] },
  isAdmin: {type: Boolean}
});

export const User = mongoose.model("user", userSchema);

export function validateAuthUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be valid.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  });
  return schema.validate(user);
}

export function validateRegisterUser(user) {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be valid.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  });
  return schema.validate(user);
}
