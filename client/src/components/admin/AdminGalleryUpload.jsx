import React, { useState } from "react";
import { uploadImage } from "../../api/galleryApi";
import UploadForm from "../upload/UploadForm";

export default function AdminGalleryUpload({ fetchImages }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (!file) return;

      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const removeImage = () => {
    setPreview(null);
    setForm({ ...form, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) return alert("Select image ❗");

    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("image", form.image);

    try {
      setLoading(true);
      await uploadImage(data);

      setForm({ title: "", category: "", image: null });
      setPreview(null);

      fetchImages && fetchImages();
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 rounded-3xl shadow-2xl max-w-xl mx-auto border border-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
        📤 Upload Event Image
      </h2>

      <UploadForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        preview={preview}
        removeImage={removeImage}
        loading={loading}
      />
    </div>
  );
}