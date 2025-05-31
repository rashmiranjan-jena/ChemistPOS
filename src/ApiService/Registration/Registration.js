import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-registration/`;

// Submit Form Data
export const submitFormData = async (data) => {
  const apiUrl = `${API_BASE_URL}`;

  if (!apiUrl) {
    Swal.fire({
      title: "Error!",
      text: "API URL is not defined. Check your environment variables.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw new Error("API URL is not defined. Check your environment variables.");
  }

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error while posting data:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while submitting the form data. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};

// Fetch Businesses
export const fetchBusinesses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while fetching businesses. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};

// status update

export const updateBusinessStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?business_id=${id}`, {
      status,
    });

    return response;  
  } catch (error) {
    console.error("Failed to update business status:", error);
    throw new Error(
      error.response ? error.response.data.message : "Failed to update business status"
    );
  }
};

// Delete Business
export const deleteBusiness = async (id) => {
  if (!id) {
    Swal.fire({
      title: "Error!",
      text: "Business ID is required for deletion.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw new Error("Business ID is required for deletion.");
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}?business_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting business:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while deleting the business. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};

// Fetch the data by id
export const fetchBusinessesbyId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?business_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while fetching businesses. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};

// Edit Fuction
export const updateBusiness = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?business_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating business:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while updating the business. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};

