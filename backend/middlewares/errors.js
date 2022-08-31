const ErrorHandler = require("../utilities/ErrorHandler");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // handling development errors
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  // handling production error
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // wrong mongoose object id error
    if (err.name === "CastError") {
      const message = "Resource not Found. Invalid: " + err;
      error = new ErrorHandler(message, 404);
    }

    // handling mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.erros).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // implement other error handlers

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
