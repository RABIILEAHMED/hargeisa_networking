import React from "react";
import { motion } from "framer-motion";

export default function GalleryModal({ img, onClose }) {
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full"
      >
        {/* IMAGE */}
        <img
          src={img.imageUrl}
          alt={img.title}
          className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
        />

        {/* INFO BAR */}
        <div className="mt-4 text-center text-white">
          <h2 className="text-xl font-bold text-yellow-400">
            {img.title}
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            📅{" "}
            {img.createdAt
              ? new Date(img.createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "No date"}
          </p>

          <p className="text-xs text-gray-500">
            👤 Admin Upload
          </p>

          <div className="flex justify-center gap-6 mt-2 text-sm text-gray-300">
            <span>❤️ {img.likes}</span>
            <span>👁 {img.views}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}