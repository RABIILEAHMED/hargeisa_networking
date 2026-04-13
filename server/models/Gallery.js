const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    imageUrl: String,
    public_id: String,
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);