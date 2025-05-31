import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-brand-info/`;

// Get business brand details
export const getBusinessBrandDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching the business brand details.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    throw error;
  }
};

// post business brand details files formData 
export const postBusinessBrandDetails = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error post the business brand details.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
      throw error;
    }
  };

// put business brand details files formData+


// status change
export const statusChange = async (id,status) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_brand_id=${id}`,status);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error change the status.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    throw error;
  }
}


// delete business brand details files formData+
export const deleteBusinessBrandDetails = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_brand_id=${id}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error delete the business brand details.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    throw error;
  }
}