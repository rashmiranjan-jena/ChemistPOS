import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getDrugsBySupplier = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/supplier-drugs/?supplier_id=${id}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch purchase entries"
    );
  }
};

export const searchDrugsBySupplier = async (supplierId, drugName, page = 1) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/purchase-drugs/`,
      {
        params: {
          supplier_id: supplierId,
          drug_name: drugName,
          page: page,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search drugs: " + error.message);
  }
};
