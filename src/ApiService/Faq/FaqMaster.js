import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/`;

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}faq-categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch categories.",
      confirmButtonText: "OK",
    });

    throw new Error("Failed to fetch categories.");
  }
};

export const createFaq = async (faqData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}faqs/`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to create FAQ.",
      confirmButtonText: "OK",
    });

    throw new Error("Failed to create FAQ.");
  }
};

export const getFaqs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}faqs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch FAQs.",
      confirmButtonText: "OK",
    });

    throw error;
  }
};

export const updateFaqStatus = async (faqId, newStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}faqs/?faq_id=${faqId}`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ status:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update FAQ status.",
      confirmButtonText: "OK",
    });

    throw error;
  }
};


export const deleteFaq = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}faqs/?faq_id=${id}`);
  } catch (error) {
    console.error("Failed to delete FAQ", error);
    throw error;
  }
};


export const getFaqByID = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}faqs/?faq_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting FAQ by ID:", error);
    throw error;
  }
};



export const editFaq = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}faqs/?faq_id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error editing FAQ:", error);
    throw error;
  }
};
