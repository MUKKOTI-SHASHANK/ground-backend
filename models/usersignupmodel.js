import mongoose from "mongoose";
// import { Express } from "express";

const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const usermodel = mongoose.model("UserSchema", UserSchema);

export { usermodel as UserSignupModel };
