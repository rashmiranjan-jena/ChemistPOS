import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin-signup/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};


