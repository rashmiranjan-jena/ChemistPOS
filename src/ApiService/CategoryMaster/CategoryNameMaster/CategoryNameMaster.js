import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`


export const postCategoryData = async (categoryData) => {
  try {

    const response = await axios.post(`${BASE_URL}/category-name/`, categoryData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error posting category data:", error);
    throw error; 
  }
};


export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category-name/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const updateCategoryStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/category-name/?category_id=${id}`,
      { status: status }
    );
    return response.data; 
    
  } catch (error) {
    console.error("Error updating category status:", error);
    throw error; 
  }
};


const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/category-name/?category_id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting category');
  }
};

export { deleteCategory };

export const getCategoryById = async(id) => {
  try {
    const response = await axios.get(`${BASE_URL}/category-name/?category_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const updateCategoryData = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/category-name/?category_id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};


export const uploadCategoriesExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${BASE_URL}/upload-excel/model`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};