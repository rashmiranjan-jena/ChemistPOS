import axios from "axios";

const BASE_URL=`${import.meta.env.VITE_API_BASE_URL}api`

export const fetchOrder = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/order`);
    return response;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
