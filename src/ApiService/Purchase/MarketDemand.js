import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

// Create a new market demand
export const createMarketDemand = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/market-demand/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create market demand"
    );
  }
};

// Fetch all market demands
export const getMarketDemand = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-demand/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch market demand data"
    );
  }
};

export const getMarketDemandById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-demand/?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch market demand"
    );
  }
};

// Update a market demand by ID
export const updateMarketDemand = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/market-demand/?id=${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update market demand"
    );
  }
};

// Delete a market demand by ID
export const deleteMarketDemand = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/market-demand/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete market demand"
    );
  }
};