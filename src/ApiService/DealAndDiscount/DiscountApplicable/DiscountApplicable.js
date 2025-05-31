import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/`;

const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message || "Something went wrong!",
  });
};

export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}coupon-master/`); 
    console.log("response--->", response);
    if (response.status === 200) {
      return response.data; 
    }
    throw new Error("Failed to fetch coupons");
  } catch (error) {
    console.error("Error fetching coupons:", error);
    showError(response.error || "Failed to fetch coupons");
    throw error;
  }
};

// Helper function to make API requests
const makeApiCall = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    showError(response.error || `Error fetching data from ${endpoint}`);
    throw error;
  }
};

// Fetch categories
export const getCategories = async () => {
  return await makeApiCall("category-name"); 
};

// Fetch brands
export const getBrands = async () => {
  return await makeApiCall("brand-master"); 
};

// Fetch products
export const getProducts = async () => {
  return await makeApiCall("products-handler"); 
};

// Fetch users
export const getUsers = async () => {
  return await makeApiCall("profile"); 
};

// Fetch order values
// export const getOrderValues = async () => {
//   return await makeApiCall("order-values"); 
// };

// Post the data 
export const postDiscountApplicable = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}coupon-applicable/`, data);
    console.log("response from post----->", response.data);
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    showError(response.error || "Failed to post discount applicable data");
  }
};

// Get the data
export const getDiscountApplicabilities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}coupon-applicable/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    showError(response.error || "Failed to fetch discount applicabilities");
    throw error; 
  }
};

// Status handle function
export const updateApplicabilityStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}coupon-applicable/?coupon_id=${id}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating applicability status:', error);
    showError(response.error || "Failed to update applicability status");
    throw error;
  }
};


export const deleteApplicability = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}coupon-applicable/?coupon_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getDiscountApplicableById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}coupon-applicable/?coupon_id=${id}`);
    return response; 
  } catch (error) {
    console.error("Error fetching discount applicable by ID:", error);
    throw error; 
  }
};


export const updateDiscountApplicable = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}coupon-applicable/?coupon_id=${id}`,
      payload
    );
    return response.data; 
  } catch (error) {
    console.error("Error updating discount applicable:", error);
    throw error; 
  }
};