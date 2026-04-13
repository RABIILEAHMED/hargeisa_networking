const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  getUserById,
  forgotPassword,
  resetPassword,
  verifyOtp
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Routes
router.post("/register", register);
router.post("/login", login);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/verify-otp", verifyOtp);

router.get("/me", authMiddleware, getMe);

// UPDATE PROFILE (with photo)
router.put("/profile", authMiddleware, upload.single("photo"), updateProfile);

// PUBLIC PROFILE
router.get("/:id", getUserById);

module.exports = router;