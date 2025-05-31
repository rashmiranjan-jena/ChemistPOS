import axios from "axios";


const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/`;

const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message || "Something went wrong!",
  });
};

export const getDeal = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}deals/`); 
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

// Post the data 
export const postDealApplicable = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}deals-data/`, data);
    console.log("response from post----->", response.data);
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    showError(response.error || "Failed to post discount applicable data");
  }
};

export const getDealApplicable = async() =>{
  try {
    const response = await axios.get(`${API_BASE_URL}deals-data/`);
    return response;
  } catch (error) {
    throw error
  }
}


export const updateDealStatus = async (dealId, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}deals-data/?deal_id=${dealId}`,
      {
        status
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};



export const deleteDeal = async (dealId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}deals-data/?deal_id=${dealId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting deal:", error);
    throw error;
  }
};



export const getDealApplicabilityById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}deals-data/?deal_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deal applicability:", error);
    throw error;
  }
};

export const editDealApplicabilityById = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}deals-data/?deal_id=${id}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('An error occurred while updating the deal applicability.');
  }
};



