const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,

    // 🆕 PROFILE FIELDS
    photo: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    bio: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

// ✅ OTP fields
  resetOTP: String,
  resetExpire: Date,
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);