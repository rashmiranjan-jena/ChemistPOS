import axios from "axios";
import Swal from "sweetalert2";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const submitGstDetails = async (gstData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gst-master/`, gstData);

    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message || "GST details have been successfully submitted.",
      });
      
    } else {
      Swal.fire({
        icon: "info",
        title: "Notice",
        text: response.data.message || "Details submitted successfully.",
      });
    }

    return response.data; 
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An error occurred while submitting the form. Please try again later.";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });

    console.error("Error submitting form:", error);
    throw error; 
  }
};

// get categories in the drop down
export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category-name/`);
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An error occurred while fetching subcategories. Please try again later.",
    });
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// get the data
export const fetchGstDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gst-master/`);
    return response.data; 
  } catch (error) {
    console.log(error);
     throw error;
  } 
};


export const updateGstStatus = async (id, isPublished) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/gst-master/?gst_id=${id}`, {
      status: isPublished, 
    });
    return response;
  } catch (error) {
    console.error("Error updating GST status:", error);
    throw error;
  }
};

// Delete the data

export const deleteGstDetails = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/gst-master/?gst_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getGstById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gst-master/?gst_id=${id}`);
    return response; 
  } catch (error) {
    console.log(error);
     throw error;
  } 
};


export const updateGstDetails = async (id, gstData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/gst-master/?gst_id=${id}`, gstData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating GST details:", error);
    throw error;
  }
};
