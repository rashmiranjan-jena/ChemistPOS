import axios from "axios";
import Swal from "sweetalert2"; 

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/brand-master`);
    return response.data; 
  } catch (error) {
    
    console.error("Error fetching brands:", error);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong while fetching brands. Please try again!',
    });

    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category-name`);
    return response.data; 
  } catch (error) {
   
    console.error("Error fetching categories:", error);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong while fetching categories. Please try again!',
    });

    throw error; 
  }
};

export const fetchSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategory-master`);
    return response.data; 
  } catch (error) {
   
    console.error("Error fetching subcategories:", error);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong while fetching subcategories. Please try again!',
    });

    throw error; 
  }
};

// Post the data
export const submitSupplierDetails = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/suppliers/`, 
      formData, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; 
  } catch (error) {
    
    console.error("Error submitting form data:", error);
    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong. Please try again!',
    });

    throw error; 
  }
};

// get the sipplier data

export const getSupplierDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suppliers/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier details:", error);  
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong while fetching supplier details. Please try again!',
    });
    throw error;
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/suppliers/?supplier_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// get the data by id
export const fetchSupplierById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suppliers/?supplier_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier details:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Something went wrong while fetching supplier details. Please try again!',
    });
    throw error;
  }
};

// edit function
export const updateSupplierDetails = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/suppliers/?supplier_id=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating supplier details:", error);
    throw error;
  }
};