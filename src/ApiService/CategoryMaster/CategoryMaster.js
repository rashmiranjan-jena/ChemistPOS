import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api`;

// Function to fetch category data
export const getCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/category-master/`);
    console.log("response----->", response.data)
    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; 
  }
};


export const updateCategoryStatus = async (categoryId, status) => {
  try {
    const response = await axios.put(`${apiUrl}/category-master/?category_id=${categoryId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${apiUrl}/category-master/?category_id=${categoryId}`);
    return response.data;
  } catch (error) { 
    throw error;
  }
};