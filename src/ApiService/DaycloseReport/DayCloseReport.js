import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;


export const getDayCloseReport = async (page = 1, pageSize = 10, filterDate = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/walkin-summary/`, {
      params: {
        page,
        pageSize,
        date: filterDate || undefined,
      },
    });
    return {
      data: response?.data ?? [],
      total_items: response?.data?.total_items ?? 0,
    };
  } catch (error) {
    throw new Error(error?.response?.data?.message ?? "Failed to fetch day close reports");
  }
};