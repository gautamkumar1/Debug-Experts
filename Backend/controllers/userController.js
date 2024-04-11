import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const studentRegister = catchAsyncErrors(async (req, res, next) => {
  const { fullName, githubUsername, email, password } = req.body;
  if (!fullName || !githubUsername || !email || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    fullName, 
    githubUsername, 
    email, 
    password,
    role: "Student",
  });
  res.status(200).json({
    success: true,
    message: "User Registered Successfully!",
  });
});
