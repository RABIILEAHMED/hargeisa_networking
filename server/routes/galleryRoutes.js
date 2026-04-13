const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware"); // ✅ FIXED

const {
  uploadImage,
  getImages,
  likeImage,
  viewImage,
  deleteImage,
} = require("../controllers/galleryController");

const router = express.Router();

// 📦 Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-gallery",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// 🚀 ROUTES
router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getImages);
router.put("/like/:id", likeImage);
router.put("/view/:id", viewImage);
// router.delete("/:id", deleteImage);
// ❌ DELETE (ADMIN ONLY)
router.delete("/:id", auth, isAdmin, deleteImage);

module.exports = router;