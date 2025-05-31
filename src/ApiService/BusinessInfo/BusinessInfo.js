import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-info/`;

// Post the data to backend
export const submitBusinessInfo = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.data.message || 'Business information submitted successfully.',
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting business info:", error.response || error.message);
    
    const errorMessage = error?.response?.data?.error || 'There was an error submitting your business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};

// Get the data from backend
export const fetchBusinessInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);    
    return response.data;
  } catch (error) {
    console.error("Error fetching business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error fetching the business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};

export const updateBusinessStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}?business_info_id=${id}`, 
      { status } 
    );
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};


export const deleteBusiness = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_info_id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete business");
  }
};

// get the data by id
export const getBusinessInfoById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?business_info_id=${id}`);    
    return response;
  } catch (error) {
    console.error("Error fetching business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error fetching the business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};

// functon for edit
export const updateBusinessInfo = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_info_id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating business info", error);
    throw error; 
  }
};
