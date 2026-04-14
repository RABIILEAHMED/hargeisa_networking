import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditProfile() {
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

const token = localStorage.getItem("token");
const BASE_URL = "https://hargeisa-connect.onrender.com";

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: token },
      });

      setForm(res.data);

      // ✅ FIX EXISTING IMAGE
      if (res.data.photo) {
        const cleanPath = res.data.photo.startsWith("/")
          ? res.data.photo.slice(1)
          : res.data.photo;

        setPreview(`${BASE_URL}/${cleanPath}`);
      }
    } catch (err) {
      console.log("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMAGE CHANGE + PREVIEW
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size / 1024 / 1024 > 2) {
      alert("❌ Image must be less than 2MB");
      return;
    }

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // instant preview
    };
    reader.readAsDataURL(selected);
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("jobTitle", form.jobTitle || "");
      formData.append("bio", form.bio || "");
      formData.append(
  "skills",
  JSON.stringify(form.skills || [])
);

      if (file) {
        formData.append("photo", file);
      }

     await axios.put(`${BASE_URL}/api/auth/profile`, formData, {
  headers: {
    Authorization: token,
    "Content-Type": "multipart/form-data",
  },
});

      alert("✅ Profile Updated Successfully");

      // refresh data
      fetchUser();
      setFile(null);

    } catch (err) {
      console.log("❌ Update error:", err);
      alert("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse text-yellow-400 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-5 bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/10"
        encType="multipart/form-data"
      >
        {/* AVATAR */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg transition hover:scale-105"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <label className="mt-3 cursor-pointer text-sm text-yellow-400 hover:underline">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* NAME */}
        <input
          placeholder="Name"
          value={form.name || ""}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* JOB */}
        <input
          placeholder="Job Title"
          value={form.jobTitle || ""}
          onChange={(e) =>
            setForm({ ...form, jobTitle: e.target.value })
          }
          className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* BIO */}
        <textarea
          placeholder="Bio"
          value={form.bio || ""}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
          rows={3}
          className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* SKILLS */}
        <input
          placeholder="Skills (comma separated)"
          value={form.skills ? form.skills.join(",") : " "}
          onChange={(e) =>
            setForm({
              ...form,
              skills: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s),
            })
          }
          className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* BUTTON */}
        <button
          disabled={saving}
          className={`w-full py-3 rounded font-semibold transition ${
            saving
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400 text-black"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}