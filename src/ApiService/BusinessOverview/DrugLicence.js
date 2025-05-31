import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/drug-license/`;

// Get the drug licence details
export const fetchDrugLicenceDetails = async () => {
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
// post the drug licence details

export const postDrugLicenceDetails = async (data) => {
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
// edit drug licence data

export const editDrugLicenceData = async (id,data) => {
    console.log(id);
    
  try {
    const response = await axios.put(`${BASE_URL}?drug_id=${id}`, data);
    return response;
  } catch (error) {
    console.error("Error editing business-info", error);

    const errorMessage = error.response?.data?.message || 'There was an error editing your business information.';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    
    throw error;
  }
};
// delete drug licence data

export const deleteDrugLicenceData = async (id) => {
    console.log(id);
    
  try {
    const response = await axios.delete(`${BASE_URL}?drug_id=${id}`);
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