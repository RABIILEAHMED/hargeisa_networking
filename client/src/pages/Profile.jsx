import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: token },
      });

      console.log("✅ USER DATA:", res.data);
      setUser(res.data);
    } catch (err) {
      console.log("❌ ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse text-yellow-400 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  // ✅ FIX IMAGE URL PROPERLY
  let imageUrl = "https://placehold.co/150";

  if (user?.photo) {
    // remove leading slash if exists
    const cleanPath = user.photo.startsWith("/")
      ? user.photo.slice(1)
      : user.photo;

    imageUrl = `${BASE_URL}/${cleanPath}`;
  }

  console.log("🖼 IMAGE URL:", imageUrl);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">

          {/* IMAGE */}
          <div className="flex flex-col items-center">
            <img
              src={imageUrl}
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
              onError={(e) => {
                console.log("❌ IMAGE FAILED:", imageUrl);
                e.target.onerror = null;
                e.target.src = "https://placehold.co/150";
              }}
            />

            <h1 className="text-2xl font-bold mt-4">
              {user?.name || "No Name"}
            </h1>

            <p className="text-gray-400">
              {user?.jobTitle || "No job title"}
            </p>
          </div>

          {/* BIO */}
          <div className="mt-6 text-center text-gray-300">
            {user?.bio || "No bio added yet."}
          </div>

          {/* SKILLS */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-yellow-400 mb-3">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2 justify-center">
              {user?.skills?.length > 0 ? (
                user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm hover:scale-105 transition"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}