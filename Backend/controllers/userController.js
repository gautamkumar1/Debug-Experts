import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
/*
**************************
//* STUDENT REGISTRATION LOGIC
**************************
*/
export const studentRegister = catchAsyncErrors(async (req, res, next) => {
  const { fullName, githubUsername, email, password,role } = req.body;
  if (!fullName || !githubUsername || !email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  const isGithubUsername = await User.findOne({ githubUsername });
  if (isRegistered || isGithubUsername) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    fullName, 
    githubUsername, 
    email, 
    password,
    role: "Student",
  });
 generateToken(user,"User Registered Successfully" ,200,res)
});
/*
**************************
//* STUDENT LOGIN LOGIC
**************************
*/
export const login = catchAsyncErrors(async (req, res, next) => {
  const {githubUsername,password, confirmPassword, role } = req.body;
  if (!githubUsername  || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ githubUsername }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

/*
**************************
//* ADD NEW ADMIN LOGIC
**************************
*/
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { fullName, githubUsername, email, password} = req.body;
  if (!fullName || !githubUsername || !email || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists!`, 400));
  }

  const admin = await User.create({
    fullName, githubUsername, email, password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

