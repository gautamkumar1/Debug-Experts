import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name Is Required!"],
    minLength: [6, "Full Name Must Contain At Least 6 Characters!"],
  },
  githubUsername: {
    type: String,
    required: [true, "Github Username Is Required!"],
    minLength: [4, "Github Username Must Contain At Least 4 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  appointment_date: {
    type: String,
    required: [true, "Appointment Date Is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  expert: {
    fullName: {
      type: String,
      required: [true, "Expert Name Is Required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  expertId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Expert Id Is Invalid!"],
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Student Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
