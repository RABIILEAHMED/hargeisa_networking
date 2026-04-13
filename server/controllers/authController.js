const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// 🔥 ADD THIS (MISSING PART FIX)
const sendEmail = require("../utils/sendEmail");

// ==============================
// 📩 SEND OTP (IMPROVED)
// ==============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🔐 OTP GENERATE
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP is: ${otp}. It will expire in 10 minutes.`
    );

    res.json({ msg: "OTP sent to email 📩" });

  } catch (err) {
    console.error("Forgot error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// ==============================
// 🔑 RESET PASSWORD (IMPROVED)
// ==============================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired OTP ❌" });
    }

    // 🔐 HASH PASSWORD
    user.password = await bcrypt.hash(password, 10);

    // 🧹 CLEAR OTP
    user.resetOTP = undefined;
    user.resetExpire = undefined;

    await user.save();

    res.json({ msg: "Password updated successfully ✅" });

  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    resetOTP: otp,
    resetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  res.json({ msg: "OTP Verified ✅" });
};
// ==============================
// ✅ REGISTER
// ==============================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ LOGIN
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SECRET123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ GET ME
// ==============================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ UPDATE PROFILE
// ==============================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = req.body.name || user.name;
    user.jobTitle = req.body.jobTitle || user.jobTitle;
    user.bio = req.body.bio || user.bio;

    if (req.body.skills) {
      if (typeof req.body.skills === "string") {
        user.skills = req.body.skills.split(",").map((s) => s.trim());
      } else if (Array.isArray(req.body.skills)) {
        user.skills = req.body.skills;
      }
    }

    if (req.file) {
      if (user.photo && !user.photo.includes("placeholder")) {
        const oldPath = path.join(
          __dirname,
          "../uploads/",
          path.basename(user.photo)
        );

        fs.unlink(oldPath, (err) => {
          if (err) console.log("Old photo not deleted", err);
        });
      }

      user.photo = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ GET USER BY ID
// ==============================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// 🔥 EXPORT ALL (MUHIIM)
// ==============================
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  getUserById,
  forgotPassword,
  resetPassword,
   verifyOtp,
};