import React from "react";

export default function ImagePreview({ preview, removeImage }) {
  if (!preview) return null;

  return (
    <div className="relative">
      <img
        src={preview}
        alt="preview"
        className="w-full h-52 object-cover rounded-xl border border-gray-700"
      />

      <button
        type="button"
        onClick={removeImage}
        className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-sm"
      >
        ❌
      </button>
    </div>
  );
}