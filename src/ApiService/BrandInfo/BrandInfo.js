import axios from 'axios';
import Swal from 'sweetalert2';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-brand-info/`;

export const submitBrandInfo = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    Swal.fire({
      icon: 'success',
      title: 'Brand Info Submitted',
      text: 'Your brand information has been successfully submitted.',
    });
    
    return response.data;
  } catch (error) {

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to submit brand information',
    });
    
    throw new Error(error.response?.data?.message || 'Failed to submit brand information');
  }
};


// get the data from backend 

export const getBrandInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`); 
    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch brand information.',
    });

    console.error("Error fetching brand-info", error);
    throw error;
  }
};


// status update
export const updateBrandStatus = async (id, status) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_brand_id=${id}`, { status });
    Swal.fire({
      title: 'Success!',
      text: `Brand status updated to ${status ? 'Published' : 'Unpublished'}`,
      icon: 'success',
      confirmButtonText: 'OK'
    });

    return response.data; 
  } catch (error) {
    console.error("Error updating brand status:", error);

    Swal.fire({
      title: 'Error!',
      text: 'There was an error updating the brand status. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    });

    throw error;  
  }
};

// Delete the brand data
export const deleteBrand = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_brand_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand", error);
    throw error;  
  }
};


export const getBrandInfobyID = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?business_brand_id=${id}`); 
    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch brand information.',
    });

    console.error("Error fetching brand-info", error);
    throw error;
  }
};



export const updateBrandInfo = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_brand_id=${id}`, formData);

    return response.data; 
  } catch (error) {
    console.error('Error updating brand info:', error);
    throw error; 
  }
};
