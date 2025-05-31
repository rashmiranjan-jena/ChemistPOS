import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/designations/`;

// Get the designation details

export const getDesignationDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching the designation details.';
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

// Create a new designation

export const createDesignation = async (designation) => {
  try {
    const response = await axios.post(`${BASE_URL}`, designation);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error creating the designation.';
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

// delete a designation

export const deleteDesignation = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?designation_id=${id}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error deleting the designation.';
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

// update a designation

export const updateDesignation = async (id,designation) => {
  try {
    const response = await axios.put(`${BASE_URL}?designation_id=${id}`, designation);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error updating the designation.';
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};