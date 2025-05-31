import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-store-info/`;
const BASE_URL2 = `${import.meta.env.VITE_API_BASE_URL}api/departments/`;

// get the store info details
export const getStore = async()=>{
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response;
  } catch (error) {
    console.log("Error getting store info:", error.response || error.message);
    
  }
}


// post the store info details
export const submitStoreInfo = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.data.message || 'Store information submitted successfully.',
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting store info:", error.response || error.message);
    
    const errorMessage = error?.response?.data?.error || 'There was an error submitting your store information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};

// update the store info details
export const updateStoreInfo = async (storeId,data) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_store_id=${storeId}`, data,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.data.message || 'Store information updated successfully.',
    });
    return response.data;
  } catch (error) {
    console.error("Error updating store info:", error.response || error.message);
    
    const errorMessage = error?.response?.data?.error || 'There was an error updating your store information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};
// update the store info details
export const updateJsonStoreInfo = async (storeId,data) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_store_id=${storeId}`, data);
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.data.message || 'Store information updated successfully.',
    });
    return response.data;
  } catch (error) {
    console.error("Error updating store info:", error.response || error.message);
    
    const errorMessage = error?.response?.data?.error || 'There was an error updating your store information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};

// get department
export const getDepartmentDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL2}`);
    return response;
  } catch (error) {
    console.error("Error getting department:", error.response || error.message);
    throw error;
  }
};

// delete store
export const deleteStore = async (storeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_store_id=${storeId}`);
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: response.data.message || 'Store deleted successfully.',
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting store:", error.response || error.message);
    const errorMessage = error?.response?.data?.error || 'There was an error deleting your store.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    throw error;
  }
};