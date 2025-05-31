import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getRattingFeedback = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rating-feedback/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to update feedback status (true for Published, false for Unpublished)
export const updateFeedbackStatus = async (id, newStatus) => {
  try {
    const statusBoolean = newStatus === "Published" ? true : false; 
    const response = await axios.put(`${API_BASE_URL}/rating-feedback/?id=${id}`, {
      status: statusBoolean,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
