const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorHandler = require("../utilities/ErrorHandler");

// check if the user is authenticated
exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return next(new ErrorHandler("Invalid token,please login again", 401));
    }
  }

  if (!token) {
    return next(
      new ErrorHandler("You must be logged in to use this feature", 401)
    );
  }
});
