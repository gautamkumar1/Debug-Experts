import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { fullName, email, issue } = req.body;
  if (!fullName|| !email || !issue) {
    return next(new ErrorHandler("Please fill the from",400))
  }
  await Message.create({ fullName,email, issue });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
})
