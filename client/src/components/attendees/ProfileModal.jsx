import React, { useState } from "react";
import { X, Briefcase, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileModal({ user, onClose }) {
  if (!user) return null;
const [imgError, setImgError] = useState(false);
const BASE_URL = import.meta.env.VITE_API_URL;

  // ✅ INITIALS
  const initials =
    user.name?.split(" ").map((n) => n[0]).join("") || "U";

  // ✅ IMAGE FIX
  const getImageUrl = (photo) => {
    if (!photo) return null;

    if (photo.startsWith("http")) return photo;

    const clean = photo.startsWith("/") ? photo.slice(1) : photo;

    return `${BASE_URL}/${clean}`;
  };

  const imageUrl = getImageUrl(user.photo);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 px-4"
    >

      {/* MODAL */}
      <motion.div
        onClick={(e) => e.stopPropagation()} // ✅ prevent close when clicking inside
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-white/10 p-6 relative"
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center">

          {/* IMAGE */}
          {imageUrl && !imgError && (
  <img
    src={imageUrl}
    alt="profile"
    className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
    onError={() => setImgError(true)}
  />
)}
          {/* FALLBACK INITIALS */}
       {(!imageUrl || imgError) && (
  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-black shadow-lg">
    {initials}
  </div>
)}

          <h2 className="text-xl font-bold mt-4 text-white">
            {user.name || "Unknown User"}
          </h2>

          <p className="text-yellow-400 text-sm flex items-center gap-1 mt-1">
            <Briefcase size={14} />
            {user.jobTitle || "Attendee"}
            {user.company && ` @ ${user.company}`}
          </p>

          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
            <Mail size={14} />
            {user.email || "No email"}
          </p>

        </div>

        {/* BIO */}
        <div className="mt-5 text-center text-gray-300 text-sm leading-relaxed">
          {user.bio || "No bio provided."}
        </div>

        {/* SKILLS */}
        {user.skills && user.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {user.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-xs rounded-full hover:bg-yellow-400/30 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* ACTION */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
}