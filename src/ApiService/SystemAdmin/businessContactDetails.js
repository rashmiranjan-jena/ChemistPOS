import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api`;

export const PostBusinessContact = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/department-contact-info/`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating BusinessContact:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error?.response?.data?.message ||
      error.message ||
      "Failed to create business contact"
    );
  }
};

export const GetBusinessContactById = async (id) => {
  try {
    console.log(
      "GET API URL:",
      `${API_BASE_URL}/department-contact-info/?id=${id}`
    );
    const response = await axios.get(
      `${API_BASE_URL}/department-contact-info/?id=${id}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching business contact:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch business contact"
    );
  }
};

export const UpdateBusinessContact = async (id, data) => {
  try {
    console.log(
      "PUT API URL:",
      `${API_BASE_URL}/department-contact-info/?id=${id}`
    );
    console.log("PUT Payload:", data);
    const response = await axios.put(
      `${API_BASE_URL}/department-contact-info/?id=${id}`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating business contact:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error?.response?.data?.message ||
      error.message ||
      "Failed to update business contact"
    );
  }
};

export const getBusinessContactList = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/department-contact-info/`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching business contact list:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error?.response?.data?.message ||
      error.message ||
      "Failed to fetch business contact list"
    );
  }
};
