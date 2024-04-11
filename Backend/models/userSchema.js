import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name Is Required!"],
    minLength: [10, "Full Name Must Contain At Least 10 Characters!"],
  },
  githubUsername: {
    type: String,
    required: [true, "Github Username Is Required!"],
    minLength: [6, "Github Username Must Contain At Least 6 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  //   nic: {
  //     type: String,
  //     required: [true, "NIC Is Required!"],
  //     minLength: [13, "NIC Must Contain Only 13 Digits!"],
  //     maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  //   },

  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [6, "Password Must Contain At Least 6 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Student", "Expert", "Admin"],
  },
  expertDepartment: {
    type: String,
  },
  expertAvatar: {
    public_id: String,
    url: String,
  },
});
// This method to save password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
// this method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// this method to generate json web token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
