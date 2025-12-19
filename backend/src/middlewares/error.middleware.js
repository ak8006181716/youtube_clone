import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;
