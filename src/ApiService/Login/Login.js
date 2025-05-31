import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin-login/`, formData);

    return response?.data;
  } catch (err) {
    throw err;
  }
};


