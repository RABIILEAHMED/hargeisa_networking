import React from "react";
import FileInput from "./FileInput";
import ImagePreview from "./ImagePreview";

export default function UploadForm({
  form,
  handleChange,
  handleSubmit,
  preview,
  removeImage,
  loading,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* TITLE */}
      <input
        type="text"
        name="title"
        placeholder="Image Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none"
        required
      />

      {/* CATEGORY */}
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none"
        required
      />

      {/* FILE */}
      <FileInput handleChange={handleChange} />

      {/* PREVIEW */}
      <ImagePreview preview={preview} removeImage={removeImage} />

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition"
      >
        {loading ? "Uploading..." : "🚀 Upload Image"}
      </button>
    </form>
  );
}