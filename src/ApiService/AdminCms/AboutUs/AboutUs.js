import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/about-us/`;

// Post the data to backend
export const submitAboutUs = async (data) => {
  const apiUrl = `${API_BASE_URL}`;

  if (!apiUrl) {
    throw new Error(
      "API URL is not defined. Check your environment variables."
    );
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
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Failed to submit About Us data. Please try again.",
    });
    throw error;
  }
};

// Get the data
export const getAboutUsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Failed to fetch About Us data. Please try again.",
    });
    throw error;
  }
};

// Update the About Us status
export const updateAboutUsStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}?about_us_id=${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Failed to update status. Please try again.",
    });
    throw error;
  }
};

export const deleteAboutUs = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}?about_us_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting About Us entry:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to delete the About Us entry. Please try again.",
    });
    throw error;
  }
};

export const getAboutUsDetails = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?about_us_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Failed to fetch About Us data. Please try again.",
    });
    throw error;
  }
};

export const updateAboutUs = async (id, updatedData) => {
  try {
    const response = await axios.put(
     `${API_BASE_URL}?about_us_id=${id}`, 
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      }
    );

    console.log("Update Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating About Us:", error.response ? error.response.data : error.message);
    throw error;
  }
};


