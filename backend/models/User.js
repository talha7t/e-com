const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [20, "First name can not exceed 20 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "Last name must be at least 2 characters"],
      maxLength: [20, "Last name can not exceed 20 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "Password must be at least 5 characters"],
    },
    isVerified: { type: Boolean, default: false },
    userRole: {
      type: String,
      required: [true, "Please select a role for the user"],
      enum: {
        values: ["customer", "admin"],
        required: [true, "Please select a correct role for the user"],
      },
      default: "customer",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// encrypting password before registering user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // run this if password is not modified
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// compare user passwords
userSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Password reset token
userSchema.methods.getResetPasswordToken = function () {
  //genereate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // create hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set token expiry time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
