import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Function to fetch category options
export const getCategoryOptions = async () => {
  try {
    const response = await axios.get(`${baseURL}/category-name/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Function to fetch variant options
export const getVariantOptions = async () => {
  try {
    const response = await axios.get(`${baseURL}/varient-name/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching variants:", error);
    throw error;
  }
};

// Function to register a product
export const registerProduct = async (dataToSubmit) => {
  try {
    const response = await axios.post(
      `${baseURL}/product-category-master/`,
      dataToSubmit
    );
    return response;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};


// get data

export const getProductCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/product-category-master/`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
};

// delete the data

export const deleteProductCategory = async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/product-category-master/?productCategory_id=${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/product-category-master/?productCategory_id=${id}`);
    console.log("API Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
};


export const updateProduct = async (id, data) => {
  try {
    const response = await axios.put(
     `${baseURL}/product-category-master/?productCategory_id=${id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};


