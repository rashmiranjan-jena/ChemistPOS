import axios from "axios";
import Swal from "sweetalert2";

const backendUrl = `${import.meta.env.VITE_API_BASE_URL}api/department-contact-info/`;

export const sendContactInfo = async (payload) => {
  try {
    const response = await axios.post(`${backendUrl}`, payload);
    Swal.fire({
      title: "Success",
      text: response.data?.message || "Data submitted successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });

    return response.data; 
  } catch (error) {
    console.error("Error while sending contact info:", error);
    const errorMessage =  error?.response?.data?.error || "There was an error submitting the data.";

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Ok",
    });

    throw error; 
  }
};

export const fetchContactData = async () => {
  try {
    const response = await axios.get(backendUrl);
    
    return response; 
  } catch (error) {
    console.error("Error while fetching contact info:", error);
  
    const errorMessage = error.response?.data?.message || "There was an error fetching the data.";

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Ok",
    });

    throw error;
  }
};

export const updateContactStatus = async (id, status) => {
  try {
    const response = await axios.put(`${backendUrl}?department_contact_id=${id}`, { status });

    Swal.fire({
      icon: 'success',
      title: 'Status Updated',
      text: `The contact status has been successfully updated to ${status ? "Published" : "Unpublished"}.`,
      confirmButtonText: 'OK',
    });

    return response.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'There was an issue updating the contact status. Please try again.',
      confirmButtonText: 'OK',
    });
    console.error("Error updating contact status:", error);
    throw error;
  }
};

// Delete Contactinfo
export const deleteContactInfo = async (id) => {
  try {
    const response = await axios.delete(`${backendUrl}?department_contact_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contact info:", error);
    throw error;
  }
};

export const getContactInfoById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}?department_contact_id=${id}`);
    return response; 
  } catch (error) {
    console.error("Error while fetching contact info:", error);
  
    const errorMessage = error.response?.data?.message || "There was an error fetching the data.";

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Ok",
    });

    throw error;
  }
};


export const updateContactInfo = async (id, data) => {
  try {
    const response = await axios.put(`${backendUrl}?department_contact_id=${id}`, data)
    return response.data;
  } catch (error) {
    console.error("Error updating business:", error);
    Swal.fire({
      title: "Error!",
      text: "An error occurred while updating the business. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
    throw error;
  }
};