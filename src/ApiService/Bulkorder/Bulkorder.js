import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/suppliers/`;

export const getSuppliers = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("response",response)
    return response.data; 
  } catch (error) {
    console.error("Error fetching suppliers:", error);

    Swal.fire({
      icon: "error",
      title: "Failed to fetch suppliers",
      text: error.response?.data?.message || "An unexpected error occurred. Please try again later.",
      confirmButtonText: "OK",
    });

    throw error; 
  }
};
