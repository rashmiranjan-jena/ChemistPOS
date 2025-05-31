import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const logoutUser = async (refreshToken) => {
  try {
    await axiosInstance.post("/admin-logout/", { refresh: refreshToken });
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, error };
  }
};

export default axiosInstance;
