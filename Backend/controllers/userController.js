import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
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
    role
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
  const isGithubUsername = await User.findOne({ githubUsername });
  if (isRegistered || isGithubUsername) {
    return next(new ErrorHandler(`${isRegistered.role} With This role Already Exists!`, 400));
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

/*
**************************
//* GET ALL EXPERTS LOGIC
**************************
*/

export const getAllExperts = catchAsyncErrors(async (req, res, next) => {
  const experts = await User.find({ role: "Expert" });
  res.status(200).json({
    success: true,
    experts,
  });
});

/*
**************************
//* GET ALL USER DETAILS LOGIC
**************************
*/

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});


// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutStudent = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("studentToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Student Logged Out Successfully.",
    });
});
/*
**************************
//* ADD NEW EXPERTS
**************************
*/

export const addNewExpert = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Expert Avatar Required!", 400));
  }
  const { expertAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  // mimetype function used to check the extension of image files
  if (!allowedFormats.includes(expertAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    fullName, githubUsername, email, password,
    expertDepartment,
  } = req.body;
  if (
    !fullName || !githubUsername || !email || !password ||
    !expertDepartment ||
    !expertAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  const isGithubUsername = await User.findOne({ githubUsername });
  if (isRegistered || isGithubUsername) {
    return next(
      new ErrorHandler(
        "Expert With This Email and Github Username Already Exists!",
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    expertAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const expert = await User.create({
    fullName, githubUsername, email, password,
    role: "Expert",
    expertDepartment,
    expertAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Expert Registered",
    expert,
  });
});