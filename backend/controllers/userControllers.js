const User = require("../models/User");
const Token = require("../models/Token");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utilities/ErrorHandler");
const sendEmail = require("../utilities/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const userData = ({
    firstName,
    lastName,
    email,
    password,
    address,
    city,
    zipCode,
    country,
    phoneNumber,
  } = req.body);

  /// check if user exists
  const userExists = await User.findOne({ email: userData.email });

  if (userExists) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const user = await User.create(userData);
  if (!user) {
    return next(new ErrorHandler("Invalid user data"), 400);
  }

  sendConfirmationEmail(user, next, res);
});

// @desc    Confirm email
// @route   GET /api/confirmation/:email/:token
// @access  Private

const confirmEmail = asyncHandler(async (req, res, next) => {
  const token = await Token.findOne({ token: req.params.token });

  // token is not found into database i.e. token may have expired
  if (!token) {
    return next(
      new ErrorHandler(
        "You verification Link may have expired. Please click on resend verification link",
        400
      )
    );
  } else {
    const user = await User.findOne({
      _id: token._userId,
      email: req.params.email,
    });

    // if user email is false or token is not for this user return error
    if (!user) {
      return next(
        new ErrorHandler(
          "Unable to find user for this verification. Please Singup!",
          401
        )
      );
    } // user is already verified
    else if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "User has been already verified. Please Login" });
    } // verify user
    else {
      //   change isVerified to true
      user.isVerified = true;
      user.save();

      res.status(200).json({ message: "You account has been verified" });
    }
  }
});

// @desc    Resend confirmation email
// @route   GET /api/resend/
// @access  Public

const resendLink = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("No user exists with provided email"), 400);
  } // user has been already verified
  else if (user.isVerified) {
    return next(new ErrorHandler("Account has already been verified"), 401);
  } // send verification link
  else {
    sendConfirmationEmail(user, next, res);
  }
});

// @desc    Forgot Password
// @route   GET /api/users/password/forgot
// @access  Public

const forgotPassword = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler("No user exists with email " + req.body.email),
      400
    );
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // create reset password url
  const resetUrl =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
      : `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is ${resetUrl}\n\n`;

  try {
    await sendEmail({
      email: user.email,
      subject: "SHOP IT Password Recovery",
      message,
    });

    res.status(200).json({ message: `Email sent to ${user.email}` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

// @desc    Reset Password
// @route   POST /api/users/password/reset:token
// @access  Public

const resetPassword = asyncHandler(async (req, res, next) => {
  // hash URL tokens
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is either invalid or has been expired"
      ),
      400
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // set up new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "password changed successfully" });
});

// @desc    Reset Password
// @route   POST /api/users/me/change-email
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("No user found with existing email", 400));
  }

  if (user.password === req.body.currentPassword) {
    return next(
      new ErrorHandler(
        "New password must be different from current password",
        400
      )
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  console.log(user);
  res.status(200).json({ user, message: "password changed successfully" });
});

// @desc    User login
// @route   POST /api/users/login
// @access  Public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are entered by the user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password"), 400);
  }

  // Find user in database
  const user = await User.findOne({ email }).select("-password");

  // check if user exists
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // check user is verified or not
  if (!user.isVerified) {
    return next(
      new ErrorHandler(
        `Your Email has not been verified. Please verify your email and try again`,
        401
      )
    );
  }

  // check if password is correct or not
  const isPasswordMatched = await user.comparePasswords(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Password", 401));
  }

  // const token = generateToken(user._id);
  res.status(200).json({
    user,
    token: generateToken(user._id),
    message: "User logged in successfully",
  });
});

// @desc    Get user details
// @route   GET /api/users/me
// @access  Private

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ user });
});

// @desc    admin get all user
// @route   GET /api/users/admin/all
// @access  Private

const adminGetAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  if (!users) {
    return next(new ErrorHandler("No users Found"), 400);
  }

  res.status(200).json({ usersCount: users.length, users });
});

// @desc    admin delete user
// @route   DELETE /api/users/admin/:id
// @access  Private
const adminDeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User does not exist", 401));
  }

  //delete cookies here

  await user.remove();

  res.status(200).json({ success: true });
});

module.exports = {
  register,
  confirmEmail,
  resendLink,
  forgotPassword,
  changePassword,
  resetPassword,
  login,
  getMe,
  adminGetAllUsers,
  adminDeleteUser,
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_TIME}d`,
  });
};
// send email confirmation link
async function sendConfirmationEmail(user, next, res) {
  // generate token and save
  const token = await Token.create({
    _userId: user._id,
    email: user.email,
    token: crypto.randomBytes(16).toString("hex"),
  });

  // email message
  const message =
    "Hello " +
    user.name +
    ",\n\n" +
    "Please verify your account by clicking the link: \n" +
    // req.headers.host +
    process.env.FRONTEND_URL +
    "/confirmation/" +
    user.email +
    "/" +
    token.token +
    "\n\nThank You!\n" +
    "Your verification link will expire after 24 hours";

  // send email
  try {
    await sendEmail({
      email: user.email,
      subject: "Account verification email for Shop IT",
      message,
    });
    res.status(200).json({
      user,
      message: `Confirmation email sent to ${user.email}. Please check your email.`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}
