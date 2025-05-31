import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/`;

// Function to post data to the server
export const postCategoryData = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}faq-categories/`, categoryData);  

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "FAQ Category data posted successfully!",
      confirmButtonText: "Okay",
    });

    return response.data;  
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong! Please try again later.",
      confirmButtonText: "Okay",
    });

    console.error("Error posting category data:", error);
    throw error;  
  }
};


export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}faq-categories/`);
    
    if (response.data.error) {
      throw new Error(response.data.error); 
    }

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An error occurred while fetching the categories.',
    });

    throw error;  
  }
};

// status change 
export const updateCategoryStatus = async (id, statusData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}faq-categories/?faqCategory_id=${id}`, {status:statusData} );
    return response.data;
  } catch (error) {
     console.log(error);
     throw error;
  }

};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}faq-categories/?faqCategory_id=${id}`);
    return response.data;  
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error; 
  }
};


export const getCategoryByID = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}faq-categories/?faqCategory_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting category by ID:", error);
    throw error;
  }
};



export const editCategoryData = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}faq-categories/?faqCategory_id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error editing category data:", error);
    throw error;
  }
};
