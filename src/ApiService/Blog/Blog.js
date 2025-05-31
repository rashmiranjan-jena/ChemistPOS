import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const submitForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error during form submission:", error);
    throw error;
  }
};

export const getBlogData = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogs/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateBlogStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/?blog_id=${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog status:", error);
    throw error;
  }
};

export const editFormbyid = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/?blog_id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateForm = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/blogs/?blog_id=${id}`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating form:", error.response?.data || error.message);
    throw error;
  }
};

