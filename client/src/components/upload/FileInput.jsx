import React from "react";

export default function FileInput({ handleChange }) {
  return (
    <label className="block border-2 border-dashed border-gray-600 p-6 rounded-xl text-center cursor-pointer hover:border-yellow-400 transition">
      <span className="text-gray-400">📸 Click to choose image</span>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="hidden"
        accept="image/*"
      />
    </label>
  );
}