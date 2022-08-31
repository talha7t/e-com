const { Router } = require("express");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { isAuthenticatedUser } = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/confirmation/:email/:token", userController.confirmEmail);
router.post("/resend", userController.resendLink);
router.post("/password/forgot", userController.forgotPassword);
router.post("/password/reset/:token", userController.resetPassword);
router.post(
  "/me/change-email",
  isAuthenticatedUser,
  userController.changePassword
);
router.get("/me", isAuthenticatedUser, userController.getMe);
// router.post("/password/reset/:token", userController.resetPassword);

router.get("/admin/all", userController.adminGetAllUsers);
router.delete("/admin/:id", userController.adminDeleteUser);

module.exports = router;
