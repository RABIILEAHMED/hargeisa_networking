const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");


// 📤 Upload
const uploadImage = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const image = await Gallery.create({
      title,
      category,
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });

    // 🔥 SOCKET.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("galleryUpdated");
    }

    res.json(image);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get all
const getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❤️ Like
const likeImage = async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);

    if (!img) return res.status(404).json({ message: "Not found" });

    img.likes++;
    await img.save();

    res.json(img);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👁 View
const viewImage = async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);

    if (!img) return res.status(404).json({ message: "Not found" });

    img.views++;
    await img.save();

    res.json(img);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete
const deleteImage = async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);

    if (!img) return res.status(404).json({ message: "Not found" });

    await cloudinary.uploader.destroy(img.public_id);
    await img.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadImage,
  getImages,
  likeImage,
  viewImage,
  deleteImage,
};