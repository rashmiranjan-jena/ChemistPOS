import axios from "axios";

const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}api/subcategory-master/`;

// Function to fetch subcategories
export const getSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`); 
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error; 
  }
};

// update status

export const updateSubcategoryStatus = async (subcategoryId, status) => {
  const newStatus = status === "Published" ? true : false;
  try {
    const response = await axios.put(`${API_BASE_URL}?sub_category_id=${subcategoryId}`, { status: newStatus });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Delete Subcategory

export const deleteSubcategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}?sub_category_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};



export const uploadSubcategoriesExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}api/upload-excel/model`,
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
