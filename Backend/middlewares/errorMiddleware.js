class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
// MongoDb Return one code when we give the any duplicated value
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400);
  }
//   This is related to the toke
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
//   This is related to the token expiry
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
//   Cast Error when we not entered correct data according to your schema
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }

   const errorMessage = err.errors
     ? Object.values(err.errors)
         .map((error) => error.message)
         .join(" ")
     : err.message;


  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  })


}
export default ErrorHandler
