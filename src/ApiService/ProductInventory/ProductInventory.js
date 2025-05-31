import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/category-name/`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch categories";
    console.error("Error fetching categories:", error);
    Swal.fire("Error", errorMessage, "error");
  }
};

// Function to fetch category details (subcategories, brands, variants)
export const fetchCategoryDetails = async (categoryId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/system_category_handler/?category_id=${categoryId}`
    );
    return response.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch category details";
    console.error("Error fetching category details:", error);
    Swal.fire("Error", errorMessage, "error");
  }
};

// post the data
export const submitProductForm = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}api/products-handler/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// get Product data
export const getProductData= async(page)=>{
  try {
     const response = await axios.get(`${BASE_URL}api/products-handler/?page=${page}`);
     console.log(response);
     return response;
  } catch (error) {
    console.log(error);
  }
}

// change the status
export const updateProductStatus = async (productId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}api/products-handler/?product_id=${productId}`, {
      status: status, 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product status:", error);
    alert("An error occurred while updating the product status.");
  }
};

// Upload ExcellFile

export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${BASE_URL}api/upload-products/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Return response data for further use in the component
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; 
  }
};

// Delete the data
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
     `${BASE_URL}api/products-handler/?product_id=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};


export const editDatabyId = async (id) =>{
  try {
      const response = await axios.get(`${BASE_URL}api/products-handler/?product_id=${id}`);
      return response.data;
  } catch (error) {
    throw error;
  }
}