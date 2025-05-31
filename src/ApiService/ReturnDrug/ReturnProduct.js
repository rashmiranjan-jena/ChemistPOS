import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const getReturnProduct = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.type && params.type !== "All") {
      query.append("type", params.type);
    }
    const queryString = query.toString();
    const url = queryString
      ? `${API_BASE_URL}/all-drug-return/?${queryString}`
      : `${API_BASE_URL}/all-drug-return/`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch return products"
    );
  }
};



export const sendReturnOrderEmail = async (formData) => {
  try {
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth")) || {};
    const accessToken = adminAuth.access || "";

    const response = await axios.post(`${API_BASE_URL}/return-memo/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while sending the email" };
  }
};



export const getReturnMemos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-memo/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return memos"
    );
  }
};


export const PostReturneOrder = async (formData) => {
  try {
  
    const response = await axios.post(`${API_BASE_URL}/return-bill/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while sending the email" };
  }
};

export const PostReturneOrderEmail = async (formData) => {
  try {
  
    const response = await axios.post(`${API_BASE_URL}/return-bill/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while sending the email" };
  }
};


export const getReturnBill = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-bill/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return bills"
    );
  }
};

export const GetReturnOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-bill/?id=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return memos"
    );
  }
};

export const UpdateReturnOrder = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/return-bill/?id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred while updating the return order" };
  }
}


export const getReturnBillById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-bill/?rb_no=${id}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return bill data"
    );
  }
};

export const postReturnAdjustment = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/return-bill-adjust/`, data, {
      headers: {
        "Content-Type": "application/json",
        
      },
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit return adjustment"
    );
  }
};

export const getReturnAdjustments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-bill-adjust/`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return adjustments"
    );
  }
}

export const getReturnAdjustmentById = async (adjustmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/return-bill-adjust/?bill_id=${adjustmentId}`);
    return response?.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ?? "Failed to fetch return adjustment data"
    );
  }
}