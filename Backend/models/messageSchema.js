import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minLength: [6, "Full Name Must Contain At Least 6 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  issue: {
    type: String,
    required: true,
    minLength: [10, "Issue Must Contain At Least 10 Characters!"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
