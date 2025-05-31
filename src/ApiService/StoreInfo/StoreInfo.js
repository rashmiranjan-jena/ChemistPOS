import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-store-info/`;

// post the data to backend

export const submitStoreData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    return response;
  } catch (error) {
    console.error("Error submitting store data:", error);

    // Notify error
    await Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text:
        error.response?.data?.message ||
        "An error occurred while adding the store. Please try again.",
      confirmButtonColor: "#d33",
    });

    throw error;
  }
};

// get the data from backend
export const fetchStore = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    await Swal.fire({
      icon: "error",
      title: "Fetch Failed",
      text:
        error.response?.data?.message ||
        "An error occurred while fetching store data. Please try again.",
      confirmButtonColor: "#d33",
    });

    throw error;
  }
};

// status change
export const updateStoreStatus = async (id, status) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_store_id=${id}`, {
      status,
    });

    await Swal.fire({
      icon: "success",
      title: "Status Updated",
      text: `Store status has been updated to ${
        status ? "Published" : "Unpublished"
      }.`,
      confirmButtonColor: "#3085d6",
      timer: 2000,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update status:", error);
    await Swal.fire({
      icon: "error",
      title: "Update Failed",
      text:
        error.response?.data?.message ||
        "An error occurred while updating the status.",
      confirmButtonColor: "#d33",
    });

    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

// delete the data
export const deleteStore = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_store_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "An error occurred while trying to delete the store.",
      confirmButtonColor: "#d33",
    });

    throw error;
  }
};


// get Data by id for edit
export const getStorebyId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?business_store_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
};


// Edit Functio
export const updateStoreData = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}?business_store_id=${id}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};
