import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Function to get customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);

    const errorMessage =
      response.error && response.error.data
        ? error.response.data.message || "An error occurred. Please try again."
        : "Failed to load customer data. Please try again later.";

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });

    throw error; 
  }
};


export const updateCustomerStatus = async (id, newStatus) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/profile/?customer_id=${id}`,
      { status: newStatus },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update status.";
  }
};
