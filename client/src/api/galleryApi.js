import axios from "axios";

const API = "https://hargeisa-connect.onrender.com";

// 📤 UPLOAD IMAGE
export const uploadImage = (formData) => {
  return axios.post(`${API}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📥 GET ALL IMAGES
export const getImages = () => {
  return axios.get(API);
};

// ❤️ LIKE
export const likeImage = (id) => {
  return axios.put(`${API}/like/${id}`);
};

// 👁 VIEW
export const viewImage = (id) => {
  return axios.put(`${API}/view/${id}`);
};


// ❌ DELETE (ADMIN ONLY)
export const deleteImage = (id) => {
  const token = localStorage.getItem("token"); // 👈 GET TOKEN

  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: token, // 👈 SEND TOKEN
    },
  });
};