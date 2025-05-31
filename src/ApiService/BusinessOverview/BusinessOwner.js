import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-owner/`;


// get the business owner details

export const getBusinessOwnerDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error fetching the business owner.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    throw error;
  }
};




// post the business owner details formData

export const postBusinessOwnerDetails = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error post the business woner.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
    throw error;
  }
};
// put the business owner details formData

export const putBusinessOwnerDetails = async (id,formData) => {
    console.log('id',id);
    
  try {
    const response = await axios.put(`${BASE_URL}?business_owner_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error put the business owner.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
    throw error;
  }
};
// delete the business owner details

export const deleteBusinessOwnerDetails = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_owner_id=${id}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'There was an error delete the business owner.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
    throw error;
  }
};

