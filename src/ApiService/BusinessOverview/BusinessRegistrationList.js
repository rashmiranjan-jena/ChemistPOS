import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/business-info/`;

// fetch bussiness registration List
export const fetchBusinessRegistrationList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
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

// post the business registration details
export const postBusinessRegistrationDetails = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}`, data);
    return response;
  } catch (error) {
    console.error("Error posting business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error submitting your business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });

    throw error;
  }
};

// update the business registration details
export const updateBusinessRegistrationDetails = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}?business_info_id=${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error updating your business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });

    throw error;
  }
};

// delete the business registration details

export const deleteBusinessRegistrationDetails = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}?business_info_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error deleting your business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });

    throw error;
  }
};