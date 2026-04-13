import React from "react";
import { motion } from "framer-motion";

export default function GalleryCard({
  img,
  onClick,
  onLike,
  onDelete,
  isAdmin = false,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-xl bg-black"
    >
      {/* IMAGE */}
      <img
        src={img.imageUrl}
        onClick={onClick}
        className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-0 w-full p-4 text-white">
        <h3 className="font-bold text-lg truncate">{img.title}</h3>

        <p className="text-xs text-gray-300">
          📅{" "}
          {img.createdAt
            ? new Date(img.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "No date"}
        </p>

        <p className="text-xs text-gray-400">👤 Admin Upload</p>

        {/* STATS */}
        <div className="flex justify-between text-xs mt-2 text-gray-200">
          <span>❤️ {img.likes}</span>
          <span>👁 {img.views}</span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center mt-2">
          {/* LIKE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike && onLike();
            }}
            className="text-yellow-400 text-xs hover:scale-110 transition"
          >
            ❤️ Like
          </button>

          {/* DELETE (ONLY ADMIN) */}
          {isAdmin === true && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
              className="text-red-400 text-xs hover:text-red-600"
            >
              🗑 Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}