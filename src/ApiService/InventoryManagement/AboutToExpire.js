import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getAboutToExpireInventory = async () => {
  try {  
    const response = await axios.get(`${API_BASE_URL}/about-to-expire/`);
    console.log('API Response:', response?.data); 
    return response?.data?.map((item, index) => ({
      id: item?.drug_details?.drug_id ?? index + 1,
      productName: item?.drug_details?.drug_name ?? 'N/A', 
      productId: item?.drug_details?.hsn_code ?? 'N/A',
      batchNumber: item?.batch_no ?? 'N/A',
      expiryDate: item?.expire_date ?? 'N/A',
      quantity: item?.quantity ?? 0,
      supplier: item?.supplier_name ?? 'N/A',
      daysToExpire: item?.expires_in_days ?? 0,
    
    })) ?? [];
  } catch (error) {
    console.error(
      "Error fetching inventory:",
      error?.response?.data?.message || error.message
    );
    throw error;
  }
};


