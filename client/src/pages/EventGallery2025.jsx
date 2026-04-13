import React, { useEffect, useState } from "react";
import socket from "../socket";

import {
  getImages,
  likeImage,
  viewImage,
  deleteImage,
} from "../api/galleryApi";

import GalleryCard from "../components/gallery/GalleryCard";
import GalleryModal from "../components/gallery/GalleryModal";

// ✅ SOCKET FIX (Render compatible)


export default function EventGallery2025() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 📥 FETCH IMAGES (SAFE)
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getImages();

      // ✅ FIX: ensure array
      const data = res?.data;
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setImages([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  // ✅ SINGLE useEffect (FIXED)
useEffect(() => {
  fetchData();

  socket.on("connect", () => {
    console.log("🔥 Connected:", socket.id);
  });

  socket.on("galleryUpdated", fetchData);

  // 🔐 ADMIN CHECK
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Invalid token");
    }
  }

  return () => {
    socket.off("connect");
    socket.off("galleryUpdated");
  };
}, []);

  // ❤️ LIKE (optimistic update)
  const handleLike = async (id) => {
    try {
      await likeImage(id);

      setImages((prev) =>
        prev.map((img) =>
          img._id === id
            ? { ...img, likes: (img.likes || 0) + 1 }
            : img
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 👁 VIEW + MODAL
  const handleView = async (img) => {
    try {
      await viewImage(img._id);
      setSelected(img);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 DELETE (ADMIN)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this image?");
    if (!confirmDelete) return;

    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6 md:p-10">
      
      {/* HEADER */}
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10 text-center">
        🚀 PRO Event Gallery
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400 animate-pulse">
          Loading images...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && images.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          📭 No images found in gallery
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(images) &&
          images.map((img) => (
            <GalleryCard
              key={img._id}
              img={img}
              onClick={() => handleView(img)}
              onLike={() => handleLike(img._id)}
              onDelete={() => handleDelete(img._id)}
              isAdmin={isAdmin}
            />
          ))}
      </div>

      {/* MODAL */}
      {selected && (
        <GalleryModal
          img={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}