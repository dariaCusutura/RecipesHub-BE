import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  favorites: Array,
});

export const User = mongoose.model("user", userSchema);

export function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be valid.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required."
    }),
  });
  return schema.validate(user);
}
