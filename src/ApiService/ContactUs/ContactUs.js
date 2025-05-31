import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/contact-us-page/`;
// post the data to backend
export const submitContactus = async (data) => {
  const apiUrl = `${API_BASE_URL}`;

  if (!apiUrl) {
    throw new Error(
      "API URL is not defined. Check your environment variables."
    );
  }

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error while posting data:", error);
    throw error;
  }
};

// get data from backend

export const fetchContactus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch contact data. Please try again.",
    });
    console.error("Error fetching businesses:", error);
    throw error;
  }
};

// change the status

export const updateContactStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}?id=${id}`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to update status");
  } catch (error) {
    console.error("Error updating status:", error);
    throw error; 
  }
};


export const deleteContactUs = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contact us entry:", error);
    throw error; 
  }
}; 

export const getContactusById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?id=${id}`);
    return response;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to fetch contact data. Please try again.",
    });
    console.error("Error fetching businesses:", error);
    throw error;
  }
};

export const updateContactus = async (id, payload) => {
  try {
    const response = axios.put(`${API_BASE_URL}?id=${id}`, payload);
    return response;
  } catch (error) {
    throw error;

  }
};