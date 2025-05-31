import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/testimonials/`;

// Function to post the testimonial data
export const addTestimonial = async (testimonialData) => {
  try {
    const response = await axios.post(`${API_URL}`, testimonialData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; 
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error posting testimonial",
    });
    throw new Error(error.response?.data?.message || "Error posting testimonial");
  }
};

// Function to get testimonials
export const getTestimonials = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load testimonials",
    });
    throw error;
  }
};

// updateTestimonialStatus
export const updateTestimonialStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}?testimonial_id=${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to updateTestimonialStatus",
    });
    throw error; 
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}?testimonial_id=${id}`);
    return response.data;  
  } catch (error) {
    throw new Error("Failed to delete testimonial");
  }
};

export const editTestimonialsbyID = async (id) => {
  try {
    const response = await axios.get(`${API_URL}?testimonial_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load testimonials",
    });
    throw error;
  }
};

export const getTestimonialByID = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}?testimonial_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing testimonial by ID:", error);
    throw error;
  }
};