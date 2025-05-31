import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getUserDetails= async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/?user_id=${userId}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch recent activity");
  }
};


export const updateUserProfile = async (customer_id, formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile/?user_id=${customer_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response; 
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};