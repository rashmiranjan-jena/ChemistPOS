import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// POST - Create new storage
export const createStorage = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rack-handler/`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to create storage");
  }
};


export const updateStorage = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/rack-handler/?id=${id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to update storage");
  }
};

export const getStorageById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rack-handler/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch storage");
  }
};

export const getStorage = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      rack_no: filters.rack_no || "",
      shelf_no: filters.shelf_no || "",
      box_no: filters.box_no || "",
      drug_name: filters.drug_name || "",
      page: filters.page || 1,
      page_size: filters.page_size || 10,
    }).toString();

    const url = `${API_BASE_URL}/rack-handler/${query ? `?${query}` : ""}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch storage");
  }
};

  
  export const deleteStorage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/rack-handler/?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return true; 
    } catch (err) {
      throw new Error(err?.response?.data?.message || "Failed to delete storage");
    }
  };
