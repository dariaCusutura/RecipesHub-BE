import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  hashedPassword: String,
  favorites: Array,
});

const User = mongoose.model("user", userSchema);
export default User;
