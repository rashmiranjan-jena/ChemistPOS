import axios from "axios";

const API_BASE_URL =  `${import.meta.env.VITE_API_BASE_URL}api`
// Function to fetch stores
export const fetchStores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business-store-info`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};

// Function to fetch categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category-name`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Function to fetch brands
export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brand-master`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};



// Function to fetch all data in parallel
export const fetchAllData = async () => {
  try {
    const [stores, categories, brands, pincodes] = await Promise.all([
      fetchStores(),
      fetchCategories(),
      fetchBrands(),
    ]);
    return { stores, categories, brands, pincodes };
  } catch (error) {
    console.error("Error fetching all data:", error);
    return { stores: [], categories: [], brands: [] };
  }
};

export const poatalCode = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};




export const postDeliveryData = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delivery-pincode/`, payload);
    return response.data; 
  } catch (error) {
    console.error("Error in posting delivery data", error);
    throw error;
  }
};

export const getDeliveryData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delivery-pincode/`);
    return response.data; 
  } catch (error) {
    console.error("Error in posting delivery data", error);
    throw error;
  }
};




export const putDeliveryStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delivery-pincode/?pincode=${id}`, {
      is_available: newStatus,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};



export const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delivery-pincode/?pincode=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
};

export const getDeliveryDataById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delivery-pincode/?pincode=${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error in posting delivery data", error);
    throw error;
  }
};



export const updateDeliveryDataById = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delivery-pincode/?pincode=${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
